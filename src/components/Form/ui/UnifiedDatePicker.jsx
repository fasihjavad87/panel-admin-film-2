import React, {
    useEffect,
    useMemo,
    useState,
    useRef,
    useCallback,
} from 'react';

import { useField } from 'formik';
import jMoment from 'moment-jalaali';

const months = [
    { id: 1, value: "فروردین", days: 31 },
    { id: 2, value: "اردیبهشت", days: 31 },
    { id: 3, value: "خرداد", days: 31 },
    { id: 4, value: "تیر", days: 31 },
    { id: 5, value: "مرداد", days: 31 },
    { id: 6, value: "شهریور", days: 31 },
    { id: 7, value: "مهر", days: 30 },
    { id: 8, value: "آبان", days: 30 },
    { id: 9, value: "آذر", days: 30 },
    { id: 10, value: "دی", days: 30 },
    { id: 11, value: "بهمن", days: 30 },
    { id: 12, value: "اسفند", days: 29 },
];

const UnifiedDatePicker = ({
    name,
    label,
    yearsLimit = { from: 100, to: 10 },
    initialDate,
    className = '',
    placeholder = 'انتخاب تاریخ',
    required = false,
    toDay = false,
    disabled = false,
    clearable = true,
    labelColor = 'text-gray-700 dark:text-gray-300',
    iconLabel = 'icon-calendar',
    iconLabelStyle = '',
    icon = 'icon-calendar',
    iconColor = 'text-gray-400 dark:text-gray-400',
    clearText = 'پاک کردن',
}) => {

    // =========================
    // FORMIK
    // =========================

    const [field, meta, helpers] = useField(name);

    // =========================
    // REFS
    // =========================

    const pickerRef = useRef(null);

    // =========================
    // CURRENT DATE
    // =========================

    const currentDate = useMemo(() => {

        const now = jMoment();

        return {
            year: now.jYear(),
            month: now.jMonth() + 1,
            day: now.jDate(),
        };

    }, []);

    // =========================
    // STATES
    // =========================

    const [showConfig, setShowConfig] = useState(false);

    const [animation, setAnimation] = useState('');

    const [isInitialized, setIsInitialized] = useState(false);

    // MAIN DATE
    const [date, setDate] = useState({
        day: '',
        month: '',
        year: '',
    });

    // TEMP DATE
    const [tempDate, setTempDate] = useState({
        day: '',
        month: '',
        year: '',
    });

    // =========================
    // LEAP YEAR
    // =========================

    const isLeapYear = useCallback((yearNum) => {

        const remainders = [1, 5, 9, 13, 17, 22, 26, 30];

        return remainders.includes(yearNum % 33);

    }, []);

    // =========================
    // MONTH DAYS
    // =========================

    const getMonthDays = useCallback((yearNum, monthNum) => {

        if (monthNum < 7) return 31;

        if (monthNum < 12) return 30;

        return isLeapYear(yearNum) ? 30 : 29;

    }, [isLeapYear]);

    // =========================
    // INITIALIZE
    // =========================

    useEffect(() => {

        if (isInitialized) return;

        // TODAY
        if (
            toDay &&
            !initialDate &&
            !field.value
        ) {

            const today = {
                year: currentDate.year.toString(),
                month: currentDate.month.toString(),
                day: currentDate.day.toString(),
            };

            setDate(today);

            helpers.setValue(
                `${today.year}/${today.month}/${today.day}`
            );

            setIsInitialized(true);

            return;
        }

        // INITIAL VALUE
        const dateToSet =
            initialDate || field.value;

        if (dateToSet) {

            let parsedDate = null;

            // STRING SPLIT
            if (
                typeof dateToSet === 'string' &&
                dateToSet.includes('/')
            ) {

                const parts = dateToSet.split('/');

                if (parts.length === 3) {

                    const y = parseInt(parts[0]);
                    const m = parseInt(parts[1]);
                    const d = parseInt(parts[2]);

                    if (
                        !isNaN(y) &&
                        !isNaN(m) &&
                        !isNaN(d)
                    ) {

                        parsedDate = {
                            year: y.toString(),
                            month: m.toString(),
                            day: d.toString(),
                        };
                    }
                }
            }

            // MOMENT PARSE
            if (!parsedDate) {

                const m = jMoment(
                    dateToSet,
                    'jYYYY/jM/jD'
                );

                if (m.isValid()) {

                    parsedDate = {
                        year: m.jYear().toString(),
                        month: (m.jMonth() + 1).toString(),
                        day: m.jDate().toString(),
                    };
                }
            }

            if (parsedDate) {
                setDate(parsedDate);
            }
        }

        setIsInitialized(true);

    }, [
        isInitialized,
        toDay,
        initialDate,
        field.value,
        currentDate,
        helpers,
    ]);

    // =========================
    // YEARS
    // =========================

    const years = useMemo(() => {

        const baseYear = currentDate.year;

        const from =
            baseYear - (yearsLimit?.from || 100);

        const to =
            baseYear + (
                yearsLimit?.to !== undefined
                    ? yearsLimit.to
                    : 10
            );

        return Array.from(
            { length: to - from + 1 },
            (_, i) => from + i
        );

    }, [yearsLimit, currentDate.year]);

    // =========================
    // VALID DAYS
    // =========================

    const validDays = useMemo(() => {

        if (
            !tempDate.month ||
            !tempDate.year
        ) {
            return [];
        }

        const yearNum = parseInt(tempDate.year);

        const monthNum = parseInt(tempDate.month);

        const daysInMonth =
            getMonthDays(yearNum, monthNum);

        return Array.from(
            { length: daysInMonth },
            (_, i) => i + 1
        );

    }, [
        tempDate.month,
        tempDate.year,
        getMonthDays,
    ]);

    // =========================
    // DISPLAY VALUE
    // =========================

    const displayValue = useMemo(() => {

        if (
            date.day &&
            date.month &&
            date.year
        ) {

            const monthName =
                months.find(
                    m => m.id === parseInt(date.month)
                )?.value || '';

            return `${date.day} ${monthName} ${date.year}`;
        }

        return '';

    }, [date]);

    // =========================
    // CLOSE ANIMATION
    // =========================

    const closeWithAnimation = useCallback((callback) => {

        setAnimation('slide-out');

        setTimeout(() => {

            callback();

            setAnimation('');

        }, 300);

    }, []);

    // =========================
    // TOGGLE
    // =========================

    const handleToggleConfig = useCallback(() => {

        if (showConfig) {

            closeWithAnimation(() => {
                setShowConfig(false);
            });

            return;
        }

        setTempDate({
            year:
                date.year ||
                currentDate.year.toString(),

            month: date.month || '',

            day: date.day || '',
        });

        setShowConfig(true);

        setAnimation('slide-in');

    }, [
        showConfig,
        closeWithAnimation,
        date,
        currentDate,
    ]);

    // =========================
    // CONFIRM
    // =========================

    const handleConfirm = useCallback((e) => {

        e.stopPropagation();

        if (
            tempDate.day &&
            tempDate.month &&
            tempDate.year
        ) {

            setDate(tempDate);

            const formattedDate =
                `${tempDate.year}/${tempDate.month}/${tempDate.day}`;

            helpers.setValue(formattedDate);

            helpers.setTouched(true);

            closeWithAnimation(() => {
                setShowConfig(false);
            });
        }

    }, [
        tempDate,
        helpers,
        closeWithAnimation,
    ]);

    // =========================
    // CANCEL
    // =========================

    const handleCancel = useCallback(() => {

        closeWithAnimation(() => {
            setShowConfig(false);
        });

    }, [closeWithAnimation]);

    // =========================
    // CLEAR
    // =========================

    const handleClear = useCallback((e) => {

        e.stopPropagation();

        const emptyDate = {
            day: '',
            month: '',
            year: '',
        };

        setDate(emptyDate);

        setTempDate(emptyDate);

        helpers.setValue('');

        helpers.setTouched(true);

        closeWithAnimation(() => {
            setShowConfig(false);
        });

    }, [
        helpers,
        closeWithAnimation,
    ]);

    // =========================
    // TODAY
    // =========================

    const handleSetToday = useCallback(() => {

        setTempDate({
            year: currentDate.year.toString(),
            month: currentDate.month.toString(),
            day: currentDate.day.toString(),
        });

    }, [currentDate]);

    // =========================
    // CLICK OUTSIDE
    // =========================

    const handleClickOutside = useCallback((event) => {

        if (
            pickerRef.current &&
            !pickerRef.current.contains(event.target)
        ) {

            handleCancel();
        }

    }, [handleCancel]);

    useEffect(() => {

        if (!showConfig) return;

        document.addEventListener(
            'mousedown',
            handleClickOutside
        );

        return () => {

            document.removeEventListener(
                'mousedown',
                handleClickOutside
            );
        };

    }, [
        showConfig,
        handleClickOutside,
    ]);

    // =========================
    // RENDER
    // =========================

    return (
        <div
            className={`relative w-full ${className}`}
            ref={pickerRef}
        >

            {/* STYLE */}
            <style>{`
                @keyframes slideInFromMiddle {
                    0% {
                        opacity: 0;
                        transform: scale(0.95) translateY(-10px);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }

                @keyframes slideOutToMiddle {
                    0% {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                    100% {
                        opacity: 0;
                        transform: scale(0.95) translateY(-10px);
                    }
                }

                .slide-in {
                    animation: slideInFromMiddle 0.3s cubic-bezier(0.34, 1.2, 0.64, 1) forwards !important;
                }

                .slide-out {
                    animation: slideOutToMiddle 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards !important;
                }
            `}</style>

            {/* LABEL */}
            {label && (

                <div className='flex items-center justify-between mb-2 select-none'>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {/* <div className="flex items-center justify-between"> */}
                        <div className="flex gap-1 items-center">
                            <svg className={`w-[18px] h-[18px] fill-transparent ${iconLabelStyle}`}>
                                <use xlinkHref={`#${iconLabel}`} />
                            </svg>
                            <span className={`${labelColor}`}>{label}</span>
                            {required && <span className="text-red-500">*</span>}
                        </div>
                        {/* {clearable && displayValue && !disabled && ( */}
                        {/* <div> */}
                        {/* <button
                                type='button'
                                onClick={handleClear}
                                className={`px-3 py-1 text-xs bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 rounded-lg transition-colors duration-200 cursor-pointer
                                                ${clearable && displayValue && !disabled
                                        ? 'opacity-100 visible'
                                        : 'opacity-0 invisible'}
                                                `}>
                                پاک کردن
                            </button> */}
                        {/* </div> */}
                        {/* )} */}
                        {/* </div> */}
                    </label>
                    <button
                        type='button'
                        onClick={handleClear}
                        className={`px-3 py-1 text-xs bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 rounded-lg transition-colors duration-200 cursor-pointer
                                                ${clearable && displayValue && !disabled
                                ? 'opacity-100 visible'
                                : 'opacity-0 invisible'}
                                                `}>
                        {clearText}
                    </button>
                </div>
            )}

            {/* FIELD */}
            <div
                onClick={handleToggleConfig}
                className={`
                    group relative
                    flex items-center justify-between
                    w-full pr-3 pl-1.5 py-[9px]
                    bg-white dark:bg-gray-700
                    border rounded-lg
                    transition-all duration-200
                    text-gray-700 dark:text-white

                    ${disabled
                        ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed opacity-60'
                        : 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600'
                    }

                    ${showConfig
                        ? 'border-blue-500 ring-1 ring-blue-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }
                `}
            >

                <div className="flex-1 min-w-0">
                    {displayValue ? (
                        <div className="flex items-center gap-2">
                            <div className="
                                w-6 h-6 rounded-full
                                bg-blue-100 dark:bg-blue-900
                                flex items-center justify-center
                                text-blue-600 dark:text-blue-300
                                text-xs font-bold flex-shrink-0
                            ">
                                {date.day || '?'}
                                {/* {displayValue.charAt(0).toUpperCase()} */}
                            </div>
                            <div className="truncate">
                                <div className="font-medium truncate text-sm">
                                    {displayValue}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-2">
                            <div className="
                                w-6 h-6 rounded-full
                                bg-gray-100 dark:bg-gray-700
                                flex items-center justify-center
                            ">
                                <svg className={`w-4 h-4 fill-transparent ${iconColor}`}>
                                    <use xlinkHref={`#${icon}`} />
                                </svg>
                                {/* <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg> */}
                            </div>
                            <span>{placeholder || 'انتخاب تاریخ'}</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                    {/* {displayValue && (
                        <span className="
                            bg-blue-600 text-white
                            text-xs rounded-full
                            w-5 h-5
                            flex items-center justify-center
                        ">
                            {date.day}
                        </span>
                    )} */}
                    <svg className={`w-[18px] h-[18px] text-gray-400 fill-transparent transition-transform ${showConfig ? 'rotate-180' : ''}`}>
                        <use xlinkHref="#icon-alt-arrow-down" />
                    </svg>
                    {/* <svg
                        className={`
                            w-4 h-4 text-gray-400
                            transition-transform
                            ${showConfig ? 'rotate-180' : ''}
                        `}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg> */}
                </div>

            </div>

            {/* ERROR */}
            {meta.touched && meta.error && (
                <div className="text-red-500 text-sm mt-1 block">
                    {meta.error}
                </div>
            )}

            {/* DROPDOWN */}
            {showConfig && (

                <div className={`
                    absolute z-50 mt-1 w-full
                    bg-white dark:bg-gray-800
                    border border-gray-300 dark:border-gray-600
                    rounded-lg shadow-xl
                    transition-all duration-100 overflow-hidden
                    ${animation === 'slide-in' ? 'opacity-100 scale-100' : ''}
                    ${animation === 'slide-out' ? 'opacity-0 scale-95' : ''}
                `}>

                    {/* HEADER */}
                    <div className="
                        sticky z-10 top-0
                        bg-white dark:bg-gray-800
                        p-2
                        border-b border-gray-200 dark:border-gray-700
                        flex justify-between items-center
                    ">

                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            انتخاب تاریخ
                        </span>

                        <div className="flex gap-2">

                            {/* TODAY */}
                            <button
                                type="button"
                                onClick={handleSetToday}
                                className="
                                    px-3 py-1 text-xs
                                    bg-blue-50 dark:bg-blue-900/30
                                    text-blue-600 dark:text-blue-400
                                    rounded-lg
                                    hover:bg-blue-100 dark:hover:bg-blue-900/50
                                    transition-colors cursor-pointer
                                "
                            >
                                امروز
                            </button>

                            {/* CLEAR */}
                            {(date.day ||
                                date.month ||
                                date.year) && (

                                    <button
                                        type="button"
                                        onClick={handleClear}
                                        className="
                                            px-3 py-1 text-xs
                                            bg-red-50 dark:bg-red-900/30
                                            text-red-500 dark:text-red-400
                                            rounded-lg
                                            hover:bg-red-100 dark:hover:bg-red-900/50
                                            transition-colors cursor-pointer
                                        "
                                    >
                                        {clearText}
                                    </button>
                                )}

                            {/* CLOSE */}
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="
                                    p-1 text-xs
                                    text-gray-400 hover:text-red-500 dark:hover:text-red-300
                                    bg-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700
                                    rounded-lg transition-colors cursor-pointer
                                "
                            >

                                <svg className="w-4 h-4 fill-transparent">
                                    <use xlinkHref="#icon-closed" />
                                </svg>
                                {/* <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg> */}
                            </button>

                        </div>

                    </div>

                    {/* CONTENT */}
                    <div className="p-2 flex gap-2 items-center">

                        {/* DAY */}
                        <div className="flex-1">

                            <select
                                value={tempDate.day}
                                onChange={(e) =>
                                    setTempDate(prev => ({
                                        ...prev,
                                        day: e.target.value,
                                    }))
                                }
                                className="
                                    w-full
                                    px-3 py-2
                                    rounded-lg border
                                    border-gray-300 dark:border-gray-600
                                    bg-white dark:bg-gray-700
                                    text-gray-700 dark:text-white
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-200
                                    outline-none
                                    transition-all
                                    text-center
                                    cursor-pointer
                                "
                            >

                                <option value="">
                                    روز
                                </option>

                                {validDays.map(day => (
                                    <option
                                        key={day}
                                        value={day}
                                    >
                                        {day}
                                    </option>
                                ))}

                            </select>

                        </div>

                        {/* MONTH */}
                        <div className="flex-1">

                            <select
                                value={tempDate.month}
                                onChange={(e) =>
                                    setTempDate(prev => ({
                                        ...prev,
                                        month: e.target.value,
                                    }))
                                }
                                className="
                                    w-full
                                    px-3 py-2
                                    rounded-lg border
                                    border-gray-300 dark:border-gray-600
                                    bg-white dark:bg-gray-700
                                    text-gray-700 dark:text-white
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-200
                                    outline-none
                                    transition-all
                                    text-center
                                    cursor-pointer
                                "
                            >

                                <option value="">
                                    ماه
                                </option>

                                {months.map(month => (
                                    <option
                                        key={month.id}
                                        value={month.id}
                                    >
                                        {month.value}
                                    </option>
                                ))}

                            </select>

                        </div>

                        {/* YEAR */}
                        <div className="flex-1">

                            <select
                                value={tempDate.year}
                                onChange={(e) =>
                                    setTempDate(prev => ({
                                        ...prev,
                                        year: e.target.value,
                                    }))
                                }
                                className="
                                    w-full
                                    px-3 py-2
                                    rounded-lg border
                                    border-gray-300 dark:border-gray-600
                                    bg-white dark:bg-gray-700
                                    text-gray-700 dark:text-white
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-200
                                    outline-none
                                    transition-all
                                    text-center
                                    cursor-pointer
                                "
                            >

                                <option value="">
                                    سال
                                </option>

                                {years.map(year => (
                                    <option
                                        key={year}
                                        value={year}
                                    >
                                        {year}
                                    </option>
                                ))}

                            </select>

                        </div>

                        {/* SUBMIT */}
                        <button
                            type="button"
                            onClick={handleConfirm}
                            disabled={
                                !tempDate.day ||
                                !tempDate.month ||
                                !tempDate.year
                            }
                            className="
                                flex-shrink-0
                                w-10 h-10
                                flex items-center justify-center
                                rounded-lg
                                bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700
                                text-white
                                transition-colors
                                duration-200
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                                cursor-pointer
                            "
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
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>

                        </button>

                    </div>

                </div>

            )}

        </div>
    );
};

export default React.memo(UnifiedDatePicker);