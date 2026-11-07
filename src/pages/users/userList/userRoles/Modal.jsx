import React, { useEffect, useRef, useState } from 'react';
import ModalsContainer2 from '@/components/ModalsContainer2';
import { useNavigate, useParams } from 'react-router-dom';
import { getSinglrUserService } from '@/services/users';
import { rolesGetAllService } from '@/services/roles';
import { userSyncRoleService } from '@/services/users';
import Loading from '@/components/ui/Loading';
import jMoment from "moment-jalaali";
import Checkbox from '@/components/Form/ui/Checkbox';
import { Form, Formik } from 'formik';
import { toast } from '@/components/Toast/ToastContainer';
// import { getRoleText, getRoleBadge, getStatusText, getStatusBadge } from '../userShow/core';

const Modal = () => {

    const navigate = useNavigate()
    const modalRef = useRef(null);
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [allRoles, setAllRoles] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        modalRef.current?.open()
        handleGetUser()
    }, []);

    const handleGetUser = async () => {
        setLoading(true);
        try {
            const [userRes, rolesRes] = await Promise.all([
                getSinglrUserService(id),
                rolesGetAllService()
            ]);

            setUser(userRes.data.data);

            setAllRoles(rolesRes.data.data);
            // setAllRoles({});
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }

    }
    // const handleGetAllRoles = async () => {
    //     setLoading(true);
    //     try {
    //         const res = await getSinglrUserService(id)
    //         if (res?.data?.data) {
    //             // console.log(res);
    //             setUser(res.data.data)
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     } finally {
    //         setLoading(false);
    //     }

    // }

    const initialValues = {
        // roles: user ? user.roles.map(role => String(role.id)) : []
        roles: user?.roles?.map(role => String(role.id)) || []
    }

    // const handleSubmit = async (values) => {
    //     await userSyncRoleService(id, {
    //         roles: values.roles.map(Number)
    //     });
    // }
    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            await userSyncRoleService(id, {
                roles: values.roles.map(Number),
            });

            modalRef.current?.close(() => {
                toast.success("نقش‌های کاربر با موفقیت بروزرسانی شد", {
                    duration: 4000,
                });
            });

        } catch (error) {
            console.log(error);

            toast.error("خطا در بروزرسانی نقش‌ها");
        } finally {
            setSubmitting(false);
        }
    };

    const selectAllRoles = (values, setFieldValue) => {
        const allIds = allRoles.map(r => String(r.id));
        const currentIds = values.roles || [];
        if (currentIds.length === allIds.length) {
            setFieldValue('roles', []);
        } else {
            setFieldValue('roles', allIds);
        }
    }


    return (
        <ModalsContainer2
            ref={modalRef}
            id="show_user_modal"
            title={loading ? (
                <div className="h-5 w-40 bg-gray-200 animate-pulse rounded"></div>
            ) : (
                `افزودن نقش به ${user?.name || ""}`
            )}
            fullScreen
            isFooter={false}
            // closeOnOutsideClick={false}
            // width='max-w-5xl'
            onClose={() => {
                navigate(-1);
            }}
            // itemRightToFooter={(
            //    <span className='flex gap-1 items-center text-sm'><span className='text-blue-500'>2</span>انتخاب شده</span>
            // )}
            // itemLeftToFooter={(
            //     <button
            //         type="button"
            //         // onClick={close}
            //         // onClick={() => close()}
            //         className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:blue-red-300 transition-colors cursor-pointer"
            //     >
            //         تایید
            //     </button>
            // )}
        >
            <div className=''>
                {loading ? (
                    // <div className="flex justify-center items-center h-20">
                    //     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    // </div>
                    // <Loading text={null}/>
                    <div className="flex flex-col items-center">

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
                ) : user ? (
                    // <Formik
                    //     enableReinitialize={true}
                    //     initialValues={initialValues}
                    //     // validationSchema={validationSchema}
                    //     onSubmit={handleSubmit}
                    // >
                    //     {({ isSubmitting, values, setFieldValue }) => (
                    //         <Form className="flex justify-center">
                    //             <div className="rounded-xl border bg-white shadow-sm p-5 mb-6">

                    //                 <div className="flex items-center gap-4">

                    //                     <img
                    //                         src={user.avatar_url}
                    //                         className="w-16 h-16 rounded-full object-cover"
                    //                     />

                    //                     <div>

                    //                         <h2 className="font-bold text-lg">
                    //                             {user.name}
                    //                         </h2>

                    //                         <p className="text-gray-500">
                    //                             {user.email}
                    //                         </p>

                    //                         <p className="text-sm text-gray-400">
                    //                             @{user.username}
                    //                         </p>

                    //                     </div>

                    //                 </div>

                    //             </div>
                    //             <div className="w-full max-w-2xl">
                    //                 <div className="rounded-xl border bg-white p-5">
                    //                     <h3 className="font-semibold mb-4">
                    //                         نقش‌های کاربر
                    //                     </h3>
                    //                     <Checkbox
                    //                         name="roles"
                    //                         // label="نقش ها"
                    //                         labelKey='title'
                    //                         options={allRoles}
                    //                     />
                    //                 </div>
                    //             </div>
                    //         </Form>
                    //     )}
                    // </Formik>

                    // <Formik
                    //     enableReinitialize={true}
                    //     initialValues={initialValues}
                    //     onSubmit={handleSubmit}
                    // >
                    //     {({ isSubmitting, values, setFieldValue }) => (
                    //         <Form>
                    //             <div className="max-w-5xl mx-auto ">
                    //                 {/* کارت اصلی با سایه و حاشیه زیبا */}
                    //                 <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">

                    //                     {/* هدر با گرادینت */}
                    //                     <div className="relative bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 px-6 py-5">
                    //                         <div className="relative flex items-center justify-between">
                    //                             <div className="flex items-center gap-4">
                    //                                 <div className="relative">
                    //                                     <img
                    //                                         src={user.avatar_url || '/default-avatar.png'}
                    //                                         className="w-16 h-16 rounded-full object-cover border-4 border-white/30 shadow-lg"
                    //                                         alt={user.name}
                    //                                     />
                    //                                     {/* <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div> */}
                    //                                 </div>
                    //                                 <div className="text-white">
                    //                                     <h2 className="text-xl font-bold tracking-tight">
                    //                                         {user.name}
                    //                                     </h2>
                    //                                     <div className="flex items-center gap-3 mt-1 text-purple-100">
                    //                                         <span className="flex items-center gap-1 text-sm">
                    //                                             <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    //                                                 <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    //                                             </svg>
                    //                                             {user.email}
                    //                                         </span>
                    //                                         <span className="w-1 h-1 bg-purple-300 rounded-full"></span>
                    //                                         <span className="flex items-center gap-1 text-sm">
                    //                                             <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    //                                                 <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    //                                             </svg>
                    //                                             @{user.username}
                    //                                         </span>
                    //                                     </div>
                    //                                 </div>
                    //                             </div>
                    //                             <div className="hidden sm:block">
                    //                                 <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full border border-white/30">
                    //                                     مدیریت نقش‌ها
                    //                                 </span>
                    //                             </div>
                    //                         </div>
                    //                     </div>

                    //                     {/* بدنه */}
                    //                     <div className="p-6 space-y-6">
                    //                         {/* بخش نقش‌ها */}
                    //                         <div>
                    //                             <div className="flex items-center justify-between mb-4">
                    //                                 <div className="flex items-center gap-2">
                    //                                     <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    //                                         <svg className="w-5 h-5 text-purple-600 dark:text-purple-400 fill-transparent">
                    //                                             <use xlinkHref="#icon-shield-user-bold-duotone"></use>
                    //                                         </svg>
                    //                                     </div>
                    //                                     <div>
                    //                                         <h3 className="font-semibold text-gray-800 dark:text-white">
                    //                                             نقش‌های کاربر
                    //                                         </h3>
                    //                                         <p className="text-xs text-gray-500 dark:text-gray-400">
                    //                                             {allRoles.filter(r => values.roles?.includes(String(r.id))).length} نقش انتخاب شده
                    //                                         </p>
                    //                                     </div>
                    //                                 </div>
                    //                                 <div className="flex gap-2">
                    //                                     <button
                    //                                         type="button"
                    //                                         onClick={() => {
                    //                                             const allIds = allRoles.map(r => String(r.id));
                    //                                             const currentIds = values.roles || [];
                    //                                             if (currentIds.length === allIds.length) {
                    //                                                 setFieldValue('roles', []);
                    //                                             } else {
                    //                                                 setFieldValue('roles', allIds);
                    //                                             }
                    //                                         }}
                    //                                         className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-all duration-200 font-medium cursor-pointer"
                    //                                     >
                    //                                         {values.roles?.length === allRoles.length ? 'لغو همه' : 'انتخاب همه'}
                    //                                     </button>
                    //                                 </div>
                    //                             </div>

                    //                             {allRoles.length === 0 ? (
                    //                                 <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                    //                                     <svg className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3 fill-transparent">
                    //                                         <use xlinkHref="#icon-shield-off-bold-duotone"></use>
                    //                                     </svg>
                    //                                     <p className="text-gray-500 dark:text-gray-400">هیچ نقشی در سیستم تعریف نشده است</p>
                    //                                 </div>
                    //                             ) : (
                    //                                 <div className="bg-gray-50 dark:bg-gray-800/30 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    //                                     <Checkbox
                    //                                         name="roles"
                    //                                         options={allRoles.map(role => ({
                    //                                             id: role.id,
                    //                                             title: role.title || role.name,
                    //                                             description: role.name
                    //                                         }))}
                    //                                         value={values.roles || []}
                    //                                         onChange={(newValues) => {
                    //                                             setFieldValue('roles', newValues);
                    //                                         }}
                    //                                         className="mb-0"
                    //                                         colorlableitem="text-gray-700 dark:text-gray-300"
                    //                                         colorcheckitem="checked:bg-purple-600 checked:border-purple-600"
                    //                                         colorcheckitemicon="text-white"
                    //                                     />
                    //                                 </div>
                    //                             )}
                    //                         </div>

                    //                         {/* خلاصه نقش‌های انتخاب شده */}
                    //                         {values.roles?.length > 0 && (
                    //                             <div className="flex flex-wrap items-center gap-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                    //                                 <svg className="w-4 h-4 text-purple-600 dark:text-purple-400 fill-transparent flex-shrink-0">
                    //                                     <use xlinkHref="#icon-shield-check-bold-duotone"></use>
                    //                                 </svg>
                    //                                 <span className="text-xs font-medium text-purple-700 dark:text-purple-300">
                    //                                     نقش‌های انتخاب شده:
                    //                                 </span>
                    //                                 <div className="flex flex-wrap gap-1.5">
                    //                                     {values.roles.map(id => {
                    //                                         const role = allRoles.find(r => String(r.id) === id);
                    //                                         return role ? (
                    //                                             <span
                    //                                                 key={id}
                    //                                                 className="px-2.5 py-0.5 text-xs bg-purple-200 dark:bg-purple-700 text-purple-800 dark:text-purple-200 rounded-full font-medium"
                    //                                             >
                    //                                                 {role.title || role.name}
                    //                                             </span>
                    //                                         ) : null;
                    //                                     })}
                    //                                 </div>
                    //                                 <button
                    //                                     type="button"
                    //                                     onClick={() => setFieldValue('roles', [])}
                    //                                     className="mr-auto text-xs text-purple-500 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium cursor-pointer"
                    //                                 >
                    //                                     پاک کردن همه
                    //                                 </button>
                    //                             </div>
                    //                         )}

                    //                         {/* دکمه‌های اقدام */}
                    //                         <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    //                             <button
                    //                                 type="button"
                    //                                 onClick={() => navigate(-1)}
                    //                                 className="px-6 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-all duration-200 font-medium cursor-pointer"
                    //                             >
                    //                                 انصراف
                    //                             </button>
                    //                             <button
                    //                                 type="submit"
                    //                                 disabled={isSubmitting}
                    //                                 className="relative px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                    //                             >
                    //                                 {isSubmitting ? (
                    //                                     <>
                    //                                         <span>در حال ذخیره...</span>
                    //                                     </>
                    //                                 ) : (
                    //                                     <>
                    //                                         <span>ذخیره نقش‌ها</span>
                    //                                     </>
                    //                                 )}
                    //                             </button>
                    //                         </div>
                    //                     </div>
                    //                 </div>
                    //             </div>
                    //         </Form>
                    //     )}
                    // </Formik>

                    // <Formik
                    //     enableReinitialize={true}
                    //     initialValues={initialValues}
                    //     onSubmit={handleSubmit}
                    // >
                    //     {({ isSubmitting, values, setFieldValue }) => (
                    //         <Form>
                    //             <div className="max-w-5xl mx-auto p-4">
                    //                 <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">

                    //                     {/* هدر با گرادینت بنفش */}
                    //                     <div className="relative bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 px-6 py-5">
                    //                         <div className="relative flex items-center justify-between">
                    //                             <div className="flex items-center gap-4">
                    //                                 <div className="relative">
                    //                                     <img
                    //                                         src={user.avatar_url || '/default-avatar.png'}
                    //                                         className="w-16 h-16 rounded-full object-cover border-4 border-white/30 shadow-lg"
                    //                                         alt={user.name}
                    //                                     />
                    //                                 </div>
                    //                                 <div className="text-white">
                    //                                     <h2 className="text-xl font-bold tracking-tight">
                    //                                         {user.name}
                    //                                     </h2>
                    //                                     <div className="flex items-center gap-3 mt-1 text-purple-100">
                    //                                         <span className="flex items-center gap-1 text-sm">
                    //                                             {/* <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    //                                                 <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    //                                             </svg> */}
                    //                                             <svg className="w-[18px] h-[18px] fill-transparent">
                    //                                                 <use xlinkHref="#icon-letter-bold-duotone"></use>
                    //                                             </svg>
                    //                                             {user.email}
                    //                                         </span>
                    //                                         {/* <span className="w-1 h-1 bg-purple-300 rounded-full"></span> */}
                    //                                         <span className="flex items-center gap-1 text-sm">
                    //                                             {/* <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    //                                                 <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    //                                             </svg> */}
                    //                                             <svg className="w-[18px] h-[18px] fill-transparent">
                    //                                                 <use xlinkHref="#icon-user-rounded-bold-duotone"></use>
                    //                                             </svg>
                    //                                             {user.username}
                    //                                         </span>
                    //                                     </div>
                    //                                 </div>
                    //                             </div>
                    //                             <div className="hidden sm:block">
                    //                                 <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full border border-white/30">
                    //                                     مدیریت نقش‌ها
                    //                                 </span>
                    //                             </div>
                    //                         </div>
                    //                     </div>

                    //                     {/* بدنه */}
                    //                     <div className="p-6 space-y-6">

                    //                         {/* بخش نقش‌ها */}
                    //                         <div>
                    //                             <div className="flex items-center justify-between mb-4">
                    //                                 <div className="flex items-center gap-2">
                    //                                     <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    //                                         <svg className="w-5 h-5 text-purple-600 dark:text-purple-400 fill-transparent">
                    //                                             <use xlinkHref="#icon-shield-user-bold-duotone"></use>
                    //                                         </svg>
                    //                                     </div>
                    //                                     <div>
                    //                                         <h3 className="font-semibold text-gray-800 dark:text-white">
                    //                                             نقش‌های کاربر
                    //                                         </h3>
                    //                                         <p className="text-xs text-gray-500 dark:text-gray-400">
                    //                                             {allRoles.filter(r => values.roles?.includes(String(r.id))).length} نقش انتخاب شده
                    //                                         </p>
                    //                                     </div>
                    //                                 </div>
                    //                                 <div className="flex gap-2">
                    //                                     <button
                    //                                         type="button"
                    //                                         onClick={() => {
                    //                                             const allIds = allRoles.map(r => String(r.id));
                    //                                             const currentIds = values.roles || [];
                    //                                             if (currentIds.length === allIds.length) {
                    //                                                 setFieldValue('roles', []);
                    //                                             } else {
                    //                                                 setFieldValue('roles', allIds);
                    //                                             }
                    //                                         }}
                    //                                         className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-all duration-200 font-medium cursor-pointer"
                    //                                     >
                    //                                         {values.roles?.length === allRoles.length ? 'لغو همه' : 'انتخاب همه'}
                    //                                     </button>
                    //                                 </div>
                    //                             </div>

                    //                             {allRoles.length === 0 ? (
                    //                                 <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                    //                                     <svg className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3 fill-transparent">
                    //                                         <use xlinkHref="#icon-shield-off-bold-duotone"></use>
                    //                                     </svg>
                    //                                     <p className="text-gray-500 dark:text-gray-400">هیچ نقشی در سیستم تعریف نشده است</p>
                    //                                 </div>
                    //                             ) : (
                    //                                 <div className="bg-gray-50 dark:bg-gray-800/30 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    //                                     <Checkbox
                    //                                         name="roles"
                    //                                         options={allRoles.map(role => ({
                    //                                             id: role.id,
                    //                                             title: role.title || role.name,
                    //                                             description: role.name
                    //                                         }))}
                    //                                         value={values.roles || []}
                    //                                         onChange={(newValues) => {
                    //                                             setFieldValue('roles', newValues);
                    //                                         }}
                    //                                         className="mb-0"
                    //                                         colorlableitem="text-gray-700 dark:text-gray-300"
                    //                                         colorcheckitem="checked:bg-purple-600 checked:border-purple-600"
                    //                                         colorcheckitemicon="text-white"
                    //                                     />
                    //                                 </div>
                    //                             )}
                    //                         </div>

                    //                         {/* خلاصه نقش‌های انتخاب شده - با استایل بنفش */}
                    //                         {values.roles?.length > 0 && (
                    //                             <div className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-700">
                    //                                 <svg className="w-4 h-4 text-purple-600 dark:text-purple-400 fill-transparent flex-shrink-0">
                    //                                     <use xlinkHref="#icon-shield-check-bold-duotone"></use>
                    //                                 </svg>
                    //                                 <span className="text-xs font-medium text-purple-700 dark:text-purple-300">
                    //                                     نقش‌های انتخاب شده:
                    //                                 </span>
                    //                                 <div className="flex flex-wrap gap-1.5">
                    //                                     {values.roles.map(id => {
                    //                                         const role = allRoles.find(r => String(r.id) === id);
                    //                                         return role ? (
                    //                                             <span
                    //                                                 key={id}
                    //                                                 className="px-2.5 py-0.5 text-xs bg-purple-200 dark:bg-purple-700 text-purple-800 dark:text-purple-200 rounded-full font-medium"
                    //                                             >
                    //                                                 {role.title || role.name}
                    //                                             </span>
                    //                                         ) : null;
                    //                                     })}
                    //                                 </div>
                    //                                 <button
                    //                                     type="button"
                    //                                     onClick={() => setFieldValue('roles', [])}
                    //                                     className="mr-auto text-xs py-1.5 px-3 rounded-full text-red-500 hover:text-red-600 bg-red-100 hover:bg-red-200 transition-colors font-medium cursor-pointer"
                    //                                 >
                    //                                     پاک کردن همه
                    //                                 </button>
                    //                             </div>
                    //                         )}

                    //                         {/* دکمه‌های اقدام */}
                    //                         <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    //                             <button
                    //                                 type="button"
                    //                                 onClick={() => navigate(-1)}
                    //                                 className="px-6 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-all duration-200 font-medium cursor-pointer"
                    //                             >
                    //                                 انصراف
                    //                             </button>
                    //                             <button
                    //                                 type="submit"
                    //                                 disabled={isSubmitting}
                    //                                 className="relative px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                    //                             >
                    //                                 {isSubmitting ? (
                    //                                     <>
                    //                                         <span>در حال ذخیره...</span>
                    //                                     </>
                    //                                 ) : (
                    //                                     <>
                    //                                         <span>ذخیره نقش‌ها</span>
                    //                                     </>
                    //                                 )}
                    //                             </button>
                    //                         </div>
                    //                     </div>
                    //                 </div>
                    //             </div>
                    //         </Form>
                    //     )}
                    // </Formik>

                    <Formik
                        enableReinitialize={true}
                        initialValues={initialValues}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting, values, setFieldValue, initialValues }) => {

                            const isRolesChanged =
                                [...(values.roles || [])].sort().join(",") !==
                                [...(initialValues.roles || [])].sort().join(",");
                            return (
                                <Form>
                                    <div className="max-w-5xl mx-auto">
                                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-300 dark:border-gray-700 overflow-hidden">

                                            {/* هدر با گرادینت بنفش */}
                                            <div className="relative bg-blue-50 px-6 py-5 select-none">
                                                <div className="relative flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="relative">
                                                            <img
                                                                src={user.avatar_url || '/default-avatar.png'}
                                                                className="w-16 h-16 rounded-full object-cover border-4 border-blue-500/40 shadow-lg"
                                                                alt={user.name}
                                                            />
                                                        </div>
                                                        <div className="text-blue-600">
                                                            <h2 className="text-xl font-bold tracking-tight">
                                                                {user.name}
                                                            </h2>
                                                            <div className="flex items-center gap-3 mt-1">
                                                                <span className="flex items-center gap-1 text-sm">
                                                                    {/* <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                                                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                                                </svg> */}
                                                                    <svg className="w-[18px] h-[18px] fill-transparent">
                                                                        <use xlinkHref="#icon-letter-bold-duotone"></use>
                                                                    </svg>
                                                                    {user.email}
                                                                </span>
                                                                {/* <span className="w-1 h-1 bg-purple-300 rounded-full"></span> */}
                                                                <span className="flex items-center gap-1 text-sm">
                                                                    {/* <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                                                </svg> */}
                                                                    <svg className="w-[18px] h-[18px] fill-transparent">
                                                                        <use xlinkHref="#icon-user-rounded-bold-duotone"></use>
                                                                    </svg>
                                                                    {user.username}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="hidden sm:block">
                                                        <span className="px-3 py-1 bg-blue-100 backdrop-blur-sm text-blue-600 text-xs font-semibold rounded-full border border-blue-600">
                                                            مدیریت نقش‌ها
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* بدنه */}
                                            <div className="p-6 space-y-6">


                                                <div>
                                                    <div className="flex items-center justify-between mb-4 select-none">
                                                        <div className="flex items-center gap-2">
                                                            <div className="p-2 bg-blue-100 dark:bg-purple-900/30 rounded-lg">
                                                                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 fill-transparent">
                                                                    <use xlinkHref="#icon-shield-user-bold-duotone"></use>
                                                                </svg>
                                                            </div>
                                                            <div>
                                                                <h3 className="font-semibold text-gray-800 dark:text-white">
                                                                    نقش‌های کاربر
                                                                </h3>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                    {Array.isArray(allRoles) && allRoles?.filter(r => values.roles?.includes(String(r.id)))?.length} نقش انتخاب شده
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            {allRoles?.length > 0 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={()=>selectAllRoles(values,setFieldValue)}
                                                                    // onClick={() => {
                                                                    //     const allIds = allRoles.map(r => String(r.id));
                                                                    //     const currentIds = values.roles || [];
                                                                    //     if (currentIds.length === allIds.length) {
                                                                    //         setFieldValue('roles', []);
                                                                    //     } else {
                                                                    //         setFieldValue('roles', allIds);
                                                                    //     }
                                                                    // }}
                                                                    className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-all duration-200 font-medium cursor-pointer"
                                                                >
                                                                    {values.roles?.length === allRoles?.length ? 'لغو همه' : 'انتخاب همه'}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {allRoles?.length > 0 ? (
                                                        <div className="bg-gray-50 dark:bg-gray-800/30 rounded-xl p-4 border border-gray-200 dark:border-gray-700 max-h-[140px] overflow-y-auto scrollbar-thin">
                                                            <Checkbox
                                                                name="roles"
                                                                options={allRoles}
                                                                labelKey='title'
                                                                className="mb-0"
                                                                classParentCheckBox="justify-center"
                                                                colorlableitem="text-gray-700 dark:text-gray-300"
                                                                colorcheckitem="checked:bg-blue-600! checked:border-blue-600!"
                                                                colorcheckitemicon="text-white"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 select-none">
                                                            <svg className="w-12 h-12 mx-auto text-blue-400 dark:text-blue-600 mb-3 fill-transparent">
                                                                <use xlinkHref="#icon-shield-cross-bold-duotone"></use>
                                                            </svg>
                                                            <p className="text-gray-500 dark:text-gray-400">هیچ نقشی در سیستم تعریف نشده است</p>
                                                        </div>
                                                    )}
                                                </div>

                                                {Array.isArray(allRoles) && allRoles.length > 0 && values.roles?.length > 0 ? (
                                                    <div className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-700 select-none">
                                                        <div className='p-1 rounded-[5px] bg-blue-100'>
                                                            <svg className="w-18px h-18px text-blue-600 dark:text-blue-400 fill-transparent flex-shrink-0">
                                                                <use xlinkHref="#icon-shield-check-bold-duotone"></use>
                                                            </svg>
                                                        </div>
                                                        <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                                                            نقش‌های انتخاب شده:
                                                        </span>
                                                        {Array.isArray(allRoles) && allRoles.length > 0 && (
                                                            <div className="flex flex-wrap gap-1.5">
                                                                {values.roles.map(id => {
                                                                    const role = allRoles?.find(r => String(r.id) === id);
                                                                    return role ? (
                                                                        <span
                                                                            key={id}
                                                                            className="px-2.5 py-0.5 text-xs bg-blue-100 dark:bg-blue-700 text-blue-700 dark:text-blue-200 rounded-full font-medium"
                                                                        >
                                                                            {role.title || role.name}
                                                                        </span>
                                                                    ) : null;
                                                                })}
                                                            </div>
                                                        )}
                                                        <button
                                                            type="button"
                                                            onClick={() => setFieldValue('roles', [])}
                                                            className="mr-auto text-xs py-1.5 px-3 rounded-full text-red-500 hover:text-red-600 bg-red-100 hover:bg-red-200 transition-colors font-medium cursor-pointer"
                                                        >
                                                            پاک کردن همه
                                                        </button>
                                                    </div>
                                                ) : null}

                                                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 select-none">
                                                    <button
                                                        type="button"
                                                        onClick={() => navigate(-1)}
                                                        className="px-6 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-all duration-200 font-medium cursor-pointer"
                                                    >
                                                        انصراف
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        disabled={isSubmitting || !isRolesChanged}
                                                        className="relative px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                                                    >
                                                        {isSubmitting ? (
                                                            <>
                                                                <span>در حال ذخیره...</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span>ذخیره نقش‌ها</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>



                                            {/* <div className="p-6 space-y-6">
                                                <div className='flex flex-col px-2.5 py-3.5 gap-3 border border-gray-200 rounded-lg'>
                                                    
                                                    <div>
                                                        <div className="flex items-center justify-between mb-4 select-none">
                                                            <div className="flex items-center gap-2">
                                                                <div className="p-2 bg-blue-100 dark:bg-purple-900/30 rounded-lg">
                                                                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 fill-transparent">
                                                                        <use xlinkHref="#icon-shield-user-bold-duotone"></use>
                                                                    </svg>
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-semibold text-gray-800 dark:text-white">
                                                                        نقش‌های کاربر
                                                                    </h3>
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                        {Array.isArray(allRoles) && allRoles?.filter(r => values.roles?.includes(String(r.id)))?.length} نقش انتخاب شده
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                {allRoles?.length > 0 && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={selectAllRoles}
                                                                        // onClick={() => {
                                                                        //     const allIds = allRoles.map(r => String(r.id));
                                                                        //     const currentIds = values.roles || [];
                                                                        //     if (currentIds.length === allIds.length) {
                                                                        //         setFieldValue('roles', []);
                                                                        //     } else {
                                                                        //         setFieldValue('roles', allIds);
                                                                        //     }
                                                                        // }}
                                                                        className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-all duration-200 font-medium cursor-pointer"
                                                                    >
                                                                        {values.roles?.length === allRoles?.length ? 'لغو همه' : 'انتخاب همه'}
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {allRoles?.length > 0 ? (
                                                            <div className="bg-gray-50 dark:bg-gray-800/30 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                                                                <Checkbox
                                                                    name="roles"
                                                                    options={allRoles}
                                                                    labelKey='title'
                                                                    className="mb-0"
                                                                    colorlableitem="text-gray-700 dark:text-gray-300"
                                                                    colorcheckitem="checked:bg-blue-600! checked:border-blue-600!"
                                                                    colorcheckitemicon="text-white"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 select-none">
                                                                <svg className="w-12 h-12 mx-auto text-blue-400 dark:text-blue-600 mb-3 fill-transparent">
                                                                    <use xlinkHref="#icon-shield-cross-bold-duotone"></use>
                                                                </svg>
                                                                <p className="text-gray-500 dark:text-gray-400">هیچ نقشی در سیستم تعریف نشده است</p>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {Array.isArray(allRoles) && allRoles.length > 0 && values.roles?.length > 0 ? (
                                                        <div className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-700 select-none">
                                                            <div className='p-1 rounded-[5px] bg-blue-100'>
                                                                <svg className="w-18px h-18px text-blue-600 dark:text-blue-400 fill-transparent flex-shrink-0">
                                                                    <use xlinkHref="#icon-shield-check-bold-duotone"></use>
                                                                </svg>
                                                            </div>
                                                            <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                                                                نقش‌های انتخاب شده:
                                                            </span>
                                                            {Array.isArray(allRoles) && allRoles.length > 0 && (
                                                                <div className="flex flex-wrap gap-1.5">
                                                                    {values.roles.map(id => {
                                                                        const role = allRoles?.find(r => String(r.id) === id);
                                                                        return role ? (
                                                                            <span
                                                                                key={id}
                                                                                className="px-2.5 py-0.5 text-xs bg-blue-100 dark:bg-blue-700 text-blue-700 dark:text-blue-200 rounded-full font-medium"
                                                                            >
                                                                                {role.title || role.name}
                                                                            </span>
                                                                        ) : null;
                                                                    })}
                                                                </div>
                                                            )}
                                                            <button
                                                                type="button"
                                                                onClick={() => setFieldValue('roles', [])}
                                                                className="mr-auto text-xs py-1.5 px-3 rounded-full text-red-500 hover:text-red-600 bg-red-100 hover:bg-red-200 transition-colors font-medium cursor-pointer"
                                                            >
                                                                پاک کردن همه
                                                            </button>
                                                        </div>
                                                    ) : null}
                                                </div>
                                        
                                                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 select-none">
                                                    <button
                                                        type="button"
                                                        onClick={() => navigate(-1)}
                                                        className="px-6 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-all duration-200 font-medium cursor-pointer"
                                                    >
                                                        انصراف
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        disabled={isSubmitting || !isRolesChanged}
                                                        className="relative px-6 py-2.5 bg-blue-100 hover:bg-blue-200 text-blue-600 hover:text-blue-700 border-[1.4px] border-blue-600 hover:border-blue-700 rounded-xl transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                                                    >
                                                        {isSubmitting ? (
                                                            <>
                                                                <span>در حال ذخیره...</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span>ذخیره نقش‌ها</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div> */}

                                        </div>
                                    </div>
                                </Form>
                            )
                        }}
                    </Formik>
                ) : (
                    <div className="text-center text-gray-500 py-8">
                        کاربری یافت نشد
                    </div>
                )}


            </div>
        </ModalsContainer2 >
    );
}

export default Modal;
