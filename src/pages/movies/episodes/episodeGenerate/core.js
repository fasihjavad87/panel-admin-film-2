// src/pages/movies/episodes/episodeGenerate/core.js

import { episodesGenerateService } from "@/services/movies";
import { toast } from "@/components/Toast/ToastContainer";
import * as Yup from "yup";

export const validationSchema = Yup.object({
  total_episodes: Yup.number()
    .min(1, "حداقل ۱ قسمت")
    .max(1000, "حداکثر ۱۰۰۰ قسمت")
    .required("تعداد قسمت الزامی است"),
  schedule_pattern: Yup.string().required("الگوی پخش الزامی است"),
  first_air_date: Yup.string().when("schedule_pattern", {
    is: (val) => val !== "custom",
    then: (schema) => schema.required("تاریخ شروع الزامی است"),
  }),

  // ⬇️⬇️⬇️ فقط برای weekly: air_days_single الزامی ⬇️⬇️⬇️
  air_days_single: Yup.mixed().when("schedule_pattern", {
    is: "weekly",
    then: (schema) =>
      schema
        .test(
          "air-days-single-required",
          "روز پخش الزامی است",
          (value) =>
            value !== null &&
            value !== undefined &&
            value !== "" &&
            !isNaN(Number(value))
        )
        .required("روز پخش الزامی است"),
    otherwise: (schema) => schema.notRequired(),
  }),

  // ⬇️⬇️⬇️ فقط برای multi_weekly: air_days_multi الزامی ⬇️⬇️⬇️
  air_days_multi: Yup.array()
    .of(Yup.number())
    .when("schedule_pattern", {
      is: "multi_weekly",
      then: (schema) =>
        schema
          .min(1, "حداقل یک روز پخش انتخاب کنید")
          .required("روزهای پخش الزامی است"),
      otherwise: (schema) => schema.notRequired(),
    }),
});

export const handleSubmit = async (
  values,
  setSubmitting,
  navigate,
  movieId,
  refresh
) => {
  try {
    // ⬇️⬇️⬇️ values.air_days از onSubmit اومده (چون onSubmit تبدیل کرده) ⬇️⬇️⬇️
    let airDays = Array.isArray(values.air_days)
      ? values.air_days.map((d) => Number(d)).filter((d) => !isNaN(d))
      : [];

    if (["weekly", "multi_weekly"].includes(values.schedule_pattern)) {
      if (airDays.length === 0) {
        toast.error("حداقل یک روز پخش انتخاب کنید");
        setSubmitting(false);
        return;
      }
    }

    const payload = {
      total_episodes: Number(values.total_episodes),
      schedule_pattern: values.schedule_pattern,
      first_air_date: values.first_air_date,
      air_time: values.air_time ? `${values.air_time}:00` : "20:00:00",
      runtime: values.runtime ? Number(values.runtime) : null,
    };

    if (["weekly", "multi_weekly"].includes(values.schedule_pattern)) {
      payload.air_days = airDays;
    }

    const res = await episodesGenerateService(movieId, payload);
    toast.success(res.data.message || "قسمت‌ها ساخته شدند");
    refresh('episodes');
    navigate(-1);
  } catch (error) {
    // toast خودکار
  } finally {
    setSubmitting(false);
  }
};