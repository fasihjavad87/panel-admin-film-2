import * as Yup from "yup";
import { toast } from "@/components/Toast/ToastContainer";
import {
  countryAddNewService,
  countryEditService,
} from "@/services/countries";

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
    code: Yup.string()
      .max(15, "کد حداکثر 15 کاراکتر است"),
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
    code: values.code,
  };

  try {
    let res;
    if (isEditMode) {
      res = await countryEditService(id, payload);
    } else {
      res = await countryAddNewService(payload);
    }

    if (res.status === 200 || res.status === 201) {
      toast.success(
        isEditMode
          ? "کشور با موفقیت ویرایش شد"
          : "کشور با موفقیت ایجاد شد",
      );
      refresh("countries");
      navigate("/countries");
    }
  } catch (error) {
    console.error("Error saving country:", error);
    toast.error(error?.response?.data?.message || "خطا در ذخیره اطلاعات");
  } finally {
    setSubmitting(false);
  }
};
