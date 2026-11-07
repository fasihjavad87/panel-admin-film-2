// // src/pages/movies/episodes/episodeShift/Modal.jsx

// import React, { useEffect, useRef, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { Formik, Form } from "formik";
// import ModalsContainer2 from "@/components/ModalsContainer2";
// import Input2 from "@/components/Form/ui/UnifiedInput";
// import { handleSubmit, validationSchema } from "./core";

// const Modal = () => {
//   const navigate = useNavigate();
//   const modalRef = useRef(null);
//   const { id } = useParams();
//   const [submitting, setSubmitting] = useState(false);

//   useEffect(() => {
//     modalRef.current?.open();
//   }, []);

//   const onSubmit = async (values) => {
//     await handleSubmit(values, setSubmitting, navigate, id);
//   };

//   return (
//     <ModalsContainer2
//       ref={modalRef}
//       id="episode_shift_modal"
//       title="🔄 جابجایی برنامه پخش"
//       isFooter={false}
//       closeOnOutsideClick={false}
//       width="max-w-lg"
//       onClose={() => navigate(-1)}
//     >
//       <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg text-sm text-purple-700">
//         همه قسمت‌های <span className="font-bold">scheduled</span> از شماره مشخص،
//         به تعداد روز وارد شده جابجا می‌شوند
//         <br />
//         <span className="text-xs">
//           (مثبت = عقب بردن، منفی = جلو بردن)
//         </span>
//       </div>

//       <Formik
//         initialValues={{
//           from_episode: 1,
//           days_to_shift: 7,
//         }}
//         validationSchema={validationSchema}
//         onSubmit={onSubmit}
//       >
//         <Form className="space-y-4">
//           <Input2
//             name="from_episode"
//             type="number"
//             label="از قسمت شماره"
//             required
//             rtl
//           />
//           <Input2
//             name="days_to_shift"
//             type="number"
//             label="چند روز جابجا شود؟"
//             placeholder="مثبت = عقب، منفی = جلو"
//             required
//             rtl
//           />
//           <div className="flex justify-end gap-2 pt-4 border-t">
//             <button
//               type="button"
//               onClick={() => navigate(-1)}
//               className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
//             >
//               انصراف
//             </button>
//             <button
//               type="submit"
//               disabled={submitting}
//               className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
//             >
//               {submitting ? "در حال جابجایی..." : "جابجا کن"}
//             </button>
//           </div>
//         </Form>
//       </Formik>
//     </ModalsContainer2>
//   );
// };

// export default Modal;

// src/pages/movies/episodes/episodeShift/Modal.jsx

import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form } from "formik";
import ModalsContainer2 from "@/components/ModalsContainer2";
import Input2 from "@/components/Form/ui/UnifiedInput";
import { handleSubmit, validationSchema } from "./core";
import { movieGetSingleService, episodesGetService } from "@/services/movies";
import { toast } from "@/components/Toast/ToastContainer";
import { useTableRefresh } from "@/hooks/useTableRefresh";

const Modal = () => {
  const navigate = useNavigate();
  const modalRef = useRef(null);
  const { id } = useParams();
  const { refresh } = useTableRefresh();
  const [submitting, setSubmitting] = useState(false);

  // ⬇️⬇️⬇️ state برای min/max ⬇️⬇️⬇️
  const [loading, setLoading] = useState(true);
  const [minEpisode, setMinEpisode] = useState(1);
  const [maxEpisode, setMaxEpisode] = useState(1);

  useEffect(() => {
    modalRef.current?.open();
    loadLimits();
  }, []);

  // ⬇️⬇️⬇️ محاسبه min/max از movie + episodes ⬇️⬇️⬇️
  const loadLimits = async () => {
    setLoading(true);
    try {
      const [movieRes, epsRes] = await Promise.all([
        movieGetSingleService(id),
        episodesGetService(id),
      ]);

      const movie = movieRes.data;
      const episodes = epsRes.data || [];

      // max = total_episodes
      const max = movie.total_episodes || episodes.length || 1;
      setMaxEpisode(max);

      // min = اولین قسمت scheduled
      const scheduledEpisodes = episodes
        .filter((ep) => ep.status === "scheduled")
        .sort((a, b) => a.episode_number - b.episode_number);

      if (scheduledEpisodes.length > 0) {
        setMinEpisode(scheduledEpisodes[0].episode_number);
      } else {
        // اگه هیچ scheduled نیست، از max شروع کن
        setMinEpisode(max);
      }
    } catch (error) {
      toast.error("خطا در دریافت اطلاعات");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values) => {
    await handleSubmit(values, setSubmitting, navigate, id, refresh);
  };

  return (
    <ModalsContainer2
      ref={modalRef}
      id="episode_shift_modal"
      // title="🔄 جابجایی برنامه پخش"
      title={
        <div className="flex items-center gap-x-1">
          <svg className="w-7 h-7 fill-transparent text-purple-500">
            <use xlinkHref="#icon-refresh-square-3-bold-duotone"></use>
          </svg>
          <span>جابجایی برنامه پخش</span>
        </div>
      }
      isFooter={false}
      closeOnOutsideClick={false}
      width="max-w-lg"
      onClose={() => navigate(-1)}
    >
      <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg text-sm text-purple-700">
        همه قسمت‌های <span className="font-bold">scheduled</span> از شماره مشخص،
        به تعداد روز وارد شده جابجا می‌شوند
        <br />
        <span className="text-xs">(مثبت = عقب بردن، منفی = جلو بردن)</span>
        {!loading && (
          <span className="block mt-1 text-xs font-bold">
            محدوده مجاز: از قسمت {minEpisode} تا {maxEpisode}
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="flex gap-2">
            <span className="w-3 h-3 bg-purple-600 rounded-full animate-bounce"></span>
            <span
              className="w-3 h-3 bg-purple-600 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></span>
            <span
              className="w-3 h-3 bg-purple-600 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></span>
          </div>
        </div>
      ) : (
        <Formik
          initialValues={{
            from_episode: minEpisode,
            days_to_shift: 7,
          }}
          validationSchema={validationSchema(minEpisode, maxEpisode)}
          onSubmit={onSubmit}
        >
          <Form className="space-y-4">
            <Input2
              name="from_episode"
              type="number"
              label="از قسمت شماره"
              required
              min={minEpisode}
              max={maxEpisode}
              rtl
            />
            <Input2
              name="days_to_shift"
              type="number"
              label="چند روز جابجا شود؟"
              placeholder="مثبت = عقب، منفی = جلو"
              required
              rtl
            />
            <div className="flex justify-end gap-2 pt-4 border-t">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                انصراف
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                {submitting ? "در حال جابجایی..." : "جابجا کن"}
              </button>
            </div>
          </Form>
        </Formik>
      )}
    </ModalsContainer2>
  );
};

export default Modal;
