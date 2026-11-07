import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  mediaGetService,
  mediaGetTrashedService,
  mediaGroupSoftDeleteService,
  mediaGroupRestoreService,
  mediaGroupForceDeleteService,
} from "@/services/media";

import { openConfirmModal } from "@/components/Modal/modal";
import { toast } from "@/components/Toast/ToastContainer";
import MediaGrid from "./MediaGrid";
import MediaUpload, { createEmptyRow } from "../mediaUpload/MediaUpload";
import MediaDetailsModal from "./mediaShow/MediaDetailsModal";
import { Formik } from "formik";
import CheckPermission from "@/components/checkPermission";

const MediaLibrary = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getTabFromPath = (pathname) => {
    if (pathname.includes("/upload")) return "upload";
    if (pathname.includes("/trashed")) return "trashed";
    return "library";
  };

  const [activeTab, setActiveTab] = useState(getTabFromPath(location.pathname));

  useEffect(() => {
    setActiveTab(getTabFromPath(location.pathname));
  }, [location.pathname]);

  const handleTabChange = (tab) => {
    if (tab === "upload") navigate("/media/upload");
    else if (tab === "trashed") navigate("/media/trashed");
    else navigate("/media");
  };

  // ================== state ها ==================
  const [media, setMedia] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [selectedIds, setSelectedIds] = useState([]);

  // ================== بارگذاری ==================
  const loadMedia = async (pageToLoad, reset = false) => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const isTrashed = activeTab === "trashed";
      const res = isTrashed
        ? await mediaGetTrashedService(pageToLoad, 50, search)
        : await mediaGetService(pageToLoad, 50, search);

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

  useEffect(() => {
    if (activeTab === "library" || activeTab === "trashed") {
      setSelectedIds([]);
      setMedia([]); // 👈 این خط اضافه شد: پاک کردن آیتم‌های تب قبلی
      setPage(1); // 👈 این خط اضافه شد: ریست صفحه
      setLastPage(1); // 👈 این خط اضافه شد: ریست آخرین صفحه
      setError(null); // 👈 این خط اضافه شد: پاک کردن خطای قبلی
      void loadMedia(1, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, activeTab]);

  const hasMore = page < lastPage;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(searchInput.trim());
  };

  const handleUploaded = (uploadedItems) => {
    setMedia((prev) => [...uploadedItems, ...prev]);
    navigate("/media");
  };

  // ================== انتخاب ==================
  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleClearSelection = () => setSelectedIds([]);

  // ================== عملیات گروهی ==================
  const handleGroupSoftDelete = async () => {
    if (!selectedIds.length) return;

    const confirmed = await openConfirmModal({
      title: "حذف گروهی رسانه‌ها",
      message: `آیا از حذف تعداد "${selectedIds.length}" رسانه مطمئن هستید؟`,
      confirmText: "حذف شوند",
      cancelText: "انصراف",
      variant: "danger",
      icon: "trash-bin-minimalistic",
    });

    if (!confirmed) return;

    try {
      const response = await mediaGroupSoftDeleteService({ ids: selectedIds });

      if (response.status === 200 || response.status === 204) {
        await toast.success(
          `تعداد "${selectedIds.length}" رسانه با موفقیت حذف موقت شد`,
          { title: "موفق", duration: 5000 },
        );
        setMedia((prev) => prev.filter((m) => !selectedIds.includes(m.id)));
        setSelectedIds([]);
      }
    } catch (error) {
      console.error("Error group deleting media:", error);
      await toast.error(
        error.response?.data?.message || "خطا در حذف گروهی رسانه‌ها",
        { title: "خطا", duration: 5000 },
      );
    }
  };

  // ================== بازگردانی گروهی ==================
  const handleGroupRestore = async () => {
    if (!selectedIds.length) return;

    const confirmed = await openConfirmModal({
      title: "بازگردانی گروهی رسانه‌ها",
      message: `آیا از بازگردانی تعداد "${selectedIds.length}" رسانه مطمئن هستید؟`,
      confirmText: "بازگردانی شوند",
      cancelText: "انصراف",
      variant: "success",
      icon: "check-circle",
    });

    if (!confirmed) return;

    try {
      const response = await mediaGroupRestoreService({ ids: selectedIds });

      if (response.status === 200 || response.status === 204) {
        await toast.success(
          `تعداد "${selectedIds.length}" رسانه با موفقیت بازگردانی شد`,
          { title: "موفق", duration: 5000 },
        );
        setMedia((prev) => prev.filter((m) => !selectedIds.includes(m.id)));
        setSelectedIds([]);
      }
    } catch (error) {
      console.error("Error group restoring media:", error);
      await toast.error(
        error.response?.data?.message || "خطا در بازگردانی گروهی رسانه‌ها",
        { title: "خطا", duration: 5000 },
      );
    }
  };

  // ================== حذف دائمی گروهی ==================
  const handleGroupForceDelete = async () => {
    if (!selectedIds.length) return;

    const confirmed = await openConfirmModal({
      title: "حذف دائمی گروهی رسانه‌ها",
      message: `⚠️ این عمل غیرقابل بازگشت است! آیا از حذف دائمی تعداد "${selectedIds.length}" رسانه مطمئن هستید؟`,
      confirmText: "حذف دائمی شوند",
      cancelText: "انصراف",
      variant: "danger",
      icon: "trash-bin-minimalistic",
    });

    if (!confirmed) return;

    try {
      const response = await mediaGroupForceDeleteService({ ids: selectedIds });

      if (response.status === 200 || response.status === 204) {
        await toast.success(
          `تعداد "${selectedIds.length}" رسانه برای همیشه حذف شد`,
          { title: "موفق", duration: 5000 },
        );
        setMedia((prev) => prev.filter((m) => !selectedIds.includes(m.id)));
        setSelectedIds([]);
      }
    } catch (error) {
      console.error("Error group force deleting media:", error);
      await toast.error(
        error.response?.data?.message || "خطا در حذف دائمی گروهی رسانه‌ها",
        { title: "خطا", duration: 5000 },
      );
    }
  };

  // ================== بعد از ویرایش/حذف در مودال ==================
  const handleMediaUpdated = (updated) => {
    setMedia((prev) =>
      prev.map((m) => (m.id === updated.id ? { ...m, ...updated } : m)),
    );
  };

  const handleMediaDeleted = (id, mode) => {
    // if (mode === "force" || mode === "soft") {
    //   setMedia((prev) => prev.filter((m) => m.id !== id));
    // } else if (mode === "restore") {
    //   setMedia((prev) => prev.filter((m) => m.id !== id));
    // }
    setMedia((prev) => prev.filter((m) => m.id !== id));
  };

  const handleOpenDetails = (id) => {
    // اگه تو تب سطل زباله هستیم، به /media/trashed/:id برو
    if (activeTab === "trashed") navigate(`/media/trashed/${id}`);
    else navigate(`/media/${id}`);
  };

  const isTrashed = activeTab === "trashed";

  return (
    <section className="flex h-full bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 overflow-hidden select-none relative">
      <div className="flex-1 flex flex-col transition-all duration-300">
        {/* ============ تب‌ها ============ */}
        <div className="pt-1 px-6 pb-0">
          <div className="border-b border-gray-300 mb-6 flex justify-between items-end">
            <nav className="-mb-px flex space-x-8">
              <TabButton
                active={activeTab === "library"}
                onClick={() => handleTabChange("library")}
                permission="view-media"
              >
                کتابخانه رسانه
              </TabButton>
              <TabButton
                active={activeTab === "upload"}
                onClick={() => handleTabChange("upload")}
                permission="create-media"
                success
              >
                آپلود فایل جدید
              </TabButton>
              <TabButton
                active={activeTab === "trashed"}
                onClick={() => handleTabChange("trashed")}
                permission="view-delete-media"
                danger
              >
                سطل زباله
              </TabButton>
            </nav>
          </div>

          {/* جستجو + نوار انتخاب */}
          {(activeTab === "library" || activeTab === "trashed") && (
            <div className="mb-6 flex items-center gap-3">
              {/* ============ سرچ - همیشه نمایش داده میشه ============ */}
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
                  className="group flex items-center gap-x-1.5 px-[11px] py-2.5 rounded-lg bg-indigo-50 text-indigo-600 border-[1.4px] border-indigo-200 text-sm font-medium hover:bg-indigo-100 transition cursor-pointer"
                >
                  <svg className="w-18px h-18px group-hover:scale-125 fill-transparent transition-all">
                    <use xlinkHref="#icon-magnifer"></use>
                  </svg>
                  {/* <span>جستجو</span> */}
                </button>
              </form>

              {/* ============ باکس انتخاب - همیشه فضاش هست ============ */}
              <div
                className={`flex items-center justify-between gap-x-2 min-w-[420px] px-1.5 ${selectedIds.length > 0 ? 'py-[5px]' : 'py-3'}  rounded-lg border-[1.4px] flex-shrink-0  ${
                  selectedIds.length > 0
                    ? isTrashed
                      ? "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800"
                      : "bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800"
                    : "bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700 opacity-60"
                }`}
              >
                {selectedIds.length > 0 ? (
                  <>
                    {/* سمت راست: تعداد انتخاب */}
                    <div className="flex items-center gap-x-2">
                      <div
                        className={`flex items-center justify-center w-7 h-7 rounded-lg ${
                          isTrashed
                            ? "bg-amber-200 text-amber-700"
                            : "bg-indigo-200 text-indigo-700"
                        }`}
                      >
                        <svg className="w-[16px] h-[16px] fill-transparent">
                          <use xlinkHref="#icon-checked"></use>
                        </svg>
                      </div>
                      <p
                        className={`text-sm font-bold whitespace-nowrap ${
                          isTrashed ? "text-amber-800" : "text-indigo-800"
                        }`}
                      >
                        {selectedIds.length} انتخاب شده
                      </p>
                    </div>

                    {/* سمت چپ: دکمه‌های عملیات */}
                    <div className="flex items-center gap-1.5">
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

                      {isTrashed ? (
                        <>
                          <CheckPermission permission="restore-media">
                            <button
                              type="button"
                              onClick={handleGroupRestore}
                              className="flex items-center gap-x-1 px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-600 border-[1.4px] border-blue-200 text-xs font-medium hover:bg-blue-100 transition cursor-pointer whitespace-nowrap"
                            >
                              <svg className="w-[14px] h-[14px] fill-transparent">
                                <use xlinkHref="#icon-check-circle"></use>
                              </svg>
                              بازگردانی
                            </button>
                          </CheckPermission>
                          <CheckPermission permission="force-delete-media">
                            <button
                              type="button"
                              onClick={handleGroupForceDelete}
                              className="flex items-center gap-x-1 px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 border-[1.4px] border-red-200 text-xs font-medium hover:bg-red-100 transition cursor-pointer whitespace-nowrap"
                            >
                              <svg className="w-[14px] h-[14px] fill-transparent">
                                <use xlinkHref="#icon-trash-bin-minimalistic"></use>
                              </svg>
                              حذف دائمی
                            </button>
                          </CheckPermission>
                        </>
                      ) : (
                        <CheckPermission permission="delete-media">
                          <button
                            type="button"
                            onClick={handleGroupSoftDelete}
                            className="flex items-center gap-x-1 px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 border-[1.4px] border-red-200 text-xs font-medium hover:bg-red-100 transition cursor-pointer whitespace-nowrap"
                          >
                            <svg className="w-[14px] h-[14px] fill-transparent">
                              <use xlinkHref="#icon-trash-bin-minimalistic"></use>
                            </svg>
                            حذف انتخاب‌شده‌ها
                          </button>
                        </CheckPermission>
                      )}
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-gray-400 dark:text-gray-500 text-center w-full select-none">
                    چیزی انتخاب نشده
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ============ محتوا ============ */}
        <div className="p-6 pt-2.5 flex-1 overflow-y-auto relative">
          {(activeTab === "library" || activeTab === "trashed") && (
            <>
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

              <MediaGrid
                items={media}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
                onOpenDetails={handleOpenDetails} // 👈 تغییر کرد
              />

              {error && (
                <p className="mt-4 text-red-500 text-center">{error}</p>
              )}

              {hasMore && (
                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={() => void loadMedia(page + 1)}
                    disabled={loading}
                    className="px-6 py-3 rounded-lg border border-indigo-600 text-indigo-600 font-medium hover:bg-indigo-50 disabled:opacity-50 disabled:pointer-events-none transition cursor-pointer"
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
            </>
          )}

          {activeTab === "upload" && (
            <Formik
              initialValues={{ rows: [createEmptyRow()] }}
              onSubmit={() => {}}
            >
              <MediaUpload onUploaded={handleUploaded} />
            </Formik>
          )}
        </div>
      </div>

      {/* ============ مودال جزئیات ============ */}
      <Outlet
        context={{
          onMediaUpdated: handleMediaUpdated,
          onMediaDeleted: handleMediaDeleted,
        }}
      />
    </section>
  );
};

const TabButton = ({
  active,
  onClick,
  children,
  permission,
  danger,
  success,
}) => (
  <CheckPermission permission={permission}>
    <button
      type="button"
      onClick={onClick}
      className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 cursor-pointer ${
        active
          ? danger
            ? "border-red-600 text-red-600"
            : success
              ? "border-green-600 text-green-600"
              : "border-indigo-600 text-indigo-600"
          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
      }`}
    >
      {children}
    </button>
  </CheckPermission>
);

export default MediaLibrary;
