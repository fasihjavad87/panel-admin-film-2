// src/pages/movies/Movies.jsx

import React from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import MoviesTable from "./movieList/MoviesTable";

const Movies = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path && !location.search;
    }
    return location.pathname + location.search === path;
  };

  const tabs = [
    { to: "/movies", label: "همه", icon: "icon-clapperboard-play-bold-duotone", exact: true },
    { to: "/movies?content_type=movie", label: "فیلم‌ها", icon: "icon-clapperboard-play-bold-duotone" },
    { to: "/movies?content_type=series", label: "سریال‌ها", icon: "icon-tv-bold-duotone" },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* تب‌ها */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-1.5 flex gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.to}
            onClick={() => navigate(tab.to)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              isActive(tab.to, tab.exact)
                ? "bg-indigo-50 text-indigo-600 border border-indigo-200"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <svg className="w-5 h-5 fill-transparent">
              <use xlinkHref={`#${tab.icon}`}></use>
            </svg>
            {tab.label}
          </button>
        ))}
      </div>

      <MoviesTable/>

      {/* محتوا */}
      <Outlet />
    </div>
  );
};

export default Movies;