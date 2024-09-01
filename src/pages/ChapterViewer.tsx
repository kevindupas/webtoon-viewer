import {
  IonContent,
  IonIcon,
  IonPage,
  IonSpinner,
  useIonViewWillEnter,
} from "@ionic/react";
import {
  arrowBack,
  chevronBack,
  chevronForward,
  listSharp,
} from "ionicons/icons";
import React, { useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import useSWR from "swr";

import axios from "axios";
import { API_URL } from "../Utils/url";
import { useAuth } from "../contexts/AuthContext";
import useFetch from "../hooks/useFetch";
import { ChapterData } from "../types";

const ChapterViewer: React.FC = () => {
  const { token, isAuthenticated } = useAuth();
  const { fetcher } = useFetch();
  const [showUI, setShowUI] = useState(true);
  const { webtoonId, chapterId } = useParams<{
    webtoonId: string;
    chapterId: string;
  }>();
  const history = useHistory();
  const contentRef = useRef<HTMLIonContentElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { data: chapterData, error } = useSWR<ChapterData>(
    isAuthenticated
      ? `${API_URL}/webtoons/${webtoonId}/chapters/${chapterId}/images`
      : null,
    fetcher
  );

  useIonViewWillEnter(() => {
    updateReadingProgress();
  });

  const updateReadingProgress = async () => {
    if (!isAuthenticated || !token) return;

    try {
      await axios.post(
        `${API_URL}/webtoons/${webtoonId}/chapters/${chapterId}/progress`,
        { percentage: 0 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Reading progress updated successfully");
    } catch (error) {
      console.error("Error updating reading progress:", error);
    }
  };

  useEffect(() => {
    updateReadingProgress();
  }, [chapterId]);

  useEffect(() => {
    setShowUI(true);

    const timer = setTimeout(() => {
      setShowUI(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleScroll = (e: CustomEvent) => {
    const { scrollTop, scrollHeight, clientHeight } = e.detail;

    console.log("scrollTop:", scrollTop);
    console.log("scrollHeight:", scrollHeight);
    console.log("clientHeight:", clientHeight);

    const threshold = 100; // Vous pouvez ajuster ce seuil si nécessaire
    const isNearTop = scrollTop < threshold;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < threshold;

    if (isNearTop || isNearBottom) {
      setShowUI(true);
    } else {
      setShowUI(false);
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setShowUI(false);
    }, 3000);
  };

  const toggleUI = () => {
    setShowUI(!showUI);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!showUI) {
      timeoutRef.current = setTimeout(() => {
        setShowUI(false);
      }, 3000);
    }
  };

  const goToChapterList = () => {
    history.push(`/webtoon/${webtoonId}`);
  };

  const goToNextChapter = () => {
    if (chapterData?.next_chapter) {
      history.push(
        `/webtoon/${webtoonId}/chapter/${chapterData.next_chapter.id}`
      );
    }
  };

  const goToPreviousChapter = () => {
    if (chapterData?.previous_chapter) {
      history.push(
        `/webtoon/${webtoonId}/chapter/${chapterData.previous_chapter.id}`
      );
    }
  };

  return (
    <IonPage>
      <div
        className={`fixed top-0 left-0 right-0 z-20 bg-black bg-opacity-75 text-white transition-all duration-300 ease-in-out ${
          showUI
            ? "translate-y-0 opacity-100 visible"
            : "-translate-y-full opacity-0 invisible"
        }`}
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="flex items-center p-2">
          <button
            onClick={goToChapterList}
            className="flex items-center justify-center w-12 h-12 focus:outline-none"
          >
            <IonIcon icon={arrowBack} className="text-2xl" />
          </button>
          <div className="flex-1 text-start overflow-hidden">
            <h1 className="text-sm font-bold truncate">
              {chapterData?.webtoon_name}
            </h1>
            <p className="text-xs">
              Episode {chapterData?.current_chapter.number}
            </p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <IonContent
        fullscreen
        scrollEvents={true}
        onIonScroll={handleScroll}
        scrollY={true}
        onClick={toggleUI}
        ref={contentRef}
      >
        <div className="relative h-full">
          {!chapterData && !error && (
            <div className="flex justify-center items-center h-full">
              <IonSpinner />
            </div>
          )}
          {error && (
            <div className="text-white">
              Failed to load chapter data. Please try again.
            </div>
          )}
          {chapterData && chapterData.images.length === 0 && (
            <div className="text-white text-center">No images found.</div>
          )}
          {chapterData &&
            chapterData.images.map(
              (image: {
                id: React.Key | null | undefined;
                image_url: string | undefined;
              }) => (
                <img
                  key={image.id}
                  src={image.image_url}
                  alt={`Page ${image.id}`}
                  className="w-full"
                />
              )
            )}
        </div>
      </IonContent>

      <div
        className={`fixed bottom-0 left-0 right-0 z-20 bg-black bg-opacity-75 text-white transition-all duration-300 ease-in-out ${
          showUI
            ? "translate-y-0 opacity-100 visible"
            : "translate-y-full opacity-0 invisible"
        }`}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex justify-between items-center px-4 ">
          <button
            onClick={goToPreviousChapter}
            className={`flex items-center justify-center w-12 h-12  ${
              !chapterData?.previous_chapter
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            disabled={!chapterData?.previous_chapter}
          >
            <IonIcon icon={chevronBack} className="text-2xl" />
          </button>
          <button
            onClick={goToChapterList}
            className="flex items-center justify-center w-12 h-12"
          >
            <IonIcon icon={listSharp} className="text-2xl" />
          </button>
          <button
            onClick={goToNextChapter}
            className={`flex items-center justify-center w-12 h-12  ${
              !chapterData?.next_chapter ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!chapterData?.next_chapter}
          >
            <IonIcon icon={chevronForward} className="text-2xl" />
          </button>
        </div>
      </div>
    </IonPage>
  );
};

export default ChapterViewer;
