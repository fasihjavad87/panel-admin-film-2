// components/ModalSystem.jsx
import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

const ModalContext = createContext();

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) throw new Error('useModal must be used within ModalProvider');
    return context;
};

export const ModalProvider = ({ children }) => {
    const [modals, setModals] = useState([]);

    const addModal = useCallback((modal) => {
        const id = modal.id || Date.now() + Math.random().toString(36);
        setModals(prev => [...prev, { ...modal, id }]);
        return id;
    }, []);

    const removeModal = useCallback((id) => {
        setModals(prev => prev.filter(modal => modal.id !== id));
    }, []);

    const updateModal = useCallback((id, updates) => {
        setModals(prev => prev.map(modal =>
            modal.id === id ? { ...modal, ...updates } : modal
        ));
    }, []);

    const clearAll = useCallback(() => {
        setModals([]);
    }, []);

    return (
        <ModalContext.Provider value={{ addModal, removeModal, updateModal, clearAll, modals }}>
            {children}
            <ModalRenderer />
        </ModalContext.Provider>
    );
};

// کامپوننت رندر کننده مودال‌ها
const ModalRenderer = () => {
    const { modals, removeModal, updateModal } = useModal();

    if (modals.length === 0) return null;

    return (
        <>
            {modals.map(modal => (
                <Modal
                    key={modal.id}
                    {...modal}
                    onClose={() => {
                        if (modal.onClose) modal.onClose();
                        removeModal(modal.id);
                    }}
                    onConfirm={(result) => {
                        if (modal.onConfirm) modal.onConfirm(result);
                        if (modal.type !== 'alert') removeModal(modal.id);
                    }}
                    updateModal={(updates) => updateModal(modal.id, updates)}
                />
            ))}
        </>
    );
};

// کامپوننت اصلی مودال با استایل جدید
const Modal = ({
    id,
    type,
    title,
    message,
    confirmText = 'تایید',
    cancelText = 'انصراف',
    onConfirm,
    onClose,
    icon,
    backdropClose = false
}) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);
    const modalRef = useRef(null);
    const contentRef = useRef(null);

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

            @keyframes fadeInBackdrop {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }

            .fade-in {
                animation: fadeInBackdrop 0.3s ease-out forwards;
            }

            .fade-out {
                animation: fadeInBackdrop 0.3s ease-out reverse forwards;
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    // انیمیشن ورود هنگام mount شدن
    useEffect(() => {
        setShouldRender(true);

        setTimeout(() => {
            if (modalRef.current) {
                modalRef.current.style.display = 'flex';
                document.body.classList.add('overflow-hidden');

                requestAnimationFrame(() => {
                    modalRef.current?.classList.add('fade-in');
                    modalRef.current.style.opacity = '1';
                    contentRef.current?.classList.add('slide-in');
                });
            }
        }, 10);

        return () => {
            document.body.classList.remove('overflow-hidden');
        };
    }, []);

    const handleClose = () => {
        if (isAnimating) return;

        setIsAnimating(true);

        if (modalRef.current) {
            modalRef.current.classList.remove('fade-in');
            modalRef.current.classList.add('fade-out');

            contentRef.current?.classList.remove('slide-in');
            contentRef.current?.classList.add('slide-out');

            setTimeout(() => {
                onClose();
                setShouldRender(false);
                setIsAnimating(false);
            }, 300);
        } else {
            onClose();
        }
    };

    const handleConfirm = (result = true) => {
        onConfirm(result);
        if (type === 'alert') {
            handleClose();
        }
    };

    if (!shouldRender) return null;

    return (
        <div
            ref={modalRef}
            className="fixed inset-0 z-50 items-center justify-center p-4 transition-all duration-300"
            style={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(2px)',
                display: 'flex',
                opacity: 0,
            }}
            onClick={(e) => {
                if (e.target === modalRef.current && backdropClose && !isAnimating) {
                    handleClose();
                }
            }}
        >
            {/* Modal Content */}
            <div
                ref={contentRef}
                className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full transform"
            >
                {/* Icon (اختیاری) */}
                {icon && (
                    <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-10">
                        <div className="bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg">
                            {icon}
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className={`p-6 ${icon ? 'pt-8' : 'pt-6'}`}>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center">
                        {title}
                    </h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-300 text-center">
                        {message}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 p-6 pt-0">
                    {type === 'confirm' && (
                        <button
                            onClick={handleClose}
                            disabled={isAnimating}
                            className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {cancelText}
                        </button>
                    )}
                    <button
                        onClick={() => handleConfirm(true)}
                        disabled={isAnimating}
                        className={`flex-1 px-4 py-2 rounded-lg transition-colors font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${type === 'confirm'
                                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                            }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};