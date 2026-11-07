import * as Yup from "yup";
import { toast } from "@/components/Toast/ToastContainer";
import { roleAddNewService, roleEditService } from "@/services/roles";

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
  refresh,
) => {
  const payload = {
    name: values.name,
    title: values.title,
    description: values.description || "",
    is_active: values.is_active ? 1 : 0,
  };

  try {
    let res;
    if (isEditMode) {
      res = await roleEditService(id, payload);
    } else {
      res = await roleAddNewService(payload);
    }

    if (res.status === 200 || res.status === 201) {
      toast.success(
        isEditMode ? "نقش با موفقیت ویرایش شد" : "نقش با موفقیت ایجاد شد",
      );
      refresh("roles");
      navigate("/users/roles");
    }
  } catch (error) {
    console.error("Error saving role:", error);
    toast.error(error?.response?.data?.message || "خطا در ذخیره اطلاعات");
  } finally {
    setSubmitting(false);
  }
};
