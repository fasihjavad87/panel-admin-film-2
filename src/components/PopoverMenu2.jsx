// components/PopoverMenu2.jsx
import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef, useCallback } from 'react';

const PopoverMenu2 = forwardRef(({
    children,
    isOpen,
    setIsOpen,
    position = 'bottom-left',
    width = 'w-max min-w-[300px]',
    hight = 'max-h-[310px]',
    padding = 'p-5',
    borderRadius = 'rounded-2xl',
    className = '',
    animationDuration = 300,
    clickBody = true
}, ref) => {
    const [isAnimatingOut, setIsAnimatingOut] = useState(false);
    const menuRef = useRef(null);
    const triggerElementRef = useRef(null);

    const closeMenu = useCallback(() => {
        if (isOpen) {
            setIsAnimatingOut(true);
            setTimeout(() => {
                setIsOpen(false);
                setIsAnimatingOut(false);
            }, animationDuration);
        }
    }, [isOpen, setIsOpen, animationDuration]);

    // متدهای قابل دسترسی از بیرون
    useImperativeHandle(ref, () => ({
        close: closeMenu,
        open: () => setIsOpen(true),
        toggle: () => isOpen ? closeMenu() : setIsOpen(true)
    }), [closeMenu, isOpen, setIsOpen]);

    const getPositionClasses = () => {
        switch (position) {
            case 'bottom-left': return 'top-[110%] left-0';
            case 'bottom-right': return 'top-[110%] right-0';
            case 'top-left': return 'bottom-[110%] left-0';
            case 'top-right': return 'bottom-[110%] right-0';
            default: return 'top-[110%] left-0';
        }
    };

    // پیدا کردن المنت دکمه (هر جایی که باشه)
    useEffect(() => {
        // دنبال دکمه‌ای که این منو رو کنترل می‌کنه می‌گردیم
        const findTriggerButton = () => {
            // اگه قبلاً پیدا کردیم برش گردون
            if (triggerElementRef.current) return triggerElementRef.current;
            
            // دنبال دکمه‌ای که attribute مخصوص داره می‌گردیم
            const button = document.querySelector('[data-popover-trigger]');
            if (button) {
                triggerElementRef.current = button;
                return button;
            }
            
            // راه دیگه: دنبال دکمه‌ای که最近的 parent منو هست
            const parentDiv = menuRef.current?.parentElement;
            const buttonInParent = parentDiv?.querySelector('button');
            if (buttonInParent) {
                triggerElementRef.current = buttonInParent;
                return buttonInParent;
            }
            
            return null;
        };

        findTriggerButton();
    }, []);

    // تشخیص کلیک بیرون
    useEffect(() => {
        const handleClickOutside = (event) => {
            // اگه trigger پیدا نشده بود دوباره پیداش کن
            if (!triggerElementRef.current) {
                const button = document.querySelector('[data-popover-trigger]');
                if (button) triggerElementRef.current = button;
            }

            const isTriggerClick = triggerElementRef.current?.contains(event.target);
            const isMenuClick = menuRef.current?.contains(event.target);
            
            if (clickBody) {   
                if (isOpen && !isMenuClick && !isTriggerClick) {
                    closeMenu();
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, closeMenu]);

    // اضافه کردن استایل‌های انیمیشن
    useEffect(() => {
        const styleId = 'popover-animations';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                .popover-slide-in {
                    animation: slideInFromMiddle ${animationDuration}ms cubic-bezier(0.34, 1.2, 0.64, 1) forwards !important;
                }
                .popover-slide-out {
                    animation: slideOutToMiddle ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1) forwards !important;
                }
                
                @keyframes slideInFromMiddle {
                    0% { transform: translateY(30px); opacity: 0; }
                    100% { transform: translateY(0); opacity: 1; }
                }
                @keyframes slideOutToMiddle {
                    0% { transform: translateY(0); opacity: 1; }
                    100% { transform: translateY(30px); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }, [animationDuration]);

    return (
        <div
            ref={menuRef}
            className={`absolute z-30 ${getPositionClasses()} ${width} ${hight} ${padding} ${borderRadius}
                        bg-white border border-border-c dark:bg-gray-700 overflow-y-auto scrollbar-none shadow-2xl ${className}
                        ${isAnimatingOut ? 'popover-slide-out' : (isOpen ? 'popover-slide-in' : '')}
                        ${!isOpen && !isAnimatingOut ? 'hidden' : ''}`}
        >
            {typeof children === 'function' ? children({ closeMenu }) : children}
        </div>
    );
});

export default PopoverMenu2;