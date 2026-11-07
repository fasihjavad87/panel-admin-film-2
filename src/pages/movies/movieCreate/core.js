import { movieAddNewService, movieEditService } from "@/services/movies";
import * as Yup from "yup";
import { toast } from "@/components/Toast/ToastContainer";

export const validationSchema = (isEditMode) => {
  return Yup.object({
    title: Yup.string().required("عنوان الزامی است"),
    e_name: Yup.string().required("عنوان انگلیسی الزامی است"),
    slug: Yup.string()
      .required("Slug الزامی است")
      .matches(/^[a-z0-9-]+$/, "فقط حروف کوچک، عدد و خط تیره"),
    content_type: Yup.string().required("نوع محتوا الزامی است"),
    status: Yup.string().required("وضعیت الزامی است"),
    runtime: Yup.number()
      .min(1, "مدت زمان باید حداقل ۱ دقیقه باشد")
      .when("content_type", {
        is: "movie",
        then: (schema) => schema.required("مدت فیلم الزامی است"),
      }),
    publish_at: Yup.string().when("content_type", {
      is: "movie",
      then: (schema) => schema.required("تاریخ پخش فیلم الزامی است"),
    }),
    total_episodes: Yup.number()
      .min(1, "تعداد قسمت‌ها باید حداقل ۱ باشد")
      .max(1000)
      .nullable(),
    details: Yup.object({
      release_year: Yup.string().nullable(),
      rating: Yup.number().min(1).max(10).nullable(),
    }),
  });
};

export const handleSubmit = async (
  values,
  setSubmitting,
  navigate,
  isEditMode,
  id
) => {
  try {
    const payload = {
      title: values.title,
      e_name: values.e_name,
      slug: values.slug,
      description: values.description,
      content_type: values.content_type,
      status: values.status,
      runtime: values.runtime ? Number(values.runtime) : null,
      is_free: values.is_free,
      // ⬇️⬇️⬇️ total_episodes (فقط سریال) ⬇️⬇️⬇️
      total_episodes:
        values.content_type === "series" && values.total_episodes
          ? Number(values.total_episodes)
          : 0,
      details: {
        release_year: values.details.release_year
          ? Number(values.details.release_year)
          : null,
        age_rating: values.details.age_rating,
        rating: values.details.rating ? Number(values.details.rating) : null,
      },
    };

    if (values.content_type === "movie" && values.publish_at) {
      payload.publish_at = values.publish_at;
    }

    const res = isEditMode
      ? await movieEditService(id, payload)
      : await movieAddNewService(payload);

    toast.success(
      isEditMode ? "با موفقیت ویرایش شد" : "با موفقیت ایجاد شد"
    );
    navigate("/movies");
  } catch (error) {
    // toast در httpService نمایش داده می‌شود
  } finally {
    setSubmitting(false);
  }
};