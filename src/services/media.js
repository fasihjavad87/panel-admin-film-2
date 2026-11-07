import httpService from "./httpService";

// لیست رسانه‌ها با صفحه‌بندی و جستجو
export const mediaGetService = (page = 1, perPage = 50, search = "") => {
  return httpService(
    `/media?page=${page}&per_page=${perPage}&search=${encodeURIComponent(search)}`,
    "get",
  );
};

// رسانه‌های حذف‌شده (سطل زباله) با جستجو
export const mediaGetTrashedService = (page = 1, perPage = 50, search = "") => {
  return httpService(
    `/media/trashed?page=${page}&per_page=${perPage}&search=${encodeURIComponent(search)}`,
    "get",
  );
};

// گرفتن یک رسانه
export const mediaGetSingleService = (mediaId) => {
  return httpService(`/media/${mediaId}`, "get");
};

// آپلود یک یا چند رسانه (FormData از سمت کامپوننت میاد)
export const mediaUploadService = (formData) => {
  return httpService("/media/create", "post", formData);
};

// ویرایش متادیتا
export const mediaEditService = (mediaId, formData) => {
  return httpService(`/media/${mediaId}/edit`, "put", formData);
};

// حذف نرم
export const mediaSoftDeleteService = (mediaId) => {
  return httpService(`/media/${mediaId}/delete`, "delete");
};

// بازگردانی
export const mediaRestoreService = (mediaId) => {
  return httpService(`/media/${mediaId}/restore`, "post");
};

// حذف کامل
export const mediaForceDeleteService = (mediaId) => {
  return httpService(`/media/${mediaId}/force-delete`, "delete");
};

// گروهی
export const mediaGroupSoftDeleteService = (data) => {
  return httpService(`/media/group-delete`, "delete", data);
};

export const mediaGroupRestoreService = (data) => {
  return httpService(`/media/group-restore`, "delete", data);
};

export const mediaGroupForceDeleteService = (data) => {
  return httpService(`/media/group-force-delete`, "delete", data);
};