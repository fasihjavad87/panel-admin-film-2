// // components/Toast/ToastItem.jsx
// import { useEffect, useState } from 'react';

// const ToastItem = ({ toast, onClose }) => {
//     const [isVisible, setIsVisible] = useState(false);
//     const [isLeaving, setIsLeaving] = useState(false);

//     useEffect(() => {
//         // انیمیشن ورود با تأخیر کم
//         const enterTimer = setTimeout(() => {
//             setIsVisible(true);
//         }, 10);

//         return () => clearTimeout(enterTimer);
//     }, []);

//     useEffect(() => {
//         if (!toast.show && !isLeaving) {
//             setIsLeaving(true);
//             setIsVisible(false);

//             // بعد از اتمام انیمیشن خروج، کامپوننت رو حذف کن
//             // const exitTimer = setTimeout(() => {
//             //     onRemove();
//             // }, 300);

//             // return () => clearTimeout(exitTimer);
//         }
//     }, [toast.show, isLeaving]);

//     const typeClasses = {
//         success: {
//             border: 'border-green-500',
//             bg: 'bg-green-500',
//             text: 'text-green-500',
//             buttonBg: 'bg-green-100 text-green-600',
//             buttonHover: 'hover:bg-green-200',
//             progressBg: 'bg-green-500',
//         },
//         error: {
//             border: 'border-red-500',
//             bg: 'bg-red-500',
//             text: 'text-red-500',
//             buttonBg: 'bg-red-100 text-red-600',
//             buttonHover: 'hover:bg-red-200',
//             progressBg: 'bg-red-500',
//         },
//         warning: {
//             border: 'border-yellow-500',
//             bg: 'bg-yellow-500',
//             text: 'text-yellow-500',
//             buttonBg: 'bg-yellow-100 text-yellow-600',
//             buttonHover: 'hover:bg-yellow-200',
//             progressBg: 'bg-yellow-500',
//         },
//         info: {
//             border: 'border-blue-500',
//             bg: 'bg-blue-500',
//             text: 'text-blue-500',
//             buttonBg: 'bg-blue-100 text-blue-600',
//             buttonHover: 'hover:bg-blue-200',
//             progressBg: 'bg-blue-500',
//         },
//     };

//     const currentType = typeClasses[toast.type];

//     return (
//         <div
//             className={`
//             relative py-4 px-2.5 rounded-xl shadow-2xl 
//             flex items-start justify-between overflow-hidden gap-x-5 
//             min-w-[280px] max-w-sm border-r-4 
//             hover:shadow-3xl cursor-pointer bg-white text-gray-800
//             transition-all duration-300 ease-out
//             will-change-transform, opacity
//             ${currentType.border}
//             ${isVisible
//                     ? 'opacity-100 translate-x-0 scale-100'
//                     : 'opacity-0 translate-x-full scale-90'
//                 }
//             ${!toast.show ? 'toast-exit-animation' : ''}
//         `}
//         // onClick={onClose}
//         >
//             {/* نوار رنگی کناری */}
//             <div className={`py-[21px] px-3px rounded-xl ${currentType.bg}`} />

//             {/* محتوا */}
//             <div className="flex-1">
//                 <h5 className={`font-semibold ${currentType.text}`}>
//                     {toast.title}
//                 </h5>
//                 <div className="text-xs font-semibold pt-0.5 text-gray-700">
//                     {toast.message}
//                 </div>
//             </div>

//             {/* دکمه بستن */}
//             <button
//                 onClick={(e) => {
//                     e.stopPropagation();
//                     onClose();
//                 }}
//                 className={`
//                     p-1 rounded-sm transition-all duration-150 cursor-pointer
//                     ${currentType.buttonBg} ${currentType.buttonHover}
//                 `}
//             >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//             </button>

//             {/* Progress Bar */}
//             <div
//                 key={toast.id}
//                 className={`absolute bottom-0 left-0 h-1 rounded-full ${currentType.progressBg}`}
//                 style={{
//                     width: '100%',
//                     animation: `toast-progress ${toast.duration}ms linear forwards`,
//                 }}
//             />
//         </div>
//     );
// };

// export default ToastItem;



// components/Toast/ToastItem.jsx
import { useEffect, useState } from 'react';

const ToastItem = ({ toast, position = 'top-right', paused = false, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    // ✅ انیمیشن ورود
    useEffect(() => {
        const enterTimer = setTimeout(() => {
            setIsVisible(true);
        }, 10);
        return () => clearTimeout(enterTimer);
    }, []);

    // ✅ شروع انیمیشن خروج وقتی toast.show=false شد
    useEffect(() => {
        if (!toast.show && !isLeaving) {
            setIsLeaving(true);
            setIsVisible(false);
        }
    }, [toast.show, isLeaving]);

    const typeClasses = {
        success: {
            border: 'border-green-500',
            bg: 'bg-green-500',
            text: 'text-green-500',
            buttonBg: 'bg-green-100 text-green-600',
            buttonHover: 'hover:bg-green-200',
            progressBg: 'bg-green-500',
        },
        error: {
            border: 'border-red-500',
            bg: 'bg-red-500',
            text: 'text-red-500',
            buttonBg: 'bg-red-100 text-red-600',
            buttonHover: 'hover:bg-red-200',
            progressBg: 'bg-red-500',
        },
        warning: {
            border: 'border-yellow-500',
            bg: 'bg-yellow-500',
            text: 'text-yellow-500',
            buttonBg: 'bg-yellow-100 text-yellow-600',
            buttonHover: 'hover:bg-yellow-200',
            progressBg: 'bg-yellow-500',
        },
        info: {
            border: 'border-blue-500',
            bg: 'bg-blue-500',
            text: 'text-blue-500',
            buttonBg: 'bg-blue-100 text-blue-600',
            buttonHover: 'hover:bg-blue-200',
            progressBg: 'bg-blue-500',
        },
    };

    const currentType = typeClasses[toast.type] || typeClasses.info;

    const enterX = position.includes('left')
        ? '-100%'
        : position.includes('right')
            ? '100%'
            : '0';

    // ✅ مدت زمان باقی‌مونده برای progress bar — از state میاد تا با setTimeout هماهنگ باشه
    // اگر paused باشه، progress bar هم متوقف می‌شه (animationPlayState)
    // duration اصلی toast هم برای شروع انیمیشن استفاده می‌شه
    const progressDuration = toast.duration;

    return (
        <div
            className={`
                relative py-4 px-2.5 rounded-xl shadow-2xl 
                flex items-start justify-between overflow-hidden gap-x-5 
                min-w-[280px] max-w-sm border-r-4 
                hover:shadow-3xl cursor-pointer bg-white text-gray-800
                transition-all duration-300 ease-out
                will-change-transform, opacity
                ${currentType.border}
                ${isVisible && toast.show
                    ? 'opacity-100 scale-100'
                    : 'opacity-0 scale-90'
                }
            `}
            style={{
                transform:
                    isVisible && toast.show
                        ? 'translateX(0) scale(1)'
                        : `translateX(${isVisible ? '0' : enterX}) scale(0.9)`,
                animation:
                    !toast.show && isLeaving
                        ? `toast-exit-${position.includes('left')
                            ? 'left'
                            : position.includes('right')
                                ? 'right'
                                : 'center'
                        } 0.3s ease-in forwards`
                        : undefined,
            }}
        >
            <div className={`py-[21px] px-3px rounded-xl ${currentType.bg}`} />

            <div className="flex-1">
                <h5 className={`font-semibold ${currentType.text}`}>
                    {toast.title}
                </h5>
                <div className="text-xs font-semibold pt-0.5 text-gray-700">
                    {toast.message}
                </div>
            </div>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }}
                className={`
                    p-1 rounded-sm transition-all duration-150 cursor-pointer
                    ${currentType.buttonBg} ${currentType.buttonHover}
                `}
            >
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </button>

            {/* ✅ Progress Bar — دقیقاً هماهنگ با تایمر setTimeout */}
            <div
                key={toast.id}
                className={`absolute bottom-0 left-0 h-1 rounded-full ${currentType.progressBg}`}
                style={{
                    width: '100%',
                    animation: `toast-progress ${progressDuration}ms linear forwards`,
                    animationPlayState: paused ? 'paused' : 'running',
                }}
            />
        </div>
    );
};

export default ToastItem;