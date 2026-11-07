import * as Yup from "yup";
import { toast } from "@/components/Toast/ToastContainer";
import {
  categoryAddNewService,
  categoryEditService,
} from "@/services/categories";

export const validationSchema = (isEditMode) => {
  return Yup.object({
    name: Yup.string()
      .required("نام فارسی الزامی است")
      .max(50, "نام فارسی حداکثر 50 کاراکتر است"),
    //   .matches(
    //     /^[a-zA-Z0-9_\-]+$/,
    //     "نام انگلیسی فقط می‌تواند شامل حروف انگلیسی، اعداد و زیرخط باشد",
    //   ),
    e_name: Yup.string()
      .required("نام انگلیسی الزامی است")
      .max(50, "نام انگلیسی حداکثر 50 کاراکتر است"),
  });
};

export const handleSubmit = async (
  values,
  setSubmitting,
  navigate,
  isEditMode,
  id,
  refresh,
) => {
  const payload = {
    name: values.name,
    e_name: values.e_name,
  };

  try {
    let res;
    if (isEditMode) {
      res = await categoryEditService(id, payload);
    } else {
      res = await categoryAddNewService(payload);
    }

    if (res.status === 200 || res.status === 201) {
      toast.success(
        isEditMode
          ? "دسته بندی با موفقیت ویرایش شد"
          : "دسته بندی با موفقیت ایجاد شد",
      );
      refresh("categories");
      navigate("/categories");
    }
  } catch (error) {
    console.error("Error saving category:", error);
    toast.error(error?.response?.data?.message || "خطا در ذخیره اطلاعات");
  } finally {
    setSubmitting(false);
  }
};
