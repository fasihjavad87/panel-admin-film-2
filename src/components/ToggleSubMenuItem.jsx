// // components/ToggleSubMenuItem.jsx
// import React from 'react';
// import { NavLink } from 'react-router-dom';
// import { useHasPermission } from '@/hooks/useHasPermission';
// import Tooltip2 from './Tooltip2';

// const ToggleSubMenuItem = ({
//     id,
//     icon,
//     label,
//     href = "#",
//     isParentOpen,
//     sidebarOpen,
//     parentId,
//     classStyle,
//     currentPath,
//     permission,
// }) => {
//     const hasPerm = useHasPermission(permission)


//     return hasPerm && (
//         <li>
//             <Tooltip2 text={label} placement='left'>
//                 <NavLink
//                     // title={label}
//                     to={href}
//                     className={({ isActive }) => {
//                         return `flex gap-1.5 items-center p-2 rounded-md select-none transition 
//                         ${sidebarOpen ? '' : 'justify-center'}  
//                         ${isActive
//                                 ? 'bg-orange-50 hover:bg-orange-100 text-orange-500'
//                                 : `bg-blue-50 hover:bg-blue-100 text-custom-blue ${classStyle || ''}`
//                             }`;
//                     }}
//                     end={true}
//                 >
//                     <svg className="w-6 h-6 fill-transparent">
//                         <use xlinkHref={icon}></use>
//                     </svg>
//                     <span className={`transition ${sidebarOpen ? '' : 'hidden'}`}>{label}</span>
//                 </NavLink>
//             </Tooltip2>
//         </li>
//     );
// };

// export default ToggleSubMenuItem;



// components/ToggleSubMenuItem.jsx
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useHasPermission } from '@/hooks/useHasPermission';
import Tooltip2 from './Tooltip2';

const ToggleSubMenuItem = ({
    id,
    icon,
    label,
    href = "#",
    isParentOpen,
    sidebarOpen,
    parentId,
    classStyle,
    currentPath,
    permission,
}) => {
    const hasPerm = useHasPermission(permission);
    const location = useLocation();

    // جدا کردن pathname و search از href
    const [hrefPath, hrefQuery = ""] = href.split("?");

    // بررسی اینکه آیا این آیتم دقیقاً فعاله (با در نظر گرفتن query)
    const isExactlyActive = (() => {
        // pathname باید دقیقاً یکی باشه
        if (location.pathname !== hrefPath) {
            return false;
        }

        // اگه href query داره، search باید دقیقاً همون باشه
        if (hrefQuery) {
            const expectedSearch = `?${hrefQuery}`;
            return location.search === expectedSearch;
        }

        // اگه href query نداره، search هم باید خالی باشه
        return location.search === "";
    })();

    // بررسی اینکه آیا این آیتم یا زیرمسیرش فعاله (برای parent active)
    // (اینجا برای parent استفاده نمی‌شه چون ToggleMenuItem خودش مدیریت می‌کنه)

    return hasPerm ? (
        <li>
            <Tooltip2 text={label} placement='left'>
                <NavLink
                    to={href}
                    className={() => {
                        return `flex gap-1.5 items-center p-2 rounded-md select-none transition 
                        ${sidebarOpen ? '' : 'justify-center'}  
                        ${isExactlyActive
                                ? 'bg-orange-50 hover:bg-orange-100 text-orange-500'
                                : `bg-blue-50 hover:bg-blue-100 text-custom-blue ${classStyle || ''}`
                            }`;
                    }}
                    end={true}
                >
                    <svg className="w-6 h-6 fill-transparent">
                        <use xlinkHref={icon}></use>
                    </svg>
                    <span className={`transition ${sidebarOpen ? '' : 'hidden'}`}>{label}</span>
                </NavLink>
            </Tooltip2>
        </li>
    ) : null;
};

export default ToggleSubMenuItem;