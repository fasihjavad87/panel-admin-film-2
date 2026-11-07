import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form } from "formik";
import { toast } from "@/components/Toast/ToastContainer";
import { movieGetSingleService } from "@/services/movies";
import { ContentTypeOptions } from "@/enums/contentTypeStatus";
import { MovieStatusOptions } from "@/enums/movieStatus";
import Input2 from "@/components/Form/ui/UnifiedInput";
import Textarea from "@/components/Form/ui/UnifiedTextarea";
import UnifiedSearchableSelect from "@/components/Form/ui/UnifiedSearchableSelect2";
import UnifiedDateTimePicker from "@/components/Form/ui/UnifiedDateTimePicker";
import Switch from "@/components/Form/switch";
import { handleSubmit, validationSchema } from "./core";
import { SkeletonField, SkeletonSelect } from "@/components/Form/ui/Skeleton";

// ⬇️ گزینه‌های رده سنی
const AgeRatingOptions = [
  { id: "all", title: "همه سنین" },
  { id: "7+", title: "بالای ۷ سال" },
  { id: "12+", title: "بالای ۱۲ سال" },
  { id: "15+", title: "بالای ۱۵ سال" },
  { id: "18+", title: "بالای ۱۸ سال" },
  { id: "not_rated", title: "بدون رده‌بندی" },
];

// ⬇️ تولید لیست سال (برای release_year)
const generateYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear + 2; i >= currentYear - 100; i--) {
    years.push({ id: String(i), title: String(i) });
  }
  return years;
};

const MovieCreate = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [loadingMovie, setLoadingMovie] = useState(false);
  const [movieName, setMovieName] = useState("");
  const [initialValues, setInitialValues] = useState({
    title: "",
    e_name: "",
    slug: "",
    description: "",
    content_type: "movie",
    status: "draft",
    runtime: "",
    is_free: false,
    publish_at: "",
    total_episodes: "",   // ⬅️ جدید
    details: {
      release_year: "",
      age_rating: "not_rated",
      rating: "",
    },
  });

  const yearsOptions = useMemo(() => generateYears(), []);

  useEffect(() => {
    if (isEditMode) {
      loadMovie();
    }
  }, [id]);

  const loadMovie = async () => {
    setLoadingMovie(true);
    try {
      const res = await movieGetSingleService(id);
      if (res.status === 200) {
        const movie = res.data;
        setMovieName(movie.title || "");

        let publishAtValue = "";
        if (movie.episodes?.[0]?.publish_at) {
          const raw = movie.episodes[0].publish_at;
          const date = new Date(raw);
          const pad = (n) => String(n).padStart(2, "0");
          publishAtValue = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
        }

        setInitialValues({
          title: movie.title || "",
          e_name: movie.e_name || "",
          slug: movie.slug || "",
          description: movie.description || "",
          content_type: movie.content_type || "movie",
          status: movie.status || "draft",
          runtime: movie.runtime || "",
          is_free: movie.is_free || false,
          publish_at: publishAtValue,
          total_episodes: movie.total_episodes || "",   // ⬅️ جدید
          details: {
            release_year: movie.details?.release_year
              ? String(movie.details.release_year)
              : "",
            age_rating: movie.details?.age_rating || "not_rated",
            rating: movie.details?.rating || "",
          },
        });
      }
    } catch (error) {
      toast.error("خطا در دریافت اطلاعات");
    } finally {
      setLoadingMovie(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 max-w-6xl mx-auto">
        <div className="p-6 sm:p-10">
          <h1 className="text-2xl font-extrabold text-gray-900 border-b pb-4 mb-8 border-indigo-300 flex items-center gap-2">
            {isEditMode ? (
              <>
                <span>ویرایش محتوا</span>
                {loadingMovie ? (
                  <span className="inline-block w-32 h-8 bg-gray-200 animate-pulse rounded"></span>
                ) : (
                  <span className="text-indigo-600">{movieName}</span>
                )}
              </>
            ) : (
              "ایجاد محتوای جدید"
            )}
          </h1>

          <Formik
            enableReinitialize={true}
            initialValues={initialValues}
            validationSchema={validationSchema(isEditMode)}
            onSubmit={(values, { setSubmitting }) =>
              handleSubmit(values, setSubmitting, navigate, isEditMode, id)
            }
          >
            {({ isSubmitting, values }) => (
              <Form className="space-y-8">
                {/* اطلاعات اصلی */}
                <div className="p-6 shadow-lg rounded-xl bg-gray-50">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                    اطلاعات اصلی
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {loadingMovie ? (
                      <>
                        <SkeletonField />
                        <SkeletonField />
                        <SkeletonField />
                        <SkeletonField />
                      </>
                    ) : (
                      <>
                        <Input2
                          name="title"
                          label="عنوان"
                          placeholder="عنوان فارسی"
                          required
                          rtl
                        />
                        <Input2
                          name="e_name"
                          label="عنوان انگلیسی"
                          placeholder="English Title"
                          required
                          rtl
                        />
                        <Input2
                          name="slug"
                          label="Slug"
                          placeholder="my-movie-slug"
                          required
                          rtl
                        />
                        <UnifiedSearchableSelect
                          name="content_type"
                          mode="single"
                          label="نوع محتوا"
                          model={ContentTypeOptions}
                          required
                          displayField="title"
                          subField="description"
                          iconHeader
                          icon="icon-clapperboard-play-bold-duotone"
                          iconToField
                          iconItems
                          sizePanel="240px"
                          placeholder="انتخاب کنید"
                        />

                        {/* ⬇️⬇️⬇️ تعداد قسمت (فقط سریال) ⬇️⬇️⬇️ */}
                        {values.content_type === "series" && (
                          <Input2
                            name="total_episodes"
                            type="number"
                            label="تعداد کل قسمت‌ها"
                            placeholder="مثلاً ۱۶"
                            min={1}
                            rtl
                          />
                        )}
                      </>
                    )}
                  </div>

                  <div className="mt-6">
                    <Textarea
                      name="description"
                      label="خلاصه داستان"
                      placeholder="توضیحات ..."
                      rows={4}
                      rtl
                    />
                  </div>
                </div>

                {/* وضعیت و تنظیمات */}
                <div className="p-6 shadow-lg rounded-xl bg-gray-50">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                    وضعیت و تنظیمات
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <UnifiedSearchableSelect
                      name="status"
                      mode="single"
                      label="وضعیت انتشار"
                      model={MovieStatusOptions}
                      required
                      displayField="title"
                      subField="description"
                      iconHeader
                      icon="icon-check-circle-bold-duotone"
                      iconToField
                      iconItems
                      sizePanel="240px"
                    />
                    <Input2
                      name="runtime"
                      type="number"
                      label="مدت زمان (دقیقه)"
                      placeholder={
                        values.content_type === "movie"
                          ? "مدت فیلم"
                          : "میانگین مدت هر قسمت"
                      }
                      rtl
                    />

                    {values.content_type === "movie" && (
                      <UnifiedDateTimePicker
                        name="publish_at"
                        label="تاریخ پخش فیلم"
                        dateType="gregorian"
                        dateFormat="YYYY-MM-DD"
                        showTime={true}
                        timeFormatOutput="HH:mm:ss"
                        minuteStep={5}
                        iconLabel="icon-calendar"
                        icon="icon-calendar"
                        required
                        clearable
                        placeholder="تاریخ و ساعت پخش فیلم"
                        yearsLimit={{ from: 100, to: 1 }}
                      />
                    )}

                    <div className="flex items-center justify-start">
                      <Switch
                        name="is_free"
                        label="رایگان است؟"
                        colorWrapper="bg-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* جزئیات */}
                <div className="p-6 shadow-lg rounded-xl bg-gray-50">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                    جزئیات نمایش
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <UnifiedSearchableSelect
                      name="details.release_year"
                      mode="single"
                      label="سال ساخت"
                      model={yearsOptions}
                      displayField="title"
                      iconHeader
                      icon="icon-calendar-bold-duotone"
                      iconToField
                      iconItems
                      sizePanel="200px"
                      placeholder="سال را انتخاب کنید"
                    />

                    <UnifiedSearchableSelect
                      name="details.age_rating"
                      mode="single"
                      label="رده سنی"
                      model={AgeRatingOptions}
                      displayField="title"
                      iconHeader
                      icon="icon-shield-user-bold-duotone"
                      iconToField
                      iconItems
                    //   sizePanel="190px"
                    />

                    <Input2
                      name="details.rating"
                      type="number"
                      step="0.1"
                      min={1}
                      max={10}
                      label="امتیاز (1-10)"
                      placeholder="8.5"
                      rtl
                    />
                  </div>
                </div>

                {/* دکمه‌ها */}
                <div className="pt-6 border-t border-gray-200 flex justify-start gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting || loadingMovie}
                    className="flex items-center gap-2 px-6 py-3 text-lg font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition shadow-xl shadow-indigo-500/30 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>در حال ذخیره...</span>
                    ) : (
                      <span>{isEditMode ? "ویرایش" : "ایجاد"}</span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/movies")}
                    className="px-6 py-3 text-lg font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition cursor-pointer"
                  >
                    بازگشت
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default MovieCreate;