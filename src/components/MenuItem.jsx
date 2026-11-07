// // components/MenuItem.jsx
// // import React, { useState, useEffect } from 'react';
// import { NavLink } from 'react-router-dom';
// import { useHasPermission } from '../hooks/useHasPermission';
// import Tooltip2 from './Tooltip2';

// const MenuItem = ({
//     id,              // شناسه یکتای منو (مثلاً "users", "settings")
//     icon,
//     label,
//     href,
//     sidebarOpen,
//     classDefault,
//     classStyle,
//     permission,
// }) => {
//     const hasPerm = useHasPermission(permission)

//     return hasPerm && (
//         <li >
//             <Tooltip2 text={label} placement="left" >
//                 <NavLink  to={href} className={({ isActive }) => `flex gap-1.5 items-center p-2 cursor-pointer select-none rounded-md transition ${sidebarOpen ? '' : 'justify-center'} ${isActive ? 'bg-orange-50 hover:bg-orange-100 text-orange-500' : `bg-blue-50 hover:bg-blue-100 text-custom-blue ${classDefault}`} ${classStyle}`}>
//                     <svg className="w-6 h-6 fill-transparent">
//                         <use xlinkHref={icon}></use>
//                     </svg>
//                     <span className={`transition ${sidebarOpen ? '' : 'hidden'}`}>{label}</span>
//                 </NavLink>
//                 {/* <a title={label} href={href} className={`flex gap-1.5 items-center bg-blue-50 hover:bg-blue-100 text-custom-blue p-2 cursor-pointer select-none rounded-md transition ${sidebarOpen ? '' : 'justify-center'} ${classStyle}`}>
//                 <svg className="w-6 h-6 fill-transparent">
//                     <use xlinkHref={icon}></use>
//                 </svg>
//                 <span className={`transition ${sidebarOpen ? '' : 'hidden'}`}>{label}</span>
//             </a> */}
//             </Tooltip2>
//         </li>
//     );
// }

// export default MenuItem;




// components/MenuItem.jsx
import { NavLink } from 'react-router-dom';
import { useHasPermission } from '../hooks/useHasPermission';
import Tooltip2 from './Tooltip2';

const MenuItem = ({
    id,              // شناسه یکتای منو (مثلاً "users", "settings")
    icon,
    label,
    href,            // اگه بدی → NavLink
    onClick,         // اگه بدی (و href نداشته باشی) → button
    sidebarOpen,
    classDefault,
    classStyle,
    classIcon,
    permission,
}) => {
    const hasPerm = useHasPermission(permission);

    if (!hasPerm) return null;

    // کلاس‌های مشترک بین هر سه حالت (NavLink / button / div)
    const baseClass = ({ isActive = false } = {}) =>
        `flex gap-1.5 items-center p-2 cursor-pointer select-none rounded-md transition w-full text-right ${
            sidebarOpen ? '' : 'justify-center'
        } ${
            isActive
                ? 'bg-orange-50 hover:bg-orange-100 text-orange-500'
                : `bg-blue-50 hover:bg-blue-100 text-custom-blue ${classDefault || ''}`
        } ${classStyle || ''}`;

    // محتوای داخلی (آیکون + متن)
    const innerContent = (
        <>
            <svg className={`w-6 h-6 fill-transparent shrink-0 ${classIcon}`}>
                <use xlinkHref={icon}></use>
            </svg>
            <span className={`transition ${sidebarOpen ? '' : 'hidden'}`}>
                {label}
            </span>
        </>
    );

    // تعیین نوع المان
    let triggerEl;

    if (href) {
        // حالت لینک
        triggerEl = (
            <NavLink
                to={href}
                className={({ isActive }) => baseClass({ isActive })}
            >
                {innerContent}
            </NavLink>
        );
    } else if (onClick) {
        // حالت دکمه با تابع
        triggerEl = (
            <button
                type="button"
                onClick={onClick}
                className={baseClass({ isActive: false })}
            >
                {innerContent}
            </button>
        );
    } else {
        // حالت فقط نمایشی
        triggerEl = (
            <div className={baseClass({ isActive: false })}>
                {innerContent}
            </div>
        );
    }

    return (
        <li>
            <Tooltip2
                text={label}
                placement="left"
                trigger="hover"
                // وقتی سایدبار بازه، tooltip لازم نیست
                disabled={sidebarOpen}
            >
                {triggerEl}
            </Tooltip2>
        </li>
    );
};

export default MenuItem;