import React, {
    forwardRef,
    useRef,
    useState,
    useImperativeHandle,
    useEffect,
} from "react";

import { createPortal } from "react-dom";
import Tooltip2 from "./Tooltip2";

const ANIMATION_DURATION = 300;

const ModalsContainer2 = forwardRef(
    (
        {
            children,
            id,
            title,
            fullScreen = false,
            width = "max-w-4xl",
            isFooter = true,
            closeOnOutsideClick = true,
            closeFooterButton = true,
            closeHeaderButton = true,
            onClose,
            itemRightToFooter,
            itemLeftToFooter,
        },
        ref
    ) => {

        const modalRef = useRef(null);
        const previousFocusRef = useRef(null);
        const callbackRef = useRef(null)
        const contentRef = useRef(null);

        const [mounted, setMounted] = useState(false);
        const [isOpen, setIsOpen] = useState(false);

        useImperativeHandle(ref, () => ({
            open,
            close,
        }));

        const open = () => {
            previousFocusRef.current = document.activeElement;

            setMounted(true);

            requestAnimationFrame(() => {
                setIsOpen(true);
            });
        };

        const close = (callback = null) => {
            callbackRef.current = callback;

            contentRef.current?.classList.remove("slide-in");
            contentRef.current?.classList.add("slide-out");

            setIsOpen(false);
        };

        useEffect(() => {
            if (!mounted) return;

            contentRef.current?.classList.remove("slide-out");
            contentRef.current?.classList.add("slide-in");
        }, [mounted]);

        useEffect(() => {

            if (!mounted) return;

            if (isOpen) {
                document.body.classList.add("overflow-hidden");
            } else {

                const timer = setTimeout(() => {

                    document.body.classList.remove(
                        "overflow-hidden"
                    );

                    setMounted(false);

                    previousFocusRef.current?.focus();

                    contentRef.current?.classList.remove("slide-out");
                    callbackRef.current?.();
                    onClose?.();

                    callbackRef.current = null;

                }, ANIMATION_DURATION);

                return () => clearTimeout(timer);
            }

        }, [isOpen]);

        if (!mounted) return null;

        return createPortal(
            <div
                ref={modalRef}
                id={id}
                className={`
                    fixed inset-0 z-50
                    flex items-center justify-center
                    bg-black/30 backdrop-blur-[2px]
                    transition-opacity duration-300
                    ${isOpen
                        ? "opacity-100"
                        : "opacity-0"}
                `}
                onClick={(e) => {

                    if (
                        closeOnOutsideClick &&
                        e.target === modalRef.current
                    ) {
                        close();
                    }

                }}
            >
                <div
                    ref={contentRef}
                    className={`
                        bg-white flex flex-col shadow-2xl
                        transition-all duration-300

                        
                        ${fullScreen
                            ? "w-full h-full"
                            : `w-full ${width} mx-4 rounded-lg`
                        }
                    `}
                    style={{
                        maxHeight: fullScreen
                            ? "100%"
                            : "80vh",
                    }}
                    onClick={(e) =>
                        e.stopPropagation()
                    }
                >
                    {/* Header */}

                    <div
                        className="flex items-center justify-between p-5 border-b border-gray-200 rounded-t-lg bg-white sticky top-0 z-10"
                    >
                        <h5
                            className="text-xl font-semibold text-gray-800 flex-1 text-right"
                        >
                            {title}
                        </h5>
                        {closeHeaderButton && (
                            <Tooltip2 text='بستن' placement="right">
                                <button
                                    type="button"
                                    // onClick={close}
                                    onClick={() => close()}
                                    className="text-gray-400 bg-transparent hover:bg-gray-100 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center cursor-pointer transition-colors"
                                >
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                    </svg>
                                </button>
                            </Tooltip2>
                        )}
                    </div>

                    {/* Body */}

                    <div
                        className={`flex-1 p-5 overflow-y-auto ${fullScreen ? '' : 'scrollbar-thin'}`}
                    >
                        {children}
                    </div>

                    {/* Footer */}

                    {isFooter && (
                        <div
                            className={`flex ${itemRightToFooter && closeFooterButton ? 'justify-between' : itemRightToFooter && !closeFooterButton ? 'justify-start' : 'justify-end'} items-center p-3.5 border-t border-gray-200 rounded-b-lg bg-white sticky bottom-0 z-10`}
                        >
                            {itemRightToFooter}
                            <div className="flex items-center gap-2.5">
                                {closeFooterButton && (
                                    <button
                                        type="button"
                                        // onClick={close}
                                        onClick={() => close()}
                                        className="px-6 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-300 transition-colors cursor-pointer"
                                    >
                                        انصراف
                                    </button>
                                )}
                                {itemLeftToFooter}
                            </div>
                        </div>
                    )}
                </div>
            </div >,
            document.getElementById("modals-root")
        );
    }
);

export default ModalsContainer2;