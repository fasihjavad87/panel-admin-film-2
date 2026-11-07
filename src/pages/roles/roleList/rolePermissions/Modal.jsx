import React, { useEffect, useRef, useState } from 'react';
import ModalsContainer2 from '@/components/ModalsContainer2';
import { useNavigate, useParams } from 'react-router-dom';
import { getSinglrRoleService } from '@/services/roles';
import { permissionsGetAllService } from '@/services/permissions';
import { roleSyncPermissionService } from '@/services/roles';
import Loading from '@/components/ui/Loading';
import jMoment from "moment-jalaali";
import Checkbox from '@/components/Form/ui/Checkbox';
import { Form, Formik } from 'formik';
import { toast } from '@/components/Toast/ToastContainer';

const Modal = () => {

    const navigate = useNavigate()
    const modalRef = useRef(null);
    const { id } = useParams();
    const [role, setRole] = useState(null);
    const [allPermissions, setAllPermissions] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        modalRef.current?.open()
        handleGetRole()
    }, []);

    const handleGetRole = async () => {
        setLoading(true);
        try {
            const [roleRes, permissionsRes] = await Promise.all([
                getSinglrRoleService(id),
                permissionsGetAllService()
            ]);

            setRole(roleRes.data.data);

            setAllPermissions(permissionsRes.data.data);
            // setAllRoles({});
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }

    }

    const initialValues = {
        // roles: user ? user.roles.map(role => String(role.id)) : []
        permissions: role?.permissions?.map(permission => String(permission.id)) || []
    }

    // const handleSubmit = async (values) => {
    //     await userSyncRoleService(id, {
    //         roles: values.roles.map(Number)
    //     });
    // }
    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            await roleSyncPermissionService(id, {
                permissions: values.permissions.map(Number),
            });

            modalRef.current?.close(() => {
                toast.success("مجوز های نقش با موفقیت بروزرسانی شد", {
                    duration: 4000,
                });
            });

        } catch (error) {
            console.log(error);

            toast.error("خطا در بروزرسانی مجوز ها");
        } finally {
            setSubmitting(false);
        }
    };

    const selectAllPermissions = (values, setFieldValue) => {
        const allIds = allPermissions.map(r => String(r.id));
        const currentIds = values.permissions || [];
        if (currentIds.length === allIds.length) {
            setFieldValue('permissions', []);
        } else {
            setFieldValue('permissions', allIds);
        }
    }


    return (
        <ModalsContainer2
            ref={modalRef}
            id="show_user_modal"
            title={loading ? (
                <div className="h-5 w-40 bg-gray-200 animate-pulse rounded"></div>
            ) : (
                `افزودن مجوز به ${role?.title || ""}`
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
                ) : role ? (
                    <Formik
                        enableReinitialize={true}
                        initialValues={initialValues}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting, values, setFieldValue, initialValues }) => {

                            const isPermissionsChanged =
                                [...(values.permissions || [])].sort().join(",") !==
                                [...(initialValues.permissions || [])].sort().join(",");
                            return (
                                <Form>
                                    <div className="max-w-5xl mx-auto">
                                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-300 dark:border-gray-700 overflow-hidden">

                                            {/* هدر با گرادینت بنفش */}
                                            <div className="relative bg-blue-50 px-6 py-5 select-none">
                                                <div className="relative flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className='flex justify-center items-center w-16 h-16 rounded-full border-4 border-blue-500/40 shadow-lg'>
                                                            <svg className="w-10 h-10 text-blue-600 fill-transparent">
                                                                <use xlinkHref="#icon-shield-user-bold-duotone"></use>
                                                            </svg>
                                                        </div>
                                                        <div className="text-blue-600">
                                                            <h2 className="text-xl font-bold tracking-tight">
                                                                {role.name}
                                                            </h2>
                                                            <div className="flex items-center gap-3 mt-1">
                                                                <span className="flex items-center gap-1 text-sm">
                                                                    {/* <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                                                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                                                </svg> */}
                                                                    {/* <svg className="w-[18px] h-[18px] fill-transparent">
                                                                        <use xlinkHref="#icon-shield-star-bold-duotone"></use>
                                                                    </svg> */}
                                                                    {role.title}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="hidden sm:block">
                                                        <span className="px-3 py-1 bg-blue-100 backdrop-blur-sm text-blue-600 text-xs font-semibold rounded-full border border-blue-600">
                                                            مدیریت مجوزها
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
                                                                    <use xlinkHref="#icon-shield-keyhole-minimalistic-bold-duotone"></use>
                                                                </svg>
                                                            </div>
                                                            <div>
                                                                <h3 className="font-semibold text-gray-800 dark:text-white">
                                                                    مجوزهای نقش
                                                                </h3>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                    {Array.isArray(allPermissions) && allPermissions?.filter(r => values.permissions?.includes(String(r.id)))?.length} مجوزهای انتخاب شده
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            {allPermissions?.length > 0 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={()=>selectAllPermissions(values,setFieldValue)}
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
                                                                    {values.permissions?.length === allPermissions?.length ? 'لغو همه' : 'انتخاب همه'}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {allPermissions?.length > 0 ? (
                                                        <div className="bg-gray-50 dark:bg-gray-800/30 rounded-xl p-4 border border-gray-200 dark:border-gray-700 max-h-[140px] overflow-y-auto scrollbar-thin">
                                                            <Checkbox
                                                                name="permissions"
                                                                options={allPermissions}
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
                                                            <p className="text-gray-500 dark:text-gray-400">هیچ مجوزی در سیستم تعریف نشده است</p>
                                                        </div>
                                                    )}
                                                </div>

                                                {Array.isArray(allPermissions) && allPermissions.length > 0 && values.permissions?.length > 0 ? (
                                                    <div className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-700 select-none">
                                                        <div className='p-1 rounded-[5px] bg-blue-100'>
                                                            <svg className="w-18px h-18px text-blue-600 dark:text-blue-400 fill-transparent flex-shrink-0">
                                                                <use xlinkHref="#icon-shield-check-bold-duotone"></use>
                                                            </svg>
                                                        </div>
                                                        <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                                                            مجوزهای انتخاب شده:
                                                        </span>
                                                        {Array.isArray(allPermissions) && allPermissions.length > 0 && (
                                                            <div className="flex flex-wrap gap-1.5">
                                                                {values.permissions.map(id => {
                                                                    const permission = allPermissions?.find(r => String(r.id) === id);
                                                                    return permission ? (
                                                                        <span
                                                                            key={id}
                                                                            className="px-2.5 py-0.5 text-xs bg-blue-100 dark:bg-blue-700 text-blue-700 dark:text-blue-200 rounded-full font-medium"
                                                                        >
                                                                            {permission.title || permission.name}
                                                                        </span>
                                                                    ) : null;
                                                                })}
                                                            </div>
                                                        )}
                                                        <button
                                                            type="button"
                                                            onClick={() => setFieldValue('permissions', [])}
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
                                                        disabled={isSubmitting || !isPermissionsChanged}
                                                        className="relative px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                                                    >
                                                        {isSubmitting ? (
                                                            <>
                                                                <span>در حال ذخیره...</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span>ذخیره مجوزها</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </Form>
                            )
                        }}
                    </Formik>
                ) : (
                    <div className="text-center text-gray-500 py-8">
                        نقش یافت نشد
                    </div>
                )}


            </div>
        </ModalsContainer2 >
    );
}

export default Modal;
