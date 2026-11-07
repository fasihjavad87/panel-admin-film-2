// src/pages/movies/episodes/episodeCreate/Modal.jsx

import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form } from "formik";
import ModalsContainer2 from "@/components/ModalsContainer2";
import {
  episodeAddNewService,
  episodeEditService,
  episodesGetService,
} from "@/services/movies";
import { EpisodeStatusOptions } from "@/enums/episodeStatus";
import Input2 from "@/components/Form/ui/UnifiedInput";
import UnifiedSearchableSelect from "@/components/Form/ui/UnifiedSearchableSelect2";
import UnifiedDateTimePicker from "@/components/Form/ui/UnifiedDateTimePicker";
import Switch from "@/components/Form/switch";
import { handleSubmit, validationSchema } from "./core";
import { useTableRefresh } from "@/hooks/useTableRefresh";

const Modal = () => {
  const navigate = useNavigate();
  const modalRef = useRef(null);
  const { id, episodeId } = useParams();
  const isEditMode = !!episodeId;
  const { refresh } = useTableRefresh();

  const [loading, setLoading] = useState(isEditMode);
  const [initialValues, setInitialValues] = useState({
    episode_number: 1,
    title: "",
    status: "draft",
    publish_at: "",
    runtime: "",
    is_free: false,
  });

  useEffect(() => {
    modalRef.current?.open();
    if (isEditMode) {
      loadEpisode();
    } else {
      loadNextEpisodeNumber();
    }
  }, []);

  const loadEpisode = async () => {
    setLoading(true);
    try {
      const res = await episodesGetService(id);
      const episode = res.data.find((e) => e.id === Number(episodeId));
      if (episode) {
        // ⬇️ تبدیل datetime به فرمت میلادی "YYYY-MM-DD HH:mm:ss"
        let publishAtValue = "";
        if (episode.publish_at) {
          const date = new Date(episode.publish_at);
          const pad = (n) => String(n).padStart(2, "0");
          publishAtValue = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
        }

        setInitialValues({
          episode_number: episode.episode_number || 1,
          title: episode.title || "",
          status: episode.status || "draft",
          publish_at: publishAtValue,
          runtime: episode.runtime || "",
          is_free: episode.is_free || false,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const loadNextEpisodeNumber = async () => {
    try {
      const res = await episodesGetService(id);
      const maxNumber = Math.max(
        0,
        ...res.data.map((e) => e.episode_number || 0),
      );
      setInitialValues((prev) => ({
        ...prev,
        episode_number: maxNumber + 1,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (values, { setSubmitting }) => {
    await handleSubmit(
      values,
      setSubmitting,
      navigate,
      isEditMode,
      id,
      episodeId,
      refresh,
    );
  };

  return (
    <ModalsContainer2
      ref={modalRef}
      id="episode_form_modal"
      title={
        loading ? (
          <div className="h-5 w-40 bg-gray-200 animate-pulse rounded"></div>
        ) : isEditMode ? (
          `ویرایش قسمت ${initialValues.episode_number}`
        ) : (
          "افزودن قسمت جدید"
        )
      }
      isFooter={false}
      closeOnOutsideClick={false}
      width="max-w-2xl"
      onClose={() => navigate(-1)}
    >
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
          validationSchema={validationSchema(isEditMode)}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input2
                  name="episode_number"
                  type="number"
                  label="شماره قسمت"
                  required
                  rtl
                />
                <Input2 name="title" label="عنوان" placeholder="قسمت ۱" rtl />
                <UnifiedSearchableSelect
                  name="status"
                  mode="single"
                  label="وضعیت"
                  model={EpisodeStatusOptions}
                  required
                  displayField="title"
                  iconHeader
                  icon="icon-check-circle-bold-duotone"
                  iconToField
                  iconItems
                  sizePanel="200px"
                />
                <Input2 name="runtime" type="number" label="مدت (دقیقه)" rtl />

                {/* ⬇️⬇️⬇️ تاریخ پخش قسمت با UnifiedDateTimePicker ⬇️⬇️⬇️ */}
                <div className="md:col-span-2">
                  <UnifiedDateTimePicker
                    name="publish_at"
                    label="تاریخ و ساعت پخش"
                    dateType="gregorian" // ⬅️ خروجی میلادی
                    dateFormat="YYYY-MM-DD"
                    showTime={true} // ⬅️ با ساعت
                    timeFormatOutput="HH:mm:ss"
                    minuteStep={5}
                    iconLabel="icon-calendar"
                    icon="icon-calendar"
                    clearable
                    placeholder="تاریخ و ساعت پخش قسمت"
                    yearsLimit={{ from: 0, to: 2 }}
                  />
                </div>

                <div className="flex items-center">
                  <Switch
                    name="is_free"
                    label="رایگان است؟"
                    colorWrapper="bg-blue-500"
                  />
                </div>
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
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isSubmitting
                    ? "در حال ذخیره..."
                    : isEditMode
                      ? "ویرایش"
                      : "ایجاد"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </ModalsContainer2>
  );
};

export default Modal;
