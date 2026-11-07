// components/UserTable.jsx
import React, { useState } from 'react';

const UserTable = () => {
    // دیتای استاتیک کاربران
    const [users] = useState([
        { id: 1, name: 'علی رضایی', email: 'ali@example.com', role: 'مدیر', status: 'active', lastLogin: '۱۴۰۳/۰۲/۱۵', avatar: '👨‍💼' },
        { id: 2, name: 'سارا محمدی', email: 'sara@example.com', role: 'نویسنده', status: 'active', lastLogin: '۱۴۰۳/۰۲/۱۴', avatar: '👩‍💻' },
        { id: 3, name: 'رضا کریمی', email: 'reza@example.com', role: 'کاربر عادی', status: 'inactive', lastLogin: '۱۴۰۳/۰۲/۱۰', avatar: '👨‍🎨' },
        { id: 4, name: 'مریم حسینی', email: 'maryam@example.com', role: 'مدیر', status: 'active', lastLogin: '۱۴۰۳/۰۲/۱۲', avatar: '👩‍🔧' },
        { id: 5, name: 'احمد نوری', email: 'ahmad@example.com', role: 'کاربر عادی', status: 'blocked', lastLogin: '۱۴۰۳/۰۲/۰۵', avatar: '👨‍🌾' },
        { id: 6, name: 'زهرا کاظمی', email: 'zahra@example.com', role: 'نویسنده', status: 'active', lastLogin: '۱۴۰۳/۰۲/۱۳', avatar: '👩‍🎓' },
        { id: 7, name: 'حسین مرادی', email: 'hossein@example.com', role: 'کاربر عادی', status: 'inactive', lastLogin: '۱۴۰۳/۰۲/۰۸', avatar: '👨‍🚀' },
        { id: 8, name: 'محمد جواد فصیح', email: 'fasihjavad99@example.com', role: 'مدیر', status: 'active', lastLogin: '۱۴۰۳/۰۲/۰۸', avatar: '👩‍🔧' },
        { id: 9, name: 'علی فصیح', email: 'ali9F3@example.com', role: 'کاربر عادی', status: 'blocked', lastLogin: '۱۴۰۳/۰۲/۰۸', avatar: '👨‍🌾' },
    ]);

    // State برای سرچ، سورت و صفحه‌بندی
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // فیلتر کردن بر اساس سرچ
    const filteredUsers = users.filter(user =>
        user.name.includes(searchTerm) ||
        user.email.includes(searchTerm) ||
        user.role.includes(searchTerm)
    );

    // سورت کردن
    const sortedUsers = [...filteredUsers].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    // صفحه‌بندی
    const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
    const paginatedUsers = sortedUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // هندل سورت
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // گرفتن استایل برای وضعیت
    const getStatusBadge = (status) => {
        switch (status) {
            case 'active':
                return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 border border-green-300">فعال</span>;
            case 'inactive':
                return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700 border border-yellow-300">غیرفعال</span>;
            case 'blocked':
                return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700 border border-red-300">مسدود</span>;
            default:
                return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">نامشخص</span>;
        }
    };

    return (
        <div className="p-4 bg-white rounded-md border border-gray-300">
            {/* هدر جدول با سرچ */}
            <div className="flex flex-row justify-between items-center mb-4 gap-3 select-none">
                <h2 className="text-lg font-semibold text-custom-blue">لیست کاربران</h2>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="جستجو بر اساس نام، ایمیل یا نقش..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="pr-8 pl-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-blue focus:border-transparent text-sm w-full md:w-64"
                    />
                    {/* <svg className="absolute right-2 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg> */}
                    <svg className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 fill-transparent">
                        <use xlinkHref="#icon-search"></use>
                    </svg>
                </div>
            </div>

            {/* جدول - ریسپانسیو با overflow-x-auto */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 select-none">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition rounded-tr-md"
                                onClick={() => handleSort('name')}>
                                <div className="flex items-center gap-1 justify-start">
                                    کاربر
                                    {sortConfig.key === 'name' && (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            {sortConfig.direction === 'asc' ?
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /> :
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            }
                                        </svg>
                                    )}
                                </div>
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition"
                                onClick={() => handleSort('email')}>
                                <div className="flex items-center gap-1 justify-start">
                                    ایمیل
                                    {sortConfig.key === 'email' && (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            {sortConfig.direction === 'asc' ?
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /> :
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            }
                                        </svg>
                                    )}
                                </div>
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition"
                                onClick={() => handleSort('role')}>
                                <div className="flex items-center gap-1 justify-start">
                                    نقش
                                    {sortConfig.key === 'role' && (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            {sortConfig.direction === 'asc' ?
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /> :
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            }
                                        </svg>
                                    )}
                                </div>
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition"
                                onClick={() => handleSort('status')}>
                                <div className="flex items-center gap-1 justify-start">
                                    وضعیت
                                    {sortConfig.key === 'status' && (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            {sortConfig.direction === 'asc' ?
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /> :
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            }
                                        </svg>
                                    )}
                                </div>
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">آخرین ورود</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عملیات</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-teal-50 transition duration-150">
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-lg">
                                            {user.avatar}
                                        </div>
                                        <div className="font-medium text-gray-900">{user.name}</div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <span className="px-2 py-1 text-xs rounded-full bg-purple-50 text-purple-600 border border-purple-200">
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">{getStatusBadge(user.status)}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{user.lastLogin}</td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="flex gap-2">
                                        <button className="p-1.5 rounded-md bg-blue-50 hover:bg-blue-100 text-custom-blue cursor-pointer transition">
                                            {/* <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg> */}
                                            <svg className="w-[22px] h-[22px] fill-transparent">
                                                <use xlinkHref="#icon-eye"></use>
                                            </svg>
                                        </button>
                                        <button className="p-1.5 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-600 cursor-pointer transition">
                                            {/* <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg> */}
                                            <svg className="w-[22px] h-[22px] fill-transparent">
                                                <use xlinkHref="#icon-pen-new-square"></use>
                                            </svg>
                                        </button>
                                        <button className="p-1.5 rounded-md bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer transition">
                                            {/* <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg> */}
                                            <svg className="w-[22px] h-[22px] fill-transparent">
                                                <use xlinkHref="#icon-trash-bin-minimalistic"></use>
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* صفحه‌بندی */}
            {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200 select-none">
                    <div className="text-sm text-gray-500">
                        نمایش {((currentPage - 1) * itemsPerPage) + 1} تا {Math.min(currentPage * itemsPerPage, sortedUsers.length)} از {sortedUsers.length} کاربر
                    </div>
                    <div dir="ltr" className="flex gap-1">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`flex items-center justify-center w-9 h-9 rounded-md border cursor-pointer transition ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-custom-blue border-gray-300 hover:bg-blue-50'}`}
                        >
                            {/* <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg> */}
                            <svg className="w-[22px] h-[22px] fill-transparent">
                                <use xlinkHref="#icon-alt-arrow-left"></use>
                            </svg>
                        </button>
                        {[...Array(totalPages)].map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentPage(idx + 1)}
                                className={`w-9 h-9 rounded-md border transition cursor-pointer ${currentPage === idx + 1
                                    ? 'bg-custom-blue text-white border-custom-blue'
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'
                                    }`}
                            >
                                {idx + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className={`flex items-center justify-center w-9 h-9 rounded-md border cursor-pointer transition ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-custom-blue border-gray-300 hover:bg-blue-50'}`}
                        >
                            {/* <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg> */}
                            <svg className="w-[22px] h-[22px] fill-transparent">
                                <use xlinkHref="#icon-alt-arrow-right"></use>
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserTable;