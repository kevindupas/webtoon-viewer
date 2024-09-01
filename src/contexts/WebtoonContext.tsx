import { Drivers, Storage } from "@ionic/storage";
import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import useSWR from "swr";
import { API_URL } from "../Utils/url";
import { Webtoon } from "../types";
import { useAuth } from "./AuthContext";

interface WebtoonContextType {
  recentlyRead: Webtoon[] | undefined;
  favorites: Webtoon[] | undefined;
  allWebtoons: Webtoon[] | undefined;
  isLoading: boolean;
  error: any;
  mutate: (
    data?: Partial<WebtoonContextType>,
    shouldRevalidate?: boolean
  ) => Promise<any>;
}

const WebtoonContext = createContext<WebtoonContextType | undefined>(undefined);

export const useWebtoon = () => {
  const context = useContext(WebtoonContext);
  if (!context) {
    throw new Error("useWebtoon must be used within a WebtoonProvider");
  }
  return context;
};

export const WebtoonProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [storage, setStorage] = useState<Storage | null>(null);
  const [initError, setInitError] = useState<any>(null);
  const { token } = useAuth();

  useEffect(() => {
    const initStorage = async () => {
      try {
        const newStorage = new Storage({
          name: "webtoon-db",
          storeName: "_ionicstorage",
          driverOrder: [Drivers.IndexedDB],
        });
        await newStorage.create();
        setStorage(newStorage);
      } catch (error) {
        setInitError(error);
        console.error("Error initializing storage", error);
      }
    };

    initStorage();
  }, []);

  const fetcher = async (url: string) => {
    if (!token) {
      throw new Error("No token found");
    }

    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (error) {
      if ((error as any).response && (error as any).response.status === 401) {
        console.error("Unauthorized, redirecting to login...");
        // Optionally, handle token refresh or redirect to login
      }
      throw error;
    }
  };

  const {
    data: recentlyRead,
    error: recentlyReadError,
    mutate: mutateRecentlyRead,
  } = useSWR<Webtoon[]>(
    token && storage ? `${API_URL}/webtoons/recently-read` : null,
    fetcher
  );

  const {
    data: favorites,
    error: favoritesError,
    mutate: mutateFavorites,
  } = useSWR<Webtoon[]>(
    token && storage ? `${API_URL}/webtoons/favorites` : null,
    fetcher
  );

  const {
    data: allWebtoons,
    error: allWebtoonsError,
    mutate: mutateAllWebtoons,
  } = useSWR<Webtoon[]>(
    token && storage ? `${API_URL}/webtoons` : null,
    fetcher
  );

  const isLoading =
    !storage ||
    (!recentlyRead &&
      !favorites &&
      !allWebtoons &&
      !recentlyReadError &&
      !favoritesError &&
      !allWebtoonsError);
  const error =
    initError || recentlyReadError || favoritesError || allWebtoonsError;

  const mutate = async (
    data?: Partial<WebtoonContextType>,
    shouldRevalidate = true
  ) => {
    if (data?.recentlyRead !== undefined) {
      await mutateRecentlyRead(data.recentlyRead, shouldRevalidate);
    }
    if (data?.favorites !== undefined) {
      await mutateFavorites(data.favorites, shouldRevalidate);
    }
    if (data?.allWebtoons !== undefined) {
      await mutateAllWebtoons(data.allWebtoons, shouldRevalidate);
    }
  };

  const value = {
    recentlyRead,
    favorites,
    allWebtoons,
    isLoading,
    error,
    mutate,
  };

  return (
    <WebtoonContext.Provider value={value}>{children}</WebtoonContext.Provider>
  );
};
