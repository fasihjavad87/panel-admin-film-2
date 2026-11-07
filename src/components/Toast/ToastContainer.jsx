// // components/Toast/ToastContainer.jsx
// import { useState, useEffect, useCallback, useRef } from 'react';
// import ToastItem from './ToastItem';

// let toastId = 0;
// let listeners = [];

// // تابع برای صدا زدن از هر جای برنامه
// export const showToast = (options) => {
//     const id = ++toastId;
//     const toast = {
//         id,
//         title: options.title || '',
//         message: options.message || '',
//         type: options.type || 'info',
//         duration: options.duration || 3000,
//         show: true,
//         createdAt: Date.now(), // برای کلید یکتا
//     };

//     listeners.forEach(listener => listener(toast));
//     return id;
// };

// // میانبرهای راحت‌تر
// export const toast = {
//     success: (message, options = {}) =>
//         showToast({ title: options.title || 'موفقیت', message, type: 'success', ...options }),
//     error: (message, options = {}) =>
//         showToast({ title: options.title || 'خطا', message, type: 'error', ...options }),
//     warning: (message, options = {}) =>
//         showToast({ title: options.title || 'هشدار', message, type: 'warning', ...options }),
//     info: (message, options = {}) =>
//         showToast({ title: options.title || 'اطلاعیه', message, type: 'info', ...options }),
// };

// const ToastContainer = () => {
//     const [toasts, setToasts] = useState([]);
//     const timeoutsRef = useRef({});

//     const closeToast = useCallback((id) => {
//         // setToasts(prev =>
//         //     prev.map(toast =>
//         //         toast.id === id ? { ...toast, show: false } : toast
//         //     )
//         // );

//         // // clear timeout if exists
//         // if (timeoutsRef.current[id]) {
//         //     clearTimeout(timeoutsRef.current[id]);
//         //     delete timeoutsRef.current[id];
//         // }

//         if (timeoutsRef.current[id]) {
//             clearTimeout(timeoutsRef.current[id]);
//             delete timeoutsRef.current[id];
//         }

//         setToasts(prev =>
//             prev.map(toast =>
//                 toast.id === id
//                     ? { ...toast, show: false }
//                     : toast
//             )
//         );
//         setTimeout(() => {
//             removeToast(id);
//         }, 300);

//     }, []);

//     const removeToast = useCallback((id) => {
//         setToasts(prev => prev.filter(toast => toast.id !== id));
//     }, []);

//     useEffect(() => {
//         const listener = (toast) => {
//             // اضافه کردن toast جدید بدون ایجاد لرزش
//             setToasts(prev => {
//                 // بررسی نکنه قبلاً وجود داره
//                 if (prev.some(t => t.id === toast.id)) return prev;
//                 return [toast, ...prev];
//             });

//             // ست کردن تایم‌اوت برای بسته شدن خودکار
//             const timeoutId = setTimeout(() => {
//                 closeToast(toast.id);
//                 // حذف کامل بعد از انیمیشن
//                 // setTimeout(() => {
//                 //     removeToast(toast.id);
//                 // }, 300);
//             }, toast.duration);

//             timeoutsRef.current[toast.id] = timeoutId;
//         };

//         listeners.push(listener);

//         return () => {
//             const index = listeners.indexOf(listener);
//             if (index > -1) {
//                 listeners.splice(index, 1);
//             }
//             // پاک کردن تمام تایم‌اوت‌ها
//             Object.values(timeoutsRef.current).forEach(clearTimeout);
//         };
//     }, [closeToast, removeToast]);

//     return (
//         <div
//             className="fixed top-5 right-5 z-[100]"
//             style={{
//                 display: 'flex',
//                 flexDirection: 'column',
//                 // gridTemplateColumns: 'repeat(1, 1fr)',
//                 gap: '12px',
//                 direction: 'rtl'
//             }}
//         >
//             {toasts.map(toast => (
//                 <div
//                     key={toast.id}
//                     style={{
//                         transition: 'all 0.3s ease-in-out',
//                         gridRow: '1',
//                         opacity: toast.show ? 1 : 0,
//                         transform: toast.show ? 'translateX(0) scale(1)' : 'translateX(100%) scale(0.9)',
//                         pointerEvents: toast.show ? 'auto' : 'none',
//                     }}
//                 >
//                     <ToastItem
//                         toast={toast}
//                         onClose={() => closeToast(toast.id)}
//                         onRemove={() => removeToast(toast.id)}
//                     />
//                 </div>
//             ))}
//         </div>
//     );
// };

// export default ToastContainer;




// components/Toast/ToastContainer.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import ToastItem from './ToastItem';

let toastId = 0;
let listeners = [];

export const showToast = (options) => {
    const id = ++toastId;
    const toast = {
        id,
        title: options.title || '',
        message: options.message || '',
        type: options.type || 'info',
        duration: options.duration || 3000,
        show: true,
        stacked: options.stacked || false,
        position: options.position || 'top-right',
        pauseOnHover: options.pauseOnHover !== false, // ← پیش‌فرض true
        createdAt: Date.now(),
        paused: false, // ✅ برای نمایش در UI (state)
    };

    listeners.forEach(listener => listener(toast));
    return id;
};

export const toast = {
    success: (message, options = {}) =>
        showToast({ title: options.title || 'موفقیت', message, type: 'success', ...options }),
    error: (message, options = {}) =>
        showToast({ title: options.title || 'خطا', message, type: 'error', ...options }),
    warning: (message, options = {}) =>
        showToast({ title: options.title || 'هشدار', message, type: 'warning', ...options }),
    info: (message, options = {}) =>
        showToast({ title: options.title || 'اطلاعیه', message, type: 'info', ...options }),
};

const POSITIONS = {
    'top-right': { container: { top: '20px', right: '20px' }, direction: 'rtl', isTop: true },
    'top-left': { container: { top: '20px', left: '20px' }, direction: 'ltr', isTop: true },
    'top-center': { container: { top: '20px', left: '50%', transform: 'translateX(-50%)' }, direction: 'rtl', isTop: true },
    'bottom-right': { container: { bottom: '20px', right: '20px' }, direction: 'rtl', isTop: false },
    'bottom-left': { container: { bottom: '20px', left: '20px' }, direction: 'ltr', isTop: false },
    'bottom-center': { container: { bottom: '20px', left: '50%', transform: 'translateX(-50%)' }, direction: 'rtl', isTop: false },
};

const ToastContainer = () => {
    const [toasts, setToasts] = useState([]);
    const [isHoveringStack, setIsHoveringStack] = useState(false);

    // برای هر toast: { timeoutId, startTime, remaining, paused }
    const timersRef = useRef({});
    // برای cleanup کردن setTimeout های closeToast
    const closeTimeoutsRef = useRef({});

    const removeToast = useCallback((id) => {
        delete timersRef.current[id];
        if (closeTimeoutsRef.current[id]) {
            clearTimeout(closeTimeoutsRef.current[id]);
            delete closeTimeoutsRef.current[id];
        }
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const closeToast = useCallback((id) => {
        const timer = timersRef.current[id];
        if (timer?.timeoutId) {
            clearTimeout(timer.timeoutId);
            delete timersRef.current[id];
        }

        setToasts(prev =>
            prev.map(t => (t.id === id ? { ...t, show: false } : t))
        );

        closeTimeoutsRef.current[id] = setTimeout(() => {
            delete closeTimeoutsRef.current[id];
            removeToast(id);
        }, 300);
    }, [removeToast]);

    // شروع تایمر برای یک toast
    const startTimer = useCallback((id, duration) => {
        const startTime = Date.now();
        const timeoutId = setTimeout(() => {
            closeToast(id);
        }, duration);

        timersRef.current[id] = {
            timeoutId,
            startTime,
            remaining: duration,
            paused: false,
        };
    }, [closeToast]);

    // pause تایمر — هم ref و هم state آپدیت می‌شن
    const pauseTimer = useCallback((id) => {
        const timer = timersRef.current[id];
        if (!timer || timer.paused) return;

        clearTimeout(timer.timeoutId);
        const elapsed = Date.now() - timer.startTime;
        timer.remaining = Math.max(0, timer.remaining - elapsed);
        timer.paused = true;
        timer.timeoutId = null;

        // ✅ state رو هم آپدیت کن تا UI re-render بشه
        setToasts(prev =>
            prev.map(t => (t.id === id ? { ...t, paused: true } : t))
        );
    }, []);

    // resume تایمر — هم ref و هم state آپدیت می‌شن
    const resumeTimer = useCallback((id) => {
        const timer = timersRef.current[id];
        if (!timer || !timer.paused) return;

        const startTime = Date.now();
        const timeoutId = setTimeout(() => {
            closeToast(id);
        }, timer.remaining);

        timer.timeoutId = timeoutId;
        timer.startTime = startTime;
        timer.paused = false;

        // ✅ state رو هم آپدیت کن
        setToasts(prev =>
            prev.map(t => (t.id === id ? { ...t, paused: false } : t))
        );
    }, [closeToast]);

    useEffect(() => {
        const listener = (toast) => {
            setToasts(prev => {
                if (prev.some(t => t.id === toast.id)) return prev;
                return [toast, ...prev];
            });

            startTimer(toast.id, toast.duration);
        };

        listeners.push(listener);

        return () => {
            const index = listeners.indexOf(listener);
            if (index > -1) listeners.splice(index, 1);
            Object.values(timersRef.current).forEach(t => {
                if (t.timeoutId) clearTimeout(t.timeoutId);
            });
            Object.values(closeTimeoutsRef.current).forEach(tid => {
                if (tid) clearTimeout(tid);
            });
            timersRef.current = {};
            closeTimeoutsRef.current = {};
        };
    }, [startTimer]);

    // هندلرهای هاور روی toast
    const handleMouseEnterToast = useCallback((t) => {
        if (t.pauseOnHover) pauseTimer(t.id);
    }, [pauseTimer]);

    const handleMouseLeaveToast = useCallback((t) => {
        if (t.pauseOnHover) resumeTimer(t.id);
    }, [resumeTimer]);

    const groupedByPosition = toasts.reduce((acc, t) => {
        const pos = t.position || 'top-right';
        if (!acc[pos]) acc[pos] = { normal: [], stacked: [] };
        if (t.stacked) acc[pos].stacked.push(t);
        else acc[pos].normal.push(t);
        return acc;
    }, {});

    const STACK_OFFSET = 14;

    return (
        <>
            {Object.entries(groupedByPosition).map(([posKey, group]) => {
                const config = POSITIONS[posKey] || POSITIONS['top-right'];
                const isTop = config.isTop;

                return (
                    <div key={posKey}>
                        {/* Toast های معمولی */}
                        <div
                            className="fixed z-[100]"
                            style={{
                                ...config.container,
                                display: 'flex',
                                flexDirection: isTop ? 'column' : 'column-reverse',
                                gap: '12px',
                                direction: config.direction,
                            }}
                        >
                            {group.normal.map(t => (
                                <div
                                    key={t.id}
                                    onMouseEnter={() => handleMouseEnterToast(t)}
                                    onMouseLeave={() => handleMouseLeaveToast(t)}
                                    style={{
                                        transition: 'all 0.3s ease-in-out',
                                        opacity: t.show ? 1 : 0,
                                        transform: t.show
                                            ? 'translateX(0) scale(1)'
                                            : `translateX(${posKey.includes('left') ? '-100%' : '100%'}) scale(0.9)`,
                                        pointerEvents: t.show ? 'auto' : 'none',
                                    }}
                                >
                                    <ToastItem
                                        toast={t}
                                        position={posKey}
                                        paused={t.paused} // ✅ از state، نه ref
                                        onClose={() => closeToast(t.id)}
                                        onRemove={() => removeToast(t.id)}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Toast های استک شده */}
                        {group.stacked.length > 0 && (
                            <div
                                className="fixed z-[101]"
                                style={{
                                    ...config.container,
                                    direction: config.direction,
                                    position: 'fixed',
                                    height: isHoveringStack
                                        ? `${group.stacked.length * 90 + (group.stacked.length - 1) * 12}px`
                                        : `${(group.stacked.length - 1) * STACK_OFFSET + 80}px`,
                                    width: '380px',
                                    transition: 'height 0.3s ease-out',
                                }}
                                onMouseEnter={() => setIsHoveringStack(true)}
                                onMouseLeave={() => setIsHoveringStack(false)}
                            >
                                {group.stacked
                                    .slice()
                                    .reverse()
                                    .map((t, index) => {
                                        const hoverTop = index * (90 + 12);
                                        const stackTop = index * STACK_OFFSET;
                                        const top = isHoveringStack ? hoverTop : stackTop;

                                        return (
                                            <div
                                                key={t.id}
                                                onMouseEnter={() => handleMouseEnterToast(t)}
                                                onMouseLeave={() => handleMouseLeaveToast(t)}
                                                style={{
                                                    position: 'absolute',
                                                    top: isTop ? 0 : 'auto',
                                                    bottom: isTop ? 'auto' : 0,
                                                    right: 0,
                                                    left: 0,
                                                    transform: `translateY(${isTop ? top : -top}px)`,
                                                    transition: 'transform 0.3s ease-out, opacity 0.3s',
                                                    opacity: t.show ? 1 : 0,
                                                    zIndex: index,
                                                    pointerEvents: t.show ? 'auto' : 'none',
                                                }}
                                            >
                                                <ToastItem
                                                    toast={t}
                                                    position={posKey}
                                                    paused={t.paused} // ✅ از state، نه ref
                                                    onClose={() => closeToast(t.id)}
                                                    onRemove={() => removeToast(t.id)}
                                                />
                                            </div>
                                        );
                                    })}
                            </div>
                        )}
                    </div>
                );
            })}
        </>
    );
};

export default ToastContainer;