// src/pages/movies/movieShow/Modal.jsx

import React, { useEffect, useRef, useState } from "react";
import ModalsContainer2 from "@/components/ModalsContainer2";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { movieGetSingleService } from "@/services/movies";
import jMoment from "moment-jalaali";
import {
  getContentTypeText,
  getContentTypeBadge,
} from "@/enums/contentTypeStatus";
import { getMovieStatusText, getMovieStatusBadge } from "@/enums/movieStatus";
import {
  getPlaybackStatusText,
  getPlaybackStatusBadge,
} from "@/enums/playbackStatus";
import {
  getEpisodeStatusText,
  getEpisodeStatusBadge,
} from "@/enums/episodeStatus";
import EpisodeCountdown from "@/components/Countdown/EpisodeCountdown";

const Modal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const modalRef = useRef(null);
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  // بررسی اینکه آیا از صفحه‌ای با تب content_type اومده یا نه
  const backPath = location.state?.from || "/movies";

  useEffect(() => {
    modalRef.current?.open();
    loadMovie();
  }, []);

  const loadMovie = async () => {
    setLoading(true);
    try {
      const res = await movieGetSingleService(id);
      setMovie(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const cover =
    movie?.primary_media?.thumb_url ||
    movie?.media?.[0]?.thumb_url ||
    null;
    // "/placeholder.png";

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

  return (
    <ModalsContainer2
      ref={modalRef}
      id="show_movie_modal"
      title={
        loading ? (
          <div className="h-5 w-40 bg-gray-200 animate-pulse rounded"></div>
        ) : (
          `اطلاعات ${movie?.title || ""}`
        )
      }
      isFooter={false}
      closeOnOutsideClick={false}
      width="max-w-3xl"
      onClose={() => navigate(backPath)}
    >
      <div>
        {loading ? (
          <div className="flex flex-col items-center py-8">
            <div className="flex gap-2">
              <span className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></span>
              <span
                className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></span>
              <span
                className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></span>
            </div>
          </div>
        ) : movie ? (
          <div className="flex flex-col gap-2.5">
            {/* تصویر و عنوان */}
            <div className="flex items-start gap-3 p-2.5 rounded-lg bg-gray-50 border-[1.4px] border-gray-200">
              <img
                className="w-[80px] h-[110px] rounded-lg border-[1.4px] border-gray-200 object-cover"
                // src={movie.details?.poster_url || "/placeholder.png"}
                src={cover}
                alt={movie.title}
                onError={(e) => {
                  e.target.src = "/placeholder.png";
                }}
              />
              <div className="flex flex-col gap-1 flex-1">
                <h2 className="text-lg font-bold">{movie.title}</h2>
                {movie.e_name && (
                  <p className="text-sm text-gray-500">{movie.e_name}</p>
                )}
                <p className="text-xs text-gray-400">/{movie.slug}</p>
              </div>
            </div>

            {/* اطلاعات اصلی */}
            <div className="grid grid-cols-2 gap-3">
              <div
                className={`border-[1.4px] p-3 rounded-lg ${getContentTypeBadge(movie.content_type).bg}`}
              >
                <div
                  className={`text-sm flex items-center gap-x-0.5 ${getContentTypeBadge(movie.content_type).iconColor}`}
                >
                  <svg className="w-[19px] h-[19px] fill-transparent">
                    <use
                      xlinkHref={`#${getContentTypeBadge(movie.content_type).icon}`}
                    ></use>
                  </svg>
                  <span className="font-semibold">نوع</span>
                </div>
                <div
                  className={`text-base pt-1 font-bold ${getContentTypeBadge(movie.content_type).text}`}
                >
                  {getContentTypeText(movie.content_type)}
                </div>
              </div>

              <div
                className={`border-[1.4px] p-3 rounded-lg ${getMovieStatusBadge(movie.status).bg}`}
              >
                <div
                  className={`text-sm flex items-center gap-x-0.5 ${getMovieStatusBadge(movie.status).iconColor}`}
                >
                  <svg className="w-[19px] h-[19px] fill-transparent">
                    <use
                      xlinkHref={`#${getMovieStatusBadge(movie.status).icon}`}
                    ></use>
                  </svg>
                  <span className="font-semibold">وضعیت</span>
                </div>
                <div
                  className={`text-base pt-1 font-bold ${getMovieStatusBadge(movie.status).text}`}
                >
                  {getMovieStatusText(movie.status)}
                </div>
              </div>

              <div
                className={`border-[1.4px] p-3 rounded-lg ${getPlaybackStatusBadge(movie.playback_status).bg}`}
              >
                <div
                  className={`text-sm flex items-center gap-x-0.5 ${getPlaybackStatusBadge(movie.playback_status).iconColor}`}
                >
                  <svg className="w-[19px] h-[19px] fill-transparent">
                    <use
                      xlinkHref={`#${getPlaybackStatusBadge(movie.playback_status).icon}`}
                    ></use>
                  </svg>
                  <span className="font-semibold">وضعیت پخش</span>
                </div>
                <div
                  className={`text-base pt-1 font-bold ${getPlaybackStatusBadge(movie.playback_status).text}`}
                >
                  {getPlaybackStatusText(movie.playback_status)}
                </div>
              </div>

              <div className="bg-teal-50 border-[1.4px] border-teal-200 p-3 rounded-lg">
                <div className="text-sm text-teal-600 flex items-center gap-x-0.5">
                  <svg className="w-[19px] h-[19px] fill-transparent">
                    <use xlinkHref="#icon-play-circle-bold-duotone"></use>
                  </svg>
                  <span className="font-semibold">قسمت‌ها</span>
                </div>
                <div className="text-base pt-1 font-bold text-teal-800">
                  {movie.total_episodes} قسمت
                </div>
              </div>

              {movie.runtime && (
                <div className="bg-orange-50 border-[1.4px] border-orange-200 p-3 rounded-lg">
                  <div className="text-sm text-orange-600 flex items-center gap-x-0.5">
                    <svg className="w-[19px] h-[19px] fill-transparent">
                      <use xlinkHref="#icon-clock-circle-bold-duotone"></use>
                    </svg>
                    <span className="font-semibold">مدت</span>
                  </div>
                  <div className="text-base pt-1 font-bold text-orange-800">
                    {movie.runtime} دقیقه
                  </div>
                </div>
              )}

              {movie.details?.rating && (
                <div className="bg-amber-50 border-[1.4px] border-amber-200 p-3 rounded-lg">
                  <div className="text-sm text-amber-600 flex items-center gap-x-0.5">
                    <svg className="w-[19px] h-[19px] fill-transparent">
                      <use xlinkHref="#icon-star-bold"></use>
                    </svg>
                    <span className="font-semibold">امتیاز</span>
                  </div>
                  <div className="text-base pt-1 font-bold text-amber-800">
                    {movie.details.rating} / 10
                  </div>
                </div>
              )}
            </div>

            {/* توضیحات */}
            {movie.description && (
              <div className="bg-blue-50 border-[1.4px] border-blue-200 p-3 rounded-lg">
                <div className="text-sm text-blue-600 flex items-center gap-x-0.5 mb-2">
                  <svg className="w-[19px] h-[19px] fill-transparent">
                    <use xlinkHref="#icon-document-text-bold-duotone"></use>
                  </svg>
                  <span className="font-semibold">خلاصه داستان</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {movie.description}
                </p>
              </div>
            )}

            {/* جزئیات اضافه */}
            {movie.details && (
              <div className="grid grid-cols-2 gap-3">
                {movie.details.release_year && (
                  <div className="bg-indigo-50 border-[1.4px] border-indigo-200 p-3 rounded-lg">
                    <div className="text-sm text-indigo-600 flex items-center gap-x-0.5">
                      <svg className="w-[19px] h-[19px] fill-transparent">
                        <use xlinkHref="#icon-calendar-bold-duotone"></use>
                      </svg>
                      <span className="font-semibold">سال ساخت</span>
                    </div>
                    <div className="text-base pt-1 font-bold text-indigo-800">
                      {movie.details.release_year}
                    </div>
                  </div>
                )}
                {movie.details.age_rating && (
                  <div className="bg-red-50 border-[1.4px] border-red-200 p-3 rounded-lg">
                    <div className="text-sm text-red-600 flex items-center gap-x-0.5">
                      <svg className="w-[19px] h-[19px] fill-transparent">
                        <use xlinkHref="#icon-shield-user-bold-duotone"></use>
                      </svg>
                      <span className="font-semibold">رده سنی</span>
                    </div>
                    <div className="text-base pt-1 font-bold text-red-800">
                      {movie.details.age_rating}
                    </div>
                  </div>
                )}
              </div>
            )}

            {movie?.countdown && (
              <EpisodeCountdown
                secondsTill={movie.countdown.seconds_till}
                episodeNumber={movie.countdown.episode_number}
                airdate={movie.countdown.airdate} // ⬅️ ISO
                scheduleTextFa={movie.countdown.schedule_text_fa}
              />
            )}

            {/* قسمت‌های سریال */}
            {movie.episodes && movie.episodes.length > 0 && (
              <div className="bg-purple-50 border-[1.4px] border-purple-200 p-3 rounded-lg">
                <div className="text-sm text-purple-600 flex items-center gap-x-0.5 mb-3">
                  <svg className="w-[19px] h-[19px] fill-transparent">
                    <use xlinkHref="#icon-play-circle-bold-duotone"></use>
                  </svg>
                  <span className="font-semibold">
                    قسمت‌ها ({movie.episodes.length})
                  </span>
                </div>
                <div className="flex flex-col gap-1.5 max-h-60 overflow-y-auto scrollbar-thin pl-2.5">
                  {movie.episodes.map((ep) => (
                    <div
                      key={ep.id}
                      className="flex items-center justify-between bg-white p-2 rounded border border-purple-200"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-purple-700 text-sm">
                          قسمت {ep.episode_number}
                        </span>
                        {ep.runtime && (
                          <span className="text-xs text-gray-500">
                            ({ep.runtime} دقیقه)
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {renderBadge(
                          getEpisodeStatusBadge(ep.status),
                          getEpisodeStatusText(ep.status),
                        )}
                        {ep.publish_at && (
                          <span className="text-xs text-gray-500">
                            {jMoment(ep.publish_at).format("jYYYY/jM/jD")}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* تاریخ ایجاد */}
            <div className="bg-gray-50 border-[1.4px] border-gray-200 p-3 rounded-lg">
              <div className="text-sm text-gray-600 flex items-center gap-x-0.5">
                <svg className="w-[19px] h-[19px] fill-transparent">
                  <use xlinkHref="#icon-calendar-bold-duotone"></use>
                </svg>
                <span className="font-semibold">تاریخ ایجاد</span>
              </div>
              <div className="text-base pt-1 font-bold text-gray-800">
                {jMoment(movie.created_at).format("jYYYY/jM/jD HH:mm:ss")}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">محتوایی یافت نشد</div>
        )}
      </div>
    </ModalsContainer2>
  );
};

export default Modal;
