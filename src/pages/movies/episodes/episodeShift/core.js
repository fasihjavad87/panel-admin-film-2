// // src/pages/movies/episodes/episodeShift/core.js

// import { episodesShiftService } from "@/services/movies";
// import { toast } from "@/components/Toast/ToastContainer";
// import * as Yup from "yup";

// export const validationSchema = Yup.object({
//   from_episode: Yup.number().min(1).required("شماره شروع الزامی است"),
//   days_to_shift: Yup.number().required("تعداد روز الزامی است"),
// });

// export const handleSubmit = async (values, setSubmitting, navigate, movieId) => {
//   try {
//     const res = await episodesShiftService(movieId, {
//       from_episode: Number(values.from_episode),
//       days_to_shift: Number(values.days_to_shift),
//     });
//     toast.success(res.data.message || "برنامه جابجا شد");
//     navigate(-1);
//   } catch (error) {
//     // toast خودکار
//   } finally {
//     setSubmitting(false);
//   }
// };

// src/pages/movies/episodes/episodeShift/core.js

import { episodesShiftService } from "@/services/movies";
import { toast } from "@/components/Toast/ToastContainer";
import * as Yup from "yup";

export const validationSchema = (minEpisode = 1, maxEpisode = 1000) => {
  return Yup.object({
    from_episode: Yup.number()
      .min(minEpisode, `حداقل از قسمت ${minEpisode} است`)
      .max(maxEpisode, `حداکثر تا قسمت ${maxEpisode} است`)
      .required("شماره شروع الزامی است"),
    days_to_shift: Yup.number().required("تعداد روز الزامی است"),
  });
};

export const handleSubmit = async (values, setSubmitting, navigate, movieId, refresh) => {
  try {
    const res = await episodesShiftService(movieId, {
      from_episode: Number(values.from_episode),
      days_to_shift: Number(values.days_to_shift),
    });
    toast.success(res.data.message || "برنامه جابجا شد");
    refresh('episodes');
    navigate(-1);
  } catch (error) {
    // toast خودکار
  } finally {
    setSubmitting(false);
  }
};