import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { forwardRef } from 'react';
import { createPortal } from 'react-dom';

const ModalsContainer = forwardRef(({ children, id, fullScreen, title, className, closeFunction },ref) => {
    const modalRef = useRef(null);
    const contentRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);
    const previousFocusRef = useRef(null);


    useImperativeHandle(ref, () => ({
        close: handleClose
    }));

    useEffect(() => {
        // بررسی می‌کنیم که آیا باید مودال باز بشه
        if (className?.includes('show') || className?.includes('d-block')) {
            setShouldRender(true);

            // ذخیره المان فوکوس شده قبلی
            previousFocusRef.current = document.activeElement;

            setTimeout(() => {
                setIsOpen(true);
                if (modalRef.current) {
                    modalRef.current.style.display = 'flex';
                    document.body.classList.add('overflow-hidden');

                    // فوکوس روی مودال
                    modalRef.current.focus();

                    requestAnimationFrame(() => {
                        if (modalRef.current) {
                            modalRef.current.classList.add('show');
                            modalRef.current.style.opacity = '1';
                        }
                        if (contentRef.current) {
                            contentRef.current.classList.add('slide-in');
                        }
                    });
                }
            }, 10);
        }

        return () => {
            document.body.classList.remove('overflow-hidden');
            // برگردوندن فوکوس به المان قبلی
            if (previousFocusRef.current) {
                previousFocusRef.current.focus();
            }
        };
    }, [className]);

    const handleClose = () => {
        setIsAnimating(true);

        if (modalRef.current) {
            modalRef.current.classList.remove('show');
            modalRef.current.style.opacity = '0';

            if (contentRef.current) {
                contentRef.current.classList.remove('slide-in');
                contentRef.current.classList.add('slide-out');
            }

            setTimeout(() => {
                if (modalRef.current) {
                    modalRef.current.style.display = 'none';
                    document.body.classList.remove('overflow-hidden');
                }
                if (contentRef.current) {
                    contentRef.current.classList.remove('slide-out');
                }
                setIsAnimating(false);
                setShouldRender(false);
                // if (closeFunction) {
                    closeFunction?.();
                // }
            }, 300);
        } else {
            closeFunction?.();
        }
    };

    // اضافه کردن استایل داینامیک برای انیمیشن‌ها
    useEffect(() => {
        const style = document.createElement('style');
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
            
            .slide-in {
                animation: slideInFromMiddle 0.3s cubic-bezier(0.34, 1.2, 0.64, 1) forwards !important;
            }
            
            .slide-out {
                animation: slideOutToMiddle 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards !important;
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    if (!shouldRender && !className?.includes('show')) return null;

    return createPortal(
        <div
            ref={modalRef}
            className={`fixed inset-0 z-50 items-center justify-center transition-opacity duration-300 backdrop-blur-[2px]
                ${isOpen ? 'flex' : 'hidden'}
                ${className?.includes('show') ? 'opacity-100' : 'opacity-0'}`}
            style={{
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                opacity: 0,
            }}
            id={id}
            tabIndex="-1"
            aria-hidden={isAnimating ? "true" : "false"}
            onClick={(e) => {
                if (e.target === modalRef.current && !isAnimating) handleClose();
            }}
        >
            <div
                ref={contentRef}
                className={`bg-white shadow-2xl transition-all duration-300 transform flex flex-col
                    ${fullScreen
                        ? 'w-full h-full rounded-none'
                        : 'relative w-full max-w-4xl mx-4 rounded-lg'
                    }`}
                style={{
                    maxHeight: fullScreen ? '100%' : '80vh',
                    height: fullScreen ? '100%' : 'auto'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header - همیشه در بالا */}
                <div className="flex items-center justify-between p-5 border-b border-gray-200 rounded-t-lg bg-white sticky top-0 z-10">
                    <h5 className="text-xl font-semibold text-gray-800 flex-1 text-right">
                        {title}
                    </h5>
                    <button
                        type="button"
                        className="text-gray-400 bg-transparent hover:bg-gray-100 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center cursor-pointer transition-colors"
                        onClick={handleClose}
                        disabled={isAnimating}
                    >
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                        </svg>
                        <span className="sr-only">بستن</span>
                    </button>
                </div>

                {/* Modal Body - محتوای اسکرول‌شونده */}
                <div className="flex-1 overflow-y-auto scroll-content p-5">
                    {children}
                </div>

                {/* Modal Footer - همیشه در پایین */}
                <div className="flex justify-end items-center p-5 border-t border-gray-200 rounded-b-lg bg-white sticky bottom-0 z-10">
                    <button
                        type="button"
                        className="px-6 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-300 transition-colors cursor-pointer"
                        onClick={handleClose}
                        disabled={isAnimating}
                    >
                        انصراف
                    </button>
                </div>
            </div>
        </div>,
        document.getElementById('modals-root')
    );
});

export default ModalsContainer;