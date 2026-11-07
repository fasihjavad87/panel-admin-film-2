import React, { useContext, useEffect, useRef, useState } from 'react';
import { useSidebar } from './hooks/useSidebar';
import PopoverMenu from './components/PopoverMenu';
import PopoverMenu2 from './components/PopoverMenu2';
import { useTheme } from './hooks/useTheme';

const Header = () => {
    const { sidebarOpen, setSidebarOpen } = useSidebar();
    const [menuUser, setMenuUser] = useState(false);
    const [isAnimatingOut, setIsAnimatingOut] = useState(false);
    const [menuNotification, setMenuNotification] = useState(false);
    const [menuTest, setMenuTest] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';
    const iconRef = useRef(null);

    const testMenuRef = useRef(null);


    useEffect(() => {
        if (!iconRef.current) return;

        const icon = iconRef.current;
        icon.classList.add('rotate-180');

        const timeout = setTimeout(() => {
            icon.classList.remove('rotate-180');
        }, 300);

        return () => {
            clearTimeout(timeout);
        };
    }, [theme]);

    // تعریف آرایه نوتیفیکیشن‌ها
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            text: 'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است',
            type: 'danger', // danger, success, error, info
            icon: '#icon-danger-circle',
            bgColor: 'bg-yellow-50',
            textColor: 'text-yellow-700'
        },
        {
            id: 2,
            text: 'لورم ایپسوم متن ساختگی با تولیدز',
            type: 'success',
            icon: '#icon-check-circle',
            bgColor: 'bg-green-50',
            textColor: 'text-green-700'
        },
        {
            id: 3,
            text: 'متن به سرور ارسال نشد لطفا بعدا مجددا تلاش نمایید',
            type: 'error',
            icon: '#icon-close-circle',
            bgColor: 'bg-red-50',
            textColor: 'text-red-700'
        },
        {
            id: 4,
            text: 'یک تیکت جدید ثبت شده گفتم اطلاعاع بدم که بدونی',
            type: 'info',
            icon: '#icon-question-circle',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-700'
        }
    ]);

    // تابع حذف نوتیفیکیشن
    const handleRemoveNotification = (id) => {
        setNotifications(prevNotifications =>
            prevNotifications.filter(notification => notification.id !== id)
        );
    };


    const handleRefreshNotifications = () => {
        // گزینه 1: بازنشانی به حالت اولیه (اگه بعضی رو حذف کرده باشی)
        // setNotifications(initialNotifications);

        // گزینه 2: اضافه کردن یه نوتیفیکیشن جدید با یه پیام تست
        // (میتونی این بخش رو کامنت کنی و گزینه 1 رو غیرفعال کنی)

        const newNotification = {
            id: Date.now(), // id یکتا با زمان حال
            text: `اعلان جدید در ساعت ${new Date().toLocaleTimeString('fa-IR')}`,
            type: 'info',
            icon: '#icon-info-circle',
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-700'
        };
        setNotifications(prev => [newNotification, ...prev]);


        // گزینه 3: نمایش alert تستی
        // alert('اعلان‌ها به‌روزرسانی شدند!');

        // گزینه 4: ترکیبی - نمایش توستر یا console.log
        // console.log('دکمه رفرش کلیک شد! تعداد اعلان‌ها:', notifications.length);
    };

    const handleToggleMenu = () => {
        setSidebarOpen(!sidebarOpen)
    }

    const handleToggleMenuTest = () => {
        testMenuRef.current?.toggle();
    }

    const handleToggleUserMenu = () => {
        if (menuUser) {
            setIsAnimatingOut(true);
            setTimeout(() => {
                setMenuUser(false);
                setIsAnimatingOut(false);
            }, 300);
        } else {
            setMenuUser(true);
        }
    }

    return (
        <header className={`bg-white border border-gray-300 fixed m-1.5 rounded-md top-0 left-0 h-app-header-h text-black transition-[right] transform z-[30] right-0  ${sidebarOpen ? 'md:right-[calc(var(--spacing-app-sidebar-w)+6px)]' : 'md:right-[calc(var(--spacing-app-sidebar-w-mobile)+6px)]'}   `}>
            <div className='w-full h-full flex justify-between items-center p-2 gap-2'>
                <button className='p-2 ml-3 rounded-md bg-blue-50 hover:bg-blue-100 text-custom-blue transition cursor-pointer' onClick={handleToggleMenu}>
                    <svg className="w-6 h-6 fill-transparent">
                        <use xlinkHref="#icon-dashboard"></use>
                    </svg>
                </button>

                <span>Header</span>
                <div className='flex gap-2'>
                    <button
                        onClick={toggleTheme}
                        className={`p-2 rounded-md bg-blue-50 hover:bg-blue-100  ${isDark ? "text-custom-blue" : "text-custom-blue"} transition cursor-pointer`}
                    >
                        <svg
                            ref={iconRef}
                            className="transition-transform duration-300 w-6 h-6 fill-transparent">
                            <use xlinkHref={`${isDark ? "#icon-sun" : "#icon-moon"}`}></use>
                        </svg>
                    </button>

                    <div className='relative'>
                        <button
                            onClick={handleToggleMenuTest}
                            className='p-2 rounded-md bg-blue-50 hover:bg-blue-100 text-custom-blue transition cursor-pointer'>
                            <svg className="w-6 h-6 fill-transparent">
                                <use xlinkHref="#icon-bell"></use>
                            </svg>
                        </button>

                        {/* // در Header.jsx - بخش داخل PopoverMenu2 */}
                        <PopoverMenu2
                            ref={testMenuRef}
                            isOpen={menuTest}
                            setIsOpen={setMenuTest}
                            position="bottom-left"
                            width="w-max min-w-[300px]"
                            padding="p-0"  // padding رو صفر کن
                            borderRadius="rounded-2xl"
                        >
                            <div className='flex flex-col max-h-[310px]'>
                                {/* هدر ثابت */}
                                <div className='flex-shrink-0 p-4 pb-2'>
                                    <div className='flex justify-between items-center'>
                                        <h5>اعلان ها</h5>
                                        <button onClick={handleRefreshNotifications} className='bg-green-50 hover:bg-green-100 text-green-600 hover:text-green-700 border border-green-400 rounded-md transition p-1.5 cursor-pointer'>
                                            <svg className="w-5 h-5 fill-transparent">
                                                <use xlinkHref="#icon-refresh"></use>
                                            </svg>
                                        </button>
                                    </div>
                                    <hr className="w-full text-border-c mt-2" />
                                </div>

                                {/* بخش اسکرول شونده */}
                                <div className='flex-1 overflow-y-auto scrollbar-none px-4 pb-4'>
                                    {notifications.length === 0 ? (
                                        <div className="text-center py-4 text-gray-500">
                                            هیچ اعلانی وجود ندارد
                                        </div>
                                    ) : (
                                        <ul className='flex flex-col gap-1.5'>
                                            {notifications.map((notification) => (
                                                <li
                                                    key={notification.id}
                                                    className={`flex items-center justify-between shadow ${notification.bgColor} ${notification.textColor} py-1.5 px-2 rounded-md transition-all duration-300 hover:scale-[1.02]`}
                                                >
                                                    <div className='flex items-center gap-3'>
                                                        <svg className="w-5 h-5 fill-transparent">
                                                            <use xlinkHref={notification.icon}></use>
                                                        </svg>
                                                        <span className='line-clamp-2 text-sm text-wrap max-w-[200px]'>
                                                            {notification.text}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <button
                                                            onClick={() => handleRemoveNotification(notification.id)}
                                                            className='flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity'
                                                        >
                                                            <i className='fa-regular fa-xmark'></i>
                                                        </button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </PopoverMenu2>
                    </div>
                </div>
                <button className='hidden' onClick={handleToggleMenu}>click me!</button>
            </div>
        </header >
    );
}

export default Header;