// src/pages/movies/movieShow/core.js

export const getMovieTitle = (movie) => {
  return movie?.title || "محتوای ناشناخته";
};