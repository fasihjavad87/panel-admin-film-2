import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form } from "formik";
// import * as Yup from 'yup';
// import { toast } from '@/components/Toast/ToastContainer';
import { getSinglrUserService } from "@/services/users";
import { UserStatusOptions } from "@/enums/userStatus";
import Input2 from "@/components/Form/ui/UnifiedInput";
import UnifiedSearchableSelect from "@/components/Form/ui/UnifiedSearchableSelect2";
import UnifiedFileUploader from "@/components/Form/ui/UnifiedFileUploader";
import Switch from "@/components/Form/switch";
import AvatarUploader from "@/components/Form/ui/AvatarUploader";
import { handleSubmit, validationSchema } from "./core";
import {
  SkeletonSwitch,
  SkeletonAvatarUploader,
  SkeletonField,
  SkeletonSelect,
} from "@/components/Form/ui/Skeleton";
// import MediaPickerModal from "../../media/mediaModal/MediaPickerModal";
// import MediaPickerModal from "@/pages/media/mediaModal/MediaPickerModal";

const UserCreate = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

//   const [isPickerOpen, setIsPickerOpen] = useState(false);
//   const [pickedMedia, setPickedMedia] = useState([]);

//   const handleSelect = (selectedMediaArray) => {
//     // 👈 این آرایه کامل آبجکت‌های انتخاب‌شده‌ست
//     console.log("Selected media:", selectedMediaArray);
//     setPickedMedia(selectedMediaArray);

//     // مثلاً: ذخیره تو state یا ارسال به سرور
//     /*
//       selectedMediaArray = [
//         { id: 1, name: "a.jpg", url: "...", mime_type: "image/jpeg", ... },
//         { id: 2, name: "b.png", url: "...", mime_type: "image/png", ... },
//       ]
//     */
//   };

  const [loadingUser, setLoadingUser] = useState(false);
  const [userName, setUserName] = useState("");
  const [data, setData] = useState({});
  const [initialValues, setInitialValues] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    is_admin: false,
    status: "",
    avatar: [],
  });

  // دریافت اطلاعات کاربر برای حالت ویرایش
  useEffect(() => {
    if (isEditMode) {
      handleGetUserData();
    }
  }, [id]);

  const handleGetUserData = async () => {
    setLoadingUser(true);
    try {
      const res = await getSinglrUserService(id);
      if (res.status === 200) {
        const user = res.data.data;
        // console.log(user);

        setUserName(user.name || "");
        setInitialValues({
          name: user.name || "",
          email: user.email || "",
          username: user.username || "",
          password: "",
          is_admin: user.is_admin || false,
          status: user.status || "",
          avatar: user.avatar ? [{ url: user.avatar }] : [],
        });
        setData(user);
        // console.log(data);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error("خطا در دریافت اطلاعات کاربر");
    } finally {
      setLoadingUser(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 max-w-6xl mx-auto">
        <div className="p-6 sm:p-10">
          {/* هدر با حالت‌های مختلف */}
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white border-b pb-4 mb-8 border-indigo-300 dark:border-yellow-600 flex items-center gap-2">
            {isEditMode ? (
              <>
                <span>ویرایش کاربر</span>
                {loadingUser ? (
                  <span className="inline-block w-32 h-8 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></span>
                ) : (
                  <span className="text-indigo-600 dark:text-yellow-500">
                    {userName || ""}
                  </span>
                )}
              </>
            ) : (
              "ایجاد کاربر جدید"
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
            {({ isSubmitting, values, setFieldValue }) => (
              <Form className="space-y-8">
                {/* 1. اطلاعات شخصی */}
                <div className="card p-6 shadow-lg rounded-xl bg-gray-50! dark:bg-gray-900/50!">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-600">
                    اطلاعات شخصی
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {loadingUser ? (
                      // حالت Skeleton برای Loading
                      <>
                        <SkeletonField />
                        <SkeletonField />
                        <SkeletonField />
                        <SkeletonSelect />
                        <SkeletonAvatarUploader />
                      </>
                    ) : (
                      // حالت عادی
                      <>
                        {/* نام */}
                        <div>
                          <Input2
                            name="name"
                            label="نام"
                            placeholder="نام را وارد کنید"
                            required
                            icon="icon-user"
                            iconPosition="right"
                            clearable
                            rtl
                          />
                        </div>

                        {/* نام کاربری */}
                        <div>
                          <Input2
                            name="username"
                            label="نام کاربری"
                            placeholder="نام کاربری را وارد کنید"
                            required
                            icon="icon-user"
                            iconPosition="right"
                            clearable
                            showCount
                            maxLength={50}
                            rtl
                          />
                        </div>

                        {/* ایمیل */}
                        <div>
                          <Input2
                            name="email"
                            type="email"
                            label="ایمیل"
                            placeholder="example@domain.com"
                            required
                            icon="icon-letter"
                            iconPosition="right"
                            clearable
                            rtl
                          />
                        </div>

                        {/* وضعیت */}
                        <div>
                          <UnifiedSearchableSelect
                            name="status"
                            mode="single"
                            label="وضعیت"
                            model={UserStatusOptions}
                            required
                            displayField="title"
                            subField="description"
                            iconHeader
                            icon="icon-user"
                            iconToField
                            iconItems
                            clearTop
                            sizePanel="240px"
                            py="py-[9px]"
                            placeholder="وضعیت را انتخاب کنید"
                          />
                        </div>

                        {/* آواتار */}
                        {/* <div>
                                                    <div>
                                                        <img className='w-9 h-9 rounded-full' src={data.avatar_url}/>
                                                    </div>
                                                    <UnifiedFileUploader
                                                        formik={{ values, setFieldValue }}
                                                        name="avatar"
                                                        label="آواتار"
                                                        multiple={false}
                                                        maxFiles={1}
                                                        accept="image/*"
                                                        maxSize={2 * 1024 * 1024}
                                                        placeholder="تصویر پروفایل را آپلود کنید"
                                                        clearable={false}
                                                    />
                                                </div> */}
                        <AvatarUploader
                          formik={{ values, setFieldValue }}
                          name="avatar"
                          label="آواتار"
                          initialAvatar={data.avatar_url}
                          multiple={false}
                          maxFiles={1}
                          accept="image/*"
                          maxSize={2 * 1024 * 1024}
                          placeholder="تصویر پروفایل را آپلود کنید"
                          clearable={false}
                        />
                      </>
                    )}
                  </div>
                </div>

                {/* 2. تنظیمات حساب کاربری */}
                <div className="card p-6 shadow-lg rounded-xl bg-gray-50! dark:bg-gray-900/50!">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-600">
                    تنظیمات حساب کاربری
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {loadingUser ? (
                      // حالت Skeleton برای Loading
                      <>
                        <SkeletonField />
                        <SkeletonSwitch />
                      </>
                    ) : (
                      // حالت عادی
                      <>
                        {/* رمز عبور */}
                        <div>
                          <Input2
                            name="password"
                            type="password"
                            label={
                              isEditMode
                                ? "رمز عبور جدید (اختیاری)"
                                : "رمز عبور"
                            }
                            placeholder={
                              isEditMode
                                ? "برای تغییر رمز عبور وارد کنید"
                                : "رمز عبور را وارد کنید"
                            }
                            required={!isEditMode}
                            passwordTogglePosition="left"
                            passwordShowIcon="icon-eye"
                            passwordHideIcon="icon-eye-closed"
                            passwordIconColor="!text-blue-400"
                            clearable
                            showCount
                            maxLength={20}
                            rtl
                          />
                        </div>

                        {/* ادمین باشد؟ */}
                        <div className="flex items-center justify-start">
                          <Switch
                            name="is_admin"
                            label="ادمین باشد؟"
                            colorWrapper="bg-blue-500"
                          />
                        </div>
                        {/* <div>
                          <button
                            onClick={() => setIsPickerOpen(true)}
                            className="px-4 py-2 text-lg font-medium text-white bg-indigo-600 dark:bg-yellow-500 rounded-lg hover:bg-indigo-700 dark:hover:bg-yellow-600 transition duration-150 shadow-xl shadow-indigo-500/30 dark:shadow-yellow-500/30 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            باز کردن رسانه ها
                          </button>
                        </div> */}
                      </>
                    )}
                  </div>
                </div>

                {/* 3. دکمه‌های اقدام */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-900 flex justify-start gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting || loadingUser}
                    className="flex items-center gap-2 px-6 py-3 text-lg font-medium text-white bg-indigo-600 dark:bg-yellow-500 rounded-lg hover:bg-indigo-700 dark:hover:bg-yellow-600 transition duration-150 shadow-xl shadow-indigo-500/30 dark:shadow-yellow-500/30 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span>در حال ذخیره...</span>
                      </>
                    ) : (
                      <span>{isEditMode ? "ویرایش کاربر" : "ایجاد کاربر"}</span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/users")}
                    className="px-6 py-3 text-lg font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-150 cursor-pointer"
                  >
                    بازگشت
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      {/* <MediaPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={handleSelect}
        multiple={true}
        // initialSelectedIds={[1, 2]} // 👈 اگه خواستی از قبل انتخاب‌شده باشن
      /> */}
    </div>
  );
};

export default UserCreate;
