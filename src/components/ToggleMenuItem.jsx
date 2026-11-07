// // components/ToggleMenuItem.jsx
// import React, { useState, useEffect, useRef } from 'react';
// import { useLocation, matchPath } from "react-router-dom";

// const ToggleMenuItem = ({
//     id,
//     icon,
//     label,
//     children,
//     sidebarOpen,
//     openMenus,
//     onToggle
// }) => {
//     const location = useLocation();
//     const prevPathRef = useRef(location.pathname);
//     const isUserClickRef = useRef(false);
//     const isInitialMountRef = useRef(true);

//     const getChildPaths = () => {
//         const paths = [];
//         React.Children.forEach(children, child => {
//             if (child.props.href) {
//                 paths.push(child.props.href);
//             }
//             if (child.props.children) {
//                 React.Children.forEach(child.props.children, subChild => {
//                     if (subChild.props?.href) {
//                         paths.push(subChild.props?.href);
//                     }
//                 });
//             }
//         });
//         return paths;
//     };

//     const childPaths = getChildPaths();

//     const hasActiveChild = React.useMemo(() => {
//         return childPaths.some(path => {
//             if (path === "/") {
//                 return location.pathname === "/";
//             }

//             if (location.pathname === path) {
//                 return true;
//             }

//             if (location.pathname.startsWith(path + '/')) {
//                 return true;
//             }

//             return false;
//         });
//     }, [childPaths, location.pathname]);

//     // تعیین وضعیت باز بودن منو - اولویت با openMenus هست
//     const isOpen = React.useMemo(() => {
//         // اگر در openMenus مقدار مشخصی وجود داره، از اون استفاده کن
//         if (openMenus[id] !== undefined) {
//             return openMenus[id];
//         }
//         // در غیر این صورت، بر اساس وجود زیرمنوی فعال
//         return hasActiveChild;
//     }, [openMenus, id, hasActiveChild]);

//     // فقط وقتی مسیر عوض میشه، منوها رو کنترل کن
//     useEffect(() => {
//         // برای mount اولیه، کاری نکن
//         if (isInitialMountRef.current) {
//             isInitialMountRef.current = false;
//             return;
//         }

//         // فقط وقتی مسیر واقعاً تغییر کرده باشه
//         if (prevPathRef.current !== location.pathname) {
//             prevPathRef.current = location.pathname;

//             // اگر کاربر کلیک نکرده باشه
//             if (!isUserClickRef.current) {
//                 // اگر منو بسته هست ولی زیرمنوی فعال داره، بازش کن
//                 if (!openMenus[id] && hasActiveChild) {
//                     onToggle(id, true);
//                 }
//                 // اگر منو باز هست ولی زیرمنوی فعال نداره، ببندش
//                 else if (openMenus[id] && !hasActiveChild) {
//                     onToggle(id, false);
//                 }
//             }

//             // ریست کردن flag کلیک کاربر
//             isUserClickRef.current = false;
//         }
//     }, [location.pathname, hasActiveChild, id, openMenus, onToggle]);

//     // const handleToggle = (e) => {
//     //     e.stopPropagation();
//     //     isUserClickRef.current = true;
//     //     // toggle کردن منو
//     //     onToggle(id);
//     // };
//     const handleToggle = (e) => {
//         e.stopPropagation();
//         isUserClickRef.current = true;

//         onToggle(id, null, isOpen);
//     };

//     return (
//         <div className={`flex flex-col ${isOpen ? 'gap-1.5' : 'gap-0'}`}>
//             <div
//                 title={label}
//                 onClick={handleToggle}
//                 className={`flex gap-1.5 items-center text-custom-blue border-[1.4px] border-custom-blue p-2 rounded-md cursor-pointer select-none 
//                     ${isOpen ? 'bg-blue-100 hover:bg-blue-200' : 'bg-blue-50 hover:bg-blue-100'} 
//                     transition ${sidebarOpen ? 'justify-between' : 'justify-center'}`}
//             >
//                 <div className='flex gap-1.5 items-center'>
//                     <svg className="w-6 h-6 fill-transparent">
//                         <use xlinkHref={icon}></use>
//                     </svg>
//                     <span className={`transition ${sidebarOpen ? '' : 'hidden'}`}>{label}</span>
//                 </div>
//                 {sidebarOpen && (
//                     <svg className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
//                         fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                     </svg>
//                 )}
//             </div>

//             <div
//                 className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
//                     }`}
//             >
//                 <div className="overflow-hidden">
//                     <div className={`flex flex-col gap-1.5 ${sidebarOpen ? 'mr-4' : ''}`}>
//                         {React.Children.map(children, child => {
//                             return React.cloneElement(child, {
//                                 isParentOpen: isOpen,
//                                 sidebarOpen: sidebarOpen,
//                                 parentId: id,
//                                 currentPath: location.pathname
//                             });
//                         })}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ToggleMenuItem;







// components/ToggleMenuItem.jsx
// import React, { useState, useEffect, useRef, useMemo } from 'react';
// import { useLocation } from "react-router-dom";
// import { useHasPermission } from '../hooks/useHasPermission';
// import Tooltip2 from './Tooltip2';

// const ToggleMenuItem = ({
//     id,
//     icon,
//     label,
//     children,
//     sidebarOpen,
//     openMenus,
//     onToggle
// }) => {
//     const location = useLocation();
//     const prevPathRef = useRef(location.pathname);
//     const isUserClickRef = useRef(false);
//     const isInitialMountRef = useRef(true);

//     // تابع جمع‌آوری تمام permission های فرزندان (حتی تو در تو)
//     const getAllChildPermissions = useMemo(() => {
//         const permissions = [];

//         const extractPermissions = (childrenNodes) => {
//             React.Children.forEach(childrenNodes, child => {
//                 if (!child) return;

//                 // اگر child دارای permission باشه
//                 if (child.props?.permission !== undefined) {
//                     const perm = child.props.permission;

//                     // اگر permission آرایه باشه
//                     if (Array.isArray(perm)) {
//                         // فقط permission هایی که خالی نیستن رو اضافه کن
//                         const validPerms = perm.filter(p => p && p !== '');
//                         if (validPerms.length > 0) {
//                             permissions.push(...validPerms);
//                         }
//                     } else if (perm && perm !== '') {
//                         // اگر string غیر خالی باشه
//                         permissions.push(perm);
//                     }
//                     // اگر string خالی باشه یا undefined، نادیده می‌گیریم
//                 }

//                 // اگر child دارای children باشه (برای حالت‌های تو در تو)
//                 if (child.props?.children) {
//                     extractPermissions(child.props.children);
//                 }
//             });
//         };

//         extractPermissions(children);
        
//         return permissions;
//     }, [children]);

//     // تابع جمع‌آوری مسیرهای فرزندان
//     const getChildPaths = useMemo(() => {
//         const paths = [];

//         const extractPaths = (childrenNodes) => {
//             React.Children.forEach(childrenNodes, child => {
//                 if (!child) return;

//                 if (child.props?.href) {
//                     paths.push(child.props.href);
//                 }

//                 if (child.props?.children) {
//                     extractPaths(child.props.children);
//                 }
//             });
//         };

//         extractPaths(children);
//         return paths;
//     }, [children]);

//     // بررسی اینکه آیا کاربر حداقل یکی از مجوزها رو داره
//     // اگر آرایه permissions خالی باشه، یعنی هیچ مجوزی تعریف نشده => false
//     const hasAnyPermission = useHasPermission(getAllChildPermissions);

//     // بررسی active بودن
//     const hasActiveChild = useMemo(() => {
//         return getChildPaths.some(path => {
//             if (path === "/") {
//                 return location.pathname === "/";
//             }
//             if (location.pathname === path) {
//                 return true;
//             }
//             if (location.pathname.startsWith(path + '/')) {
//                 return true;
//             }
//             return false;
//         });
//     }, [getChildPaths, location.pathname]);

//     // وضعیت باز بودن منو
//     const isOpen = useMemo(() => {
//         if (openMenus[id] !== undefined) {
//             return openMenus[id];
//         }
//         return hasActiveChild;
//     }, [openMenus, id, hasActiveChild]);

//     // اگر هیچ مجوزی تعریف نشده باشه یا کاربر مجوز نداشته باشه، منو رو نشون نده
//     if (!hasAnyPermission) {
//         return null;
//     }

//     // useEffect برای مدیریت تغییر مسیر
//     useEffect(() => {
//         if (isInitialMountRef.current) {
//             isInitialMountRef.current = false;
//             return;
//         }

//         if (prevPathRef.current !== location.pathname) {
//             prevPathRef.current = location.pathname;

//             if (!isUserClickRef.current) {
//                 if (!openMenus[id] && hasActiveChild) {
//                     onToggle(id, true);
//                 }
//                 else if (openMenus[id] && !hasActiveChild) {
//                     onToggle(id, false);
//                 }
//             }

//             isUserClickRef.current = false;
//         }
//     }, [location.pathname, hasActiveChild, id, openMenus, onToggle]);

//     const handleToggle = (e) => {
//         e.stopPropagation();
//         isUserClickRef.current = true;
//         onToggle(id, null, isOpen);
//     };

//     // رندر کردن فرزندان
//     const renderChildren = () => {
//         return React.Children.map(children, (child, index) => {
//             if (!child) return null;

//             // کلون می‌کنیم با props جدید
//             return React.cloneElement(child, {
//                 key: index,
//                 isParentOpen: isOpen,
//                 sidebarOpen: sidebarOpen,
//                 parentId: id,
//                 currentPath: location.pathname
//             });
//         });
//     };

//     return (
//         <div className={`flex flex-col ${isOpen ? 'gap-1.5' : 'gap-0'}`}>
//             <Tooltip2 text={label} placement='left'>
//                 <div
//                     // title={label}
//                     onClick={handleToggle}
//                     className={`flex gap-1.5 items-center text-custom-blue border-[1.4px] border-custom-blue p-2 rounded-md cursor-pointer select-none 
//                     ${isOpen ? 'bg-blue-100 hover:bg-blue-200' : 'bg-blue-50 hover:bg-blue-100'} 
//                     transition ${sidebarOpen ? 'justify-between' : 'justify-center'}`}
//                 >
//                     <div className='flex gap-1.5 items-center'>
//                         <svg className="w-6 h-6 fill-transparent">
//                             <use xlinkHref={icon}></use>
//                         </svg>
//                         <span className={`transition ${sidebarOpen ? '' : 'hidden'}`}>{label}</span>
//                     </div>
//                     {sidebarOpen && (
//                         <svg className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
//                             fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                         </svg>
//                     )}
//                 </div>

//             </Tooltip2>
//             <div
//                 className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
//                     }`}
//             >
//                 <div className="overflow-hidden">
//                     <div className={`flex flex-col gap-1.5 ${sidebarOpen ? 'mr-4' : ''}`}>
//                         {renderChildren()}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ToggleMenuItem;






// components/ToggleMenuItem.jsx
import React, { useEffect, useRef, useMemo } from 'react';
import { useLocation } from "react-router-dom";
import { useHasPermission } from '../hooks/useHasPermission';
import Tooltip2 from './Tooltip2';

const ToggleMenuItem = ({
    id,
    icon,
    label,
    children,
    sidebarOpen,
    openMenus,
    onToggle
}) => {
    const location = useLocation();
    const prevPathRef = useRef(location.pathname + location.search);
    const isUserClickRef = useRef(false);
    const isInitialMountRef = useRef(true);

    // جمع‌آوری permission های فرزندان
    const getAllChildPermissions = useMemo(() => {
        const permissions = [];

        const extractPermissions = (childrenNodes) => {
            React.Children.forEach(childrenNodes, child => {
                if (!child) return;

                if (child.props?.permission !== undefined) {
                    const perm = child.props.permission;

                    if (Array.isArray(perm)) {
                        const validPerms = perm.filter(p => p && p !== '');
                        if (validPerms.length > 0) {
                            permissions.push(...validPerms);
                        }
                    } else if (perm && perm !== '') {
                        permissions.push(perm);
                    }
                }

                if (child.props?.children) {
                    extractPermissions(child.props.children);
                }
            });
        };

        extractPermissions(children);
        return permissions;
    }, [children]);

    // جمع‌آوری مسیرهای فرزندان (با query)
    const getChildPaths = useMemo(() => {
        const paths = [];

        const extractPaths = (childrenNodes) => {
            React.Children.forEach(childrenNodes, child => {
                if (!child) return;

                if (child.props?.href) {
                    paths.push(child.props.href);
                }

                if (child.props?.children) {
                    extractPaths(child.props.children);
                }
            });
        };

        extractPaths(children);
        return paths;
    }, [children]);

    const hasAnyPermission = useHasPermission(getAllChildPermissions);

    // ⬇️⬇️⬇️ تشخیص active با پشتیبانی از query ⬇️⬇️⬇️
    const hasActiveChild = useMemo(() => {
        return getChildPaths.some(path => {
            // جدا کردن pathname و query
            const [pathPathname, pathQuery = ""] = path.split("?");

            // مسیر خانه
            if (pathPathname === "/") {
                return location.pathname === "/" && location.search === "";
            }

            // pathname باید دقیقاً یکی باشه
            if (location.pathname !== pathPathname) {
                // یا زیرمسیرش باشه (مثلاً /movies/5 زیر /movies)
                if (!location.pathname.startsWith(pathPathname + '/')) {
                    return false;
                }
                // اگه path query داشت ولی pathname زیرمسیره، فقط برای بدون query قبول کن
                if (pathQuery) return false;
                return true;
            }

            // اگه path query داره، search باید دقیقاً همون باشه
            if (pathQuery) {
                return location.search === `?${pathQuery}`;
            }

            // اگه path query نداره، search هم باید خالی باشه
            return location.search === "";
        });
    }, [getChildPaths, location.pathname, location.search]);

    const isOpen = useMemo(() => {
        if (openMenus[id] !== undefined) {
            return openMenus[id];
        }
        return hasActiveChild;
    }, [openMenus, id, hasActiveChild]);

    if (!hasAnyPermission) {
        return null;
    }

    // useEffect برای مدیریت تغییر مسیر (pathname + search)
    useEffect(() => {
        if (isInitialMountRef.current) {
            isInitialMountRef.current = false;
            return;
        }

        const currentPath = location.pathname + location.search;
        if (prevPathRef.current !== currentPath) {
            prevPathRef.current = currentPath;

            if (!isUserClickRef.current) {
                if (!openMenus[id] && hasActiveChild) {
                    onToggle(id, true);
                }
                else if (openMenus[id] && !hasActiveChild) {
                    onToggle(id, false);
                }
            }

            isUserClickRef.current = false;
        }
    }, [location.pathname, location.search, hasActiveChild, id, openMenus, onToggle]);

    const handleToggle = (e) => {
        e.stopPropagation();
        isUserClickRef.current = true;
        onToggle(id, null, isOpen);
    };

    const renderChildren = () => {
        return React.Children.map(children, (child, index) => {
            if (!child) return null;

            return React.cloneElement(child, {
                key: index,
                isParentOpen: isOpen,
                sidebarOpen: sidebarOpen,
                parentId: id,
                currentPath: location.pathname + location.search,  // ⬅️ اضافه کردن search
            });
        });
    };

    return (
        <div className={`flex flex-col ${isOpen ? 'gap-1.5' : 'gap-0'}`}>
            <Tooltip2 text={label} placement='left'>
                <div
                    onClick={handleToggle}
                    className={`flex gap-1.5 items-center text-custom-blue border-[1.4px] border-custom-blue p-2 rounded-md cursor-pointer select-none 
                    ${isOpen ? 'bg-blue-100 hover:bg-blue-200' : 'bg-blue-50 hover:bg-blue-100'} 
                    transition ${sidebarOpen ? 'justify-between' : 'justify-center'}`}
                >
                    <div className='flex gap-1.5 items-center'>
                        <svg className="w-6 h-6 fill-transparent">
                            <use xlinkHref={icon}></use>
                        </svg>
                        <span className={`transition ${sidebarOpen ? '' : 'hidden'}`}>{label}</span>
                    </div>
                    {sidebarOpen && (
                        <svg className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    )}
                </div>
            </Tooltip2>
            <div
                className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
            >
                <div className="overflow-hidden">
                    <div className={`flex flex-col gap-1.5 ${sidebarOpen ? 'mr-4' : ''}`}>
                        {renderChildren()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ToggleMenuItem;