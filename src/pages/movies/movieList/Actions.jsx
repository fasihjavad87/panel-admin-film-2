// src/pages/movies/movieList/Actions.jsx

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Tooltip from "@/components/Tooltip";
import ActionIcon from "@/components/ActionIcon";
import { useHasPermission } from "@/hooks/useHasPermission";

const Actions = ({ rowData, onDelete }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const ACTION_PERMISSIONS = {
    episodes: "view-episode",
    media: "view-movie",
    view: "view-movie",
    edit: "update-movie",
    delete: "delete-movie",
  };

  const hasAnyActionPermission = useHasPermission(
    Object.values(ACTION_PERMISSIONS),
  );

  return (
    <div className="flex gap-2">
      {hasAnyActionPermission && (
        <Tooltip
          placement="right"
          offset={10}
          trigger="click"
          closeOnContentClick="data-attr"
          content={
            <div className="flex flex-wrap gap-1 bg-white shadow-xl border rounded-lg p-1 w-fit max-w-[120px]">
              {/* 📺 مدیریت قسمت‌ها */}
              <ActionIcon
                // onClick={() => navigate(`/movies/${rowData.id}/episodes`)}
                to={`/movies/${rowData.id}/episodes`}
                icon="icon-video-library"
                className="bg-green-50 hover:bg-green-100 text-green-600"
                title="مدیریت قسمت‌ها"
                permission="view-episode"
                data-close-tooltip
              />

              {/* 🖼️ مدیریت رسانه‌ها */}
              <ActionIcon
                to={`/movies/${rowData.id}/media`}
                icon="icon-album"
                className="bg-purple-50 hover:bg-purple-100 text-purple-600"
                title="مدیریت رسانه‌ها"
                permission="view-movie"
                data-close-tooltip
              />

              {/* 👁️ مشاهده جزئیات */}
              <ActionIcon
                to={`/movies/${rowData.id}`}
                state={{ from: location.pathname + location.search }}
                icon="icon-eye"
                className="bg-blue-50 hover:bg-blue-100 text-blue-600"
                title="مشاهده جزئیات"
                permission="view-movie"
                data-close-tooltip
              />

              {/* ✏️ ویرایش */}
              <ActionIcon
                to={`/movies/edit-movie/${rowData.id}`}
                icon="icon-pen-new-square"
                className="bg-amber-50 hover:bg-amber-100 text-amber-600"
                title="ویرایش"
                permission="update-movie"
                data-close-tooltip
              />

              {/* 🗑️ حذف */}
              <ActionIcon
                onClick={() => onDelete(rowData)}
                icon="icon-trash-bin-minimalistic"
                className="bg-red-50 hover:bg-red-100 text-red-600"
                title="حذف"
                permission="delete-movie"
                data-close-tooltip
              />
            </div>
          }
        >
          <button
            data-tooltip-text="بیشتر"
            data-tooltip-position="top"
            className="p-1.5 rounded-md cursor-pointer transition bg-blue-50 hover:bg-blue-100 text-blue-600"
          >
            <svg className="w-[22px] h-[22px] fill-transparent">
              <use xlinkHref="#icon-menu-dots"></use>
            </svg>
          </button>
        </Tooltip>
      )}
    </div>
  );
};

export default Actions;