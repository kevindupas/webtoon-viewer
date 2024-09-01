import clsx from "clsx";
import React from "react";
import { Webtoon } from "../types";

const WebtoonCard: React.FC<{ webtoon: Webtoon }> = ({ webtoon }) => (
  <div className="relative w-full h-44 rounded-lg overflow-hidden shadow-lg">
    <img
      src={webtoon.cover_image}
      alt={webtoon.name}
      className="w-full h-48 object-cover"
      style={{ height: "200px", width: "100%", objectFit: "cover" }}
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
            webtoon.last_read_chapter ? "text-yellow-500" : "text-green-500 "
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
);

export default WebtoonCard;
