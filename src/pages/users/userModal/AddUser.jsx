// import React, { useEffect, useRef, useState } from 'react';
// import { useLocation, useNavigate, useOutletContext, useParams } from 'react-router-dom';
// import { getAllRolesService, getSinglrUserService } from '../../../services/users';
// import ModalsContainer2 from '@/components/ModalsContainer2';
// import { Formik, Form } from 'formik';
// import { toast } from '@/components/Toast/ToastContainer';
// import Input3 from '@/components/Form/Input3';
// import FileUploaderSimple2 from '@/components/Form/FileUploaderSimple2';
// import Switch from '@/components/Form/switch';
// // import UnifiedSearchableSelect from '@/components/Form/UnifiedSearchableSelect';
// import UnifiedSearchableSelect from '@/components/Form/ui/UnifiedSearchableSelect2';
// // import UnifiedInput from '@/components/Form/ui/UnifiedInput';
// import Input2 from '@/components/Form/ui/UnifiedInput';
// import UnifiedTextarea from '@/components/Form/ui/UnifiedTextarea';
// import { UserStatusOptions } from '@/enums/userStatus';
// import * as Yup from 'yup';
// import UnifiedFileUploader from '@/components/Form/ui/UnifiedFileUploader';
// import UnifiedDatePicker from '@/components/Form/ui/UnifiedDatePicker';
// import UnifiedDateTimePicker from '@/components/Form/ui/UnifiedDateTimePicker';

// const AddUser = () => {
//     const navigate = useNavigate()
//     const modalRef = useRef(null);
//     const [loadingUser, setLoadingUser] = useState(false);


//     const { id } = useParams();
//     const isEditMode = !!id;

//     const [userToEdit, setUserToEdit] = useState(null)
//     // const [allRoles, setAllRoles] = useState([])
//     // const [selectedRoles, setSelectedRoles] = useState([])
//     const [reInitialValues, setReInitialValues] = useState(null)

//     // const handleGetAllRoles = async () => {
//     //     const res = await getAllRolesService();
//     //     if (res.status === 200) {
//     //         setAllRoles(res.data.data.map(r => { return { id: r.id, value: r.title } }));
//     //     }
//     // }

//     const handleGetUserData = async () => {
//         // console.log(id);
//         setLoadingUser(true);

//         const res = await getSinglrUserService(id);
//         if (res.status === 200) {
//             setUserToEdit(res.data.data);
//             // console.log(res.data.data);

//         }
//         setLoadingUser(false);
//     }

//     const handletest = () => {
//         // navigate(-1);
//         modalRef.current?.close(() => {
//             // navigate(-1);
//             toast.success('کاربر ایجاد شد', {
//                 duration: 4000
//             });
//         });
//     }

//     useEffect(() => {
//         // handleGetAllRoles()
//         if (isEditMode) {
//             handleGetUserData()
//         }
//     }, [id])

//     const validationSchema = Yup.object({
//         username: Yup.string().required(
//             'لطفا دسته بندی را انتخاب کنید'
//         ),
//     })

//     // useEffect(() => {
//     //     if (userToEdit) {
//     //         setSelectedRoles(userToEdit.roles.map(r => { return { id: r.id, value: r.title } }))
//     //         const roles_id = userToEdit.roles.map(p => p.id);
//     //         setReInitialValues({
//     //             birth_date: userToEdit.birth_date ? convertDateToJalali(userToEdit.birth_date, 'jD / jM / jYYYY') : "",
//     //             roles_id,
//     //             password: "",
//     //             user_name: userToEdit.user_name || "",
//     //             first_name: userToEdit.first_name || "",
//     //             last_name: userToEdit.last_name || "",
//     //             phone: userToEdit.phone || "",
//     //             email: userToEdit.email || "",
//     //             gender: userToEdit.gender || 1,
//     //             isEditing: true
//     //         })
//     //     }
//     // }, [userToEdit])

//     useEffect(() => {
//         modalRef.current?.open()
//     }, []);
//     // useEffect(() => {
//     //     if (userToEdit || !isEditMode) {
//     //         modalRef.current?.open();
//     //     }
//     // }, [userToEdit, isEditMode]);



//     return (
//         <>
//             <ModalsContainer2
//                 ref={modalRef}
//                 id="add_user_modal"
//                 // title={isEditMode ? `ویرایش کاربر ${userToEdit ? userToEdit.name : null}` : 'افزودن کاربر'}
//                 title={isEditMode ? (
//                     loadingUser ? (
//                         <div className="h-5 w-40 bg-gray-200 animate-pulse rounded"></div>
//                     ) : (
//                         `ویرایش کاربر ${userToEdit?.name || ""}`
//                     )
//                 ) : (
//                     "افزودن کاربر"
//                 )
//                 }
//                 // fullScreen
//                 isFooter={false}
//                 // closeOnOutsideClick = {false}
//                 // width='max-w-xl'
//                 onClose={() => {
//                     navigate(-1);
//                     // toast.success(
//                     //     "کاربر با موفقیت ایجاد شد"
//                     // );
//                 }}
//             >
//                 <div className="container">
//                     <Formik
//                         // initialValues={reInitialValues || initialValues}
//                         // onSubmit={(values, actions) => onSubmit(values, actions, setData, userId)}
//                         validationSchema={validationSchema}
//                         // enableReinitialize
//                         // initialValues={{}}
//                         initialValues={{
//                             username: '',
//                             email: '',
//                             password: '',
//                             time: '',
//                             meetingTime: '',
//                             meetingTime2: '',
//                             meetingTime3: '',
//                             meetingTime: '',
//                             description: '',
//                             testDate: '',
//                             status: '',
//                             status2: [],
//                             is_admin: '',
//                         }}
//                         onSubmit={(values) => {
//                             console.log(values);
//                         }}
//                     >


//                         {
//                             formik => {
//                                 return (
//                                     <Form className='flex justify-center'>
//                                         {/* <div className='grid grid-cols-2 gap-6 items-center'>

//                                             <Input3
//                                                 name="name"
//                                                 label="نام و نام خانوادگی"
//                                                 placeholder="حسین کریمی"
//                                                 required
//                                                 clearable
//                                                 maxLength={50}
//                                                 showCount
//                                             />
//                                             <Input3
//                                                 name="email"
//                                                 label="ایمیل"
//                                                 placeholder="kr@example.com"
//                                                 required
//                                                 clearable
//                                                 maxLength={50}
//                                                 showCount
//                                             />
//                                             <Input3
//                                                 name="username"
//                                                 label="نام کاربری"
//                                                 placeholder="krm65"
//                                                 required
//                                                 clearable
//                                                 maxLength={50}
//                                                 showCount
//                                             />

//                                             <FileUploaderSimple2
//                                                 formik={formik}
//                                                 name="avatar"
//                                                 label="آواتار"
//                                                 // multiple={true}
//                                                 maxFiles={1}
//                                                 accept="image/*"
//                                                 maxSize={5 * 1024 * 1024}
//                                                 placeholder="تصویر کاربر"
//                                             />
//                                             <Switch
//                                                 name="is_admin"
//                                                 label="ادمین باشد؟"
//                                                 colorWrapper='bg-blue-500'
//                                             />

//                                             <UnifiedSearchableSelect
//                                                 name="status"
//                                                 mode="single"
//                                                 label="وضعیت"
//                                                 model={UserStatusOptions}
//                                                 required
//                                                 displayField="title"
//                                                 subField="description"
//                                                 // icon="icon-user"
//                                                 // iconHeader
//                                                 iconItems
//                                                 // iconToField
//                                             />
                                            


//                                         </div> */}
//                                         <div className="p-6 flex flex-col gap-8 w-[950px] justify-center">

//                                             {/* بخش اطلاعات شخصی */}
//                                             <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
//                                                 <h3 className="w-max border-[1.4px] border-custom-blue rounded-md text-custom-blue py-1 px-2 dark:text-white mb-6 flex items-center gap-1">
//                                                     {/* <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                                                     </svg> */}
//                                                     <svg className="w-6 h-6 fill-transparent">
//                                                         <use xlinkHref='#icon-user'></use>
//                                                     </svg>
//                                                     <span className='text-base font-medium'>اطلاعات شخصی</span>

//                                                 </h3>

//                                                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
//                                                     {/* <Input3
//                                                         name="name"
//                                                         label="نام و نام خانوادگی"
//                                                         placeholder="حسین کریمی"
//                                                         required
//                                                         clearable
//                                                         maxLength={50}
//                                                         showCount
//                                                     />

//                                                     <Input3
//                                                         name="email"
//                                                         label="ایمیل"
//                                                         placeholder="kr@example.com"
//                                                         required
//                                                         clearable
//                                                         maxLength={50}
//                                                         showCount
//                                                     />

//                                                     <Input3
//                                                         name="username"
//                                                         label="نام کاربری"
//                                                         placeholder="krm65"
//                                                         required
//                                                         clearable
//                                                         maxLength={50}
//                                                         showCount
//                                                     /> */}
//                                                     {/* <UnifiedSearchableSelect
//                                                             name="status"
//                                                             mode="single"
//                                                             label="وضعیت"
//                                                             model={UserStatusOptions}
//                                                             required
//                                                             displayField="title"
//                                                             subField="description"
//                                                             iconItems
//                                                         /> */}

//                                                     <Input2
//                                                         name="username"
//                                                         label="نام کاربری"
//                                                         placeholder="نام کاربری را وارد کنید"
//                                                         required
//                                                         icon="icon-user"
//                                                         iconPosition="right"
//                                                         iconColor='!text-green-500'
//                                                         iconFocusColor='!text-red-500'
//                                                         iconLabel='icon-user'
//                                                         iconLabelStyle='!text-yellow-500'
//                                                         // helperText="نام کاربری باید حداقل 3 حرف باشد"
//                                                         helperText={(<span className='font-medium'>این خوبه <span className='text-red-500'>محمد جواد</span> اره!</span>)}
//                                                         // maxLength={50}
//                                                         clearable
//                                                         // showCount
//                                                         rtl
//                                                     />

//                                                     <Input2
//                                                         name="time"
//                                                         type="number"
//                                                         label="زمان"
//                                                         placeholder="120"
//                                                         addon="دقیقه"
//                                                         addonPosition="left"
//                                                         addonColor='!text-black'
//                                                         required
//                                                         rtl

//                                                     />
//                                                     <UnifiedFileUploader
//                                                         formik={formik}
//                                                         name="avatar"
//                                                         label="آواتار"
//                                                         multiple={true}
//                                                         maxFiles={3}
//                                                         accept="image/*"
//                                                         maxSize={5 * 1024 * 1024}
//                                                         placeholder="تصویر کاربر"
//                                                     />
//                                                     {/* <UnifiedDatePicker
//                                                         // formik={formik}
//                                                         name="testDate"
//                                                         label="تاریخ تست"

//                                                         yearsLimit={{ from: 80, to: 1 }}
//                                                     // disabled={false}
//                                                     // showYearMonthSelector={true}
//                                                     /> */}
//                                                     <UnifiedDateTimePicker
//                                                         name="meetingTime"
//                                                         label="زمان جلسه"
//                                                         showTime={true}
//                                                         minuteStep={1}
//                                                         yearsLimit={{ from: 80, to: 1 }}
//                                                     />
//                                                     <UnifiedDateTimePicker
//                                                         name="meetingTime2"
//                                                         label="زمان جلسه"
//                                                         placeholder='انتخاب تاریخ'
//                                                         // showTime={true}
//                                                         // minuteStep={15}
//                                                         yearsLimit={{ from: 80, to: 1 }}
//                                                     />
//                                                     <UnifiedDateTimePicker
//                                                         name="meetingTime"
//                                                         label="زمان جلسه"
//                                                         // showTime={true}
//                                                         // minuteStep={15}
//                                                         dateType="gregorian"
//                                                         dateFormat="YYYY-MM-DD"
//                                                         yearsLimit={{ from: 80, to: 1 }}
//                                                     />
//                                                     <UnifiedDateTimePicker
//                                                         name="meetingTime3"
//                                                         label="زمان جلسه"
//                                                         showTime={true}
//                                                         minuteStep={15}
//                                                         showGregorian={true}  // فعال‌سازی نمایش میلادی
//                                                         gregorianMonthFormat="short"  // 'full' | 'short' | 'number'
//                                                         dateType="gregorian"  // خروجی میلادی
//                                                         dateFormat="YYYY-MM-DD"
//                                                         yearsLimit={{ from: 80, to: 1 }}
//                                                     />
//                                                     <UnifiedDateTimePicker
//                                                         name="meetingTime4"
//                                                         label="زمان جلسه"
//                                                         // showTime={true}
//                                                         // minuteStep={15}
//                                                         showGregorian={true}  // فعال‌سازی نمایش میلادی
//                                                         gregorianMonthFormat="full"  // 'full' | 'short' | 'number'
//                                                         // dateType="gregorian"  // خروجی میلادی
//                                                         // dateFormat="YYYY-MM-DD"
//                                                         yearsLimit={{ from: 80, to: 1 }}
//                                                     />
//                                                     <Input2
//                                                         name="email"
//                                                         type="email"
//                                                         label="ایمیل"
//                                                         placeholder="example@domain.com"
//                                                         addon="@"
//                                                         addonPosition="left"
//                                                         addonColor='!text-blue-500'
//                                                         // required
//                                                         rtl
//                                                     />
//                                                     <UnifiedFileUploader
//                                                         formik={formik}
//                                                         name="avatar"
//                                                         label="آواتار"
//                                                         multiple={true}
//                                                         maxFiles={3}
//                                                         accept="image/*"
//                                                         maxSize={5 * 1024 * 1024}
//                                                         placeholder="تصویر کاربر"
//                                                     />
//                                                     <Input2
//                                                         name="password"
//                                                         type="password"
//                                                         label="رمز عبور"
//                                                         placeholder="رمز عبور را وارد کنید"
//                                                         passwordTogglePosition="left"
//                                                         passwordShowIcon='icon-eye'
//                                                         passwordHideIcon='icon-eye-closed'
//                                                         passwordIconColor='!text-red-400'
//                                                         clearable
//                                                         showCount
//                                                         maxLength={20}
//                                                         // required
//                                                         rtl
//                                                     />
//                                                     <UnifiedTextarea
//                                                         name="description"
//                                                         label="توضیحات"
//                                                         placeholder="توضیحات را وارد کنید"
//                                                         rows={5}
//                                                         // required
//                                                         maxLength={500}
//                                                         showCount
//                                                         clearable
//                                                         // helperText="حداکثر 500 کاراکتر"
//                                                         rtl
//                                                     />



//                                                 </div>
//                                             </div>

//                                             {/* بخش تنظیمات حساب کاربری */}
//                                             <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
//                                                 <h3 className="w-max border-[1.4px] border-custom-blue rounded-md text-custom-blue dark:text-white py-1 px-2 mb-6 flex items-center gap-1">
//                                                     {/* <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
//                                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                                                     </svg> */}
//                                                     <svg className="w-6 h-6 fill-transparent">
//                                                         <use xlinkHref='#icon-settings-2'></use>
//                                                     </svg>
//                                                     <span className='text-base font-medium'>تنظیمات حساب</span>

//                                                 </h3>

//                                                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 items-center">
//                                                     <div className="col-span-1">
//                                                         {/* <FileUploaderSimple2
//                                                             formik={formik}
//                                                             name="avatar"
//                                                             label="آواتار"
//                                                             maxFiles={1}
//                                                             accept="image/*"
//                                                             maxSize={5 * 1024 * 1024}
//                                                             placeholder="تصویر کاربر"
//                                                         /> */}
//                                                     </div>


//                                                     <div className="col-span-1">
//                                                         <UnifiedSearchableSelect
//                                                             name="status"
//                                                             mode="single"
//                                                             label="وضعیت"
//                                                             model={UserStatusOptions}
//                                                             required
//                                                             displayField="title"
//                                                             // searchFields={['title', 'description']}
//                                                             // subField="description"
//                                                             // iconItems
//                                                             icon="icon-user"
//                                                             iconToField
//                                                         // clearTop
//                                                         />
//                                                     </div>
//                                                     <div className="col-span-1">
//                                                         <UnifiedSearchableSelect
//                                                             name="status2"
//                                                             mode="multi"
//                                                             label="وضعیت"
//                                                             placeholder='کشورها را انتخاب کنید'
//                                                             model={UserStatusOptions}
//                                                             required
//                                                             displayField="title"
//                                                             subField="description"
//                                                             iconItems
//                                                             maxSelections={2}
//                                                             icon="icon-global"
//                                                             iconToField
//                                                             countBottom
//                                                             clearTop
//                                                         />
//                                                     </div>


//                                                     <div className="col-span-1 flex justify-center">
//                                                         <Switch
//                                                             name="is_admin"
//                                                             label="ادمین باشد؟"
//                                                             colorWrapper='bg-blue-500'
//                                                         />
//                                                     </div>
//                                                 </div>
//                                             </div>

//                                             {/* دکمه‌های اقدام */}
//                                             <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
//                                                 <button
//                                                     type="button"
//                                                     onClick={() => navigate(-1)}
//                                                     className="px-8 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-all duration-200 font-medium cursor-pointer"
//                                                 >
//                                                     انصراف
//                                                 </button>
//                                                 <button
//                                                     type="submit"
//                                                     className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg cursor-pointer"
//                                                 >
//                                                     {isEditMode ? 'ویرایش کاربر' : 'ایجاد کاربر'}
//                                                 </button>
//                                             </div>
//                                         </div>

//                                         {/* <div className="mt-4">

//                                             <button type='button' onClick={() => handletest()}>close</button>
//                                         </div> */}
//                                     </Form>
//                                 )
//                             }
//                         }
//                     </Formik>
//                 </div>

//             </ModalsContainer2>
//         </>
//     );
// }

// export default AddUser;
