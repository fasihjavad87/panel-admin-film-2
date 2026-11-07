import React, { useEffect, useRef, useState } from "react";
import ModalsContainer2 from "@/components/ModalsContainer2";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  mediaGetSingleService,
  mediaEditService,
  mediaSoftDeleteService,
  mediaRestoreService,
  mediaForceDeleteService,
} from "@/services/media";
import { openConfirmModal } from "@/components/Modal/modal";
import { toast } from "@/components/Toast/ToastContainer";
import jMoment from "moment-jalaali";
import Input2 from "@/components/Form/ui/UnifiedInput";
import Textarea from "@/components/Form/ui/UnifiedTextarea";
import CheckPermission from "@/components/checkPermission";

const isImage = (mimeType) => mimeType?.startsWith("image/");

// ==================== اسکیمای اعتبارسنجی ====================
const validationSchema = Yup.object({
  title: Yup.string().max(255, "عنوان حداکثر 255 کاراکتر است"),
  description: Yup.string(),
});

const MediaDetailsModal = () => {
  const navigate = useNavigate();
  const modalRef = useRef(null);
  const { id } = useParams();

  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState({
    title: "",
    description: "",
  });

  const { onMediaUpdated, onMediaDeleted } = useOutletContext();

  useEffect(() => {
    modalRef.current?.open();
    handleGetMedia();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleGetMedia = async () => {
    setLoading(true);
    try {
      const res = await mediaGetSingleService(id);
      if (res?.data?.data) {
        const m = res.data.data;
        setMedia(m);
        setInitialValues({
          title: m.title || "",
          description: m.description || "",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // ==================== ویرایش ====================
  const handleSubmit = async (values, { setSubmitting }) => {
    // 👈 اول تأیید بگیر
    const confirmed = await openConfirmModal({
      title: "ذخیره تغییرات",
      message: "آیا از اعمال تغییرات روی این رسانه مطمئن هستید؟",
      confirmText: "ذخیره شود",
      cancelText: "انصراف",
      variant: "success",
      icon: "check-circle",
    });

    // 👈 اگه کاربر انصراف داد، هیچی ذخیره نکن
    if (!confirmed) {
      setSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", values.title || "");
      formData.append("description", values.description || "");

      const res = await mediaEditService(id, formData);
      if (res.status === 200) {
        await toast.success("رسانه با موفقیت ویرایش شد.", {
          title: "موفق",
          duration: 5000,
        });
        setMedia(res.data.data);
        setInitialValues({
          title: res.data.data.title || "",
          description: res.data.data.description || "",
        });
        onMediaUpdated?.(res.data.data);
      }
    } catch (error) {
      console.error("Error updating media:", error);
      await toast.error(
        error.response?.data?.message || "خطا در ویرایش رسانه",
        {
          title: "خطا",
          duration: 5000,
        },
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ==================== حذف نرم ====================
  const handleSoftDelete = async () => {
    const confirmed = await openConfirmModal({
      title: "حذف رسانه",
      message: `آیا از حذف رسانه "${media?.title || media?.name}" مطمئن هستید؟`,
      confirmText: "حذف شود",
      cancelText: "انصراف",
      variant: "danger",
      icon: "trash-bin-minimalistic",
    });

    if (!confirmed) return;

    try {
      const response = await mediaSoftDeleteService(id);

      if (response.status === 200 || response.status === 204) {
        await toast.success(
          `رسانه "${media?.title || media?.name}" با موفقیت حذف موقت شد`,
          { title: "موفق", duration: 5000 },
        );

        onMediaDeleted?.(id, "soft");
        navigate(-1);
      }
    } catch (error) {
      console.error("Error soft deleting media:", error);
      await toast.error(
        error.response?.data?.message || "خطا در حذف موقت رسانه",
        { title: "خطا", duration: 5000 },
      );
    }
  };

  // ==================== بازگردانی ====================
  const handleRestore = async () => {
    const confirmed = await openConfirmModal({
      title: "بازگردانی رسانه",
      message: `آیا از بازگردانی رسانه "${media?.title || media?.name}" مطمئن هستید؟`,
      confirmText: "بازگردانی شود",
      cancelText: "انصراف",
      variant: "success",
      icon: "check-circle",
    });

    if (!confirmed) return;

    try {
      const response = await mediaRestoreService(id);

      if (response.status === 200 || response.status === 204) {
        await toast.success(
          `رسانه "${media?.title || media?.name}" با موفقیت بازگردانی شد`,
          { title: "موفق", duration: 5000 },
        );

        onMediaDeleted?.(id, "restore");
        navigate(-1);
      }
    } catch (error) {
      console.error("Error restoring media:", error);
      await toast.error(
        error.response?.data?.message || "خطا در بازگردانی رسانه",
        { title: "خطا", duration: 5000 },
      );
    }
  };

  // ==================== حذف دائمی ====================
  const handleForceDelete = async () => {
    const confirmed = await openConfirmModal({
      title: "حذف دائمی رسانه",
      message: `⚠️ این عمل غیرقابل بازگشت است! آیا از حذف دائمی رسانه "${media?.title || media?.name}" مطمئن هستید؟`,
      confirmText: "حذف دائمی شود",
      cancelText: "انصراف",
      variant: "danger",
      icon: "trash-bin-minimalistic",
    });

    if (!confirmed) return;

    try {
      const response = await mediaForceDeleteService(id);

      if (response.status === 200 || response.status === 204) {
        await toast.success(
          `رسانه "${media?.title || media?.name}" برای همیشه حذف شد`,
          { title: "موفق", duration: 5000 },
        );

        onMediaDeleted?.(id, "force");
        navigate(-1);
      }
    } catch (error) {
      console.error("Error force deleting media:", error);
      await toast.error(
        error.response?.data?.message || "خطا در حذف دائمی رسانه",
        { title: "خطا", duration: 5000 },
      );
    }
  };

  const isTrashed = !!media?.deleted_at;

  return (
    <ModalsContainer2
      ref={modalRef}
      id="show_media_modal"
      title={
        loading ? (
          <div className="h-5 w-40 bg-gray-200 animate-pulse rounded"></div>
        ) : (
          `جزئیات ${media?.title || media?.name || "رسانه"}`
        )
      }
      isFooter={false}
      // closeOnOutsideClick={false}
      width="max-w-3xl"
      onClose={() => navigate(-1)}
    >
      <div>
        {loading ? (
          <div className="flex flex-col items-center py-10 select-none">
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
        ) : media ? (
          <div className="flex flex-col gap-3 select-none">
            {/* ============ پیش‌نمایش ============ */}
            <div className="w-full bg-gray-50 dark:bg-gray-900 rounded-lg border-[1.4px] border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden min-h-[200px]">
              {isImage(media.mime_type) ? (
                // <div>
                <img
                  // src={media.url}
                  src={media.detail_url}
                  alt={media.title || media.name}
                  className="object-contain max-h-80"
                />
                // </div>
              ) : (
                <div className="py-14 text-gray-400 flex flex-col items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-20 h-20"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.25 10.125H8.25m5.25 0H12c7.87-4.223 9.471-12.015 1.5-17.25-2.028-.853-4.04-1.28-6.108-1.28H6.75A2.25 2.25 0 0 0 4.5 4.5v15c0 1.242.492 2.443 1.35 3.3.858.857 2.059 1.35 3.3 1.35h6.75c1.242 0 2.443-.492 3.3-1.35.857-.858 1.35-2.059 1.35-3.3v-1.5"
                    />
                  </svg>
                  <span className="text-xs mt-2">
                    {media.extension?.toUpperCase() || "FILE"}
                  </span>
                </div>
              )}
            </div>

            {/* ============ اطلاعات ============ */}
            <div className="grid grid-cols-2 gap-3">
              <InfoCard
                label="نام فایل"
                value={media.name}
                color="blue"
                icon="icon-user-rounded-bold-duotone"
                isCopy
              />
              <InfoCard
                label="نوع فایل"
                value={media.mime_type || "-"}
                color="amber"
                icon="icon-letter-bold-duotone"
              />
              <InfoCard
                label="پسوند"
                value={media.extension || "-"}
                color="orange"
                icon="icon-letter-bold-duotone"
              />
              <InfoCard
                label="حجم"
                value={`${(media.size / 1024).toFixed(2)} KB`}
                color="teal"
                icon="icon-calendar-bold-duotone"
              />
              <InfoCard
                label="تاریخ آپلود"
                value={
                  media.created_at
                    ? jMoment(media.created_at).format("jYYYY/jM/jD HH:mm")
                    : "-"
                }
                color="purple"
                icon="icon-calendar-bold-duotone"
              />
              <InfoCard
                label="وضعیت"
                value={isTrashed ? "حذف شده" : "فعال"}
                color={isTrashed ? "red" : "green"}
                icon="icon-shield-user-bold-duotone"
              />
            </div>

            {/* ============ URL ============ */}
            <div className="bg-gray-50 dark:bg-gray-900 border-[1.4px] border-gray-200 dark:border-gray-700 p-3 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-x-1 mb-2">
                <svg className="w-[18px] h-[18px] fill-transparent">
                  <use xlinkHref="#icon-link-bold-duotone"></use>
                </svg>
                <span className="font-semibold">آدرس URL</span>
              </div>
              <div className="flex justify-between items-center text-xs break-all bg-white dark:bg-gray-800 dark:text-gray-400 border border-gray-200 p-2 rounded-md">
                <div
                  onClick={() => {
                    navigator.clipboard.writeText(media.url);
                    toast.success("URL کپی شد.");
                  }}
                  data-tooltip-text="کپی"
                  data-tooltip-position="top"
                  className="p-1 rounded-sm bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer"
                >
                  <svg className="w-[19px] h-[19px] fill-transparent">
                    <use xlinkHref="#icon-copy"></use>
                  </svg>
                </div>
                <span>{media.url}</span>
              </div>
            </div>

            {/* ============ فرم ویرایش با Formik ============ */}
            <Formik
              enableReinitialize={true}
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, dirty }) => (
                <Form className="bg-gray-50 dark:bg-gray-900 border-[1.4px] border-gray-200 dark:border-gray-700 p-3 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-x-1 mb-3">
                    <svg className="w-[18px] h-[18px] fill-transparent">
                      <use xlinkHref="#icon-gallery-edit-line-duotone"></use>
                    </svg>
                    <span className="font-semibold">ویرایش متادیتا</span>
                  </div>

                  <div className="space-y-1">
                    {/* عنوان */}
                    <Input2
                      name="title"
                      label="عنوان (Title)"
                      placeholder="عنوان رسانه..."
                      clearable={false}
                      showCount
                      maxLength={255}
                      rtl
                    />
                    {/* <Input2
                      name="title"
                      label="نام فارسی"
                      placeholder="نام فارسی را وارد کنید"
                      required
                      icon="icon-shield-user"
                      iconPosition="right"
                      clearable
                      rtl
                    /> */}

                    {/* توضیحات - چون Input2 معمولاً برای input هست، از textarea دستی استفاده می‌کنیم */}
                    <div>
                      {/* <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        توضیحات (Description)
                      </label>
                      <textarea
                        name="description"
                        rows="3"
                        placeholder="توضیحات رسانه..."
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                      /> */}
                      <Textarea
                        name="description"
                        label=" توضیحات (Description)"
                        placeholder="توضیحات رسانه..."
                        rows={3}
                        showCount
                        maxLength={500}
                        clearable={false}
                        // icon="icon-file-text"
                        iconPosition="right"
                        rtl
                      />
                    </div>
                  </div>

                  {/* ============ دکمه‌های اقدام ============ */}
                  <CheckPermission permission={['update-media','restore-media','force-delete-media','delete-media']}>
                    <div className="flex flex-wrap gap-2 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                      <CheckPermission permission="update-media">
                        <button
                          type="submit"
                          disabled={isSubmitting || !dirty}
                          className={`flex-1 py-2.5 px-4 rounded-lg bg-green-50 text-green-600 font-medium ${dirty ? "hover:bg-green-100 " : ""} border-[1.4px] border-green-200 disabled:opacity-50 transition cursor-pointer`}
                        >
                          {isSubmitting ? "در حال ذخیره..." : "ذخیره تغییرات"}
                        </button>
                      </CheckPermission>

                      {isTrashed ? (
                        <>
                          <CheckPermission permission="restore-media">
                            <button
                              type="button"
                              onClick={handleRestore}
                              className="py-2.5 px-4 rounded-lg bg-blue-50 text-blue-600 font-medium hover:bg-blue-100 border-[1.4px] border-blue-200 transition cursor-pointer"
                            >
                              بازگردانی
                            </button>
                          </CheckPermission>
                          <CheckPermission permission="force-delete-media">
                            <button
                              type="button"
                              onClick={handleForceDelete}
                              className="py-2.5 px-4 rounded-lg bg-red-50 text-red-600 font-medium hover:bg-red-100 border-[1.4px] border-red-200 transition cursor-pointer"
                            >
                              حذف دائمی
                            </button>
                          </CheckPermission>
                        </>
                      ) : (
                        <CheckPermission permission="delete-media">
                          <button
                            type="button"
                            onClick={handleSoftDelete}
                            className="py-2.5 px-4 rounded-lg bg-red-50 text-red-600 font-medium hover:bg-red-100 border-[1.4px] border-red-200 transition cursor-pointer"
                          >
                            حذف
                          </button>
                        </CheckPermission>
                      )}
                    </div>
                  </CheckPermission>
                </Form>
              )}
            </Formik>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            رسانه‌ای یافت نشد
          </div>
        )}
      </div>
    </ModalsContainer2>
  );
};

// ============================================================
// کارت اطلاعات (مثل UserShow)
// ============================================================
const InfoCard = ({ label, value, color = "blue", icon, isCopy }) => {
  const colorMap = {
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      copy: "bg-blue-200",
      copyHover: "hover:bg-blue-300",
      text: "text-blue-600",
      bold: "text-blue-800",
    },
    amber: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      copy: "bg-amber-200",
      copyHover: "hover:bg-amber-300",
      text: "text-amber-600",
      bold: "text-amber-800",
    },
    orange: {
      bg: "bg-orange-50",
      border: "border-orange-200",
      copy: "bg-orange-200",
      copyHover: "hover:bg-orange-300",
      text: "text-orange-600",
      bold: "text-orange-800",
    },
    teal: {
      bg: "bg-teal-50",
      border: "border-teal-200",
      copy: "bg-teal-200",
      copyHover: "hover:bg-teal-300",
      text: "text-teal-600",
      bold: "text-teal-800",
    },
    purple: {
      bg: "bg-purple-50",
      border: "border-purple-200",
      copy: "bg-purple-200",
      copyHover: "hover:bg-purple-300",
      text: "text-purple-600",
      bold: "text-purple-800",
    },
    green: {
      bg: "bg-green-50",
      border: "border-green-200",
      copy: "bg-green-200",
      copyHover: "hover:bg-green-300",
      text: "text-green-600",
      bold: "text-green-800",
    },
    red: {
      bg: "bg-red-50",
      border: "border-red-200",
      copy: "bg-red-200",
      copyHover: "hover:bg-red-300",
      text: "text-red-600",
      bold: "text-red-800",
    },
  };

  const c = colorMap[color] || colorMap.blue;

  return (
    <div
      className={`relative ${c.bg} border-[1.4px] ${c.border} p-3 rounded-lg`}
    >
      <div>
        <div className={`text-sm ${c.text} flex items-center gap-x-0.5`}>
          <svg className="w-[19px] h-[19px] fill-transparent">
            <use xlinkHref={`#${icon}`}></use>
          </svg>
          <span className="font-semibold">{label}</span>
        </div>
        {isCopy && (
          <div
            onClick={() => {
              navigator.clipboard.writeText(value);
              toast.success("کپی شد");
            }}
            data-tooltip-text="کپی"
            // data-tooltip-position="top"
            className={`absolute top-1 left-1 p-1 rounded-sm ${c.copy || "bg-gray-200"} ${c.copyHover || "hover:bg-gray-300"} ${c.text || "text-black"} transition-colors cursor-pointer`}
          >
            <svg className="w-[19px] h-[19px] fill-transparent">
              <use xlinkHref="#icon-copy"></use>
            </svg>
          </div>
        )}
      </div>
      <div className={`text-base pt-1 font-bold ${c.bold} truncate`}>
        {value}
      </div>
    </div>
  );
};

export default MediaDetailsModal;
