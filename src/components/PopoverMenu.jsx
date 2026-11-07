// components/PopoverMenu.jsx
import React, { useRef, useEffect, useState, cloneElement } from 'react';

const PopoverMenu = ({
    children,  // محتوای منو
    trigger,   // دکمه یا المنت محرک (می‌تونه JSX یا تابع باشه)
    isOpen,    // state باز بودن منو (از بیرون کنترل می‌شه)
    setIsOpen, // تابع setter برای تغییر state
    position = 'bottom-left', // موقعیت: bottom-left, bottom-right, top-left, top-right
    width = 'w-max min-w-[300px]',
    padding = 'p-5',
    borderRadius = 'rounded-2xl',
    className = '',
    animationDuration = 300
}) => {
    const [isAnimatingOut, setIsAnimatingOut] = useState(false);
    const menuRef = useRef(null);
    const triggerRef = useRef(null);

    // موقعیت‌های مختلف
    const getPositionClasses = () => {
        switch (position) {
            case 'bottom-left':
                return 'top-[110%] left-0';
            case 'bottom-right':
                return 'top-[110%] right-0';
            case 'top-left':
                return 'bottom-[110%] left-0';
            case 'top-right':
                return 'bottom-[110%] right-0';
            default:
                return 'top-[110%] left-0';
        }
    };

    const closeMenu = () => {
        if (isOpen) {
            setIsAnimatingOut(true);
            setTimeout(() => {
                setIsOpen(false);
                setIsAnimatingOut(false);
            }, animationDuration);
        }
    };

    const handleToggle = () => {
        if (isOpen) {
            closeMenu();
        } else {
            setIsOpen(true);
        }
    };

    // تشخیص کلیک بیرون
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen &&
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                triggerRef.current &&
                !triggerRef.current.contains(event.target)) {
                closeMenu();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // اضافه کردن استایل‌های انیمیشن (فقط یک بار)
    useEffect(() => {
        const styleId = 'popover-animations';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                @keyframes slideInFromMiddle {
                    0% {
                        transform: translateY(30px);
                        opacity: 0;
                    }
                    100% {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                
                @keyframes slideOutToMiddle {
                    0% {
                        transform: translateY(0);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(30px);
                        opacity: 0;
                    }
                }
                
                .popover-slide-in {
                    animation: slideInFromMiddle ${animationDuration}ms cubic-bezier(0.34, 1.2, 0.64, 1) forwards !important;
                }
                
                .popover-slide-out {
                    animation: slideOutToMiddle ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1) forwards !important;
                }
            `;
            document.head.appendChild(style);
        }
    }, [animationDuration]);

    return (
        <div className='relative'>
            <div ref={triggerRef} onClick={handleToggle}>
                {typeof trigger === 'function' ? trigger({ isOpen }) : trigger}
            </div>

            {isOpen && (
                <div
                    ref={menuRef}
                    className={`absolute z-30 ${getPositionClasses()} ${width} ${padding} ${borderRadius}
                                bg-white border border-border-c dark:bg-gray-700 shadow-2xl ${className}
                                ${isAnimatingOut ? 'popover-slide-out' : 'popover-slide-in'}`}>
                    {typeof children === 'function' ? children({ closeMenu }) : children}
                </div>
            )}
        </div>
    );
};

export default PopoverMenu;