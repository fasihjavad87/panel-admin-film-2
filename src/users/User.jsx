// components/UserTable.jsx
import React, { useEffect, useState } from 'react';
// import PaginatedDataTable2 from './';
import UserActions from './UserActions';
import PaginatedDataTable2 from '../components/UserTable2';
import PaginatedDataTable3 from '../components/TableComponent/PaginatedDataTable3';
import { openAlertModal, openConfirmModal } from '../components/Modal/modal';

const UserTable2 = ({ dynamic = false, onAddUser }) => {
    // دیتای استاتیک (برای زمانیکه dynamic=false)
    const [staticUsers] = useState([
        { id: 1, name: 'علی رضایی', email: 'ali@example.com', role: 'مدیر', status: 'active', lastLogin: '۱۴۰۳/۰۲/۱۵', avatar: '👨‍💼' },
        { id: 2, name: 'سارا محمدی', email: 'sara@example.com', role: 'نویسنده', status: 'active', lastLogin: '۱۴۰۳/۰۲/۱۴', avatar: '👩‍💻' },
        { id: 3, name: 'رضا کریمی', email: 'reza@example.com', role: 'کاربر عادی', status: 'inactive', lastLogin: '۱۴۰۳/۰۲/۱۰', avatar: '👨‍🎨' },
        { id: 4, name: 'مریم حسینی', email: 'maryam@example.com', role: 'مدیر', status: 'active', lastLogin: '۱۴۰۳/۰۲/۱۲', avatar: '👩‍🔧' },
        { id: 5, name: 'احمد نوری', email: 'ahmad@example.com', role: 'کاربر عادی', status: 'blocked', lastLogin: '۱۴۰۳/۰۲/۰۵', avatar: '👨‍🌾' },
        { id: 6, name: 'زهرا کاظمی', email: 'zahra@example.com', role: 'نویسنده', status: 'active', lastLogin: '۱۴۰۳/۰۲/۱۳', avatar: '👩‍🎓' },
        { id: 7, name: 'حسین مرادی', email: 'hossein@example.com', role: 'کاربر عادی', status: 'inactive', lastLogin: '۱۴۰۳/۰۲/۰۸', avatar: '👨‍🚀' },
        { id: 8, name: 'محمد جواد فصیح', email: 'fasihjavad99@example.com', role: 'مدیر', status: 'active', lastLogin: '۱۴۰۳/۰۲/۰۸', avatar: '👩‍🔧' },
        { id: 9, name: 'علی فصیح', email: 'ali9F3@example.com', role: 'کاربر عادی', status: 'blocked', lastLogin: '۱۴۰۳/۰۲/۰۸', avatar: '👨‍🌾' },
        { id: 10, name: 'نگین زیاری', email: 'negin@gmail.com', role: 'مدیر', status: 'active', lastLogin: '۱۴۰۳/۰۲/۰۸', avatar: '👩‍🔧' },
        { id: 11, name: 'سارا ویسی', email: 'vaysi@gmail.com', role: 'کاربر عادی', status: 'active', lastLogin: '۱۴۰۳/۰۲/۰۸', avatar: '👩‍🔧' },
        { id: 12, name: 'محمد رستمی', email: 'rostami@example.com', role: 'کاربر عادی', status: 'blocked', lastLogin: '۱۴۰۳/۰۲/۰۸', avatar: '👨‍🌾' },
    ]);

    // State های مربوط به حالت داینامیک (سرور)
    const [dynamicData, setDynamicData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchChar, setSearchChar] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [selectedUsers, setSelectedUsers] = useState([]);

    // useEffect(() => {
    //     console.log(selectedUsers);
    // }, [selectedUsers]);

    // تابع وضعیت
    // const getStatusBadge = (status) => {
    //     switch (status) {
    //         case 'active':
    //             return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 border border-green-300">فعال</span>;
    //         case 'inactive':
    //             return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700 border border-yellow-300">غیرفعال</span>;
    //         case 'blocked':
    //             return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700 border border-red-300">مسدود</span>;
    //         default:
    //             return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">نامشخص</span>;
    //     }
    // };

    const getStatusBadge = (status) => {
        const statusText = getStatusText(status);

        const statusConfig = {
            active: 'bg-green-100 text-green-700 border-green-300',
            inactive: 'bg-yellow-100 text-yellow-700 border-yellow-300',
            blocked: 'bg-red-100 text-red-700 border-red-300',
            default: 'bg-gray-100 text-gray-700'
        };

        const colorClass = statusConfig[status] || statusConfig.default;

        return (
            <span className={`px-2 py-1 text-xs rounded-full border ${colorClass}`}>
                {statusText}
            </span>
        );
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'active':
                return 'فعال';
            case 'inactive':
                return 'غیر فعال';
            case 'blocked':
                return 'مسدود';

            default:
                return 'نامشخص';
        }
    }


    // تعریف ستون‌های جدول (با قابلیت سورت)
    const dataInfo = [
        {
            //   field: null, 
            title: "کاربر",
            sortKey: 'name', // کلید سورت
            sortable: true, // قابل سورت بودن
            searchable: true, // قابل جستجو بودن
            width: "20%",
            getSearchText: (rowData) => rowData.name, // برای جستجوی لوکال
            elements: (rowData) => (
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full truncate bg-blue-100 flex items-center justify-center text-lg">
                        {rowData.avatar || '👤'}
                    </div>
                    <div className="font-medium text-gray-900">{rowData.name}</div>
                </div>
            )
        },
        {
            field: "email",
            title: "ایمیل",
            sortKey: 'email',
            width: "25%",
            sortable: true,
            searchable: true
        },
        {
            //   field: "role", 
            title: "نقش",
            sortKey: 'role',
            width: "15%",
            sortable: true,
            searchable: true,
            getSearchText: (rowData) => rowData.role,
            // getSortValue: (rowData) => rowData.role,
            elements: (rowData) => (
                <span className="px-2 py-1 text-xs rounded-full bg-purple-50 text-purple-600 border border-purple-200">
                    {rowData.role}
                </span>
            )
        },
        {
            //   field: "status", 
            title: "وضعیت",
            sortKey: 'status',
            width: "15%",
            sortable: true,
            searchable: true,
            getSearchText: (rowData) => getStatusText(rowData.status),
            elements: (rowData) => getStatusBadge(rowData.status)
        },
        {
            field: "lastLogin",
            title: "آخرین ورود",
            width: "15%",
            sortKey: 'lastLogin',
            sortable: true,
            searchable: false
        },
        {
            field: null,
            title: "عملیات",
            sortable: false, // ستون عملیات قابل سورت نیست
            searchable: false,
            width: "10%",
            elements: (rowData) => (
                <UserActions
                    rowData={rowData}
                    onView={(user) => console.log("View:", user)}
                    onEdit={(user) => console.log("Edit:", user)}
                    onDelete={(user) => dlUser(user)}
                // onDelete={(user) => console.log("Delete:", user)}
                />
            )
        },
    ];

    const dlUser = async (user) => {
        const result = await openConfirmModal({
            // title: 'حذف کاربر',
            title: `حذف کاربر ${user.name}`,
            message: 'آیا از حذف این کاربر مطمئن هستید؟',
            confirmText: 'حذف',
            cancelText: 'لغو',
            // variant: 'warning',
            icon: 'eye',
            styles: {
                iconBg: 'bg-purple-100 hover:bg-purple-200 transition',
                iconColor: 'text-purple-600',
                button: 'bg-purple-500 hover:bg-purple-700',
            }
        });
        if (result) {
            openAlertModal({
                title: 'موفقیت',
                message: `کاربر ${user.name} با موفقیت ایجاد شد`,
                confirmText: 'باشه',
                variant: 'success',
                icon: 'check-circle'
            });
            // console.log('ok');
        }

        // console.log("Delete:", user)
    }

    const searchParams = {
        title: "جستجو",
        placeholder: "جستجو بر اساس نام، ایمیل یا نقش...",
        value: searchChar
    };

    // گرفتن کاربران از سرور (برای حالت داینامیک)
    const handleGetUsers = async (page = currentPage, count = 10, char = searchChar) => {
        setLoading(true);
        // اینجا سرویس واقعی خودت رو صدا بزن
        // const res = await getAllPaginatedUsersService(page, count, char);
        // setDynamicData(res.data.data.data);
        // setPageCount(res.data.last_page);

        // شبیه‌سازی درخواست سرور
        setTimeout(() => {
            const filtered = staticUsers.filter(user =>
                user.name.includes(char) || user.email.includes(char)
            );
            const start = (page - 1) * count;
            const paginated = filtered.slice(start, start + count);
            setDynamicData(paginated);
            setPageCount(Math.ceil(filtered.length / count));
            setLoading(false);
        }, 500);
    };

    const handleSearch = (char) => {
        setSearchChar(char);
        if (dynamic) {
            handleGetUsers(1, 10, char);
        }
    };

    // اگر حالت داینامیک بود و صفحه عوض شد
    useEffect(() => {
        if (dynamic) {
            handleGetUsers();
        }
    }, [currentPage]);

    return (
        // <PaginatedDataTable2
        //     tableData={dynamic ? dynamicData : staticUsers}
        //     dataInfo={dataInfo}
        //     searchParams={searchParams}
        //     loading={loading}
        //     currentPage={currentPage}
        //     setCurrentPage={setCurrentPage}
        //     title='لیست کاربران'
        //     titleBtnAdd='افزودن کاربر'
        //     funcBtnAdd={onAddUser}
        //     pageCount={pageCount}
        //     handleSearch={handleSearch}
        //     dynamic={dynamic}  // اینجا مشخص می‌کنی کدوم حالت فعال باشه
        //     sortable={true}    // فعال کردن سورت
        //     defaultSort={{ key: 'name', direction: 'asc' }} // سورت پیش‌فرض
        //     itemsPerPage={8}   // تعداد آیتم در هر صفحه برای حالت استاتیک
        // >
        //     <button className="px-4 py-2 bg-custom-blue text-white rounded-md hover:bg-blue-700 transition">
        //         افزودن کاربر جدید
        //     </button>
        // </PaginatedDataTable2>
        <PaginatedDataTable3
            tableData={dynamic ? dynamicData : staticUsers}
            dataInfo={dataInfo}
            searchParams={searchParams}
            loading={loading}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            title='لیست کاربران'
            titleBtnAdd='ایجاد کاربر'
            funcBtnAdd={onAddUser}
            pageCount={pageCount}
            handleSearch={handleSearch}
            dynamic={dynamic}  // اینجا مشخص می‌کنی کدوم حالت فعال باشه
            sortable={true}    // فعال کردن سورت
            defaultSort={{ key: 'name', direction: 'asc' }} // سورت پیش‌فرض
            itemsPerPage={4}   // تعداد آیتم در هر صفحه برای حالت استاتیک
            selectable={true}
            selectedRows={selectedUsers}
            onSelectionChange={setSelectedUsers}
        // showCountPage={false}
        >
            <button className="px-4 py-2 bg-custom-blue text-white rounded-md hover:bg-blue-700 transition">
                افزودن کاربر جدید
            </button>
        </PaginatedDataTable3>
    );
};

export default UserTable2;