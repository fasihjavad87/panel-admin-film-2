import { FastField, Form, Formik } from 'formik';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Switch from '@/components/Form/switch'
import * as Yup from 'yup';
import { toast } from '@/components/Toast/ToastContainer';
import { loginService } from '@/services/auth';
// import { duration } from 'moment-jalaali';
import { useDispatch } from 'react-redux';
import { receiveUserResponse } from '@/redux/user/userSlice';


// // const initialValues = {
// //     email: '',
// //     password: '',
// //     remember: false,
// // }

// // const onSubmit = async (values, submitMethods, navigate) => {
// //     try {
// //         // console.log('ok');

// //         const res = await loginService(values)
// //         if (res.status == 200) {
// //             localStorage.setItem('loginToken', JSON.stringify(res.data.token))
// //             // console.log(res);


// //             // const timer = setTimeout(() => {
// //             //     toast.success('اطلاعات با موفقیت دریافت شد', 'موفق', {
// //             //         duration: 5000 // 5 ثانیه
// //             //     });
// //             // }, 200);

// //             // clearTimeout(timer)
// //             // setTimeout(() => {
// //             //     toast.success('شما با موفقیت وارد شدید', 'موفق');
// //             // }, 200);
// //             toast.success('کاربر ایجاد شد', {
// //                 duration: 4000
// //             });
// //             navigate('/');
// //         } else {
// //             // const timer = setTimeout(() => {
// //             //     toast.error(res.data.message, 'خطا', {
// //             //         duration: 5000 // 5 ثانیه
// //             //     });
// //             // }, 200);

// //             // clearTimeout(timer)
// //             // setTimeout(() => {
// //                 toast.success(res.data.message, {
// //                     title: 'خطا',
// //                     duration: 4000
// //                 });
// //             // }, 200);
// //         }
// //         submitMethods.setSubmitting(false);
// //     } catch (error) {
// //         submitMethods.setSubmitting(false);
// //         // const timer = setTimeout(() => {
// //         //     toast.error('متاسفانه مشکلی از سمت سرور رخ داده', 'خطا', {
// //         //         duration: 5000 // 5 ثانیه
// //         //     });
// //         // }, 200);

// //         // clearTimeout(timer)
// //         // setTimeout(() => {
// //             toast.success('متاسفانه مشکلی از سمت سرور رخ داده', {
// //                 title: 'خطا',
// //                 duration: 4000
// //             });
// //         // }, 200);
// //     }
// // }

// // const validationSchema = Yup.object({
// //     email: Yup.string().required("این فیلد الزامی است"),
// //     password: Yup.string().required('این فیلد الزامی است').matches(/^[a-zA-Z0-9@!%$?&]+$/, "فقط از حروف و اعداد استفاده شود"),
// //     remember: Yup.boolean(),
// // })


const Login = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();


    const initialValues = {
        email: '',
        password: '',
        remember: false,
    }

    const onSubmit = async (values, { setSubmitting, resetForm }) => {

        try {
            const res = await loginService(values);

            localStorage.setItem('loginToken', JSON.stringify(res.data.token));
            dispatch(
                receiveUserResponse({
                    user: res.data.user,
                    token: res.data.token,
                })
            );

            toast.success('با موفقیت وارد شدید', {
                duration: 4000,
            });

            navigate('/', { replace: true });

        } catch (error) {
            // خطاها رو interceptor هندل می‌کنه
            console.log(error);
        } finally {
            // همیشه اجرا میشه
            setSubmitting(false);
            resetForm(); // فرم کامل خالی میشه
        }

    };


    const validationSchema = Yup.object({
        email: Yup.string().email('ایمیل معتبر وارد کنید').required("این فیلد الزامی است"),
        password: Yup.string().required('این فیلد الزامی است').matches(/^[a-zA-Z0-9@!%$?&]+$/, "فقط از حروف و اعداد استفاده شود"),
        remember: Yup.boolean(),
    })

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
        >
            {({ isSubmitting, isValid, dirty }) => (
                <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white shadow-xl p-8">
                        <h1 className="text-2xl font-bold text-center mb-2">
                            ورود به پنل مدیریت
                        </h1>

                        <p className="text-sm text-slate-500 text-center mb-8">
                            لطفا اطلاعات حساب کاربری خود را وارد کنید
                        </p>


                        <Form className='space-y-5'>

                            <div>
                                <label className="block mb-2 text-sm font-medium text-slate-700">
                                    ایمیل
                                </label>

                                <FastField
                                    type="text"
                                    name="email"
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-medium text-slate-700">
                                    رمز عبور
                                </label>

                                <FastField
                                    type="password"
                                    name="password"
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                />
                            </div>

                            <Switch
                                name="remember"
                                label="مرا بخاطر بسپارید"
                                colorWrapper="bg-blue-500"
                            />

                            {/* <button
                                type="submit"
                                className="w-full rounded-xl bg-blue-600 py-3 text-white font-medium transition hover:bg-blue-700 active:scale-[0.98]"
                            >
                                ورود
                            </button> */}
                            <button
                                type="submit"
                                disabled={!dirty || !isValid || isSubmitting}
                                className={`w-full rounded-xl py-3 text-white font-medium transition
                                    ${!dirty || !isValid || isSubmitting
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'
                                    }
                                `}
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                        <span>در حال ورود...</span>
                                    </div>
                                ) : (
                                    'ورود'
                                )}
                            </button>
                        </Form>
                    </div>
                </div>
            )}
        </Formik>
    );
}

export default Login;
