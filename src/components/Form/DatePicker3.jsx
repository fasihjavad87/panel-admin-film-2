import { ErrorMessage } from 'formik';
import jMoment from 'moment-jalaali';
import React, {
    useEffect,
    useState,
    useRef,
    useCallback,
    useMemo,
} from 'react';

const MONTHS = [
    { id: 1, name: 'فروردین' },
    { id: 2, name: 'اردیبهشت' },
    { id: 3, name: 'خرداد' },
    { id: 4, name: 'تیر' },
    { id: 5, name: 'مرداد' },
    { id: 6, name: 'شهریور' },
    { id: 7, name: 'مهر' },
    { id: 8, name: 'آبان' },
    { id: 9, name: 'آذر' },
    { id: 10, name: 'دی' },
    { id: 11, name: 'بهمن' },
    { id: 12, name: 'اسفند' },
];

const ANIMATION_DURATION = 300;

const AdvancedDatePicker = ({
    formik,
    name,
    label,

    yearsLimit = { from: 100, to: 10 },

    initialDate,

    className = '',
    placeholder = 'انتخاب تاریخ',

    required = false,
    disabled = false,

    clearable = true,
    closeOnSelect = false,
    showTodayButton = true,
    showYearMonthSelector = true,

    toDay = false,
}) => {

    const containerRef = useRef(null);

    const [isOpen, setIsOpen] = useState(false);
    const [animation, setAnimation] = useState('');

    const [selectedDate, setSelectedDate] = useState({
        year: '',
        month: '',
        day: '',
    });

    const [tempDate, setTempDate] = useState({
        year: '',
        month: '',
        day: '',
    });

    const [isInitialized, setIsInitialized] = useState(false);

    const currentValue = formik.values[name];

    // TODAY
    const today = useMemo(() => ({
        year: jMoment().jYear(),
        month: jMoment().jMonth() + 1,
        day: jMoment().jDate(),
    }), []);

    // LEAP YEAR
    const isLeapYear = useCallback((year) => {

        const remainders = [1, 5, 9, 13, 17, 22, 26, 30];

        return remainders.includes(year % 33);

    }, []);

    // DAYS OF MONTH
    const getMonthDays = useCallback((year, month) => {

        if (month < 7) return 31;

        if (month < 12) return 30;

        return isLeapYear(year) ? 30 : 29;

    }, [isLeapYear]);

    // PARSE DATE
    const parseDate = useCallback((value) => {

        if (!value) {
            return null;
        }

        // FORMAT: YYYY/MM/DD
        if (typeof value === 'string' && value.includes('/')) {

            const parts = value.split('/');

            if (parts.length === 3) {

                const year = parseInt(parts[0]);
                const month = parseInt(parts[1]);
                const day = parseInt(parts[2]);

                if (
                    !isNaN(year) &&
                    !isNaN(month) &&
                    !isNaN(day)
                ) {

                    return {
                        year: year.toString(),
                        month: month.toString(),
                        day: day.toString(),
                    };
                }
            }
        }

        // JALALI MOMENT
        const m = jMoment(value, 'jYYYY/jM/jD');

        if (m.isValid()) {

            return {
                year: m.jYear().toString(),
                month: (m.jMonth() + 1).toString(),
                day: m.jDate().toString(),
            };
        }

        return null;

    }, []);

    // YEARS LIST
    const yearsList = useMemo(() => {

        const from =
            today.year - (yearsLimit?.from || 100);

        const to =
            today.year + (
                yearsLimit?.to !== undefined
                    ? yearsLimit.to
                    : 10
            );

        return Array.from(
            { length: to - from + 1 },
            (_, index) => from + index
        );

    }, [yearsLimit, today.year]);

    // VALID DAYS
    const validDays = useMemo(() => {

        if (!tempDate.year || !tempDate.month) {
            return [];
        }

        const daysCount = getMonthDays(
            Number(tempDate.year),
            Number(tempDate.month)
        );

        return Array.from(
            { length: daysCount },
            (_, index) => index + 1
        );

    }, [tempDate.year, tempDate.month, getMonthDays]);

    // DISPLAY VALUE
    const displayValue = useMemo(() => {

        const {
            year,
            month,
            day,
        } = selectedDate;

        if (!year || !month || !day) {
            return '';
        }

        const monthName =
            MONTHS.find(
                item => item.id === Number(month)
            )?.name || '';

        return `${day} ${monthName} ${year}`;

    }, [selectedDate]);

    // INITIALIZE
    useEffect(() => {

        if (isInitialized) {
            return;
        }

        // TODAY DEFAULT
        if (
            toDay &&
            !initialDate &&
            !currentValue
        ) {

            const todayDate = {
                year: today.year.toString(),
                month: today.month.toString(),
                day: today.day.toString(),
            };

            setSelectedDate(todayDate);

            setIsInitialized(true);

            return;
        }

        const parsedDate = parseDate(
            initialDate || currentValue
        );

        if (parsedDate) {
            setSelectedDate(parsedDate);
        }

        setIsInitialized(true);

    }, [
        toDay,
        initialDate,
        currentValue,
        today,
        parseDate,
        isInitialized,
    ]);

    // SYNC FORMIK
    useEffect(() => {

        if (!isInitialized) {
            return;
        }

        const {
            year,
            month,
            day,
        } = selectedDate;

        const formattedDate =
            year && month && day
                ? `${year}/${month}/${day}`
                : '';

        if (formattedDate !== currentValue) {
            formik.setFieldValue(name, formattedDate);
        }

    }, [
        selectedDate,
        currentValue,
        formik,
        name,
        isInitialized,
    ]);

    // CLICK OUTSIDE
    useEffect(() => {

        if (!isOpen) {
            return;
        }

        const handleClickOutside = (event) => {

            if (
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ) {

                closeDropdown();
            }
        };

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

    }, [isOpen]);

    // CLOSE WITH ANIMATION
    const closeWithAnimation = useCallback((callback) => {

        setAnimation('slide-out');

        setTimeout(() => {

            callback();

            setAnimation('');

        }, ANIMATION_DURATION);

    }, []);

    // CLOSE
    const closeDropdown = useCallback(() => {

        closeWithAnimation(() => {
            setIsOpen(false);
        });

    }, [closeWithAnimation]);

    // OPEN
    const openDropdown = useCallback(() => {

        setTempDate({
            year:
                selectedDate.year ||
                today.year.toString(),

            month: selectedDate.month || '',

            day: selectedDate.day || '',
        });

        setIsOpen(true);

        setAnimation('slide-in');

    }, [selectedDate, today]);

    // TOGGLE
    const handleToggle = useCallback(() => {

        if (disabled) {
            return;
        }

        if (isOpen) {
            closeDropdown();
        } else {
            openDropdown();
        }

    }, [
        disabled,
        isOpen,
        openDropdown,
        closeDropdown,
    ]);

    // CONFIRM
    const handleConfirm = useCallback(() => {

        const {
            year,
            month,
            day,
        } = tempDate;

        if (!year || !month || !day) {
            return;
        }

        setSelectedDate(tempDate);

        if (closeOnSelect) {
            closeDropdown();
        } else {
            closeDropdown();
        }

    }, [
        tempDate,
        closeOnSelect,
        closeDropdown,
    ]);

    // CANCEL
    const handleCancel = useCallback(() => {

        closeDropdown();

    }, [closeDropdown]);

    // CLEAR
    const handleClear = useCallback((e) => {

        e.stopPropagation();

        const emptyDate = {
            year: '',
            month: '',
            day: '',
        };

        setSelectedDate(emptyDate);
        setTempDate(emptyDate);

        formik.setFieldValue(name, '');

        closeDropdown();

    }, [
        formik,
        name,
        closeDropdown,
    ]);

    // TODAY
    const handleSetToday = useCallback(() => {

        setTempDate({
            year: today.year.toString(),
            month: today.month.toString(),
            day: today.day.toString(),
        });

    }, [today]);

    // UPDATE TEMP DATE
    const updateTempDate = useCallback((key, value) => {

        setTempDate(prev => ({
            ...prev,
            [key]: value,
        }));

    }, []);

    // CHANGE DAY
    const changeDay = useCallback((direction) => {

        const {
            year,
            month,
            day,
        } = tempDate;

        if (!year || !month || !day) {
            return;
        }

        let y = Number(year);
        let m = Number(month);
        let d = Number(day);

        d += direction;

        const daysInMonth =
            getMonthDays(y, m);

        if (d < 1) {

            m--;

            if (m < 1) {
                m = 12;
                y--;
            }

            d = getMonthDays(y, m);
        }

        if (d > daysInMonth) {

            d = 1;

            m++;

            if (m > 12) {
                m = 1;
                y++;
            }
        }

        setTempDate({
            year: y.toString(),
            month: m.toString(),
            day: d.toString(),
        });

    }, [tempDate, getMonthDays]);

    return (
        <div
            ref={containerRef}
            className={`relative ${className}`}
        >

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
                    animation:
                        slideInFromMiddle
                        0.3s
                        cubic-bezier(0.34, 1.2, 0.64, 1)
                        forwards !important;
                }

                .slide-out {
                    animation:
                        slideOutToMiddle
                        0.3s
                        cubic-bezier(0.4, 0, 0.2, 1)
                        forwards !important;
                }
            `}</style>

            {/* LABEL */}
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1.5">

                    {label}

                    {required && (
                        <span className="text-red-500 mr-1">*</span>
                    )}

                </label>
            )}

            {/* FIELD */}
            <div
                onClick={handleToggle}
                className={`
                    group relative
                    flex items-center justify-between
                    w-full px-4 py-2.5
                    bg-white border rounded-xl
                    transition-all duration-200

                    ${disabled
                        ? 'bg-gray-100 cursor-not-allowed opacity-60'
                        : 'cursor-pointer'
                    }

                    ${isOpen
                        ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-sm'
                        : 'border-gray-300 hover:border-gray-400 hover:shadow-sm'
                    }
                `}
            >

                <div className="flex items-center gap-2">

                    <svg
                        className={`
                            w-5 h-5 fill-transparent transition-colors
                            ${isOpen
                                ? 'text-blue-500'
                                : 'text-gray-400 group-hover:text-gray-500'
                            }
                        `}
                    >
                        <use xlinkHref="#icon-calendar" />
                    </svg>

                    <span
                        className={
                            displayValue
                                ? 'text-gray-800'
                                : 'text-gray-400'
                        }
                    >
                        {displayValue || placeholder}
                    </span>

                </div>

                <div className="flex items-center gap-1">

                    {clearable &&
                        displayValue &&
                        !disabled && (
                            <button
                                type="button"
                                onClick={handleClear}
                                className="
                                    p-1 rounded-full
                                    hover:bg-gray-100
                                    transition-colors
                                "
                            >

                                <svg
                                    className="
                                        w-4 h-4
                                        text-gray-400
                                        hover:text-red-500
                                        cursor-pointer
                                    "
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
                                </svg>

                            </button>
                        )}

                    <svg
                        className={`
                            w-[22px] h-[22px]
                            fill-transparent text-gray-400
                            transition-transform duration-200
                            ${isOpen ? 'rotate-180' : ''}
                        `}
                    >
                        <use xlinkHref="#icon-alt-arrow-down" />
                    </svg>

                </div>

            </div>

            {/* ERROR */}
            <ErrorMessage name={name}>
                {(msg) => (
                    <div className="text-red-500 text-xs mt-1 mr-1">
                        {msg}
                    </div>
                )}
            </ErrorMessage>

            {/* DROPDOWN */}
            {isOpen && !disabled && (

                <div
                    className={`
                        absolute top-full left-0 right-0
                        mt-2 z-50 overflow-hidden

                        bg-white
                        rounded-xl
                        border border-gray-200
                        shadow-xl

                        ${animation}
                    `}
                >

                    {/* HEADER */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3">

                        <div className="flex items-center justify-between text-white">

                            <span className="text-sm font-medium">
                                انتخاب تاریخ
                            </span>

                            <button
                                type="button"
                                onClick={handleCancel}
                                className="
                                    p-1 rounded-full
                                    hover:bg-white/20
                                    transition-colors
                                    cursor-pointer
                                "
                            >

                                <svg
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
                                </svg>

                            </button>

                        </div>

                    </div>

                    {/* BODY */}
                    <div className="p-4 space-y-4">

                        {/* NAVIGATION */}
                        <div className="flex items-center justify-between gap-2">

                            <div className="flex gap-1">

                                <button
                                    type="button"
                                    onClick={() => changeDay(-1)}
                                    disabled={
                                        !tempDate.year ||
                                        !tempDate.month ||
                                        !tempDate.day
                                    }
                                    className="
                                        p-2 rounded-lg
                                        hover:bg-gray-100
                                        hover:text-blue-600
                                        transition-colors
                                        cursor-pointer
                                    "
                                >

                                    <svg className="w-[18px] h-[18px] fill-transparent">
                                        <use xlinkHref="#icon-alt-arrow-right" />
                                    </svg>

                                </button>

                                <button
                                    type="button"
                                    onClick={() => changeDay(1)}
                                    disabled={
                                        !tempDate.year ||
                                        !tempDate.month ||
                                        !tempDate.day
                                    }
                                    className="
                                        p-2 rounded-lg
                                        hover:bg-gray-100
                                        hover:text-blue-600
                                        transition-colors
                                        cursor-pointer
                                    "
                                >

                                    <svg className="w-[18px] h-[18px] fill-transparent">
                                        <use xlinkHref="#icon-alt-arrow-left" />
                                    </svg>

                                </button>

                            </div>

                            {showTodayButton && (
                                <button
                                    type="button"
                                    onClick={handleSetToday}
                                    className="
                                        px-3 py-1
                                        text-xs
                                        bg-blue-50
                                        text-blue-600
                                        rounded-lg
                                        hover:bg-blue-100
                                        transition-colors
                                        cursor-pointer
                                    "
                                >
                                    امروز
                                </button>
                            )}

                        </div>

                        {/* YEAR & MONTH */}
                        {showYearMonthSelector && (

                            <div className="grid grid-cols-2 gap-3">

                                {/* YEAR */}
                                <div>

                                    <label className="block text-xs text-gray-500 mb-1">
                                        سال
                                    </label>

                                    <select
                                        value={tempDate.year}
                                        onChange={(e) =>
                                            updateTempDate(
                                                'year',
                                                e.target.value
                                            )
                                        }
                                        className="
                                            w-full
                                            px-3 py-2
                                            rounded-lg
                                            border border-gray-300
                                            bg-white
                                            text-center
                                            cursor-pointer
                                            transition-all

                                            focus:border-blue-500
                                            focus:ring-2
                                            focus:ring-blue-200
                                            outline-none
                                        "
                                    >

                                        <option value="">
                                            انتخاب سال
                                        </option>

                                        {yearsList.map(year => (

                                            <option
                                                key={year}
                                                value={year}
                                            >
                                                {year}
                                            </option>

                                        ))}

                                    </select>

                                </div>

                                {/* MONTH */}
                                <div>

                                    <label className="block text-xs text-gray-500 mb-1">
                                        ماه
                                    </label>

                                    <select
                                        value={tempDate.month}
                                        onChange={(e) =>
                                            updateTempDate(
                                                'month',
                                                e.target.value
                                            )
                                        }
                                        className="
                                            w-full
                                            px-3 py-2
                                            rounded-lg
                                            border border-gray-300
                                            bg-white
                                            text-center
                                            cursor-pointer
                                            transition-all

                                            focus:border-blue-500
                                            focus:ring-2
                                            focus:ring-blue-200
                                            outline-none
                                        "
                                    >

                                        <option value="">
                                            انتخاب ماه
                                        </option>

                                        {MONTHS.map(month => (

                                            <option
                                                key={month.id}
                                                value={month.id}
                                            >
                                                {month.name}
                                            </option>

                                        ))}

                                    </select>

                                </div>

                            </div>

                        )}

                        {/* DAYS */}
                        {tempDate.year &&
                            tempDate.month && (

                                <div>

                                    <label className="block text-xs text-gray-500 mb-1">
                                        روز
                                    </label>

                                    <div className="
                                        grid grid-cols-7
                                        gap-1.5
                                        max-h-40
                                        overflow-y-auto
                                        p-1
                                        scrollbar-thin
                                    ">

                                        {validDays.map(day => (

                                            <button
                                                key={day}
                                                type="button"
                                                onClick={() => {

                                                    updateTempDate(
                                                        'day',
                                                        day.toString()
                                                    );

                                                    if (closeOnSelect) {

                                                        setSelectedDate({
                                                            year: tempDate.year,
                                                            month: tempDate.month,
                                                            day: day.toString(),
                                                        });

                                                        closeDropdown();
                                                    }
                                                }}
                                                className={`
                                                    py-2 rounded-lg
                                                    text-sm font-medium
                                                    transition-all duration-150
                                                    cursor-pointer

                                                    ${tempDate.day === day.toString()
                                                        ? 'bg-blue-500 text-white shadow-md scale-105'
                                                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:scale-105'
                                                    }
                                                `}
                                            >
                                                {day}
                                            </button>

                                        ))}

                                    </div>

                                </div>

                            )}

                        {/* ACTIONS */}
                        <div className="flex gap-2 pt-2 border-t border-gray-100">

                            <button
                                type="button"
                                onClick={handleCancel}
                                className="
                                    flex-1
                                    px-3 py-2
                                    rounded-lg
                                    border border-gray-300
                                    text-gray-700
                                    text-sm font-medium
                                    cursor-pointer
                                    transition-colors
                                    hover:bg-gray-50
                                "
                            >
                                انصراف
                            </button>

                            <button
                                type="button"
                                onClick={handleConfirm}
                                disabled={
                                    !tempDate.year ||
                                    !tempDate.month ||
                                    !tempDate.day
                                }
                                className={`
                                    flex-1
                                    px-3 py-2
                                    rounded-lg
                                    text-white text-sm font-medium
                                    transition-all
                                    cursor-pointer

                                    ${tempDate.year &&
                                        tempDate.month &&
                                        tempDate.day
                                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-sm'
                                        : 'bg-gray-300 cursor-not-allowed'
                                    }
                                `}
                            >
                                تایید
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
};

export default React.memo(AdvancedDatePicker);