import React, { useContext, useEffect, useRef, useState } from 'react';
import { useSidebar } from './hooks/useSidebar';
import UserTable from './components/UserTable';
import ModalsContainer from './components/ModalsContainer';
import UserTable2 from './users/User';
import ModalsContainer2 from './components/ModalsContainer2';
import { toast } from './components/Toast/ToastContainer';
import MyComponent from './todos/todo';
import DemoComponent from './todos/todo';
import Input from './components/Form/Input';
import SearchableSelect from './components/Form/SearchableSelect';
import SearchableSelctMulti from './components/Form/SearchableSelectMulti';
import Switch from './components/Form/switch';
import Checkbox from './components/Form/Checkbox';
import Radio from './components/Form/Radio';
import Input2 from './components/Form/Input2';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import UnifiedSearchableSelect from './components/Form/UnifiedSearchableSelect';
import DatePicker from './components/Form/DatePicker';
import jMoment from 'moment-jalaali';
import DatePicker2 from './components/Form/DatePicker2';
import AdvancedDatePicker from './components/Form/DatePicker3';
import FileUploader from './components/Form/FileUploader';
import FileUploaderSimple from './components/Form/FileUploaderSimple';
import Textarea from './components/Form/Textarea';
import Input3 from './components/Form/Input3';
import { openAlertModal } from './components/Modal/modal';
import FileUploaderSimple2 from './components/Form/FileUploaderSimple2';
import AdvancedDatePicker2 from './components/Form/AdvancedDatePicker2';

const Content = () => {
    const { sidebarOpen, setSidebarOpen } = useSidebar();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const modalRef = useRef(null);
    const modalRef2 = useRef(null);
    // console.log(modalRef2);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectedIds, setSelectedIds] = useState([1, 3]);
    const [selectedGender, setSelectedGender] = useState('1');

    const users = [
        { id: 1, title: 'احمد رضایی', e_name: 'Ahmad Rezaei', role: 'مدیر' },
        { id: 2, title: 'سارا محمدی', e_name: 'Sara Mohammadi', role: 'توسعه‌دهنده' },
        { id: 3, title: 'علی کریمی', e_name: 'Ali Karimi', role: 'طراح' },
        { id: 4, title: 'علی رحیمی', e_name: 'Ali Rahimi', role: 'گرافیست' },
        { id: 5, title: 'علی جوادی', e_name: 'Ali Javadi', role: 'کدنویس' },
        { id: 6, title: 'علی حسینی', e_name: 'Ali Hosini', role: 'پژوهش' },
        { id: 7, title: 'mohammad javad fasih', e_name: 'Mohammad Javad Fasih', role: 'طراح اصلی' },
    ];


    const categories = [
        {
            id: 1,
            title: 'فیلم',
            description: 'دسته فیلم‌ها',
        },
        {
            id: 2,
            title: 'سریال',
            description: 'دسته سریال‌ها',
        },
        {
            id: 3,
            title: 'انیمیشن',
            description: 'دسته انیمیشن‌ها',
        },
        {
            id: 4,
            title: 'کمدی',
            description: 'دسته کمدی ها',
        },
        {
            id: 5,
            title: 'ترسناک',
            description: 'دسته ترسناک',
        },
        {
            id: 6,
            title: 'درام',
            description: 'دسته درام ها',
        },
        {
            id: 7,
            title: 'جنایی',
            description: 'دسته جنایی ها',
        },
    ];

    const validationSchema = Yup.object({
        // category_id: Yup.string().required(
        //     'لطفا دسته بندی را انتخاب کنید'
        // ),
        // categories: Yup.array()
        //     .min(1, 'حداقل یک دسته بندی انتخاب کنید')
        //     .required('دسته بندی الزامی است'),
        // permissions: Yup.array()
        //     .min(1, 'حداقل یک دسترسی انتخاب کنید')
        //     .required('دسترسی  الزامی است'),
        // birthDate: Yup.string().required('تاریخ تولد الزامی است'),
        // startDate: Yup.string().required('تاریخ شروع الزامی است'),
        // gallery: Yup.mixed().required('A file is required')
    });


    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        userId: '', // اضافه شد
        isActive: false,
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
        // clear error on change
        if (errors[field]) {
            setErrors({ ...errors, [field]: '' });
        }
    };

    const handleBlur = (field) => {
        setTouched({ ...touched, [field]: true });

        // اعتبارسنجی فیلدها
        if (field === 'name' && !formData.name) {
            setErrors({ ...errors, name: 'نام و نام خانوادگی الزامی است!' });
        }

        if (field === 'userId' && !formData.userId) {
            setErrors({ ...errors, userId: 'لطفاً یک کاربر را انتخاب کنید!' });
        }

        if (field === 'email' && !formData.email.includes('@')) {
            setErrors({ ...errors, email: 'ایمیل درست نیست!' });
        }

        if (field === 'isActive' && !formData.isActive) {
            setErrors(prev => ({ ...prev, isActive: 'این فیلد الزامی است!' }));
        }
    };

    useEffect(() => {

        const timer = setTimeout(() => {
            toast.success('اطلاعات با موفقیت دریافت شد', 'موفق', {
                duration: 5000 // 5 ثانیه
            });
        }, 200);

        return () => clearTimeout(timer)
    }, []);

    const testCloseModal = () => {
        modalRef.current?.close();
    }

    const testToast = () => {
        const toastTest = toast.success('عملیات با موفقیت انجام شد', 'تبریک', {
            duration: 5000 // 5 ثانیه
        });

        // console.log(toastTest);
    }

    return (
        <section
            className={`fixed p-1.5 h-screen custom-scrollbar left-0 overflow-auto transition-[right]  pb-[calc(var(--spacing-app-header-h)+10px)]  top-[calc(var(--spacing-app-header-h)+6px)] right-0 md:right-[calc(var(--spacing-app-sidebar-w)+6px)] ${sidebarOpen ? 'md:right-[calc(var(--spacing-app-sidebar-w)+6px)]' : 'md:right-[calc(var(--spacing-app-sidebar-w-mobile)+6px)]'} `}>
            {/* <div className='p-3'>
                Content
                <button className='py-2 px-5 bg-custom-blue hover:bg-custom-blue-hover transition cursor-pointer rounded-md text-white'>hello</button>
            </div>
            <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt nam dignissimos libero in distinctio et nobis cupiditate a architecto eius nemo blanditiis necessitatibus rerum beatae minus dolor, delectus minima, placeat facilis magni praesentium, ad accusantium asperiores! Deleniti tenetur perferendis iusto quam accusamus laborum dignissimos pariatur dolore! Quas distinctio culpa modi nulla dicta rem, odit voluptate recusandae architecto totam vitae provident. Nemo ducimus, similique dolores, rem voluptate iste ullam aspernatur eius at corrupti reiciendis reprehenderit ad possimus quis quidem? Sint velit ipsa natus amet consequuntur tenetur praesentium, aut magni esse tempore dolor, hic inventore modi! Vero iusto eum recusandae magnam consectetur?</span>
            <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt nam dignissimos libero in distinctio et nobis cupiditate a architecto eius nemo blanditiis necessitatibus rerum beatae minus dolor, delectus minima, placeat facilis magni praesentium, ad accusantium asperiores! Deleniti tenetur perferendis iusto quam accusamus laborum dignissimos pariatur dolore! Quas distinctio culpa modi nulla dicta rem, odit voluptate recusandae architecto totam vitae provident. Nemo ducimus, similique dolores, rem voluptate iste ullam aspernatur eius at corrupti reiciendis reprehenderit ad possimus quis quidem? Sint velit ipsa natus amet consequuntur tenetur praesentium, aut magni esse tempore dolor, hic inventore modi! Vero iusto eum recusandae magnam consectetur?</span>
            <div className='block bg-custom-blue p-2 rounded-sm text-white'>hello</div> */}
            <div className='block'>
                {/* <MyComponent/> */}
                {/* <DemoComponent /> */}
                {/* <button
                    onClick={() => setIsModalOpen(true)}
                    className="mb-4 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md"
                >
                    افزودن سفارش جدید
                </button> */}
                {/* <button
                    onClick={() => modalRef2.current?.open()}
                    className="mb-4 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md"
                >
                    2 افزودن سفارش جدید
                </button> */}
                {/* <button
                    onClick={() => testToast()}
                    className="mb-4 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md"
                >
                    نمایش دیالوگ
                </button> */}

                <div className="max-w-md mx-auto space-y-6">
                    {/* <SearchableSelect
                        name="userId"
                        model={users}
                        value={formData.userId}
                        onChange={(value, name) => handleChange(name, value)}
                        onBlur={(name) => handleBlur(name)} // اضافه شد
                        label="انتخاب کاربر"
                        placeholder="کاربر مورد نظر را انتخاب کنید"
                        searchPlaceholder="جستجوی کاربر..."
                        displayField="title"
                        searchFields={['title', 'e_name']}
                        subField="role"
                        iconToField={true}
                        icon="icon-user"
                        iconItems={true}
                        required={true}
                        error={errors.userId}
                        touched={touched.userId}
                    /> */}

                    {/* <SearchableSelctMulti
                        name="user_ids"
                        model={users}
                        value={selectedUsers}
                        onChange={(value, name) => {
                            setSelectedUsers(value);
                            if (errors[name]) {
                                setErrors({ ...errors, [name]: '' });
                            }
                        }}
                        onBlur={(name) => {
                            setTouched({ ...touched, [name]: true });
                            if (selectedUsers.length === 0) {
                                setErrors({ ...errors, [name]: 'حداقل یک کاربر را انتخاب کنید!' });
                            }
                        }}
                        label="انتخاب کاربران"
                        placeholder="کاربران مورد نظر را انتخاب کنید"
                        searchPlaceholder="جستجوی کاربر..."
                        displayField="title"
                        searchFields={['title', 'e_name']}
                        subField="role"
                        iconToField={true}
                        iconItems={true}
                        icon="icon-user"
                        countTop={true}
                        clearTop={true}
                        countToField={true}
                        maxSelections={2}
                        countBottom={true}
                        required={true}
                        error={errors.user_ids}
                        touched={touched.user_ids}
                    />
                    <p className="mt-4 text-gray-600">
                        کاربر انتخاب شده: {selectedUserId}
                    </p> */}
                </div>

                {/* <UserTable /> */}
                <UserTable2 onAddUser={() => modalRef2.current?.open()} dynamic={false} />
                {isModalOpen && (
                    <ModalsContainer
                        ref={modalRef}
                        className="show"
                        id="add_order_modal"
                        title="جزئیات سفارش"
                        fullScreen={false}  // false for normal mode, true for fullscreen
                        closeFunction={() => setIsModalOpen(false)}
                    >
                        <button onClick={testCloseModal}
                            className='px-4 py-2 bg-custom-blue text-white rounded-md hover:bg-blue-700 transition'>
                            بستن مودال
                        </button>
                        {/* <UserTable /> */}
                        {/* <UserTable2 dynamic={false} /> */}
                        {/* <div className="space-y-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-semibold text-gray-800 mb-3">محتوای مودال</h3>
                                <p className="text-gray-600">این یک تست از مودال هستش</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-semibold text-gray-800 mb-3">بخش دوم</h3>
                                <p className="text-gray-600">محتوای بیشتر...</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-semibold text-gray-800 mb-3">بخش سوم</h3>
                                <p className="text-gray-600">محتوای بیشتر...</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-semibold text-gray-800 mb-3">بخش سوم</h3>
                                <p className="text-gray-600">محتوای بیشتر...</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-semibold text-gray-800 mb-3">بخش سوم</h3>
                                <p className="text-gray-600">محتوای بیشتر...</p>
                            </div>
                        </div> */}
                    </ModalsContainer>
                )}

                <ModalsContainer2
                    ref={modalRef2}
                    // className="show"
                    id="add_order_modal"
                    title="جزئیات سفارش"
                    // fullScreen={true}  // false for normal mode, true for fullscreen
                    // closeOnOutsideClick = {false}
                    // isFooter={false}
                    // width='max-w-xl'
                // closeFunction={() => setIsModalOpen(false)}
                // navigateTo={-1}
                >
                    {/* <UserTable2 onAddUser={() => setIsModalOpen(true)} dynamic={false} /> */}
                    {/* <button onClick={()=> modalRef2.current?.close()} className='px-4 py-2 bg-red-500 text-white rounded-md hover:bg-blue-700 transition'>
                            بستن مودال
                        </button> */}
                    <div className=" mx-auto space-y-6">
                        {/* Normal Input with Icon */}
                        {/* <Input
                            label="نام و نام خانوادگی"
                            name="name"
                            value={formData.name}
                            onChange={(val) => handleChange('name', val)}
                            onBlur={() => handleBlur('name')}
                            error={errors.name}
                            touched={touched.name}
                            required
                            icon={
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            }
                        /> */}

                        <Input2
                            name="email"
                            type="email"
                            label="آدرس ایمیل"
                            placeholder="example@domain.com"
                            value={formData.email}
                            onChange={(val) => handleChange('email', val)}
                            error={errors.email}
                            touched={touched.email}
                            onBlur={(name, value) => handleBlur(name)}
                            required
                            requiredColor='text-blue-500'
                        />
                        <Input2
                            name="phone"
                            label="شماره تلفن"
                            placeholder="919-714-3425"
                            icon="icon-user"
                            iconPosition="right"
                            addon="+98"
                            addonPosition="left"
                            mask="phone"
                            maxLength={10}
                        // readOnly
                        />
                        <Input2
                            name="card"
                            label="شماره کارت"
                            placeholder="1234-5678-9012-3456"
                            icon="icon-cart-large"
                            iconPosition="left"
                            iconFocusColor='!text-red-500'
                            mask="card_number"
                            maxLength={16}  // حالا فقط 16 رقم رو محدود می‌کنه
                            onChange={(value, name) => {
                                value
                            }}
                        />
                        <Input2
                            name="nationalCode"
                            label="کد ملی"
                            mask="national_code"
                            maxLength={10}
                            placeholder="123-4567890"
                            onChange={(value) => value}
                        />

                        <Input2
                            name="password"
                            type="password"
                            label="رمز عبور"
                            passwordTogglePosition="right"
                        />

                        <Input2
                            type="textarea"
                            name="description"
                            label="توضیحات"
                            rows={5}
                            maxLength={200}
                            iconLabel="icon-user"
                            iconLabelStyle="text-indigo-500"
                        />

                        <Input2
                            name="custom"
                            label="فیلد سفارشی"
                            variant="filled"
                            size="lg"
                            rounded="xl"
                            inputClass="!border-violet-500 focus:!ring-violet-500"
                            labelColor="!text-violet-700"
                        />


                        <Formik
                            initialValues={{
                                permissions: [],
                                gender: '1',
                                category_id: '',
                                categories: [],
                                testDate: '',      
                                birthDate: '',      // تاریخ تولد
                                startDate: '1400/6/15',  // تاریخ شروع با مقدار پیش‌فرض
                                title: '',
                                avatar: null,
                                gallery: [],
                                galleryVideo: [],
                                gallery2: [],
                                gallery3: [],
                            }}
                            validationSchema={validationSchema}
                            onSubmit={(values) => {
                                // const birthDateMiladi = jMoment(values.birthDate, 'jYYYY/jM/jD').format('YYYY/MM/DD');
                                // const startDateMiladi = jMoment(values.startDate, 'jYYYY/jM/jD').format('YYYY/MM/DD');
                                // console.log('تاریخ میلادی:', birthDateMiladi);
                                // console.log('تاریخ تولد میلادی:', startDateMiladi);
                                // console.log(values.birthDate);
                                console.log(values);
                                // modalRef2.current?.close();
                            }}
                        >
                            {(formik) => (
                                <Form>
                                    <Checkbox
                                        name="permissions"
                                        label="دسترسی‌ها"
                                        // required
                                        options={[
                                            { id: 1, title: "افزودن" },
                                            { id: 2, title: "ویرایش" },
                                            { id: 3, title: "حذف" },
                                            { id: 4, title: "کاربر ادمین اصلی" },
                                            { id: 5, title: "ادمین" },
                                            { id: 6, title: "نویسنده" },
                                        ]}
                                        colorcheckitem="!border-[1.4px] !border-blue-500 checked:!bg-blue-500 checked:!border-blue-500"
                                    />

                                    <Radio
                                        name="gender"
                                        label="جنسیت"
                                        options={[
                                            { id: 1, title: 'مرد' },
                                            { id: 2, title: 'زن' },
                                        ]}
                                        colorradioitem="!border-[1.4px] !border-blue-500 checked:!bg-blue-500 checked:!border-blue-600"
                                        colorradioitemicon="!text-white"
                                        colorlableitem="!text-black"
                                    />

                                    {/* <SearchableSelect
                                    name="category_id"
                                    label="دسته بندی"
                                    model={categories}
                                    required
                                    searchable={false}
                                    iconItems
                                    icon='icon-user'
                                    iconToField
                                    iconHeader
                                    subField="description"
                                    // subToField
                                    placeholder="انتخاب دسته بندی"
                                    searchPlaceholder="جستجو دسته بندی..."
                                /> */}

                                    {/* <SearchableSelctMulti
                                    name="categories"
                                    label="دسته بندی ها"
                                    model={categories}
                                    searchable={true}
                                    searchFields={[
                                        'title',
                                        'e_name'
                                    ]}
                                    displayField="title"
                                    subField="description"
                                    placeholder="انتخاب دسته بندی"
                                    searchPlaceholder="جستجو..."
                                    required={true}
                                    icon="icon-dashboard"
                                    iconHeader
                                    iconItems={true}
                                    iconToField={true}
                                    countTop={true}
                                    countBottom={true}
                                    countToField={true}
                                    clearTop={true}
                                    maxSelections={2}
                                /> */}

                                    <div className='flex flex-col gap-3.5 max-w-md pb-4'>
                                        <UnifiedSearchableSelect
                                            name="category_id"
                                            mode="single"
                                            label="دسته بندی"
                                            model={categories}
                                            // required
                                            displayField="title"
                                            subField="description"
                                            icon="icon-user"
                                            iconHeader
                                            iconItems
                                            iconToField
                                        />

                                        <UnifiedSearchableSelect
                                            name="categories"
                                            mode="multi"
                                            label="دسته بندی ها"
                                            model={categories}
                                            searchable
                                            // required
                                            maxSelections={5}
                                            countTop
                                            countBottom
                                            countToField
                                            clearTop
                                            icon="icon-dashboard"
                                            iconHeader
                                            iconItems={true}
                                            iconToField={true}
                                        />


                                        {/* <DatePicker
                                            formik={formik}
                                            name="birthDate"
                                            label="تاریخ تولد"
                                            placeholder="تاریخ تولد خود را انتخاب کنید"
                                            yearsLimit={{ from: 80, to: 0 }}  // 80 سال قبل، 5 سال بعد
                                            required={true}
                                        />

                                        <DatePicker
                                            formik={formik}
                                            name="startDate"
                                            label="تاریخ شروع"
                                            // initialDate="1403/10/20"  // مقدار پیش‌فرض
                                            yearsLimit={{ from: 10, to: 10 }}  // 10 سال قبل، 50 سال بعد
                                        /> */}
                                        <DatePicker2
                                            formik={formik}
                                            name="birthDate"
                                            label="تاریخ تولد"
                                            placeholder="تاریخ تولد خود را انتخاب کنید"
                                            yearsLimit={{ from: 80, to: 0 }}
                                        // required={true}
                                        // toDay={true}
                                        />

                                        <DatePicker2
                                            formik={formik}
                                            name="startDate"
                                            label="تاریخ شروع"
                                            // initialDate="1403/10/20"
                                            yearsLimit={{ from: 10, to: 10 }}
                                        />

                                        <AdvancedDatePicker
                                            formik={formik}
                                            name="birthDate"
                                            label="تاریخ تولد"
                                            // required={true}
                                            yearsLimit={{ from: 80, to: 0 }}
                                            clearable={true}
                                            closeOnSelect={false}
                                            showTodayButton={true}
                                        // toDay={true}
                                        />

                                        <AdvancedDatePicker

                                            formik={formik}
                                            name="startDate"
                                            label="تاریخ شروع"
                                            disabled={false}
                                            showYearMonthSelector={true}
                                        />
                                        <AdvancedDatePicker2

                                            formik={formik}
                                            name="testDate"
                                            label="تاریخ تست"

                                            yearsLimit={{ from: 80, to: 0 }}
                                            // disabled={false}
                                            // showYearMonthSelector={true}
                                        />

                                        <FileUploader
                                            formik={formik}
                                            name="avatar"
                                            label="آواتار"
                                            multiple={false}
                                            accept="image/jpeg,image/png,image/gif"
                                            maxSize={2 * 1024 * 1024} // 2MB
                                        // required={true}
                                        // onUploadSuccess={(file) => console.log('آپلود شد:', file.name)}
                                        // onUploadError={(error) => console.error('خطا:', error)}
                                        />

                                        <FileUploader
                                            formik={formik}
                                            name="gallery"
                                            label="گالری تصاویر"
                                            multiple={true}
                                            maxFiles={10}
                                            accept="image/*"
                                            maxSize={5 * 1024 * 1024} // 5MB
                                            previewSize="w-32 h-32"
                                            // placeholder="تصاویر خود را اینجا بکشید یا کلیک کنید"
                                            // onUploadSuccess={(file) => console.log('آپلود شد:', file.name)}
                                            aggregateSuccessAlerts={true}
                                            onUploadSuccess={(filesArray) => {
                                                // اینجا filesArray یک آرایه از فایل‌های جدید است
                                                openAlertModal({
                                                    title: 'فایل‌ها آپلود شدند',
                                                    message: `${filesArray.length} فایل با موفقیت آپلود شد`,
                                                    // message: `فایل ${filesArray.lenght} با موفقیت آپلود شد`,
                                                    confirmText: 'باشه',
                                                    variant: 'success'
                                                });
                                            }}
                                        />
                                        <FileUploader
                                            formik={formik}
                                            name="galleryVideo"
                                            label="گالری تصاویر"
                                            multiple={true}
                                            maxFiles={10}
                                            accept="video/*"
                                            maxSize={100 * 1024 * 1024} // 5MB
                                            previewSize="w-32 h-32"
                                            placeholder="تصاویر خود را اینجا بکشید یا کلیک کنید"
                                        // onUploadSuccess={(file) => console.log('آپلود شد:', file.name)}
                                        />

                                        <FileUploaderSimple
                                            formik={formik}
                                            name="gallery2"
                                            label="گالری تصاویر"
                                            multiple={true}
                                            maxFiles={10}
                                            accept="image/*,video/mp4"
                                            maxSize={5 * 1024 * 1024}
                                            placeholder="تصاویر یا ویدیوهای خود را انتخاب کنید"
                                            // onUploadSuccess={(file) => console.log('آپلود شد:', file.name)}
                                            // onUploadSuccess={(file) => openAlertModal({
                                            //     title: 'فایل آپلود شد',
                                            //     message: `فایل ${file.name} با موفقیت آپلود شد`,
                                            //     confirmText: 'باشه',
                                            //     variant: 'warning'
                                            // })}
                                            aggregateSuccessAlerts={true}
                                            onUploadSuccess={(filesArray) => {
                                                // اینجا filesArray یک آرایه از فایل‌های جدید است
                                                openAlertModal({
                                                    title: 'فایل‌ها آپلود شدند',
                                                    message: `${filesArray.length} فایل با موفقیت آپلود شد`,
                                                    // message: `فایل ${filesArray.name} با موفقیت آپلود شد`,
                                                    confirmText: 'باشه',
                                                    variant: 'success'
                                                });
                                            }}
                                        />
                                        <FileUploaderSimple2
                                            formik={formik}
                                            name="gallery3"
                                            label="گالری تصاویر"
                                            multiple={true}
                                            maxFiles={10}
                                            accept="image/*,video/mp4"
                                            maxSize={5 * 1024 * 1024}
                                            placeholder="تصاویر یا ویدیوهای خود را انتخاب کنید"
                                            // onUploadSuccess={(file) => console.log('آپلود شد:', file.name)}
                                            // onUploadSuccess={(file) => openAlertModal({
                                            //     title: 'فایل آپلود شد',
                                            //     message: `فایل ${file.name} با موفقیت آپلود شد`,
                                            //     confirmText: 'باشه',
                                            //     variant: 'warning'
                                            // })}
                                            // aggregateSuccessAlerts={true}
                                            // onUploadSuccess={(filesArray) => {
                                            //     // اینجا filesArray یک آرایه از فایل‌های جدید است
                                            //     openAlertModal({
                                            //         title: 'فایل‌ها آپلود شدند',
                                            //         message: `${filesArray.length} فایل با موفقیت آپلود شد`,
                                            //         // message: `فایل ${filesArray.name} با موفقیت آپلود شد`,
                                            //         confirmText: 'باشه',
                                            //         variant: 'success'
                                            //     });
                                            // }}
                                        />


                                        <Textarea
                                            name="description"
                                            label="توضیحات"
                                            placeholder="متن خود را وارد کنید..."
                                            rows={5}
                                        />

                                        {/* // با required */}
                                        <Textarea
                                            name="bio"
                                            label="بیوگرافی"
                                            // required={true}
                                            rows={6}
                                            icon="#icon-user"
                                        />

                                        {/* // با محدودیت کاراکتر و شمارنده */}
                                        <Textarea
                                            name="comment"
                                            label="نظر"
                                            maxLength={200}
                                            showCount={true}
                                            rows={3}
                                        />

                                        {/* // استایل filled */}
                                        <Textarea
                                            name="address"
                                            label="آدرس"
                                            variant="filled"
                                            rows={4}
                                        />
                                        <Textarea
                                            name="description"
                                            label="توضیحات"
                                            placeholder="متن خود را وارد کنید..."
                                            rows={5}
                                            // required={true}
                                            maxLength={500}
                                            showCount={true}
                                            className="mb-4"
                                        />

                                        <Textarea
                                            name="bio"
                                            label="بیوگرافی"
                                            icon="#icon-user"
                                            rows={6}
                                            clearable={true}
                                        />
                                        <Input3
                                            name="title"
                                            label="عنوان"
                                            placeholder="عنوان را وارد کنید"
                                            // required
                                            clearable
                                            maxLength={100}
                                            showCount
                                        />

                                        <Switch
                                            name="status"
                                            label="فعال باشد؟"
                                            colorWrapper='bg-blue-500'
                                        />
                                    </div>


                                    <button type="submit">
                                        ثبت
                                    </button>
                                </Form>
                            )}
                        </Formik>

                        {/* <Switch
                            name="isActive"
                            label="وضعیت فعال"
                            value={formData.isActive}
                            onChange={(value, name) => handleChange(name, value)}
                            onBlur={(name) => handleBlur(name)}
                            required={true}
                            error={errors.isActive}
                            touched={touched.isActive}
                            // color='yellow'
                            colorWrapper='bg-custom-blue dark:bg-custom-blue'
                            // colorToggle='bg-yellow-500 dark:bg-yellow-400'
                            // disabled={true}
                        />

                        <Checkbox
                            name="myOptions"
                            label="انتخاب گزینه‌ها"
                            options={[
                                { id: 1, title: 'گزینه اول' },
                                { id: 2, title: 'گزینه دوم' },
                                { id: 3, title: 'گزینه سوم' }
                            ]}
                            value={selectedIds}  // آرایه‌ای از idهای انتخاب شده، مثل [1, 3]
                            onChange={(e) => setSelectedIds(e.target.value)} // e.target.value آرایه جدید است
                            className="my-4"
                            colorcheckitem="!border-[1.4px] !border-violet-500 checked:!bg-violet-500 checked:!border-violet-500"
                        />

                        <Radio
                            name="gender"
                            label="انتخاب جنسیت"
                            options={[
                                { id: 1, title: 'مرد' },
                                { id: 2, title: 'زن' },
                                { id: 3, title: 'سایر' }
                            ]}
                            value={selectedGender}
                            onChange={(e) => setSelectedGender(e.target.value)}
                            className="my-4"
                            colorradioitem="!border-[1.4px] !border-violet-500 checked:!bg-violet-500 checked:!border-violet-800"
                            colorradioitemicon="!text-white"
                            colorlableitem="!text-black"
                        /> */}

                        {/* Floating Label Input */}
                        {/* <Input
                            variant="floating"
                            label="آدرس ایمیل"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={(val) => handleChange('email', val)}
                            onBlur={() => handleBlur('email')}
                            error={errors.email}
                            touched={touched.email}
                            helpText="We'll never share your email"
                            required
                            className='r-dir'
                        /> */}

                        {/* Different Sizes */}
                        {/* <Input
                            label="Small Input"
                            size="sm"
                            placeholder="Small size"
                        /> */}

                        {/* <Input
                            label="Large Input"
                            size="lg"
                            placeholder="Large size"
                        /> */}

                        {/* Disabled State */}
                        {/* <Input
                            label="Disabled Input"
                            value="Can't edit this"
                            disabled
                        /> */}
                    </div>
                </ModalsContainer2>
            </div>
        </section>
    );
}

export default Content;
