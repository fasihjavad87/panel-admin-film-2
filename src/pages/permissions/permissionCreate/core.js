import * as Yup from "yup";
import { toast } from "@/components/Toast/ToastContainer";
import {
  permissionAddNewService,
  permissionEditService,
} from "@/services/permissions";

export const validationSchema = (isEditMode) => {
  return Yup.object({
    name: Yup.string()
      .required("نام انگلیسی الزامی است")
      .max(50, "نام انگلیسی حداکثر 50 کاراکتر است")
      .matches(
        /^[a-zA-Z0-9_\-]+$/,
        "نام انگلیسی فقط می‌تواند شامل حروف انگلیسی، اعداد و زیرخط باشد",
      ),
    title: Yup.string()
      .required("نام فارسی الزامی است")
      .max(50, "نام فارسی حداکثر 50 کاراکتر است"),
    group: Yup.string()
      .max(50, "نام گروه حداکثر 50 کاراکتر است")
      .matches(
        /^[a-zA-Z0-9_\-]+$/,
        "نام گروه فقط می‌تواند شامل حروف انگلیسی، اعداد و زیرخط باشد",
      ),
    description: Yup.string().max(500, "توضیحات حداکثر 500 کاراکتر است"),
    is_active: Yup.boolean(),
  });
};

export const handleSubmit = async (
  values,
  setSubmitting,
  navigate,
  isEditMode,
  id,
  refresh
) => {
  const payload = {
    name: values.name,
    title: values.title,
    group: values.group,
    description: values.description || "",
    is_active: values.is_active ? 1 : 0,
  };

  try {
    let res;
    if (isEditMode) {
      res = await permissionEditService(id, payload);
    } else {
      res = await permissionAddNewService(payload);
    }

    if (res.status === 200 || res.status === 201) {
      toast.success(
        isEditMode ? "مجوز با موفقیت ویرایش شد" : "مجوز با موفقیت ایجاد شد",
      );
      refresh("permissions");
      navigate("/users/permissions");
    }
  } catch (error) {
    console.error("Error saving permission:", error);
    toast.error(error?.response?.data?.message || "خطا در ذخیره اطلاعات");
  } finally {
    setSubmitting(false);
  }
};
