// // Tooltip.jsx - نسخه improved با ReactDOM.createPortal
// import React, { useState, useRef, useEffect } from 'react';
// import ReactDOM from 'react-dom';

// const Tooltip = ({ children, content, position = 'top' }) => {
//     const [show, setShow] = useState(false);
//     const [coords, setCoords] = useState({ top: 0, left: 0 });
//     const childRef = useRef(null);
//     const tooltipRef = useRef(null);

//     const positionClasses = {
//         top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
//         bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
//         left: 'right-full top-1/2 -translate-y-1/2 mr-2',
//         right: 'left-full top-1/2 -translate-y-1/2 ml-2',
//     };

//     const arrowClasses = {
//         top: 'left-1/2 -translate-x-1/2 top-full border-t-gray-900 border-l-transparent border-r-transparent border-b-transparent',
//         bottom: 'left-1/2 -translate-x-1/2 bottom-full border-b-gray-900 border-l-transparent border-r-transparent border-t-transparent',
//         left: 'top-1/2 -translate-y-1/2 left-full border-l-gray-900 border-t-transparent border-b-transparent border-r-transparent',
//         right: 'top-1/2 -translate-y-1/2 right-full border-r-gray-900 border-t-transparent border-b-transparent border-l-transparent',
//     };

//     const updatePosition = () => {
//         if (childRef.current && show) {
//             const rect = childRef.current.getBoundingClientRect();
//             let top = 0, left = 0;
            
//             switch(position) {
//                 case 'top':
//                     top = rect.top - 10;
//                     left = rect.left + rect.width / 2;
//                     break;
//                 case 'bottom':
//                     top = rect.bottom + 10;
//                     left = rect.left + rect.width / 2;
//                     break;
//                 case 'left':
//                     top = rect.top + rect.height / 2;
//                     left = rect.left - 10;
//                     break;
//                 case 'right':
//                     top = rect.top + rect.height / 2;
//                     left = rect.right + 10;
//                     break;
//             }
            
//             setCoords({ top, left });
//         }
//     };

//     useEffect(() => {
//         if (show) {
//             updatePosition();
//             window.addEventListener('scroll', updatePosition);
//             window.addEventListener('resize', updatePosition);
//             return () => {
//                 window.removeEventListener('scroll', updatePosition);
//                 window.removeEventListener('resize', updatePosition);
//             };
//         }
//     }, [show, position]);

//     const handleMouseEnter = () => {
//         setShow(true);
//     };

//     const handleMouseLeave = () => {
//         setShow(false);
//     };

//     return (
//         <>
//             <div
//                 ref={childRef}
//                 onMouseEnter={handleMouseEnter}
//                 onMouseLeave={handleMouseLeave}
//                 className="inline-block"
//             >
//                 {children}
//             </div>
//             {show && ReactDOM.createPortal(
//                 <div
//                     ref={tooltipRef}
//                     style={{
//                         position: 'fixed',
//                         top: coords.top,
//                         left: coords.left,
//                         // transform: position === 'top' || position === 'bottom' ? 'translateX(-50%)' : 'translateY(-50%)',
//                         zIndex: 9999,
//                     }}
//                     className="bg-gray-900 text-white text-xs rounded py-1.5 px-3 whitespace-nowrap !-translate-y-full !-translate-x-1/2"
//                     onMouseEnter={handleMouseEnter}
//                     onMouseLeave={handleMouseLeave}
//                 >
//                     {content}
//                     <div className={`absolute w-0 h-0 border-4 ${arrowClasses[position]}`}></div>
//                 </div>,
//                 document.body
//             )}
//         </>
//     );
// };

// export default Tooltip;




import React, {
    useState,
    useRef,
    useLayoutEffect,
    useEffect,
    useCallback,
} from "react";
import { createPortal } from "react-dom";

const Tooltip = ({
    children,

    // محتوایی که داخل tooltip نمایش داده میشه (میتونه string یا JSX باشه)
    text,
    content,

    // اگه text هم پاس داده نشد و content هم نبود، این فالبک
    placement = "bottom",

    // فاصله از المان هدف
    offset = 8,

    // مدت انیمیشن
    duration = 180,

    // فاصله انیمیشن ورود
    distance = 6,

    // تابع easing
    timingFunction = "cubic-bezier(.22,1,.36,1)",

    // حالت تریگر: hover | click | both
    trigger = "hover",

    // اگه میخوای tooltip به یه المان دیگه با این id وصل بشه
    // (به جای children)
    targetId,

    // اگه false بشه، از portal استفاده نمیکنه
    usePortal = true,

    // id ریشه پورتال
    portalId = "modals-root",

    // کلاس‌های اضافی برای خود tooltip
    className = "",

    // استایل‌های اضافی برای خود tooltip
    style: extraStyle = {},

    // غیرفعال کردن
    disabled = false,

    //-----------------------------------------
    // 🆕 پراپ‌های جدید برای بستن با کلیک روی محتوا
    //-----------------------------------------
    // اگه true باشه: هر کلیکی روی هر المانی داخل Tooltip (به جز کانتینر)
    // باعث بسته شدن Tooltip میشه
    // اگه "data-attr" باشه: فقط کلیک روی المان‌هایی که
    // data-close-tooltip دارن (یا داخلشون هستن) باعث بسته شدن میشه
    closeOnContentClick = false,
}) => {
    const [mounted, setMounted] = useState(false);
    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });

    const tooltipRef = useRef(null);
    const targetRef = useRef(null);
    const closeTimerRef = useRef(null);
    const openTimerRef = useRef(null);

    //-----------------------------------------
    // پیدا کردن المان هدف
    //-----------------------------------------
    const getTargetEl = useCallback(() => {
        if (targetId) {
            return document.getElementById(targetId);
        }
        return targetRef.current;
    }, [targetId]);

    //-----------------------------------------
    // Show / Hide
    //-----------------------------------------
    const show = useCallback(() => {
        if (disabled) return;
        if (closeTimerRef.current) {
            clearTimeout(closeTimerRef.current);
            closeTimerRef.current = null;
        }
        if (openTimerRef.current) {
            clearTimeout(openTimerRef.current);
            openTimerRef.current = null;
        }
        setMounted(true);
    }, [disabled]);

    const hide = useCallback(() => {
        setVisible(false);
        if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
        closeTimerRef.current = setTimeout(() => {
            setMounted(false);
        }, duration);
    }, [duration]);

    //-----------------------------------------
    // Event Handlers
    //-----------------------------------------
    const handleMouseEnter = useCallback(() => {
        if (trigger === "hover" || trigger === "both") {
            show();
        }
    }, [trigger, show]);

    const handleMouseLeave = useCallback(() => {
        if (trigger === "hover" || trigger === "both") {
            hide();
        }
    }, [trigger, hide]);

    const handleClick = useCallback(
        (e) => {
            if (trigger === "click" || trigger === "both") {
                // اگه روی خود tooltip کلیک شد، بسته نشه
                if (mounted && visible) {
                    hide();
                } else {
                    show();
                }
            }
            // اجرای onClick اصلی children
            if (children?.props?.onClick) {
                children.props.onClick(e);
            }
        },
        [trigger, show, hide, mounted, visible, children]
    );

    //-----------------------------------------
    // 🆕 هندلر کلیک روی محتوای Tooltip
    //-----------------------------------------
    const handleTooltipContentClick = useCallback(
        (e) => {
            if (!closeOnContentClick) return;

            // حالت "data-attr": فقط اگه روی المانی با
            // data-close-tooltip (یا داخلش) کلیک شده باشه
            if (closeOnContentClick === "data-attr") {
                // closest از e.target شروع میکنه و به سمت والدین میره
                // پس اگه هر جایی در مسیر data-close-tooltip داشته باشه، پیدا میکنه
                const closeEl = e.target.closest?.("[data-close-tooltip]");
                if (closeEl) {
                    hide();
                }
                return;
            }

            // حالت true: هر کلیکی روی محتوا (به جز خود کانتینر) ببنده
            // اگه روی خود کانتینر کلیک شده باشه (نه داخلش)، نبند
            if (e.target === tooltipRef.current) return;

            hide();
        },
        [closeOnContentClick, hide]
    );

    //-----------------------------------------
    // Position محاسبه
    //-----------------------------------------
    useLayoutEffect(() => {
        if (!mounted) return;

        const target = getTargetEl();
        if (!target) return;
        if (!tooltipRef.current) return;

        const targetRect = target.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();

        let top = 0;
        let left = 0;

        switch (placement) {
            case "top":
                top = targetRect.top - tooltipRect.height - offset;
                left =
                    targetRect.left +
                    targetRect.width / 2 -
                    tooltipRect.width / 2;
                break;

            case "right":
                top =
                    targetRect.top +
                    targetRect.height / 2 -
                    tooltipRect.height / 2;
                left = targetRect.right + offset;
                break;

            case "left":
                top =
                    targetRect.top +
                    targetRect.height / 2 -
                    tooltipRect.height / 2;
                left = targetRect.left - tooltipRect.width - offset;
                break;

            case "bottom":
            default:
                top = targetRect.bottom + offset;
                left =
                    targetRect.left +
                    targetRect.width / 2 -
                    tooltipRect.width / 2;
        }

        setPosition({ top, left });

        requestAnimationFrame(() => {
            setVisible(true);
        });
    }, [mounted, placement, offset, getTargetEl, content, text]);

    //-----------------------------------------
    // بستن با کلیک بیرون (حالت click)
    //-----------------------------------------
    useEffect(() => {
        if (!mounted) return;
        if (trigger !== "click" && trigger !== "both") return;

        const handleClickOutside = (e) => {
            const target = getTargetEl();
            const tip = tooltipRef.current;
            if (
                target &&
                !target.contains(e.target) &&
                tip &&
                !tip.contains(e.target)
            ) {
                hide();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [mounted, trigger, hide, getTargetEl]);

    //-----------------------------------------
    // پاکسازی تایمرها
    //-----------------------------------------
    useEffect(() => {
        return () => {
            if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
            if (openTimerRef.current) clearTimeout(openTimerRef.current);
        };
    }, []);

    //-----------------------------------------
    // Transform اولیه
    //-----------------------------------------
    const getTransform = () => {
        if (visible) return "translate(0px,0px)";

        switch (placement) {
            case "top":
                return `translateY(${distance}px)`;
            case "bottom":
                return `translateY(-${distance}px)`;
            case "left":
                return `translateX(${distance}px)`;
            case "right":
                return `translateX(-${distance}px)`;
            default:
                return `translateY(-${distance}px)`;
        }
    };

    //-----------------------------------------
    // Clone کردن children با هندلرها
    //-----------------------------------------
    const triggerEl = targetId
        ? null
        : React.cloneElement(children, {
              ref: (node) => {
                  targetRef.current = node;
                  // اگه children خودش ref داشته
                  const childRef = children?.ref;
                  if (typeof childRef === "function") childRef(node);
                  else if (childRef && typeof childRef === "object")
                      childRef.current = node;
              },
              onMouseEnter: (e) => {
                  handleMouseEnter(e);
                  children?.props?.onMouseEnter?.(e);
              },
              onMouseLeave: (e) => {
                  handleMouseLeave(e);
                  children?.props?.onMouseLeave?.(e);
              },
              onClick: handleClick,
          });

    //-----------------------------------------
    // محتوای tooltip
    //-----------------------------------------
    const tooltipContent = content ?? text;

    //-----------------------------------------
    // رندر tooltip
    //-----------------------------------------
    const tooltipNode =
        mounted &&
        createPortal(
            <div
                ref={tooltipRef}
                className={className}
                onClick={handleTooltipContentClick}
                style={{
                    position: "fixed",
                    top: position.top,
                    left: position.left,
                    color: "#fff",
                    zIndex: 999999,
                    opacity: visible ? 1 : 0,
                    transform: getTransform(),
                    transition: `
                        opacity ${duration}ms ${timingFunction},
                        transform ${duration}ms ${timingFunction}
                    `,
                    ...extraStyle,
                }}
                data-tooltip
            >
                {tooltipContent}
            </div>,
            document.getElementById(portalId) || document.body
        );

    return (
        <>
            {triggerEl}
            {mounted && usePortal && tooltipNode}
            {mounted && !usePortal && (
                // بدون پورتال — داخل خود کامپوننت رندر میشه
                <div
                    ref={tooltipRef}
                    className={className}
                    onClick={handleTooltipContentClick}
                    style={{
                        position: "fixed",
                        top: position.top,
                        left: position.left,
                        color: "#fff",
                        zIndex: 999999,
                        opacity: visible ? 1 : 0,
                        transform: getTransform(),
                        transition: `
                            opacity ${duration}ms ${timingFunction},
                            transform ${duration}ms ${timingFunction}
                        `,
                        ...extraStyle,
                    }}
                >
                    {tooltipContent}
                </div>
            )}
        </>
    );
};

export default Tooltip;