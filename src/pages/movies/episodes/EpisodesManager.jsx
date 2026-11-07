// src/pages/movies/episodes/EpisodesManager.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Outlet } from "react-router-dom";
import {
  episodesGetService,
  movieGetSingleService,
  episodeDeleteService,
  episodesBulkStatusService,
} from "@/services/movies";
import { toast } from "@/components/Toast/ToastContainer";
import { openConfirmModal } from "@/components/Modal/modal";
import { createEpisodeColumns } from "./EpisodeColumns";
import PaginatedTable from "@/components/PaginatedTable";
import useServerTable from "@/hooks/useServerTable";
import { EpisodeStatusOptions } from "@/enums/episodeStatus";
import { useHasPermission } from "@/hooks/useHasPermission";
import Tooltip2 from "@/components/Tooltip2";
import { useTableRefresh } from "@/hooks/useTableRefresh";
import EpisodeCountdown from "@/components/Countdown/EpisodeCountdown";

import {
  isSeries,
  isMovie,
  getContentTypeText,
} from "@/enums/contentTypeStatus";

const EpisodesManager = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { registerRefresh, unregisterRefresh } = useTableRefresh();

  const [movie, setMovie] = useState(null);
  const [selectedEpisodes, setSelectedEpisodes] = useState([]);

  const hasCreatePerm = useHasPermission("create-episode");
  const hasUpdatePerm = useHasPermission("update-episode");
  // const hasDeletePerm = useHasPermission("delete-episode");

  // ⬇️⬇️⬇️ useServerTable برای episodes ⬇️⬇️⬇️
  const {
    data: episodes,
    loading,
    currentPage,
    setCurrentPage,
    search,
    setSearch,
    pageCount,
    refresh,
  } = useServerTable({
    service: (page, count, searchChar) => episodesGetService(id),
    perPage: 50,
    paginated: false, // ⬅️ آرایه مستقیم
  });

  // ⬇️ movie رو جدا لود کن
  useEffect(() => {
    loadMovie();
  }, [id]);

  useEffect(() => {
    registerRefresh("episodes", refresh);

    return () => unregisterRefresh("episodes");
  }, []);

  const loadMovie = async () => {
    try {
      const res = await movieGetSingleService(id);
      setMovie(res.data);
    } catch (error) {
      toast.error("خطا در دریافت اطلاعات سریال");
    }
  };

  const deleteEpisode = async (episode) => {
    const confirmed = await openConfirmModal({
      title: "حذف قسمت",
      message: `آیا از حذف "قسمت ${episode.episode_number}" مطمئن هستید؟`,
      confirmText: "حذف شود",
      cancelText: "انصراف",
      variant: "danger",
      icon: "trash-bin-minimalistic",
    });
    if (confirmed) {
      try {
        await episodeDeleteService(id, episode.id);
        toast.success("قسمت حذف شد");
        refresh(); // ⬅️ refresh از useServerTable
      } catch (error) {
        // toast در httpService
      }
    }
  };

  const changeBulkStatus = async (status) => {
    if (selectedEpisodes.length === 0) {
      toast.warning("حداقل یک قسمت انتخاب کنید");
      return;
    }
    try {
      await episodesBulkStatusService(id, {
        episode_ids: selectedEpisodes,
        status,
      });
      toast.success("وضعیت آپدیت شد");
      setSelectedEpisodes([]);
      refresh(); // ⬅️ refresh
    } catch (error) {
      // toast خودکار
    }
  };

  const columns = createEpisodeColumns({
    onEdit: (ep) => navigate(`/movies/${id}/episodes/${ep.id}/edit`),
    onDelete: deleteEpisode,
  });

  const tableSetting = {
    title: `قسمت‌های ${movie?.title || ""}`,
    searchPlaceholder: "جست‌وجو ...",
    selectable: true,
    countSelect: true,
    loading: loading,
  };

  const movieIsSeries = isSeries(movie?.content_type);
  const movieIsMovie = isMovie(movie?.content_type);

  const canGenerate = hasCreatePerm && movieIsSeries && episodes.length === 0;

  const getSubtitle = () => {
    if (movieIsMovie) {
      return "فیلم (تک‌قسمتی)";
    }
    if (movieIsSeries) {
      return `سریال (${episodes.length} از ${movie?.total_episodes || 0} قسمت)`;
    }
    return getContentTypeText(movie?.content_type);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* هدر */}
      <div className="bg-white rounded-xl shadow-sm border p-4 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold">مدیریت قسمت‌های {movie?.title}</h1>
          <p className="text-sm text-gray-500">{getSubtitle()}</p>
        </div>
        <button
          onClick={() => navigate("/movies")}
          className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
        >
          بازگشت
        </button>
      </div>

      {/* دکمه‌های عملیات */}
      <div className="flex flex-wrap gap-2">
        {canGenerate && (
          <Tooltip2 text="ساخت خودکار قسمت‌ها" placement="top">
            {/* <button
              onClick={() => navigate(`/movies/${id}/episodes/generate`)}
              className="px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 border border-green-300 rounded-lg text-sm font-medium"
            >
              ⚡ ساخت خودکار ({movie?.total_episodes || "؟"} قسمت)
            </button> */}
            {/* <button
            onClick={() => navigate(`/movies/${id}/episodes/generate`)}
            className="flex gap-x-1 px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-300 rounded-lg text-sm font-medium cursor-pointer"
          >
            <svg className='w-5 h-5 fill-transparent text-orange-500'>
              <use xlinkHref='#icon-bolt-bold-duotone'></use>
            </svg>
            <span>ساخت خودکار ({movie?.total_episodes || "؟"} قسمت)</span>
          </button> */}
            <button
              onClick={() => navigate(`/movies/${id}/episodes/generate`)}
              className="flex items-center gap-x-1 p-2 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-300 rounded-lg text-sm font-medium cursor-pointer"
            >
              <svg className="w-22px h-22px fill-transparent text-orange-500">
                <use xlinkHref="#icon-bolt-bold-duotone"></use>
              </svg>
              <span>ساخت خودکار ({movie?.total_episodes || "؟"} قسمت)</span>
            </button>
          </Tooltip2>
        )}
        {hasCreatePerm && (
          <Tooltip2 text="افزودن قسمت" placement="top">
            {/* <button
              onClick={() => navigate(`/movies/${id}/episodes/add-episode`)}
              className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-300 rounded-lg text-sm font-medium"
            >
              ➕ افزودن قسمت
            </button> */}
            {/* <button
            onClick={() => navigate(`/movies/${id}/episodes/add-episode`)}
            className="flex gap-x-1 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-300 rounded-lg text-sm font-medium cursor-pointer"
          >
            <svg className='w-5 h-5 fill-transparent text-blue-500'>
              <use xlinkHref='#icon-add-circle-bold-duotone'></use>
            </svg>
            <span>افزودن قسمت</span>
          </button> */}
            <button
              onClick={() => navigate(`/movies/${id}/episodes/add-episode`)}
              className="flex items-center gap-x-1 p-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-300 rounded-lg text-sm font-medium cursor-pointer"
            >
              <svg className="w-22px h-22px fill-transparent text-blue-500">
                <use xlinkHref="#icon-add-circle-bold-duotone"></use>
              </svg>
              {/* <span>افزودن قسمت</span> */}
            </button>
          </Tooltip2>
        )}
        {hasUpdatePerm && episodes.length > 0 && (
          <Tooltip2 text="جابجایی برنامه پخش" placement="top">
            {/* <button
              onClick={() => navigate(`/movies/${id}/episodes/shift`)}
              className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-300 rounded-lg text-sm font-medium cursor-pointer"
            >
              🔄 جابجایی برنامه
            </button> */}
            <button
              onClick={() => navigate(`/movies/${id}/episodes/shift`)}
              className="flex items-center gap-x-1 p-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-300 rounded-lg text-sm font-medium cursor-pointer"
            >
              <svg className="w-22px h-22px fill-transparent text-purple-500">
                <use xlinkHref="#icon-refresh-square-3-bold-duotone"></use>
              </svg>
              {/* <span>جابجایی برنامه</span> */}
            </button>
          </Tooltip2>
        )}
        {hasUpdatePerm && selectedEpisodes.length > 0 && (
          <div className="flex gap-1">
            {EpisodeStatusOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => changeBulkStatus(opt.id)}
                className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-300 rounded-lg text-sm"
              >
                {opt.title} ({selectedEpisodes.length})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* جدول */}
      <PaginatedTable
        serverSide={true} // ⬅️ true (چون useServerTable)
        data={episodes}
        dataInfo={columns}
        currentPage={currentPage}
        pageCount={pageCount}
        onPageChange={setCurrentPage}
        searchValue={search}
        onSearch={setSearch}
        selectedRows={selectedEpisodes}
        setSelectedRows={setSelectedEpisodes}
        tableSetting={tableSetting}
      />

      {/* شمارشگر معکوس */}
      {movie?.countdown && (
        <EpisodeCountdown
          secondsTill={movie.countdown.seconds_till}
          episodeNumber={movie.countdown.episode_number}
          airdate={movie.countdown.airdate} // ⬅️ ISO
          scheduleTextFa={movie.countdown.schedule_text_fa}
        />
      )}

      {/* مودال‌ها */}
      <Outlet />
    </div>
  );
};

export default EpisodesManager;
