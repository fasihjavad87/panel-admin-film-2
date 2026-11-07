// src/pages/movies/episodes/episodeCreate/core.js

import { episodeAddNewService, episodeEditService } from "@/services/movies";
import * as Yup from "yup";
import { toast } from "@/components/Toast/ToastContainer";

export const validationSchema = (isEditMode) => {
  return Yup.object({
    episode_number: Yup.number()
      .min(1, "شماره باید حداقل ۱ باشد")
      .max(65535)
      .required("شماره الزامی است"),
    status: Yup.string().required("وضعیت الزامی است"),
  });
};

export const handleSubmit = async (
  values,
  setSubmitting,
  navigate,
  isEditMode,
  movieId,
  episodeId,
  refresh
) => {
  try {
    const payload = {
      title: values.title || null,
      episode_number: Number(values.episode_number),
      status: values.status,
      publish_at: values.publish_at || null,
      runtime: values.runtime ? Number(values.runtime) : null,
      is_free: values.is_free,
    };

    if (isEditMode) {
      await episodeEditService(movieId, episodeId, payload);
      toast.success("قسمت با موفقیت ویرایش شد");
    } else {
      await episodeAddNewService(movieId, payload);
      toast.success("قسمت با موفقیت اضافه شد");
    }
    refresh('episodes');
    navigate(-1);
  } catch (error) {
    // toast در httpService
  } finally {
    setSubmitting(false);
  }
};