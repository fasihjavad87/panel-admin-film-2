import httpService from "./httpService";

// ==================== Movies ====================

export const moviesGetService = (page = 1, count = 10, searchChar = "", filters = {}) => {
  const params = new URLSearchParams({
    page,
    count,
    searchChar,
    ...Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== "" && v !== null && v !== undefined)
    ),
  });
  return httpService(`/movies?${params.toString()}`, "get");
};

export const movieGetSingleService = (movieId) => {
  return httpService(`/movies/${movieId}`, "get");
};

export const movieAddNewService = (data) => {
  return httpService("/movies/create", "post", data);
};

export const movieEditService = (movieId, data) => {
  return httpService(`/movies/${movieId}/edit`, "put", data);
};

export const movieDeleteService = (movieId) => {
  return httpService(`/movies/${movieId}/delete`, "delete");
};

// ==================== Episodes ====================

export const episodesGetService = (movieId) => {
  return httpService(`/movies/${movieId}/episodes`, "get");
};

export const episodeAddNewService = (movieId, data) => {
  return httpService(`/movies/${movieId}/episodes/create`, "post", data);
};

export const episodeEditService = (movieId, episodeId, data) => {
  return httpService(`/movies/${movieId}/episodes/${episodeId}/edit`, "patch", data);
};

export const episodeDeleteService = (movieId, episodeId) => {
  return httpService(`/movies/${movieId}/episodes/${episodeId}/delete`, "delete");
};

// ==================== Bulk Operations ====================

export const episodesGenerateService = (movieId, data) => {
  return httpService(`/movies/${movieId}/episodes/generate`, "post", data);
};

export const episodesShiftService = (movieId, data) => {
  return httpService(`/movies/${movieId}/episodes/shift`, "post", data);
};

export const episodeRescheduleService = (movieId, episodeId, data) => {
  return httpService(`/movies/${movieId}/episodes/${episodeId}/reschedule`, "patch", data);
};

export const episodesBulkStatusService = (movieId, data) => {
  return httpService(`/movies/${movieId}/episodes/bulk-status`, "patch", data);
};

export const episodesRegenerateScheduleService = (movieId, data) => {
  return httpService(`/movies/${movieId}/episodes/regenerate-schedule`, "patch", data);
};

export const movieSyncMediaService = (id, mediaArray) =>
  httpService(`/movies/${id}/media`, "post", { media: mediaArray });

export const movieGetMediaService = (id) =>
  httpService(`/movies/${id}/media`, "get");