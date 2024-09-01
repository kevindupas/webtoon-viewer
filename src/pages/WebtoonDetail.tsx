import {
  IonBadge,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonPage,
  IonSpinner,
  useIonViewDidEnter,
} from "@ionic/react";
import axios from "axios";
import dayjs from "dayjs";
import { arrowBack, heart, heartOutline } from "ionicons/icons";
import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import useSWR from "swr";
import { useAuth } from "../contexts/AuthContext";
import { ThemeContext } from "../contexts/ThemeContext";
import useFetch from "../hooks/useFetch";
import { WebtoonDetailType } from "../types";
import Rating from "../Utils/Rating";
import { API_URL } from "../Utils/url";

const WebtoonDetail: React.FC = () => {
  const { theme } = useContext(ThemeContext);
  const { token, isAuthenticated } = useAuth();
  const { fetcher } = useFetch();
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const MAX_SUMMARY_LENGTH = 100;

  const {
    data: webtoon,
    error,
    mutate,
  } = useSWR<WebtoonDetailType>(
    isAuthenticated ? `${API_URL}/webtoons/${id}` : null,
    fetcher
  );

  useEffect(() => {
    if (webtoon) {
      setIsFavorite(webtoon.is_favorite);
    }
  }, [webtoon]);

  useIonViewDidEnter(() => {
    mutate();
  });

  const toggleFavorite = async () => {
    if (!webtoon || !isAuthenticated) return;
    try {
      const response = await axios.post(
        `${API_URL}/webtoons/${id}/toggle-favorite`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsFavorite(response.data.is_favorite);
      mutate({ ...webtoon, is_favorite: response.data.is_favorite }, false);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  // Lors de l'appel de la fonction dans `handleChapterClick`
  const handleChapterClick = (chapterId: number, chapterNumber: number) => {
    history.push(`/webtoon/${id}/chapter/${chapterId}`, {
      webtoonName: webtoon?.name,
      chapterNumber: chapterNumber,
    });
  };

  const handleContinueReading = () => {
    if (!webtoon) return; // Sortir de la fonction si webtoon n'est pas défini

    if (webtoon.last_read_chapter) {
      history.push(`/webtoon/${id}/chapter/${webtoon.last_read_chapter.id}`);
    } else if (webtoon.chapters && webtoon.chapters.length > 0) {
      // Trouver le premier chapitre (le plus ancien)
      const firstChapter = webtoon.chapters.reduce((oldest, current) =>
        current.chapter_id < oldest.chapter_id ? current : oldest
      );
      history.push(`/webtoon/${id}/chapter/${firstChapter.id}`);
    } else {
      console.error("No chapters available for this webtoon");
      // Vous pouvez ajouter ici une logique pour gérer le cas où il n'y a pas de chapitres
    }
  };

  const toggleSummary = () => {
    setIsSummaryExpanded(!isSummaryExpanded);
  };

  const goToHomePage = () => {
    history.push(`/tabs/home`);
  };

  if (!isAuthenticated) {
    return (
      <IonPage>
        <IonContent>
          <div className="flex justify-center items-center h-full">
            <p>Veuillez vous connecter pour voir les détails du webtoon.</p>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  if (error)
    return <div>Failed to load webtoon details. Please try again.</div>;
  if (!webtoon) return <IonSpinner />;

  return (
    <IonPage>
      <IonContent fullscreen color={theme === "dark" ? "dark" : "light"}>
        <div className="relative">
          <div className="absolute top-0 left-0 right-0 h-32 z-10 bg-gradient-to-b from-black to-transparent pointer-events-none"></div>
          <div className="absolute z-20">
            <button
              onClick={goToHomePage}
              className="flex items-center justify-center w-12 h-12 focus:outline-none"
              style={{ paddingTop: "env(safe-area-inset-top)" }}
            >
              <IonIcon icon={arrowBack} className="text-2xl text-white" />
            </button>
          </div>
          <img
            src={webtoon.cover_image}
            alt={webtoon.name}
            className="w-full h-[40rem] object-cover"
            // style={{ marginTop: "env(safe-area-inset-top)" }}
          />
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
            <p className="text-xs text-green-500 mb-1">
              {webtoon.genres.join(" / ")}
            </p>
            <p className="text-xs text-gray-300">
              {webtoon.author} • {webtoon.artist}
            </p>
            <h1 className="text-2xl font-bold text-white">{webtoon.name}</h1>
            <p className="text-sm text-white mb-4">
              {isSummaryExpanded || webtoon.summary.length <= MAX_SUMMARY_LENGTH
                ? webtoon.summary
                : `${webtoon.summary.substring(0, MAX_SUMMARY_LENGTH)}... `}
              {webtoon.summary.length > MAX_SUMMARY_LENGTH && (
                <span
                  onClick={toggleSummary}
                  className="text-blue-500 cursor-pointer"
                >
                  {isSummaryExpanded ? " Voir moins" : " Voir plus"}
                </span>
              )}
            </p>
            <div className="flex items-center">
              {Rating(Number(webtoon.rating))}
              <span className="ml-1 text-yellow-400 font-bold">
                {Number.isFinite(Number(webtoon.rating))
                  ? Number(webtoon.rating).toFixed(2)
                  : "N/A"}
              </span>
            </div>
            <div className="flex items-center justify-start space-x-4 my-2">
              <button
                className="flex items-center justify-center bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold"
                onClick={handleContinueReading}
              >
                {webtoon.last_read_chapter
                  ? `Continuer à lire le chapitre ${webtoon.last_read_chapter.number}`
                  : `Commencer à lire le chapitre ${
                      webtoon.chapters[webtoon.chapters.length - 1].chapter_id
                    }`}
              </button>
              <button
                className="flex justify-center items-center bg-white rounded-full px-4 py-2 text-black"
                onClick={toggleFavorite}
              >
                <IonIcon
                  className="text-red-500 text-xl"
                  icon={isFavorite ? heart : heartOutline}
                />
              </button>
            </div>
          </div>
        </div>
        <div className="bg-gray-100 mb-4">
          <ul className="bg-white">
            <li className="bg-white list-none">
              {webtoon.chapters.map((chapter) => (
                <IonItem
                  key={chapter.id}
                  button
                  onClick={() =>
                    handleChapterClick(chapter.id, chapter.chapter_id)
                  }
                  color={theme === "dark" ? "dark" : "light"}
                >
                  <IonLabel>
                    <h3 className="text-base font-bold text-black dark:text-white">
                      {webtoon.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Episode {chapter.chapter_id}
                      </span>
                    </p>
                    <p>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {dayjs(chapter.release_date).format("MMM D, YYYY")}
                      </span>
                    </p>
                  </IonLabel>
                  {chapter.is_new === true ? (
                    <IonBadge color="danger" className="text-white">
                      NEW
                    </IonBadge>
                  ) : null}
                </IonItem>
              ))}
            </li>
          </ul>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default WebtoonDetail;
