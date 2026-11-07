// src/pages/media/mediaModal/MediaPickerModal.jsx
import React, { useEffect, useRef, useState } from "react";
import ModalsContainer2 from "@/components/ModalsContainer2";
import { Formik } from "formik";
import { toast } from "@/components/Toast/ToastContainer";
import { mediaGetService } from "@/services/media";
import MediaPickerGrid from "./MediaPickerGrid";
import MediaUpload, { createEmptyRow } from "../mediaUpload/MediaUpload";
import CheckPermission from "@/components/checkPermission";

const MediaPickerModal = ({
  isOpen,
  onClose,
  onSelect, // 👈 کال‌بک: (selectedMediaArray) => void
  multiple = true, // 👈 انتخاب چندتایی یا تک
  initialSelectedIds = [],
}) => {
  const modalRef = useRef(null);

  const [activeTab, setActiveTab] = useState("library");
  const [media, setMedia] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [selectedIds, setSelectedIds] = useState(initialSelectedIds);

  // ================== باز/بسته کردن مودال ==================
  useEffect(() => {
    if (isOpen) {
      modalRef.current?.open();
    } else {
      modalRef.current?.close();
    }
  }, [isOpen]);

  // ================== بارگذاری ==================
  const loadMedia = async (pageToLoad, reset = false) => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await mediaGetService(pageToLoad, 50, search);

      if (res.status === 200) {
        const result = res.data;
        setMedia((prev) =>
          reset || pageToLoad === 1 ? result.data : [...prev, ...result.data],
        );
        setPage(result.current_page);
        setLastPage(result.last_page);
      }
    } catch (err) {
      setError("دریافت رسانه‌ها ناموفق بود.");
    } finally {
      setLoading(false);
    }
  };

  // ================== لود اولیه + تغییر تب/سرچ ==================
  useEffect(() => {
    if (!isOpen) return;
    if (activeTab === "library") {
      setMedia([]);
      setPage(1);
      setLastPage(1);
      setError(null);
      void loadMedia(1, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, activeTab, isOpen]);

  // ================== ریست وقتی مودال باز می‌شه ==================
  useEffect(() => {
    if (isOpen) {
      setActiveTab("library");
      setSearch("");
      setSearchInput("");
      setSelectedIds(initialSelectedIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const hasMore = page < lastPage;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(searchInput.trim());
  };

  // ================== انتخاب ==================
  const handleToggleSelect = (id) => {
    if (!multiple) {
      // حالت تک‌انتخابی
      setSelectedIds((prev) => (prev.includes(id) ? [] : [id]));
      return;
    }

    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleClearSelection = () => setSelectedIds([]);

  // ================== بعد از آپلود ==================
  const handleUploaded = (uploadedItems) => {
    setMedia((prev) => [...uploadedItems, ...prev]);
    setActiveTab("library"); // 👈 برگردون به کتابخانه
    toast.success("فایل‌ها آپلود شدند و به کتابخانه اضافه شدند.");
  };

  // ================== تایید انتخاب ==================
  const handleConfirm = () => {
    if (!selectedIds.length) {
      toast.warning("حداقل یک رسانه انتخاب کنید.");
      return;
    }

    // 👈 ساخت آرایه کامل از آبجکت‌های انتخاب‌شده
    const selectedMedia = media.filter((m) => selectedIds.includes(m.id));

    onSelect?.(selectedMedia);
    onClose?.();
  };

  return (
    <ModalsContainer2
      ref={modalRef}
      id="media_picker_modal"
      title="انتخاب رسانه"
      isFooter={true}
      width="max-w-7xl"
      onClose={onClose}
      itemLeftToFooter={
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!selectedIds.length}
          className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:pointer-events-none transition cursor-pointer"
        >
          انتخاب رسانه‌ها ({selectedIds.length})
        </button>
      }
    >
      <div className="flex flex-col gap-4">
        {/* ============ تب‌ها ============ */}
        <div className="border-b border-gray-200 flex justify-between items-end">
          <nav className="-mb-px flex space-x-8">
            <PickerTabButton
              active={activeTab === "library"}
              onClick={() => setActiveTab("library")}
              permission='view-media'
            >
              کتابخانه رسانه
            </PickerTabButton>
            <PickerTabButton
              active={activeTab === "upload"}
              onClick={() => setActiveTab("upload")}
              permission='create-media'
              success
            >
              آپلود فایل جدید
            </PickerTabButton>
          </nav>
        </div>

        {/* ============ تب کتابخانه ============ */}
        {activeTab === "library" && (
          <>

            {/* ============ سرچ + نوار انتخاب (کنار هم) ============ */}
            <div className="flex items-center gap-3">
              {/* سرچ - همیشه نمایش داده می‌شه */}
              <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
                <div className="relative flex-1 group">
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none">
                    <svg className="w-[18px] h-[18px] fill-transparent">
                      <use xlinkHref="#icon-magnifer"></use>
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="جستجو بر اساس نام فایل یا عنوان..."
                    className="w-full pr-10 pl-3 py-2.5 rounded-lg text-sm bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-[1.4px] border-gray-200 dark:border-gray-700 focus:border-indigo-400 focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-gray-400"
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center gap-x-1.5 px-5 py-2.5 rounded-lg bg-indigo-50 text-indigo-600 border-[1.4px] border-indigo-200 text-sm font-medium hover:bg-indigo-100 transition cursor-pointer"
                >
                  <svg className="w-[16px] h-[16px] fill-transparent">
                    <use xlinkHref="#icon-magnifer"></use>
                  </svg>
                  جستجو
                </button>
              </form>

              {/* نوار انتخاب - فقط وقتی چیزی انتخاب شده نمایش داده می‌شه */}
              {selectedIds.length > 0 && (
                <div className="flex justify-between items-center w-[250px] px-1.5 py-[5px] rounded-lg border-[1.4px] bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800 flex-shrink-0">
                  <div className="flex items-center gap-x-2">
                    <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-200 text-indigo-700">
                      <svg className="w-[16px] h-[16px] fill-transparent">
                        <use xlinkHref="#icon-checked"></use>
                      </svg>
                    </div>
                    <p className="text-sm font-bold text-indigo-800 whitespace-nowrap">
                      {selectedIds.length} انتخاب شده
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleClearSelection}
                    className="flex items-center gap-x-1 px-2.5 py-1.5 rounded-lg bg-white dark:bg-gray-800 border-[1.4px] border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-xs font-medium hover:bg-gray-50 transition cursor-pointer whitespace-nowrap"
                  >
                    <svg className="w-[14px] h-[14px] fill-transparent">
                      <use xlinkHref="#icon-close-circle"></use>
                    </svg>
                    لغو
                  </button>
                </div>
              )}
            </div>

            {/* گرید */}
            <div className="relative min-h-[200px]">
              {loading && media.length === 0 && (
                <div className="absolute inset-0 z-10 bg-white/70 flex items-center justify-center">
                  <svg
                    className="animate-spin h-10 w-10 text-indigo-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              )}

              <MediaPickerGrid
                items={media}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
              />

              {error && (
                <p className="mt-4 text-red-500 text-center">{error}</p>
              )}

              {hasMore && (
                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={() => void loadMedia(page + 1)}
                    disabled={loading}
                    className="px-6 py-2.5 rounded-lg border border-indigo-600 text-indigo-600 font-medium hover:bg-indigo-50 disabled:opacity-50 disabled:pointer-events-none transition cursor-pointer"
                  >
                    {loading ? "در حال بارگذاری..." : "بارگذاری بیشتر"}
                  </button>
                </div>
              )}

              {!hasMore && media.length > 0 && (
                <p className="mt-6 text-center text-gray-500 text-sm">
                  همه رسانه‌ها بارگذاری شدند.
                </p>
              )}
            </div>
          </>
        )}

        {/* ============ تب آپلود ============ */}
        {activeTab === "upload" && (
          <Formik
            initialValues={{ rows: [createEmptyRow()] }}
            onSubmit={() => {}}
          >
            <MediaUpload onUploaded={handleUploaded} />
          </Formik>
        )}
      </div>
    </ModalsContainer2>
  );
};

// ==================== تب ====================
const PickerTabButton = ({
  active,
  onClick,
  permission,
  children,
  success,
}) => (
  <CheckPermission permission={permission}>
    <button
      type="button"
      onClick={onClick}
      className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 cursor-pointer ${
        active
          ? success
            ? "border-green-600 text-green-600"
            : "border-indigo-600 text-indigo-600"
          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
      }`}
    >
      {children}
    </button>
  </CheckPermission>
);

export default MediaPickerModal;
