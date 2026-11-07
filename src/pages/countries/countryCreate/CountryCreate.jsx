import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ModalsContainer2 from '@/components/ModalsContainer2';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { toast } from '@/components/Toast/ToastContainer';
import { getSinglrCountryService } from '@/services/countries';
import Input2 from '@/components/Form/ui/UnifiedInput';
import Textarea from '@/components/Form/ui/UnifiedTextarea';
import Switch from '@/components/Form/switch';
import { useTableRefresh } from '@/hooks/useTableRefresh';
import { SkeletonField, SkeletonButton } from '@/components/Form/ui/Skeleton';
import { handleSubmit, validationSchema } from './core';

const CountryCreate = () => {
    const navigate = useNavigate();
    const modalRef = useRef(null);
    const { id } = useParams();
    const isEditMode = !!id;
    const { refresh } = useTableRefresh();

    const [loading, setLoading] = useState(false);
    const [countryName, setCountryName] = useState('');
    const [data, setData] = useState({});
    const [initialValues, setInitialValues] = useState({
        name: '',
        e_name: '',
        code: '',
    });

    useEffect(() => {
        modalRef.current?.open()
    }, []);

    // دریافت اطلاعات کاربر برای حالت ویرایش
    useEffect(() => {
        if (isEditMode) {
            handleGetCountryData();
        }
    }, [id]);

    const handleGetCountryData = async () => {
        setLoading(true);
        try {
            const res = await getSinglrCountryService(id);
            if (res.status === 200) {
                const country = res.data.data;
                // console.log(user);

                setCountryName(country.name || '');
                setInitialValues({
                    name: country.name || '',
                    e_name: country.e_name || '',
                    code: country.code || '',
                });
                setData(country)
                // console.log(data);

            }
        } catch (error) {
            console.error('Error fetching country:', error);
            toast.error('خطا در دریافت اطلاعات کشور');
        } finally {
            setLoading(false);
        }
    };


    // کامپوننت Skeleton برای حالت Loading
    // const SkeletonField = () => (
    //     <div className="animate-pulse">
    //         <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
    //         <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
    //     </div>
    // );


    // const SkeletonTextarea = () => (
    //     <div className="animate-pulse">
    //         <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
    //         <div className="h-24 w-full bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
    //     </div>
    // );
    // const SkeletonButton = () => (
    //     <div className="animate-pulse">
    //         {/* <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div> */}
    //         <div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
    //     </div>
    // );

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
                <Form id='category-form'>
                    <ModalsContainer2
                        ref={modalRef}
                        id="create_country_modal"
                        title={isEditMode ? (
                            loading ? (
                                <div className="h-5 w-40 bg-gray-200 animate-pulse rounded"></div>
                            ) : (
                                `ویرایش کشور: ${countryName || ""}`
                            )
                        ) : (
                            "افزودن کشور"
                        )
                        }
                        // fullScreen
                        // isFooter={false}
                        closeFooterButton={false}
                        closeOnOutsideClick={false}
                        // width='max-w-5xl'
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
                                            form='category-form'
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
                                                <span>{isEditMode ? 'ویرایش کشور' : 'ایجاد کشور'}</span>
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
                                    </>
                                ) : (
                                    // حالت عادی
                                    <>
                                        {/* نام */}
                                        <div>
                                            <Input2
                                                name="name"
                                                label="نام"
                                                placeholder="نام کشور را وارد کنید"
                                                required
                                                icon="icon-library"
                                                iconPosition="right"
                                                clearable
                                                rtl
                                            />
                                        </div>

                                        {/* نام کاربری */}
                                        <div>
                                            <Input2
                                                name="e_name"
                                                label="نام انگلیسی"
                                                placeholder="نام انگلیسی کشور را وارد کنید"
                                                required
                                                icon="icon-library"
                                                iconPosition="right"
                                                clearable
                                                rtl
                                            />
                                        </div>
                                        <div>
                                            <Input2
                                                name="code"
                                                label="کد"
                                                placeholder="کد کشور را وارد کنید"
                                                required
                                                icon="icon-library"
                                                iconPosition="right"
                                                clearable
                                                rtl
                                            />
                                        </div>

                                    </>
                                )}
                            </div>

                        </div>
                    </ModalsContainer2 >
                </Form>
            )
            }
        </Formik >
    );
};

export default CountryCreate;