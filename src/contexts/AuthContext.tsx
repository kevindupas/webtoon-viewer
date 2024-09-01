import { Drivers, Storage } from "@ionic/storage";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [storage, setStorage] = useState<Storage | null>(null);

  useEffect(() => {
    const initStorage = async () => {
      const newStorage = new Storage({
        name: "webtoon-db",
        storeName: "_ionicstorage",
        driverOrder: [Drivers.IndexedDB],
      });
      await newStorage.create();
      setStorage(newStorage);

      const storedToken = await newStorage.get("token");
      if (storedToken) {
        setToken(storedToken);
      }
      setLoading(false);
    };

    initStorage();
  }, []);

  const login = async (token: string) => {
    if (storage) {
      await storage.set("token", token);
      setToken(token);
    }
  };

  const logout = async () => {
    if (storage) {
      await storage.remove("token");
      setToken(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ token, isAuthenticated: !!token, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
