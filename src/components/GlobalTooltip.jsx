// import React, { useEffect, useState, useRef } from 'react';

// const GlobalTooltip = () => {
//     const [tooltip, setTooltip] = useState({
//         visible: false,
//         content: '',
//         x: 0,
//         y: 0,
//         position: 'top'
//     });
//     const timeoutRef = useRef();

//     useEffect(() => {
//         const handleMouseEnter = (event) => {
//             let target = event.target;

//             // check if target or parent has data-tooltip-content
//             while (target && !target.getAttribute?.('data-tooltip-content')) {
//                 target = target.parentElement;
//                 if (!target || target === document.body) return;
//             }

//             const tooltipContent = target.getAttribute('data-tooltip-content');
//             if (!tooltipContent) return;

//             if (timeoutRef.current) clearTimeout(timeoutRef.current);

//             const rect = target.getBoundingClientRect();
//             const position = target.getAttribute('data-tooltip-position') || 'top';

//             let x = rect.left + rect.width / 2;
//             let y;

//             switch (position) {
//                 case 'top':
//                     y = rect.top - 8;
//                     break;
//                 case 'bottom':
//                     y = rect.bottom + 8;
//                     break;
//                 case 'left':
//                     x = rect.left - 8;
//                     y = rect.top + rect.height / 2;
//                     break;
//                 case 'right':
//                     x = rect.right + 8;
//                     y = rect.top + rect.height / 2;
//                     break;
//                 default:
//                     y = rect.top - 8;
//             }

//             setTooltip({
//                 visible: true,
//                 content: tooltipContent,
//                 x: x,
//                 y: y,
//                 position: position
//             });
//         };

//         const handleMouseLeave = (event) => {
//             let target = event.target;
//             while (target && !target.getAttribute?.('data-tooltip-content')) {
//                 target = target.parentElement;
//                 if (!target || target === document.body) return;
//             }

//             if (target) {
//                 timeoutRef.current = setTimeout(() => {
//                     setTooltip(prev => ({ ...prev, visible: true }));
//                 }, 50);
//             }
//         };

//         document.addEventListener('mouseenter', handleMouseEnter, true);
//         document.addEventListener('mouseleave', handleMouseLeave, true);

//         return () => {
//             document.removeEventListener('mouseenter', handleMouseEnter, true);
//             document.removeEventListener('mouseleave', handleMouseLeave, true);
//             if (timeoutRef.current) clearTimeout(timeoutRef.current);
//         };
//     }, []);

//     if (!tooltip.visible) return null;

//     const positionStyles = {
//         top: { transform: 'translateX(-50%)', marginBottom: '8px' },
//         bottom: { transform: 'translateX(-50%)', marginTop: '8px' },
//         left: { transform: 'translateY(-50%)', marginRight: '8px' },
//         right: { transform: 'translateY(-50%)', marginLeft: '8px' }
//     };

//     const arrowStyles = {
//         top: {
//             bottom: '-4px',
//             left: '50%',
//             transform: 'translateX(-50%)',
//             borderLeft: '4px solid transparent',
//             borderRight: '4px solid transparent',
//             borderTop: '4px solid #111827'
//         },
//         bottom: {
//             top: '-4px',
//             left: '50%',
//             transform: 'translateX(-50%)',
//             borderLeft: '4px solid transparent',
//             borderRight: '4px solid transparent',
//             borderBottom: '4px solid #111827'
//         },
//         left: {
//             right: '-4px',
//             top: '50%',
//             transform: 'translateY(-50%)',
//             borderTop: '4px solid transparent',
//             borderBottom: '4px solid transparent',
//             borderLeft: '4px solid #111827'
//         },
//         right: {
//             left: '-4px',
//             top: '50%',
//             transform: 'translateY(-50%)',
//             borderTop: '4px solid transparent',
//             borderBottom: '4px solid transparent',
//             borderRight: '4px solid #111827'
//         }
//     };

//     return (
//         <div
//             className="fixed z-[9999] pointer-events-none tooltip-id"
//             style={{
//                 left: tooltip.x,
//                 top: tooltip.y,
//                 ...positionStyles[tooltip.position]
//             }}
//         >
//             <div className="relative">
//                 <div className="bg-gray-900 text-white text-xs rounded py-1.5 px-3 whitespace-nowrap shadow-lg font-medium">
//                     {tooltip.content}
//                 </div>
//                 <div className="absolute w-0 h-0" style={arrowStyles[tooltip.position]} />
//             </div>
//         </div>
//     );
// };

// export default GlobalTooltip;




import React, {
    useState,
    useRef,
    useLayoutEffect,
    useEffect,
    useCallback,
} from "react";
import { createPortal } from "react-dom";

const ANIMATION_DURATION = 180;

const GlobalTooltip = ({
    // پیش‌فرض‌ها
    defaultPlacement = "top",
    defaultOffset = 8,
    defaultDistance = 6,
    timingFunction = "cubic-bezier(.22,1,.36,1)",

    // اتریبیوت‌های پیش‌فرض (قابل تغییر)
    textAttr = "data-tooltip-text",
    placementAttr = "data-tooltip-position",
    offsetAttr = "data-tooltip-offset",

    // ریشه پورتال
    portalId = "modals-root",

    // کلاس پیش‌فرض برای خود tooltip
    className = "",
}) => {
    const [mounted, setMounted] = useState(false);
    const [visible, setVisible] = useState(false);
    const [text, setText] = useState("");
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [placement, setPlacement] = useState(defaultPlacement);
    const [offset, setOffset] = useState(defaultOffset);

    const tooltipRef = useRef(null);
    const targetRef = useRef(null);
    const closeTimerRef = useRef(null);

    //-----------------------------------------
    // Hide
    //-----------------------------------------
    const hide = useCallback(() => {
        setVisible(false);
        if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
        closeTimerRef.current = setTimeout(() => {
            setMounted(false);
            targetRef.current = null;
        }, ANIMATION_DURATION);
    }, []);

    //-----------------------------------------
    // Show
    //-----------------------------------------
    const show = useCallback(
        (el, textValue, placementValue, offsetValue) => {
            if (closeTimerRef.current) {
                clearTimeout(closeTimerRef.current);
                closeTimerRef.current = null;
            }

            targetRef.current = el;
            setText(textValue);
            setPlacement(placementValue || defaultPlacement);
            setOffset(
                offsetValue !== undefined && offsetValue !== null
                    ? Number(offsetValue)
                    : defaultOffset
            );

            setMounted(true);
        },
        [defaultPlacement, defaultOffset]
    );

    //-----------------------------------------
    // گوش دادن به mouseover / mouseout
    //-----------------------------------------
    useEffect(() => {
        const handleMouseOver = (e) => {
            // نزدیک‌ترین المانی که اتریبیوت text رو داره پیدا کن
            const target = e.target.closest?.(`[${textAttr}]`);
            if (!target) return;

            // اگه همون المان قبلیه، دوباره نشون نده
            if (targetRef.current === target) return;

            const textValue = target.getAttribute(textAttr);
            const placementValue = target.getAttribute(placementAttr);
            const offsetValue = target.getAttribute(offsetAttr);

            show(target, textValue, placementValue, offsetValue);
        };

        const handleMouseOut = (e) => {
            const target = e.target.closest?.(`[${textAttr}]`);
            if (!target) return;

            // اگه موس رفته روی یه فرزند از همون target، نبند
            const related = e.relatedTarget;
            if (related && target.contains(related)) return;

            hide();
        };

        document.addEventListener("mouseover", handleMouseOver);
        document.addEventListener("mouseout", handleMouseOut);

        return () => {
            document.removeEventListener("mouseover", handleMouseOver);
            document.removeEventListener("mouseout", handleMouseOut);
        };
    }, [textAttr, placementAttr, offsetAttr, show, hide]);

    //-----------------------------------------
    // محاسبه موقعیت
    //-----------------------------------------
    useLayoutEffect(() => {
        if (!mounted) return;
        if (!targetRef.current) return;
        if (!tooltipRef.current) return;

        const targetRect = targetRef.current.getBoundingClientRect();
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
    }, [mounted, placement, offset]);

    //-----------------------------------------
    // پاکسازی تایمر
    //-----------------------------------------
    useEffect(() => {
        return () => {
            if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
        };
    }, []);

    //-----------------------------------------
    // Transform اولیه
    //-----------------------------------------
    const getTransform = () => {
        if (visible) return "translate(0px,0px)";

        switch (placement) {
            case "top":
                return `translateY(${defaultDistance}px)`;
            case "bottom":
                return `translateY(-${defaultDistance}px)`;
            case "left":
                return `translateX(${defaultDistance}px)`;
            case "right":
                return `translateX(-${defaultDistance}px)`;
            default:
                return `translateY(-${defaultDistance}px)`;
        }
    };

    if (!mounted) return null;

    return createPortal(
        <div
            ref={tooltipRef}
            className={className}
            style={{
                position: "fixed",
                top: position.top,
                left: position.left,
                color: "#fff",
                zIndex: 999999,
                pointerEvents: "none",
                userSelect: "none",
                opacity: visible ? 1 : 0,
                transform: getTransform(),
                transition: `
                    opacity ${ANIMATION_DURATION}ms ${timingFunction},
                    transform ${ANIMATION_DURATION}ms ${timingFunction}
                `,
            }}
        >
            {text}
        </div>,
        document.getElementById(portalId) || document.body
    );
};

export default GlobalTooltip;