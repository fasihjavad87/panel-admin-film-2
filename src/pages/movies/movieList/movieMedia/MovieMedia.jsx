// src/pages/movies/movieMedia/MovieMedia.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MediaPickerModal from "@/pages/media/mediaModal/MediaPickerModal";
import MediaStarCard from "./MediaStarCard";
import {
  movieGetMediaService,
  movieSyncMediaService,
  movieGetSingleService,
} from "@/services/movies";
import { toast } from "@/components/Toast/ToastContainer";

const MovieMedia = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [movie, setMovie] = useState(null);

  // 🎯 ساختار: [{ id, ...mediaFields, index }]
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line
  }, [id]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [movieRes, mediaRes] = await Promise.all([
        movieGetSingleService(id),
        movieGetMediaService(id),
      ]);

      setMovie(movieRes.data);

      // نرمال‌سازی: هر media با index خودش
      const list = (mediaRes.data.media || []).map((m) => ({
        ...m,
        index: m.pivot?.index ?? 0,
      }));

      // اگر هیچ index=1 نداشت و لیست خالی نبود → اولی رو primary کن
      if (list.length > 0 && !list.some((m) => m.index === 1)) {
        list[0].index = 1;
      }

      setSelectedMedia(list);
    } catch (err) {
      toast.error("خطا در دریافت اطلاعات");
    } finally {
      setLoading(false);
    }
  };

  // 🎯 بعد از انتخاب از مدال
  const handleSelect = (pickedArray) => {
    // merge با قبلی‌ها (بدون تکرار)
    setSelectedMedia((prev) => {
      const map = new Map(prev.map((m) => [m.id, m]));
      pickedArray.forEach((m) => {
        if (!map.has(m.id)) {
          map.set(m.id, { ...m, index: 0 });
        }
      });
      const merged = Array.from(map.values());

      // اگر هیچ primary نبود، اولی رو primary کن
      if (merged.length > 0 && !merged.some((m) => m.index === 1)) {
        merged[0].index = 1;
      }
      return merged;
    });
  };

  // 🎯 ستاره زدن → فقط این index=1 بشه
  const handleSetPrimary = (mediaId) => {
    setSelectedMedia((prev) =>
      prev.map((m) => ({ ...m, index: m.id === mediaId ? 1 : 0 }))
    );
  };

  // 🎯 حذف از لیست
  const handleRemove = (mediaId) => {
    setSelectedMedia((prev) => {
      const filtered = prev.filter((m) => m.id !== mediaId);
      // اگر primary حذف شد، اولی رو primary کن
      if (filtered.length > 0 && !filtered.some((m) => m.index === 1)) {
        filtered[0].index = 1;
      }
      return filtered;
    });
  };

  // 🎯 ذخیره در بک‌اند
  const handleSave = async () => {
    if (selectedMedia.length === 0) {
      toast.warning("حداقل یک رسانه انتخاب کنید.");
      return;
    }
    setSaving(true);
    try {
      const payload = selectedMedia.map((m) => ({
        id: m.id,
        index: m.index,
      }));
      await movieSyncMediaService(id, payload);
      toast.success("رسانه‌ها با موفقیت ذخیره شدند.");
      navigate("/movies");
    } catch (err) {
      toast.error("خطا در ذخیره رسانه‌ها");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 max-w-6xl mx-auto">
        <div className="p-6 sm:p-10">
          {/* هدر */}
          <div className="flex justify-between items-start mb-6 pb-4 border-b">
            <div>
              <h1 className="text-2xl font-extrabold">
                رسانه‌های{" "}
                <span className="text-indigo-600">
                  {movie?.title || "..."}
                </span>
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                یک رسانه را به‌عنوان «اصلی» انتخاب کنید (ستاره)
              </p>
            </div>
            <button
              onClick={() => navigate("/movies")}
              className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              بازگشت
            </button>
          </div>

          {/* دکمه انتخاب رسانه */}
          <div className="mb-6">
            <button
              type="button"
              onClick={() => setIsPickerOpen(true)}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow cursor-pointer"
            >
              + انتخاب رسانه
            </button>
          </div>

          {/* گرید رسانه‌های انتخاب‌شده */}
          <div className="bg-gray-50 border-[1.4px] border-gray-200 rounded-xl p-4 min-h-[200px]">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="flex gap-2">
                  <span className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce"></span>
                  <span className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </div>
              </div>
            ) : selectedMedia.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <svg className="w-14 h-14 mb-2 fill-transparent">
                  <use xlinkHref="#icon-gallery-bold-duotone"></use>
                </svg>
                <p className="text-sm">هنوز رسانه‌ای انتخاب نشده است</p>
                <p className="text-xs mt-1">
                  روی «انتخاب رسانه» کلیک کنید
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {selectedMedia.map((m) => (
                  <MediaStarCard
                    key={m.id}
                    file={m}
                    isPrimary={m.index === 1}
                    onSetPrimary={handleSetPrimary}
                    onRemove={handleRemove}
                  />
                ))}
              </div>
            )}
          </div>

          {/* دکمه‌های ذخیره */}
          <div className="pt-6 border-t flex justify-start gap-3 mt-6">
            <button
              onClick={handleSave}
              disabled={saving || selectedMedia.length === 0}
              className="px-6 py-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium disabled:opacity-50 cursor-pointer"
            >
              {saving ? "در حال ذخیره..." : "ذخیره رسانه‌ها"}
            </button>
            <button
              onClick={() => navigate("/movies")}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium cursor-pointer"
            >
              انصراف
            </button>
          </div>
        </div>
      </div>

      {/* مدال انتخاب رسانه */}
      <MediaPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={handleSelect}
        multiple={true}
        initialSelectedIds={selectedMedia.map((m) => m.id)}
      />
    </div>
  );
};

export default MovieMedia;