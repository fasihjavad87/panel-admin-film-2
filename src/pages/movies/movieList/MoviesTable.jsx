// src/pages/movies/movieList/MoviesTable.jsx

import React, { useState } from "react";
import { useSearchParams, useNavigate, useLocation, Outlet } from "react-router-dom";
import { moviesGetService, movieDeleteService } from "@/services/movies";
import PaginatedTable from "@/components/PaginatedTable";
import useServerTable from "@/hooks/useServerTable";
import { createMovieColumns } from "./MovieColumns";
import { openConfirmModal } from "@/components/Modal/modal";
import { useHasPermission } from "@/hooks/useHasPermission";
import { toast } from "@/components/Toast/ToastContainer";
import Tooltip2 from "@/components/Tooltip2";

const MoviesTable = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const contentType = searchParams.get("content_type") || "";
  const [selectedMovies, setSelectedMovies] = useState([]);

  const {
    data,
    loading,
    currentPage,
    setCurrentPage,
    search,
    setSearch,
    pageCount,
    refresh,
  } = useServerTable({
    service: (page, count, searchChar) =>
      moviesGetService(page, count, searchChar, {
        content_type: contentType,
      }),
    perPage: 50,
    paginated: true,
    deps: [contentType],
  });

  const hasCreatePerm = useHasPermission("create-movie");
  const hasDeletePerm = useHasPermission("delete-movie");

  const deleteMovie = async (movie) => {
    const confirmed = await openConfirmModal({
      title: "حذف محتوا",
      message: `آیا از حذف "${movie.title}" مطمئن هستید؟`,
      confirmText: "حذف شود",
      cancelText: "انصراف",
      variant: "danger",
      icon: "trash-bin-minimalistic",
    });

    if (confirmed) {
      try {
        await movieDeleteService(movie.id);
        toast.success(`"${movie.title}" با موفقیت حذف شد`);
        refresh();
      } catch (error) {
        // toast خودکار
      }
    }
  };

  const dataInfo = createMovieColumns({
    // onView: (movie) =>
    //   navigate(`/movies/${movie.id}`, {
    //     state: { from: location.pathname + location.search },
    //   }),
    // onEdit: (movie) => navigate(`/movies/edit-movie/${movie.id}`),
    // onEpisodes: (movie) => navigate(`/movies/${movie.id}/episodes`),
    onDelete: deleteMovie,
  });

  const tableSetting = {
    title: "لیست فیلم‌ها و سریال‌ها",
    searchPlaceholder: "جست‌وجو در عنوان ...",
    selectable: true,
    countSelect: true,
    loading: loading,
  };

  return (
    <>
      <PaginatedTable
        serverSide={true}
        data={data}
        dataInfo={dataInfo}
        currentPage={currentPage}
        pageCount={pageCount}
        onPageChange={setCurrentPage}
        searchValue={search}
        onSearch={setSearch}
        selectedRows={selectedMovies}
        setSelectedRows={setSelectedMovies}
        tableSetting={tableSetting}
      >
        <div className="flex gap-2">
          {hasCreatePerm && (
            <Tooltip2 text="افزودن" placement="top">
              <button
                onClick={() => navigate("/movies/add-movie")}
                className="flex justify-center items-center p-1.5 gap-1 bg-blue-50 hover:bg-blue-100 text-custom-blue border-[1.4px] border-custom-blue text-[18px] rounded-md transition cursor-pointer"
              >
                <svg className="w-22px h-22px fill-transparent">
                  <use xlinkHref="#icon-plus"></use>
                </svg>
              </button>
            </Tooltip2>
          )}
        </div>
      </PaginatedTable>
      {/* <Outlet /> */}
    </>
  );
};

export default MoviesTable;