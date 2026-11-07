import {
  userAddNewService,
  userEditService,
} from "@/services/users";
import * as Yup from "yup";
import { toast } from "@/components/Toast/ToastContainer";

export const validationSchema = (isEditMode) => {
  return Yup.object({
    name: Yup.string()
      .required("نام الزامی است")
      .max(50, "نام حداکثر 50 کاراکتر است"),
    email: Yup.string().email("ایمیل معتبر نیست").required("ایمیل الزامی است"),
    username: Yup.string()
      .required("نام کاربری الزامی است")
      .min(3, "نام کاربری حداقل 3 کاراکتر باید باشد")
      .max(50, "نام کاربری حداکثر 50 کاراکتر است"),
    password: Yup.string().when([], {
      is: () => !isEditMode,
      then: (schema) =>
        schema
          .required("رمز عبور الزامی است")
          .min(6, "رمز عبور حداقل 6 کاراکتر است"),
      otherwise: (schema) => schema.min(6, "رمز عبور حداقل 6 کاراکتر است"),
    }),
    status: Yup.string().required("وضعیت الزامی است"),
  });
};

// ارسال فرم
export const handleSubmit = async (
  values,
  setSubmitting,
  navigate,
  isEditMode,
  id,
) => {
  // console.log(values);

  const formData = new FormData();

  // فیلدهای معمولی
  formData.append("name", values.name);
  formData.append("email", values.email);
  formData.append("username", values.username);
  formData.append("status", values.status);
  formData.append("is_admin", values.is_admin ? "1" : "0");

  // رمز عبور فقط اگه پر شده باشه
  if (values.password) {
    formData.append("password", values.password);
  }

  // ⭐️ فایل آواتار - مهم‌ترین بخش
  if (values.avatar && values.avatar.length > 0) {
    const file = values.avatar[0];
    if (file instanceof File) {
      formData.append("avatar", file);
    }
    // اگر قبلاً آپلود شده و فقط URL داره، نیازی به ارسال مجدد نیست
  }
  // console.log(values);
  // console.log(values.avatar);
  // console.log(values.avatar[0]);
  // console.log(values.avatar[0] instanceof File);

  // اگر در حالت ویرایش هستی و می‌خوای متد PUT رو شبیه‌سازی کنی
  // Laravel با _method کار می‌کنه
  // if (isEditMode) {
  //     formData.append('_method', 'PUT');
  // }

  try {
    const res = isEditMode
      ? await userEditService(id, formData)
      : await userAddNewService(formData);

    toast.success(
      isEditMode ? "کاربر با موفقیت ویرایش شد" : "کاربر با موفقیت ایجاد شد",
    );
    navigate("/users");
  } catch (error) {
    // console.error('Error saving user:', error);
    // toast.error('خطا در ذخیره اطلاعات');
  } finally {
    setSubmitting(false);
  }
};
