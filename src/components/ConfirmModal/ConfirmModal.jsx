// src/components/ConfirmModal/ConfirmModal.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';

let modalResolvers = new Map();

// تابع برای صدا زدن از هر جای برنامه
export const showConfirm = (options) => {
    return new Promise((resolve) => {
        const id = Date.now() + Math.random();
        modalResolvers.set(id, resolve);

        // dispatch event برای باز کردن مودال
        window.dispatchEvent(new CustomEvent('open-confirm-modal', {
            detail: { id, ...options }
        }));
    });
};

// میانبرهای راحت
export const confirm = {
    success: (message, title = 'موفقیت', options = {}) =>
        showConfirm({ title, message, type: 'success', confirmButtonText: 'تأیید', cancelButtonText: 'لغو', ...options }),

    error: (message, title = 'خطا', options = {}) =>
        showConfirm({ title, message, type: 'danger', confirmButtonText: 'تأیید', cancelButtonText: 'لغو', ...options }),

    warning: (message, title = 'هشدار', options = {}) =>
        showConfirm({ title, message, type: 'warning', confirmButtonText: 'تأیید', cancelButtonText: 'لغو', ...options }),

    info: (message, title = 'اطلاعیه', options = {}) =>
        showConfirm({ title, message, type: 'info', confirmButtonText: 'تأیید', cancelButtonText: 'لغو', ...options }),

    // متد custom برای تنظیمات پیشرفته
    custom: (options) => showConfirm(options)
};

const ConfirmModal = () => {
    const [modalConfig, setModalConfig] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const currentIdRef = useRef(null);

    // هندلر باز شدن مودال
    useEffect(() => {
        const handler = (event) => {
            const { id, ...config } = event.detail;
            currentIdRef.current = id;
            setModalConfig({
                title: config.title || 'تأیید عملیات',
                message: config.message || 'آیا از انجام این عملیات مطمئن هستید؟',
                messageParts: config.messageParts || [],
                warningText: config.warningText || 'توجه: این عمل غیرقابل بازگشت است!',
                confirmButtonText: config.confirmButtonText || 'تأیید',
                cancelButtonText: config.cancelButtonText || 'لغو',
                icon: config.icon || this.getIconByType(config.type),
                type: config.type || 'warning',
                bullets: config.bullets || [],
                onConfirm: config.onConfirm || null,
                ...config
            });
            setIsOpen(true);

            // جلوگیری از اسکرول
            document.body.style.overflow = 'hidden';
        };

        window.addEventListener('open-confirm-modal', handler);
        return () => window.removeEventListener('open-confirm-modal', handler);
    }, []);

    const getIconByType = (type) => {
        const icons = {
            success: 'check-circle',
            danger: 'trash',
            warning: 'exclamation-triangle',
            info: 'information-circle'
        };
        return icons[type] || 'exclamation-triangle';
    };

    const getIconPath = (iconName) => {
        const icons = {
            'exclamation-triangle': 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
            'trash': 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
            'information-circle': 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
            'check-circle': 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
        };
        return icons[iconName] || icons['exclamation-triangle'];
    };

    const getTypeStyles = (type) => {
        const styles = {
            warning: {
                bgIcon: 'bg-yellow-50 dark:bg-yellow-900/50',
                bg: 'bg-yellow-50 dark:bg-yellow-900/20',
                border: 'border-yellow-100 dark:border-yellow-800',
                text: 'text-yellow-700 dark:text-yellow-400',
                text2: 'text-yellow-600 dark:text-yellow-300',
                icon: 'text-yellow-600 dark:text-yellow-400',
                iconBg: 'bg-yellow-100 dark:bg-yellow-800/50',
                button: 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700'
            },
            danger: {
                bgIcon: 'bg-red-50 dark:bg-red-900/50',
                bg: 'bg-red-50 dark:bg-red-900/20',
                border: 'border-red-100 dark:border-red-800',
                text: 'text-red-700 dark:text-red-400',
                text2: 'text-red-600 dark:text-red-300',
                icon: 'text-red-600 dark:text-red-400',
                iconBg: 'bg-red-100 dark:bg-red-800/50',
                button: 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700'
            },
            info: {
                bgIcon: 'bg-blue-50 dark:bg-blue-900/50',
                bg: 'bg-blue-50 dark:bg-blue-900/20',
                border: 'border-blue-100 dark:border-blue-800',
                text: 'text-blue-700 dark:text-blue-400',
                text2: 'text-blue-600 dark:text-blue-300',
                icon: 'text-blue-600 dark:text-blue-400',
                iconBg: 'bg-blue-100 dark:bg-blue-800/50',
                button: 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700'
            },
            success: {
                bgIcon: 'bg-green-50 dark:bg-green-900/50',
                bg: 'bg-green-50 dark:bg-green-900/20',
                border: 'border-green-100 dark:border-green-800',
                text: 'text-green-700 dark:text-green-400',
                text2: 'text-green-600 dark:text-green-300',
                icon: 'text-green-600 dark:text-green-400',
                iconBg: 'bg-green-100 dark:bg-green-800/50',
                button: 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
            }
        };
        return styles[type] || styles.warning;
    };

    const handleConfirm = async () => {
        setLoading(true);

        try {
            // اگه onConfirm وجود داشته باشه و پرامیس برگردونه، صبر می‌کنیم
            if (modalConfig?.onConfirm) {
                await modalConfig.onConfirm();
            }

            // resolve با true
            const resolver = modalResolvers.get(currentIdRef.current);
            if (resolver) resolver(true);
            modalResolvers.delete(currentIdRef.current);

            // بستن مودال
            setIsOpen(false);
            document.body.style.overflow = 'auto';
        } catch (error) {
            console.error('Error in confirm action:', error);
            // در صورت خطا، false برگردون
            const resolver = modalResolvers.get(currentIdRef.current);
            if (resolver) resolver(false);
            modalResolvers.delete(currentIdRef.current);
            setIsOpen(false);
            document.body.style.overflow = 'auto';
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        // resolve با false
        const resolver = modalResolvers.get(currentIdRef.current);
        if (resolver) resolver(false);
        modalResolvers.delete(currentIdRef.current);

        setIsOpen(false);
        document.body.style.overflow = 'auto';
        setLoading(false);
    };

    if (!isOpen || !modalConfig) return null;

    const styles = getTypeStyles(modalConfig.type);
    const iconPath = getIconPath(modalConfig.icon || getIconByType(modalConfig.type));

    // ساخت متن پیام
    const renderMessage = () => {
        if (modalConfig.messageParts && modalConfig.messageParts.length === 2) {
            return (
                <div>
                    <span>{modalConfig.messageParts[0]}</span>
                    <span className="font-bold mx-1">{modalConfig.itemName || ''}</span>
                    <span>{modalConfig.messageParts[1]}</span>
                </div>
            );
        }
        return <p>{modalConfig.message}</p>;
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadeIn">
            {/* Backdrop */}
            <div onClick={handleCancel} className="absolute inset-0 bg-black/50"></div>

            {/* Modal Content */}
            <div className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 
                rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-gray-700
                animate-slideUp">

                {/* Loading Overlay */}
                {loading && (
                    <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 z-10 
                        flex flex-col items-center justify-center p-8">
                        <div className="gradient-spinner mb-4" style={{ width: '40px', height: '40px' }}></div>
                        <p className="text-gray-700 dark:text-gray-300 font-medium animate-pulse">
                            در حال انجام عملیات...
                        </p>
                    </div>
                )}

                {/* Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${styles.bgIcon}`}>
                                <svg className={`w-6 h-6 ${styles.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={iconPath} />
                                </svg>
                            </div>
                            <h3 className="font-bold text-gray-900 dark:text-white text-lg">{modalConfig.title}</h3>
                        </div>
                        <button onClick={handleCancel}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:text-white dark:hover:text-gray-100 
                                bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-700 rounded-lg transition cursor-pointer">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[50vh] overflow-y-auto">
                    <div className={`text-gray-700 dark:text-gray-300 leading-relaxed ${styles.text2}`}>
                        {renderMessage()}
                    </div>

                    {modalConfig.bullets && modalConfig.bullets.length > 0 && (
                        <div className={`mt-4 p-4 rounded-lg border ${styles.bg} ${styles.border}`}>
                            <div className="flex items-start gap-3">
                                <div className={`p-1.5 rounded-full ${styles.iconBg}`}>
                                    <svg className={`w-5 h-5 ${styles.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className={`text-sm font-medium ${styles.text}`}>{modalConfig.warningText}</p>
                                    <ul className="text-xs mt-1 pr-3.5 space-y-1">
                                        {modalConfig.bullets.map((bullet, idx) => (
                                            <li key={idx} className={styles.text2}>{bullet}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Buttons */}
                <div className="p-6 pt-4 flex gap-3">
                    <button onClick={handleCancel}
                        className="flex-1 py-3 px-4 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 
                            rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-200 cursor-pointer">
                        {modalConfig.cancelButtonText}
                    </button>
                    <button onClick={handleConfirm} disabled={loading}
                        className={`flex-1 py-3 px-4 text-white rounded-lg hover:shadow-lg transition duration-200 
                            flex items-center justify-center gap-2 cursor-pointer
                            ${loading ? 'opacity-70 cursor-not-allowed ' : ''} ${styles.button}`}>
                        {loading && <div className="gradient-spinner" style={{ width: '20px', height: '20px' }}></div>}
                        <span>{loading ? 'در حال انجام...' : modalConfig.confirmButtonText}</span>
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
                .animate-slideUp {
                    animation: slideUp 0.3s ease-out;
                }
                .gradient-spinner {
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    border-top: 2px solid white;
                    animation: spin 0.8s linear infinite;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>,
        document.body
    );
};

export default ConfirmModal;