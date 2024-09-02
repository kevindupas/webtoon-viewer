import {
  faClockRotateLeft,
  faHeart,
  faSquareFull,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonToolbar,
  useIonViewWillEnter,
} from "@ionic/react";
import { bookSharp, search } from "ionicons/icons";
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { Grid } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import useSWR from "swr";
import WebtoonCard from "../components/WebtoonCard";
import { ThemeContext } from "../contexts/ThemeContext";
import useFetch from "../hooks/useFetch";
import { Webtoon } from "../types";
import { API_URL } from "../Utils/url";

import "swiper/css";
import "swiper/css/grid";
import Logo from "../components/Logo";

const Home: React.FC = () => {
  const { theme } = useContext(ThemeContext);
  const { fetcher } = useFetch();
  const history = useHistory();

  const { data: recentlyRead, mutate: mutateRecentlyRead } = useSWR(
    `${API_URL}/webtoons/recently-read`,
    fetcher
  );

  const { data: favorites, mutate: mutateFavorites } = useSWR(
    `${API_URL}/webtoons/favorites`,
    fetcher
  );
  const { data: allWebtoons, mutate: mutateAllWebtoons } = useSWR(
    `${API_URL}/webtoons`,
    fetcher
  );

  useIonViewWillEnter(() => {
    mutateRecentlyRead();
    mutateFavorites();
    mutateAllWebtoons();
  });

  const handleWebtoonClick = (webtoonId: number) => {
    history.push(`/webtoon/${webtoonId}`);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color={theme === "dark" ? "dark" : "light"}>
          <div className=" text-white py-4 px-4 flex items-center justify-between">
            <Logo />
            <div className="flex items-center space-x-4">
              <IonButtons className="">
                <IonIcon icon={search} className="text-2xl text-gray-400" />
              </IonButtons>
            </div>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen color={theme === "dark" ? "dark" : "light"}>
        <div className="pt-2 mb-6">
          <div className="flex justify-start items-center px-4 py-2 space-x-2">
            <FontAwesomeIcon
              icon={faClockRotateLeft}
              className="text-lg text-red-500"
            />
            <h2 className="text-lg text-black dark:text-slate-300 font-bold">
              Lus récemment
            </h2>
          </div>
          <div className="overflow-hidden">
            <Swiper
              slidesPerView={2.5}
              spaceBetween={10}
              pagination={{ clickable: true }}
              className="px-4"
            >
              {recentlyRead?.map((webtoon: Webtoon) => (
                <SwiperSlide key={webtoon.id}>
                  <div onClick={() => handleWebtoonClick(webtoon.id)}>
                    <WebtoonCard webtoon={webtoon} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="flex justify-start items-center px-4 py-2 space-x-2">
            <FontAwesomeIcon icon={faHeart} className="text-lg text-red-500" />
            <h2 className="text-lg text-black dark:text-slate-300 font-bold">
              Favoris
            </h2>
          </div>
          <div className="overflow-hidden">
            <Swiper
              slidesPerView={2.5}
              spaceBetween={10}
              pagination={{ clickable: true }}
              className="px-4"
            >
              {favorites?.map((webtoon: Webtoon) => (
                <SwiperSlide key={webtoon.id}>
                  <div onClick={() => handleWebtoonClick(webtoon.id)}>
                    <WebtoonCard webtoon={webtoon} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="flex justify-start items-center px-4 py-2 space-x-2">
            <FontAwesomeIcon
              icon={faSquareFull}
              className="text-lg text-red-500"
            />
            <h2 className="text-lg text-black dark:text-slate-300 font-bold">
              News
            </h2>
          </div>
          <div className="overflow-hidden">
            <Swiper
              slidesPerView={2.5}
              grid={{ rows: 2, fill: "row" }}
              spaceBetween={10}
              modules={[Grid]}
              className="px-4"
            >
              {allWebtoons?.map((webtoon: Webtoon, index: number) => (
                <SwiperSlide key={webtoon.id}>
                  <div onClick={() => handleWebtoonClick(webtoon.id)}>
                    <WebtoonCard webtoon={webtoon} />
                  </div>
                </SwiperSlide>
              ))}

              <SwiperSlide>
                <div
                  className="relative w-full h-44 rounded-lg overflow-hidden shadow-lg"
                  onClick={() => history.push("/tabs/genres")}
                >
                  {/* <img
                    src="https://placehold.co/300x900"
                    alt="webtoon"
                    className="w-full h-full object-cover"
                  /> */}
                  <div className="flex flex-col justify-center items-center">
                    <IonIcon
                      icon={bookSharp}
                      className="text-2xl text-red-500"
                    />
                    <p className="text-center">Voir plus de webtoons</p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
