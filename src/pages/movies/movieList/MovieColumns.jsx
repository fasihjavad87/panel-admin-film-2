// src/pages/movies/movieList/MovieColumns.jsx

import React from "react";
import Actions from "./Actions";
import jMoment from "moment-jalaali";
import {
  getContentTypeBadge,
  getContentTypeText,
} from "@/enums/contentTypeStatus";
import {
  getMovieStatusBadge,
  getMovieStatusText,
} from "@/enums/movieStatus";
import {
  getPlaybackStatusBadge,
  getPlaybackStatusText,
} from "@/enums/playbackStatus";

const renderBadge = (config, text) => (
  <span
    className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full border ${config.bg}`}
  >
    <svg className={`w-3.5 h-3.5 fill-transparent ${config.iconColor}`}>
      <use xlinkHref={`#${config.icon}`}></use>
    </svg>
    <span className={config.text}>{text}</span>
  </span>
);

export const createMovieColumns = ({onDelete }) => [
  {
    title: "پوستر",
    name: "poster",
    width: "80px",
    padding: "py-2",
    elements: (rowData) => {
      
      const cover = 
      rowData.primary_media?.thumb_url ||
      rowData.media?.[0]?.thumb_url ||
      null;
      // '/placeholder.png';

      return(
      <div className="flex justify-center">
        <img
          // src={rowData.thumb_url || "/placeholder.png"}
          src={cover}
          alt={rowData.title}
          className="w-12 h-16 rounded object-cover bg-gray-100"
          onError={(e) => {
            e.target.src = "/placeholder.png";
          }}
        />
      </div>
    )},
  },
  {
    field: "title",
    title: "عنوان",
    sortKey: "title",
    width: "220px",
    sortable: true,
    searchable: true,
    elements: (rowData) => (
      <div className="flex flex-col">
        <span className="font-semibold text-gray-800">{rowData.title}</span>
        {rowData.e_name && (
          <span className="text-xs text-gray-500">{rowData.e_name}</span>
        )}
      </div>
    ),
  },
  {
    title: "نوع",
    width: "110px",
    elements: (rowData) =>
      renderBadge(
        getContentTypeBadge(rowData.content_type),
        getContentTypeText(rowData.content_type)
      ),
  },
  {
    title: "وضعیت",
    width: "130px",
    elements: (rowData) =>
      renderBadge(
        getMovieStatusBadge(rowData.status),
        getMovieStatusText(rowData.status)
      ),
  },
  {
    title: "وضعیت پخش",
    width: "140px",
    elements: (rowData) =>
      renderBadge(
        getPlaybackStatusBadge(rowData.playback_status),
        getPlaybackStatusText(rowData.playback_status)
      ),
  },
  {
    title: "قسمت‌ها",
    width: "90px",
    elements: (rowData) => (
      <span className="font-semibold text-gray-700">
        {rowData.total_episodes}
      </span>
    ),
  },
  {
    title: "مدت (دقیقه)",
    width: "110px",
    elements: (rowData) =>
      rowData.runtime ? (
        <span className="font-semibold text-gray-700">{rowData.runtime}</span>
      ) : (
        <span className="text-gray-400">-</span>
      ),
  },
  {
    title: "امتیاز",
    width: "90px",
    elements: (rowData) =>
      rowData.details?.rating ? (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-amber-50 text-amber-700 border border-amber-200">
          <svg className="w-3 h-3 fill-current">
            <use xlinkHref="#icon-star-bold"></use>
          </svg>
          {rowData.details.rating}
        </span>
      ) : (
        <span className="text-gray-400">-</span>
      ),
  },
  {
    title: "تاریخ ایجاد",
    width: "130px",
    elements: (rowData) => (
      <span className="font-normal text-gray-600">
        {jMoment(rowData.created_at).format("jYYYY/jM/jD")}
      </span>
    ),
  },
  {
    field: null,
    title: "عملیات",
    width: "180px",
    elements: (rowData) => (
      <Actions rowData={rowData} onDelete={onDelete}/>
    ),
  },
];