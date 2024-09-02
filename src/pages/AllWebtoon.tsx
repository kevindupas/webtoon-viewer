import {
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonPage,
  IonToolbar,
  useIonViewWillEnter,
} from "@ionic/react";
import clsx from "clsx";
import { search } from "ionicons/icons";
import React, { useContext, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import Logo from "../components/Logo";
import { ThemeContext } from "../contexts/ThemeContext";
import useFetch from "../hooks/useFetch";
import { Webtoon } from "../types";
import { API_URL } from "../Utils/url";

const AllWebtoon: React.FC = () => {
  const { theme } = useContext(ThemeContext);
  const { fetcher } = useFetch();
  const history = useHistory();
  const [webtoons, setWebtoons] = useState<Webtoon[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const isInitialLoad = useRef(true);

  const fetchWebtoons = async (pageNum: number) => {
    try {
      const newWebtoons = await fetcher(
        `${API_URL}/webtoons/all?page=${pageNum}`
      );
      if (newWebtoons.length === 0) {
        setHasMore(false);
      } else {
        setWebtoons((prevWebtoons) => [...prevWebtoons, ...newWebtoons]);
        setPage(pageNum + 1);
      }
    } catch (error: any) {
      console.error("Error fetching webtoons:", error.message);
      if (error.message === "User not authenticated") {
        history.push("/login"); // Rediriger vers la page de connexion
      }
      setHasMore(false);
    }
  };

  useIonViewWillEnter(() => {
    // N'effectuer la requête que si la liste est vide (pour éviter les doublons)
    if (webtoons.length === 0 && isInitialLoad.current) {
      fetchWebtoons(page);
      isInitialLoad.current = false; // Marquer comme initialement chargé
    }
  });

  const handleWebtoonClick = (webtoonId: number) => {
    history.push(`/webtoon/${webtoonId}`);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color={theme === "dark" ? "dark" : "light"}>
          <div className="text-white py-4 px-4 flex items-center justify-between">
            <Logo />
            <div className="flex items-center space-x-4">
              <IonButtons>
                <IonIcon icon={search} className="text-2xl text-gray-400" />
              </IonButtons>
            </div>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen color={theme === "dark" ? "dark" : "light"}>
        <div className="px-4 pt-4 grid grid-cols-2 gap-4">
          {webtoons.map((webtoon: Webtoon, index: number) => (
            <div
              key={`${webtoon.id}-${index}`}
              onClick={() => handleWebtoonClick(webtoon.id)}
            >
              <div className="relative w-full h-56 rounded-lg overflow-hidden shadow-lg">
                <img
                  src={webtoon.cover_image}
                  alt={webtoon.name}
                  className="w-full h-full object-cover"
                  style={{ height: "224px", width: "100%", objectFit: "cover" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                <div className="absolute bottom-0 left-0 right-0 p-2 text-white">
                  <h3
                    className="text-xs font-bold leading-tight text-start mb-1"
                    style={{
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 2,
                      overflow: "hidden",
                    }}
                  >
                    {webtoon.name}
                  </h3>
                  <div className="flex items-center space-x-1">
                    <p className="text-xs text-red-500 truncate flex-grow font-medium">
                      {webtoon.genres?.length > 0 ? webtoon.genres[0] : ""}
                    </p>
                    <p
                      className={clsx(
                        "text-xs px-1 py-0.5 bg-gray-500 bg-opacity-70 rounded whitespace-nowrap",
                        webtoon.last_read_chapter
                          ? "text-yellow-500"
                          : "text-green-500 "
                      )}
                    >
                      {webtoon.last_read_chapter
                        ? `${webtoon.last_read_chapter.number}/${webtoon.total_chapters}`
                        : `${webtoon.total_chapters}`}
                    </p>
                  </div>
                </div>
                {webtoon.status === "Fin" && (
                  <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs py-1 px-2 rounded">
                    Fin
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <IonInfiniteScroll
          onIonInfinite={async (ev) => {
            await fetchWebtoons(page);
            (ev.target as HTMLIonInfiniteScrollElement).complete();
          }}
          threshold="100px"
          disabled={!hasMore}
        >
          <IonInfiniteScrollContent loadingText="Chargement..."></IonInfiniteScrollContent>
        </IonInfiniteScroll>
      </IonContent>
    </IonPage>
  );
};

export default AllWebtoon;
