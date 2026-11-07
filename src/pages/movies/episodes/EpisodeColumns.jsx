// src/pages/movies/episodes/EpisodeColumns.jsx

import React from "react";
import jMoment from "moment-jalaali";
import {
  getEpisodeStatusBadge,
  getEpisodeStatusText,
} from "@/enums/episodeStatus";
import ActionIcon from "@/components/ActionIcon";

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

export const createEpisodeColumns = ({ onEdit, onDelete }) => [
  {
    field: "episode_number",
    title: "شماره",
    width: "80px",
    elements: (row) => (
      <span className="font-bold text-gray-700">{row.episode_number}</span>
    ),
  },
  {
    field: "title",
    title: "عنوان",
    width: "200px",
    elements: (row) => (
      <span className="font-semibold">
        {row.title || `قسمت ${row.episode_number}`}
      </span>
    ),
  },
  {
    title: "وضعیت",
    width: "140px",
    elements: (row) =>
      renderBadge(
        getEpisodeStatusBadge(row.status),
        getEpisodeStatusText(row.status),
      ),
  },
  {
    title: "تاریخ پخش",
    width: "180px",
    elements: (row) =>
      row.publish_at ? (
        <span className="text-gray-700">
          {jMoment(row.publish_at).format("jYYYY/jM/jD HH:mm")}
        </span>
      ) : (
        <span className="text-gray-400">-</span>
      ),
  },
  {
    title: "مدت (دقیقه)",
    width: "110px",
    elements: (row) =>
      row.runtime ? (
        <span className="font-semibold">{row.runtime}</span>
      ) : (
        <span className="text-gray-400">-</span>
      ),
  },
  {
    title: "عملیات",
    width: "150px",
    elements: (row) => (
      <div className="flex gap-1">
        {/* <button
          onClick={() => onEdit(row)}
          className="p-1.5 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-600"
          title="ویرایش"
        >
          <svg className="w-[20px] h-[20px] fill-transparent">
            <use xlinkHref="#icon-pen-new-square"></use>
          </svg>
        </button> */}
        {/* <button
          onClick={() => onDelete(row)}
          className="p-1.5 rounded-md bg-red-50 hover:bg-red-100 text-red-600"
          title="حذف"
        >
          <svg className="w-[20px] h-[20px] fill-transparent">
            <use xlinkHref="#icon-trash-bin-minimalistic"></use>
          </svg>
        </button> */}
        <ActionIcon
          onClick={() => onEdit(row)}
          icon="icon-pen-new-square"
          className="bg-amber-50 hover:bg-amber-100 text-amber-600"
          title="ویرایش"
          permission="update-episode"
        />
        <ActionIcon
          onClick={() => onDelete(row)}
          icon="icon-trash-bin-minimalistic"
          className="bg-red-50 hover:bg-red-100 text-red-600"
          title="حذف"
          permission="delete-episode"
        />
      </div>
    ),
  },
];
