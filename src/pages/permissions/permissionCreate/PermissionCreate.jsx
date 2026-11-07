import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ModalsContainer2 from '@/components/ModalsContainer2';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { toast } from '@/components/Toast/ToastContainer';
import { getSinglrPermissionService } from '@/services/permissions';
import Input2 from '@/components/Form/ui/UnifiedInput';
import Textarea from '@/components/Form/ui/UnifiedTextarea';
import Switch from '@/components/Form/switch';
import { useTableRefresh } from '@/hooks/useTableRefresh';
import { handleSubmit, validationSchema } from './core';

const RoleCreate = () => {
    const navigate = useNavigate();
    const modalRef = useRef(null);
    const { id } = useParams();
    const isEditMode = !!id;
    const { refresh } = useTableRefresh();

    const [loading, setLoading] = useState(false);
    const [permissionName, setPermissionName] = useState('');
    const [data, setData] = useState({});
    const [initialValues, setInitialValues] = useState({
        name: '',
        title: '',
        description: '',
        group: '',
        is_active: true,
    });

    useEffect(() => {
        modalRef.current?.open()
    }, []);

    // دریافت اطلاعات کاربر برای حالت ویرایش
    useEffect(() => {
        if (isEditMode) {
            handleGetPermissionData();
        }
    }, [id]);

    const handleGetPermissionData = async () => {
        setLoading(true);
        try {
            const res = await getSinglrPermissionService(id);
            if (res.status === 200) {
                const permission = res.data.data;
                // console.log(user);

                setPermissionName(permission.title || '');
                setInitialValues({
                    name: permission.name || '',
                    title: permission.title || '',
                    description: permission.description || '',
                    group: permission.group || '',
                    is_active: permission.is_active || true,
                });
                setData(permission)
                // console.log(data);

            }
        } catch (error) {
            console.error('Error fetching permission:', error);
            toast.error('خطا در دریافت اطلاعات مجوز');
        } finally {
            setLoading(false);
        }
    };


    // کامپوننت Skeleton برای حالت Loading
    const SkeletonField = () => (
        <div className="animate-pulse">
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
    );


    const SkeletonTextarea = () => (
        <div className="animate-pulse">
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-24 w-full bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
    );
    const SkeletonButton = () => (
        <div className="animate-pulse">
            {/* <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div> */}
            <div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
    );

    return (
        <Formik
            enableReinitialize={true}
            initialValues={initialValues}
            validationSchema={validationSchema(isEditMode)}
            // validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => handleSubmit(values, setSubmitting, navigate, isEditMode, id, refresh)}
        // onSubmit={handleSubmit}
        >
            {({ isSubmitting, values, setFieldValue, dirty, isValid }) => (
                <Form id='permission-form'>
                    <ModalsContainer2
                        ref={modalRef}
                        id="create_permission_modal"
                        title={isEditMode ? (
                            loading ? (
                                <div className="h-5 w-40 bg-gray-200 animate-pulse rounded"></div>
                            ) : (
                                `ویرایش مجوز: ${permissionName || ""}`
                            )
                        ) : (
                            "افزودن مجوز"
                        )
                        }
                        // fullScreen
                        // isFooter={false}
                        closeFooterButton={false}
                        closeOnOutsideClick={false}
                        width='max-w-5xl'
                        onClose={() => {
                            navigate(-1);
                        }}
                        itemRightToFooter={(
                            loading ? (
                                <>
                                    <div className='flex gap-3'>
                                        <SkeletonButton />
                                        <SkeletonButton />
                                    </div>
                                </>
                            ) : (
                                < >
                                    <div className='flex gap-3'>
                                        <button
                                            type="submit"
                                            form='permission-form'
                                            disabled={isSubmitting || loading || !dirty || !isValid}
                                            className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-blue-600 dark:bg-yellow-500 rounded-lg hover:bg-blue-700 dark:hover:bg-yellow-600 transition duration-150 shadow-lg shadow-indigo-500/30 dark:shadow-yellow-500/30 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
                                                <span>{isEditMode ? 'ویرایش مجوز' : 'ایجاد مجوز'}</span>
                                            )}
                                        </button>

                                        <button
                                            type="button"
                                            // onClick={() => navigate(-1)}
                                            onClick={() => modalRef?.current?.close()}
                                            className="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-150 cursor-pointer"
                                        >
                                            انصراف
                                        </button>
                                    </div>
                                </>
                            )
                        )}
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

                        <div className="space-y-8">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {loading ? (
                                    // حالت Skeleton برای Loading
                                    <>
                                        <SkeletonField />
                                        <SkeletonField />
                                        <SkeletonField />
                                        <SkeletonField />
                                        <SkeletonTextarea />
                                        {/* <SkeletonField /> */}
                                    </>
                                ) : (
                                    // حالت عادی
                                    <>
                                        {/* نام */}
                                        <div>
                                            <Input2
                                                name="name"
                                                label="نام انگلیسی"
                                                placeholder="نام انگلیسی را وارد کنید"
                                                required
                                                icon="icon-shield-keyhole-minimalistic"
                                                iconPosition="right"
                                                clearable
                                                rtl
                                            />
                                        </div>

                                        {/* نام کاربری */}
                                        <div>
                                            <Input2
                                                name="title"
                                                label="نام فارسی"
                                                placeholder="نام فارسی را وارد کنید"
                                                required
                                                icon="icon-shield-keyhole-minimalistic"
                                                iconPosition="right"
                                                clearable
                                                rtl
                                            />
                                        </div>
                                        <div>
                                            <Input2
                                                name="group"
                                                label="نام گروه"
                                                placeholder="نام گروه را وارد کنید"
                                                required
                                                icon="icon-folder-security"
                                                iconPosition="right"
                                                clearable
                                                rtl
                                            />
                                        </div>

                                        {/* فعال/غیرفعال */}
                                        <div className=" flex items-center justify-start">
                                            <Switch
                                                name="is_active"
                                                label="فعال باشد؟"
                                                colorWrapper="bg-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <Textarea
                                                name="description"
                                                label="توضیحات"
                                                placeholder="توضیحات مجوز را وارد کنید"
                                                rows={4}
                                                showCount
                                                maxLength={500}
                                                clearable
                                                icon="icon-file-text"
                                                iconPosition="right"
                                                rtl
                                            />
                                        </div>

                                    </>
                                )}
                            </div>

                            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start"> */}
                            {/* {loading ? (
                                    <>
                                        <SkeletonTextarea />
                                        <SkeletonField />
                                    </> */}
                            {/* ) : (
                                    <> */}

                            {/* فعال/غیرفعال */}
                            {/* <div className="pt-6 flex items-center justify-start">
                                            <Switch
                                                name="is_active"
                                                label="فعال باشد؟"
                                                colorWrapper="bg-blue-500"
                                            />
                                        </div> */}

                            {/* توضیحات */}
                            {/* <Textarea
                                            name="description"
                                            label="توضیحات"
                                            placeholder="توضیحات مجوز را وارد کنید"
                                            rows={4}
                                            showCount
                                            maxLength={500}
                                            clearable
                                            icon="icon-file-text"
                                            iconPosition="right"
                                            rtl
                                        /> */}
                            {/* </> */}
                            {/* )} */}
                            {/* </div> */}

                        </div>

                        {/* <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-start gap-3"> */}
                        {/* {loading ? (
                                <>
                                    <SkeletonButton />
                                    <SkeletonButton />
                                </>
                            ) : (
                            <>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || loading || !dirty || !isValid}
                                    className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-blue-600 dark:bg-yellow-500 rounded-lg hover:bg-blue-700 dark:hover:bg-yellow-600 transition duration-150 shadow-lg shadow-indigo-500/30 dark:shadow-yellow-500/30 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
                                        <span>{isEditMode ? 'ویرایش نقش' : 'ایجاد نقش'}</span>
                                    )}
                                </button>


                                <button
                                    type="button"
                                    // onClick={() => navigate(-1)}
                                    onClick={() => modalRef?.current?.close()}
                                    className="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-150 cursor-pointer"
                                >
                                    انصراف
                                </button>

                            </>
                            )} */}

                        {/* </div> */}


                    </ModalsContainer2 >
                </Form>
            )
            }
        </Formik >
    );
};

export default RoleCreate;