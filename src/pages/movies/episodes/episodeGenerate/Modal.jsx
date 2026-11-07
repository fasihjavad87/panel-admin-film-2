// src/pages/movies/episodes/episodeGenerate/Modal.jsx

import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form } from "formik";
import ModalsContainer2 from "@/components/ModalsContainer2";
import {
  SchedulePatternOptions,
  WeekDayOptions,
} from "@/enums/schedulePatternStatus";
import Input2 from "@/components/Form/ui/UnifiedInput";
import UnifiedSearchableSelect from "@/components/Form/ui/UnifiedSearchableSelect2";
import UnifiedDateTimePicker from "@/components/Form/ui/UnifiedDateTimePicker";
import { handleSubmit, validationSchema } from "./core";
import { movieGetSingleService } from "@/services/movies";
import { toast } from "@/components/Toast/ToastContainer";
import { useTableRefresh } from "@/hooks/useTableRefresh";

const Modal = () => {
  const navigate = useNavigate();
  const modalRef = useRef(null);
  const { id } = useParams();
  const { refresh } = useTableRefresh();

  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState(null);

  // ⬇️⬇️⬇️ دو فیلد جدا برای air_days ⬇️⬇️⬇️
  // air_days_single → عدد (برای weekly)
  // air_days_multi  → آرایه (برای multi_weekly)
  const [initialValues, setInitialValues] = useState({
    total_episodes: 16,
    schedule_pattern: "weekly",
    first_air_date: "",
    air_time: "20:00",
    runtime: "",
    air_days_single: 6,
    air_days_multi: [6],
  });

  useEffect(() => {
    modalRef.current?.open();
    loadMovie();
  }, []);

  const loadMovie = async () => {
    setLoading(true);
    try {
      const res = await movieGetSingleService(id);
      const movieData = res.data;
      setMovie(movieData);

      const pattern = movieData.schedule_pattern || "weekly";
      const rawAirDays = movieData.air_days;

      // نرمال‌سازی برای هر دو فیلد
      let singleValue = 6;
      let multiValue = [6];

      if (Array.isArray(rawAirDays) && rawAirDays.length > 0) {
        singleValue = rawAirDays[0] ?? 6;
        multiValue = rawAirDays;
      } else if (
        rawAirDays !== null &&
        rawAirDays !== undefined &&
        rawAirDays !== ""
      ) {
        singleValue = rawAirDays;
        multiValue = [rawAirDays];
      }

      setInitialValues((prev) => ({
        ...prev,
        total_episodes: movieData.total_episodes || 16,
        runtime: movieData.runtime || "",
        schedule_pattern: pattern,
        air_time: movieData.air_time ? movieData.air_time.slice(0, 5) : "20:00",
        first_air_date: movieData.first_air_date || "",
        air_days_single: singleValue,
        air_days_multi: multiValue,
      }));
    } catch (error) {
      toast.error("خطا در دریافت اطلاعات سریال");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values) => {
    // ⬇️⬇️⬇️ تبدیل به air_days نهایی قبل از ارسال ⬇️⬇️⬇️
    const finalValues = {
      ...values,
      air_days:
        values.schedule_pattern === "weekly"
          ? values.air_days_single
            ? [Number(values.air_days_single)]
            : []
          : Array.isArray(values.air_days_multi)
            ? values.air_days_multi.map((d) => Number(d))
            : [],
    };
    await handleSubmit(finalValues, setSubmitting, navigate, id, refresh);
  };

  return (
    <ModalsContainer2
      ref={modalRef}
      id="episode_generate_modal"
      // title="⚡ ساخت خودکار قسمت‌ها"
      title={
        <div className="flex items-center gap-x-1">
          <svg className="w-7 h-7 fill-transparent text-orange-500">
            <use xlinkHref="#icon-bolt-bold-duotone"></use>
          </svg>
          <span>ساخت خودکار قسمت‌ها</span>
        </div>
      }
      isFooter={false}
      closeOnOutsideClick={false}
      width="max-w-2xl"
      onClose={() => navigate(-1)}
    >
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
        با انتخاب الگوی پخش، همه قسمت‌ها به صورت خودکار ساخته می‌شوند
        {movie?.total_episodes > 0 && (
          <span className="block mt-1 text-xs">
            تعداد قسمت‌ها از سریال ({movie.total_episodes} قسمت) پیش‌فرض شده
            است.
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="flex gap-2">
            <span className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></span>
            <span
              className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></span>
            <span
              className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></span>
          </div>
        </div>
      ) : (
        <Formik
          enableReinitialize={true}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ values, errors, touched, isValid, dirty }) => {
            // console.log("DEBUG Formik:", {
            //   values,
            //   errors,
            //   touched,
            //   isValid,
            //   dirty,
            // });
            return (
              <Form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input2
                    name="total_episodes"
                    type="number"
                    label="تعداد قسمت"
                    required
                    rtl
                  />
                  <Input2
                    name="runtime"
                    type="number"
                    label="مدت هر قسمت (دقیقه)"
                    rtl
                  />

                  <div className="md:col-span-2">
                    <UnifiedSearchableSelect
                      name="schedule_pattern"
                      mode="single"
                      label="الگوی پخش"
                      model={SchedulePatternOptions}
                      required
                      displayField="title"
                      subField="description"
                      iconHeader
                      icon="icon-calendar-bold-duotone"
                      iconToField
                      iconItems
                      sizePanel="270px"
                    />
                  </div>

                  {values.schedule_pattern !== "custom" && (
                    <>
                      <UnifiedDateTimePicker
                        name="first_air_date"
                        label="تاریخ شروع"
                        dateType="gregorian"
                        dateFormat="YYYY-MM-DD"
                        showTime={false}
                        iconLabel="icon-calendar-bold-duotone"
                        icon="icon-calendar"
                        required
                        clearable
                        placeholder="تاریخ شروع پخش"
                        yearsLimit={{ from: 0, to: 2 }}
                        showGregorian
                      />
                      <Input2
                        name="air_time"
                        type="time"
                        label="ساعت پخش"
                        rtl
                      />
                    </>
                  )}

                  {/* ⬇️⬇️⬇️ weekly: single select ⬇️⬇️⬇️ */}
                  {values.schedule_pattern === "weekly" && (
                    <div className="md:col-span-2">
                      <UnifiedSearchableSelect
                        name="air_days_single"
                        mode="single"
                        label="روز پخش هفته"
                        model={WeekDayOptions}
                        required
                        displayField="title"
                        iconHeader
                        icon="icon-calendar-bold-duotone"
                        iconToField
                        iconItems
                        clearTop
                        sizePanel="240px"
                        placeholder="روز پخش را انتخاب کنید"
                      />
                    </div>
                  )}

                  {/* ⬇️⬇️⬇️ multi_weekly: multi select ⬇️⬇️⬇️ */}
                  {values.schedule_pattern === "multi_weekly" && (
                    <div className="md:col-span-2">
                      <UnifiedSearchableSelect
                        name="air_days_multi"
                        mode="multi"
                        label="روزهای پخش هفته"
                        model={WeekDayOptions}
                        required
                        displayField="title"
                        iconHeader
                        icon="icon-calendar-bold-duotone"
                        iconToField
                        iconItems
                        clearTop
                        sizePanel="240px"
                        placeholder="روزهای هفته را انتخاب کنید"
                      />
                    </div>
                  )}
                </div>

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
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {submitting ? "در حال ساخت..." : "ساخت قسمت‌ها"}
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      )}
    </ModalsContainer2>
  );
};

export default Modal;
