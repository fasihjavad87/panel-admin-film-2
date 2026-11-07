import React, {
    useEffect,
    useMemo,
    useState,
    useRef,
    useCallback,
} from 'react';

import { useField } from 'formik';
import jMoment from 'moment-jalaali';
import moment from 'moment';

// ماه‌های شمسی
const jalaliMonths = [
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

// ماه‌های میلادی
const gregorianMonths = [
    { id: 1, value: "January", short: "Jan", days: 31 },
    { id: 2, value: "February", short: "Feb", days: 28 },
    { id: 3, value: "March", short: "Mar", days: 31 },
    { id: 4, value: "April", short: "Apr", days: 30 },
    { id: 5, value: "May", short: "May", days: 31 },
    { id: 6, value: "June", short: "Jun", days: 30 },
    { id: 7, value: "July", short: "Jul", days: 31 },
    { id: 8, value: "August", short: "Aug", days: 31 },
    { id: 9, value: "September", short: "Sep", days: 30 },
    { id: 10, value: "October", short: "Oct", days: 31 },
    { id: 11, value: "November", short: "Nov", days: 30 },
    { id: 12, value: "December", short: "Dec", days: 31 },
];

const UnifiedDateTimePicker = ({
    name,
    label,
    yearsLimit = { from: 100, to: 10 },
    initialDate,
    className = '',
    placeholder,
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
    showTime = false,
    timeFormat = 'HH:mm',
    minuteStep = 15,
    defaultTime = 'now',
    minTime = null,
    maxTime = null,
    confirmButtonText = 'تایید',
    confirmButtonStyle = '',
    dateType = 'jalali',
    dateFormat = 'YYYY-MM-DD',
    timeFormatOutput = 'HH:mm:ss',
    showGregorian = false,
    gregorianMonthFormat = 'short',
    // viewMode = 'jalali',
    viewMode ,
}) => {

    const [field, meta, helpers] = useField(name);
    const pickerRef = useRef(null);

    const currentDate = useMemo(() => {
        const now = jMoment();
        const nowGregorian = moment();

        return {
            jalali: {
                year: now.jYear(),
                month: now.jMonth() + 1,
                day: now.jDate(),
                hour: now.hour(),
                minute: Math.floor(now.minute() / minuteStep) * minuteStep,
            },
            gregorian: {
                year: nowGregorian.year(),
                month: nowGregorian.month() + 1,
                day: nowGregorian.date(),
                hour: nowGregorian.hour(),
                minute: Math.floor(nowGregorian.minute() / minuteStep) * minuteStep,
            }
        };
    }, [minuteStep]);

    const [showConfig, setShowConfig] = useState(false);
    const [animation, setAnimation] = useState('');
    const [isInitialized, setIsInitialized] = useState(false);
    const [internalViewMode, setInternalViewMode] = useState(viewMode || (showGregorian ? 'gregorian' : 'jalali'));

    const [date, setDate] = useState({
        day: '',
        month: '',
        year: '',
        hour: '',
        minute: '',
    });

    const [tempDate, setTempDate] = useState({
        day: '',
        month: '',
        year: '',
        hour: '',
        minute: '',
    });

    const isLeapYearJalali = useCallback((yearNum) => {
        const remainders = [1, 5, 9, 13, 17, 22, 26, 30];
        return remainders.includes(yearNum % 33);
    }, []);

    const isLeapYearGregorian = useCallback((yearNum) => {
        return (yearNum % 4 === 0 && yearNum % 100 !== 0) || (yearNum % 400 === 0);
    }, []);

    const getJalaliMonthDays = useCallback((yearNum, monthNum) => {
        if (monthNum < 7) return 31;
        if (monthNum < 12) return 30;
        return isLeapYearJalali(yearNum) ? 30 : 29;
    }, [isLeapYearJalali]);

    const getGregorianMonthDays = useCallback((yearNum, monthNum) => {
        if (monthNum === 2) {
            return isLeapYearGregorian(yearNum) ? 29 : 28;
        }
        return gregorianMonths[monthNum - 1]?.days || 31;
    }, [isLeapYearGregorian]);

    const jalaliToGregorian = useCallback((year, month, day) => {
        try {
            const jMomentDate = jMoment(
                `${year}/${month}/${day}`,
                'jYYYY/jM/jD'
            );

            if (jMomentDate.isValid()) {
                const gregorian = jMomentDate.toDate();
                return moment(gregorian).format(dateFormat);
            }
            return null;
        } catch (error) {
            console.error('Error converting Jalali to Gregorian:', error);
            return null;
        }
    }, [dateFormat]);

    const gregorianToJalali = useCallback((dateString) => {
        try {
            const m = moment(dateString, dateFormat);
            if (m.isValid()) {
                const jMomentDate = jMoment(m.toDate());
                return {
                    year: jMomentDate.jYear().toString(),
                    month: (jMomentDate.jMonth() + 1).toString(),
                    day: jMomentDate.jDate().toString(),
                };
            }
            return null;
        } catch (error) {
            console.error('Error converting Gregorian to Jalali:', error);
            return null;
        }
    }, [dateFormat]);

    const jalaliToGregorianObject = useCallback((year, month, day) => {
        try {
            const jMomentDate = jMoment(
                `${year}/${month}/${day}`,
                'jYYYY/jM/jD'
            );

            if (jMomentDate.isValid()) {
                const gregorian = jMomentDate.toDate();
                const m = moment(gregorian);
                return {
                    year: m.year(),
                    month: m.month() + 1,
                    day: m.date(),
                };
            }
            return null;
        } catch (error) {
            console.error('Error converting Jalali to Gregorian object:', error);
            return null;
        }
    }, []);

    const gregorianObjectToJalali = useCallback((year, month, day) => {
        try {
            const m = moment(`${year}-${month}-${day}`, 'YYYY-M-D');
            if (m.isValid()) {
                const jMomentDate = jMoment(m.toDate());
                return {
                    year: jMomentDate.jYear().toString(),
                    month: (jMomentDate.jMonth() + 1).toString(),
                    day: jMomentDate.jDate().toString(),
                };
            }
            return null;
        } catch (error) {
            console.error('Error converting Gregorian object to Jalali:', error);
            return null;
        }
    }, []);

    const getDisplayMonths = useCallback(() => {
        if (internalViewMode === 'gregorian') {
            return gregorianMonths.map(m => ({
                id: m.id,
                value: gregorianMonthFormat === 'short' ? m.short :
                    gregorianMonthFormat === 'number' ? m.id.toString() :
                        m.value,
                days: m.days,
            }));
        }
        return jalaliMonths;
    }, [internalViewMode, gregorianMonthFormat]);

    // const getDisplayYears = useCallback(() => {
    //     if (internalViewMode === 'gregorian') {
    //         const baseYear = currentDate.gregorian.year;
    //         const from = baseYear - (yearsLimit?.from || 100);
    //         const to = baseYear + (yearsLimit?.to !== undefined ? yearsLimit.to : 10);
    //         return Array.from({ length: to - from + 1 }, (_, i) => from + i);
    //     }

    //     const baseYear = currentDate.jalali.year;
    //     const from = baseYear - (yearsLimit?.from || 100);
    //     const to = baseYear + (yearsLimit?.to !== undefined ? yearsLimit.to : 10);
    //     return Array.from({ length: to - from + 1 }, (_, i) => from + i);
    // }, [internalViewMode, currentDate, yearsLimit]);
    const getDisplayYears = useCallback(() => {
    if (internalViewMode === 'gregorian') {
        const baseYear = currentDate.gregorian.year;
        // ⬇️⬇️⬇️ ?? به جای || (پشتیبانی از 0) ⬇️⬇️⬇️
        const from = baseYear - (yearsLimit?.from ?? 100);
        const to = baseYear + (yearsLimit?.to ?? 10);
        return Array.from({ length: to - from + 1 }, (_, i) => from + i);
    }

    const baseYear = currentDate.jalali.year;
    // ⬇️⬇️⬇️ ?? به جای || ⬇️⬇️⬇️
    const from = baseYear - (yearsLimit?.from ?? 100);
    const to = baseYear + (yearsLimit?.to ?? 10);
    return Array.from({ length: to - from + 1 }, (_, i) => from + i);
}, [internalViewMode, currentDate, yearsLimit]);

    // =========================
    // GET DISPLAY TEMP DATE - اصلاح شده
    // =========================

    const getDisplayTempDate = useCallback(() => {
        if (internalViewMode === 'gregorian') {
            // اگر tempDate مقدار داشته باشه، تبدیل به میلادی کن
            if (tempDate.year && tempDate.month && tempDate.day) {
                const gregorian = jalaliToGregorianObject(
                    parseInt(tempDate.year),
                    parseInt(tempDate.month),
                    parseInt(tempDate.day)
                );
                if (gregorian) {
                    return {
                        year: gregorian.year.toString(),
                        month: gregorian.month.toString(),
                        day: gregorian.day.toString(),
                        hour: tempDate.hour || '',
                        minute: tempDate.minute || '',
                    };
                }
            }
            // اگر tempDate خالی بود، خالی برگردون
            return {
                year: tempDate.year || '',
                month: tempDate.month || '',
                day: tempDate.day || '',
                hour: tempDate.hour || '',
                minute: tempDate.minute || '',
            };
        }
        return tempDate;
    }, [internalViewMode, tempDate, jalaliToGregorianObject]);

    // =========================
    // GET VALID DAYS - اصلاح شده
    // =========================

    const getValidDays = useCallback(() => {
        const current = getDisplayTempDate();

        if (!current.month || !current.year) {
            return [];
        }

        const yearNum = parseInt(current.year);
        const monthNum = parseInt(current.month);

        if (isNaN(yearNum) || isNaN(monthNum)) {
            return [];
        }

        const daysInMonth = internalViewMode === 'gregorian'
            ? getGregorianMonthDays(yearNum, monthNum)
            : getJalaliMonthDays(yearNum, monthNum);

        return Array.from({ length: daysInMonth }, (_, i) => i + 1);
    }, [internalViewMode, getDisplayTempDate, getGregorianMonthDays, getJalaliMonthDays]);

    // =========================
    // CONVERT SELECTED DATE FROM DISPLAY TO JALALI - اصلاح شده
    // =========================

    const convertDisplayDateToJalali = useCallback((displayDate) => {
        if (internalViewMode === 'gregorian') {
            // اگر سال و ماه و روز کامل نباشه، همون مقادیر موجود رو برگردون
            // if (!displayDate.year || !displayDate.month || !displayDate.day) {
            //     return {
            //         year: displayDate.year || tempDate.year || '',
            //         month: displayDate.month || tempDate.month || '',
            //         day: displayDate.day || tempDate.day || '',
            //         hour: displayDate.hour || tempDate.hour || '',
            //         minute: displayDate.minute || tempDate.minute || '',
            //     };
            // }
            if (!displayDate.year || !displayDate.month || !displayDate.day) {
                return {
                    year: displayDate.year,
                    month: displayDate.month,
                    day: displayDate.day,
                    hour: displayDate.hour,
                    minute: displayDate.minute,
                };
            }

            const jalali = gregorianObjectToJalali(
                parseInt(displayDate.year),
                parseInt(displayDate.month),
                parseInt(displayDate.day)
            );

            // if (jalali) {
            //     return {
            //         year: jalali.year,
            //         month: jalali.month,
            //         day: jalali.day,
            //         hour: displayDate.hour || tempDate.hour || '',
            //         minute: displayDate.minute || tempDate.minute || '',
            //     };
            // }

            // // اگر تبدیل نشد، مقادیر قبلی رو برگردون
            // return tempDate;
            if (jalali) {
                return {
                    year: jalali.year,
                    month: jalali.month,
                    day: jalali.day,
                    hour: displayDate.hour,
                    minute: displayDate.minute,
                };
            }

            return {
                year: displayDate.year,
                month: displayDate.month,
                day: displayDate.day,
                hour: displayDate.hour,
                minute: displayDate.minute,
            };
        }
        return displayDate;
    }, [internalViewMode, gregorianObjectToJalali, tempDate]);

    // =========================
    // HANDLE SELECT CHANGE - اصلاح شده
    // =========================

    const handleSelectChange = useCallback((field, value) => {
        if (internalViewMode === 'gregorian') {
            // دریافت تاریخ فعلی نمایش داده شده
            const currentDisplay = getDisplayTempDate();

            // ایجاد تاریخ جدید با مقدار تغییر یافته
            const newDisplay = {
                ...currentDisplay,
                [field]: value,
            };

            // اگر سال یا ماه تغییر کرد، روز رو ریست کن
            if (field === 'year' || field === 'month') {
                newDisplay.day = '';
            }

            // تبدیل به شمسی برای ذخیره در tempDate
            const jalaliDate = convertDisplayDateToJalali(newDisplay);

            if (jalaliDate) {
                setTempDate(jalaliDate);
            }
            return;
        }

        // حالت شمسی
        setTempDate(prev => {
            const newDate = { ...prev, [field]: value };
            if (field === 'year' || field === 'month') {
                newDate.day = '';
            }
            return newDate;
        });
    }, [internalViewMode, getDisplayTempDate, convertDisplayDateToJalali]);

    // =========================
    // CONVERT DISPLAY DATE TO JALALI (برای استفاده در handleSetToday)
    // =========================

    const convertDateToJalali = useCallback((year, month, day, hour = '', minute = '') => {
        if (internalViewMode === 'gregorian') {
            const jalali = gregorianObjectToJalali(
                parseInt(year),
                parseInt(month),
                parseInt(day)
            );
            if (jalali) {
                return {
                    ...jalali,
                    hour: hour,
                    minute: minute,
                };
            }
        }
        return {
            year: year,
            month: month,
            day: day,
            hour: hour,
            minute: minute,
        };
    }, [internalViewMode, gregorianObjectToJalali]);

    // =========================
    // INITIALIZE
    // =========================

    useEffect(() => {
        if (isInitialized) return;

        if (toDay && !initialDate && !field.value) {
            const today = {
                year: currentDate.jalali.year.toString(),
                month: currentDate.jalali.month.toString(),
                day: currentDate.jalali.day.toString(),
                hour: showTime ? currentDate.jalali.hour.toString() : '',
                minute: showTime ? currentDate.jalali.minute.toString() : '',
            };

            setDate(today);

            let value;
            if (dateType === 'gregorian') {
                const gregorianDate = jalaliToGregorian(
                    today.year,
                    today.month,
                    today.day
                );
                value = gregorianDate;
                if (showTime && today.hour && today.minute) {
                    value += ` ${today.hour}:${today.minute.padStart(2, '0')}:00`;
                }
            } else {
                value = `${today.year}/${today.month}/${today.day}`;
                if (showTime && today.hour && today.minute) {
                    value += ` ${today.hour}:${today.minute.padStart(2, '0')}:00`;
                }
            }

            helpers.setValue(value);
            setIsInitialized(true);
            return;
        }

        const dateToSet = initialDate || field.value;

        if (dateToSet) {
            let parsedDate = null;
            let parsedTime = null;

            if (dateType === 'gregorian' && typeof dateToSet === 'string') {
                const gregorianToJalaliResult = gregorianToJalali(dateToSet);
                if (gregorianToJalaliResult) {
                    parsedDate = gregorianToJalaliResult;
                    if (showTime) {
                        const parts = dateToSet.split(' ');
                        if (parts.length >= 2 && parts[1].includes(':')) {
                            const timeParts = parts[1].split(':');
                            if (timeParts.length >= 2) {
                                parsedTime = {
                                    hour: timeParts[0],
                                    minute: timeParts[1],
                                };
                            }
                        }
                    }
                }
            }

            if (!parsedDate) {
                if (typeof dateToSet === 'string') {
                    const parts = dateToSet.split(' ');

                    if (parts.length >= 1 && parts[0].includes('/')) {
                        const dateParts = parts[0].split('/');
                        if (dateParts.length === 3) {
                            const y = parseInt(dateParts[0]);
                            const m = parseInt(dateParts[1]);
                            const d = parseInt(dateParts[2]);

                            if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
                                parsedDate = {
                                    year: y.toString(),
                                    month: m.toString(),
                                    day: d.toString(),
                                };
                            }
                        }
                    }

                    if (showTime && parts.length >= 2 && parts[1].includes(':')) {
                        const timeParts = parts[1].split(':');
                        if (timeParts.length >= 2) {
                            const h = parseInt(timeParts[0]);
                            const min = parseInt(timeParts[1]);
                            if (!isNaN(h) && !isNaN(min) && h >= 0 && h < 24 && min >= 0 && min < 60) {
                                parsedTime = {
                                    hour: h.toString(),
                                    minute: min.toString(),
                                };
                            }
                        }
                    }
                }

                if (!parsedDate) {
                    const m = jMoment(dateToSet, 'jYYYY/jM/jD');
                    if (m.isValid()) {
                        parsedDate = {
                            year: m.jYear().toString(),
                            month: (m.jMonth() + 1).toString(),
                            day: m.jDate().toString(),
                        };
                    }
                }
            }

            if (parsedDate) {
                setDate({
                    ...parsedDate,
                    hour: parsedTime?.hour || '',
                    minute: parsedTime?.minute || '',
                });
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
        showTime,
        dateType,
        jalaliToGregorian,
        gregorianToJalali,
    ]);

    // =========================
    // TOGGLE VIEW MODE
    // =========================

    const toggleViewMode = useCallback((e) => {
        if (e) e.stopPropagation();
        if (showGregorian) {
            setInternalViewMode(prev => prev === 'jalali' ? 'gregorian' : 'jalali');
        }
    }, [showGregorian]);

    const hours = useMemo(() => {
        return Array.from({ length: 24 }, (_, i) => i);
    }, []);

    const minutes = useMemo(() => {
        const mins = [];
        for (let i = 0; i < 60; i += minuteStep) {
            mins.push(i);
        }
        return mins;
    }, [minuteStep]);

    const displayValue = useMemo(() => {
        let result = '';

        if (date.day && date.month && date.year) {
            if (internalViewMode === 'gregorian') {
                const gregorian = jalaliToGregorianObject(
                    parseInt(date.year),
                    parseInt(date.month),
                    parseInt(date.day)
                );
                if (gregorian) {
                    const monthName = gregorianMonths.find(m => m.id === gregorian.month)?.short || '';
                    result = `${gregorian.day} ${monthName} ${gregorian.year}`;
                }
            } else {
                const monthName = jalaliMonths.find(m => m.id === parseInt(date.month))?.value || '';
                result = `${date.day} ${monthName} ${date.year}`;
            }
        }

        if (showTime && date.hour && date.minute) {
            result += ` ساعت ${date.hour}:${date.minute.padStart(2, '0')}`;
        }

        return result;
    }, [date, showTime, internalViewMode, jalaliToGregorianObject]);

    const getDisplayDay = useMemo(() => {
        if (!date.day) return '?';

        if (internalViewMode === 'gregorian') {
            const gregorian = jalaliToGregorianObject(
                parseInt(date.year),
                parseInt(date.month),
                parseInt(date.day)
            );
            return gregorian?.day?.toString() || '?';
        }

        return date.day;
    }, [date, internalViewMode, jalaliToGregorianObject]);

    const closeWithAnimation = useCallback((callback) => {
        setAnimation('slide-out');
        setTimeout(() => {
            callback();
            setAnimation('');
        }, 300);
    }, []);

    const handleToggleConfig = useCallback(() => {
        if (showConfig) {
            closeWithAnimation(() => {
                setShowConfig(false);
            });
            return;
        }

        setTempDate({
            // year: date.year || currentDate.jalali.year.toString(),
            year: date.year || '',
            month: date.month || '',
            day: date.day || '',
            hour: date.hour || (showTime ? currentDate.jalali.hour.toString() : ''),
            minute: date.minute || (showTime ? currentDate.jalali.minute.toString() : ''),
        });

        setShowConfig(true);
        setAnimation('slide-in');
    }, [showConfig, closeWithAnimation, date, currentDate, showTime]);

    const handleConfirm = useCallback((e) => {
        e.stopPropagation();

        let selectedDate = tempDate;

        if (internalViewMode === 'gregorian') {
            const displayDate = getDisplayTempDate();
            selectedDate = convertDisplayDateToJalali(displayDate);
        }

        if (selectedDate.day && selectedDate.month && selectedDate.year) {
            if (showTime && (!selectedDate.hour || !selectedDate.minute)) {
                return;
            }

            setDate(selectedDate);

            let formattedValue;

            if (dateType === 'gregorian') {
                const gregorianDate = jalaliToGregorian(
                    selectedDate.year,
                    selectedDate.month,
                    selectedDate.day
                );

                if (gregorianDate) {
                    formattedValue = gregorianDate;
                    if (showTime && selectedDate.hour && selectedDate.minute) {
                        formattedValue += ` ${selectedDate.hour}:${selectedDate.minute.padStart(2, '0')}:00`;
                    }
                }
            } else {
                formattedValue = `${selectedDate.year}/${selectedDate.month}/${selectedDate.day}`;
                if (showTime && selectedDate.hour && selectedDate.minute) {
                    formattedValue += ` ${selectedDate.hour}:${selectedDate.minute.padStart(2, '0')}:00`;
                }
            }

            helpers.setValue(formattedValue);
            helpers.setTouched(true);

            closeWithAnimation(() => {
                setShowConfig(false);
            });
        }
    }, [tempDate, helpers, closeWithAnimation, showTime, dateType, jalaliToGregorian, internalViewMode, getDisplayTempDate, convertDisplayDateToJalali]);

    const handleCancel = useCallback(() => {
        closeWithAnimation(() => {
            setShowConfig(false);
        });
    }, [closeWithAnimation]);

    const handleClear = useCallback((e) => {
        e.stopPropagation();

        const emptyDate = {
            day: '',
            month: '',
            year: '',
            hour: '',
            minute: '',
        };

        setDate(emptyDate);
        setTempDate(emptyDate);
        helpers.setValue('');
        helpers.setTouched(true);

        closeWithAnimation(() => {
            setShowConfig(false);
        });
    }, [helpers, closeWithAnimation]);

    const handleSetToday = useCallback(() => {
        let todayData;
        if (internalViewMode === 'gregorian') {
            todayData = {
                year: currentDate.gregorian.year.toString(),
                month: currentDate.gregorian.month.toString(),
                day: currentDate.gregorian.day.toString(),
                hour: showTime ? currentDate.gregorian.hour.toString() : '',
                minute: showTime ? currentDate.gregorian.minute.toString() : '',
            };
        } else {
            todayData = {
                year: currentDate.jalali.year.toString(),
                month: currentDate.jalali.month.toString(),
                day: currentDate.jalali.day.toString(),
                hour: showTime ? currentDate.jalali.hour.toString() : '',
                minute: showTime ? currentDate.jalali.minute.toString() : '',
            };
        }

        if (internalViewMode === 'gregorian') {
            const jalali = gregorianObjectToJalali(
                parseInt(todayData.year),
                parseInt(todayData.month),
                parseInt(todayData.day)
            );
            if (jalali) {
                setTempDate({
                    ...jalali,
                    hour: todayData.hour,
                    minute: todayData.minute,
                });
                return;
            }
        }

        setTempDate(todayData);
    }, [currentDate, showTime, internalViewMode, gregorianObjectToJalali]);

    const handleClickOutside = useCallback((event) => {
        if (pickerRef.current && !pickerRef.current.contains(event.target)) {
            handleCancel();
        }
    }, [handleCancel]);

    useEffect(() => {
        if (!showConfig) return;
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showConfig, handleClickOutside]);

    const displayTempDate = getDisplayTempDate();
    const displayMonths = getDisplayMonths();
    const displayYears = getDisplayYears();
    const displayValidDays = getValidDays();

    return (
        <div
            className={`relative w-full ${className}`}
            ref={pickerRef}
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
                    animation: slideInFromMiddle 0.3s cubic-bezier(0.34, 1.2, 0.64, 1) forwards !important;
                }

                .slide-out {
                    animation: slideOutToMiddle 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards !important;
                }

                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }

                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #c1c1c1;
                    border-radius: 3px;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #a8a8a8;
                }
            `}</style>

            {label && (
                <div className='flex items-center justify-between mb-2 select-none'>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        <div className="flex gap-1 items-center">
                            <svg className={`w-[18px] h-[18px] fill-transparent ${iconLabelStyle}`}>
                                <use xlinkHref={`#${iconLabel}`} />
                            </svg>
                            <span className={`${labelColor}`}>{label}</span>
                            {required && <span className="text-red-500">*</span>}
                        </div>
                    </label>
                    <button
                        type='button'
                        onClick={handleClear}
                        className={`px-3 py-1 text-xs bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 rounded-lg transition-colors duration-200 cursor-pointer
                            ${clearable && displayValue && !disabled ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                    >
                        {clearText}
                    </button>
                </div>
            )}

            <div
                onClick={handleToggleConfig}
                className={`
                    group relative
                    flex items-center justify-between
                    w-full pr-3 pl-1.5 py-[9px]
                    bg-white dark:bg-gray-700
                    border rounded-lg select-none
                    transition-all duration-200
                    text-gray-700 dark:text-white

                    ${disabled ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed opacity-60' : 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600'}

                    ${showConfig ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-300 dark:border-gray-600'}
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
                                {getDisplayDay}
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
                            </div>
                            <span>{placeholder || (showTime ? 'انتخاب تاریخ و زمان' : 'انتخاب تاریخ')}</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                    {showGregorian && (
                        <span
                            // type="button"
                            // onClick={toggleViewMode}
                            className="text-xs px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-600  transition-colors cursor-default"
                        >
                            {internalViewMode === 'jalali' ? 'شمسی' : 'میلادی'}
                        </span>
                    )}
                    <svg className={`w-[18px] h-[18px] text-gray-400 fill-transparent transition-transform ${showConfig ? 'rotate-180' : ''}`}>
                        <use xlinkHref="#icon-alt-arrow-down" />
                    </svg>
                </div>
            </div>

            {meta.touched && meta.error && (
                <div className="text-red-500 text-sm mt-1 block">
                    {meta.error}
                </div>
            )}

            {showConfig && (
                <div className={`
                    absolute z-50 mt-1 w-full
                    bg-white dark:bg-gray-800
                    border border-gray-300 dark:border-gray-600
                    rounded-lg shadow-xl select-none
                    transition-all duration-100 overflow-hidden
                    ${animation === 'slide-in' ? 'opacity-100 scale-100' : ''}
                    ${animation === 'slide-out' ? 'opacity-0 scale-95' : ''}
                `}>
                    <div className="
                        sticky z-10 top-0
                        bg-white dark:bg-gray-800
                        p-2
                        border-b border-gray-200 dark:border-gray-700
                        flex justify-between items-center
                    ">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {internalViewMode === 'gregorian' ? 'انتخاب تاریخ میلادی' : 'انتخاب تاریخ شمسی'}
                                {showTime ? ' و زمان' : ''}
                            </span>
                        </div>

                        <div className="flex gap-2">
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

                            {(date.day || date.month || date.year) && (
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
                            </button>
                        </div>
                    </div>

                    <div className="p-2">
                        <div className={`flex gap-2 items-center ${showTime ? 'mb-2' : ''}`}>
                            {internalViewMode === 'gregorian' ? (
                                <>
                                    <div className="flex-1">
                                        <select
                                            value={displayTempDate.year}
                                            onChange={(e) => handleSelectChange('year', e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-center cursor-pointer"
                                        >
                                            <option value="">سال</option>
                                            {displayYears.map(year => (
                                                <option key={year} value={year}>{year}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex-1">
                                        <select
                                            value={displayTempDate.month}
                                            disabled={!displayTempDate.year}
                                            onChange={(e) => handleSelectChange('month', e.target.value)}
                                            className={`w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-center ${!displayTempDate.year ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                        >
                                            <option value="">ماه</option>
                                            {displayMonths.map(month => (
                                                <option key={month.id} value={month.id}>
                                                    {month.value}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex-1">
                                        <select
                                            value={displayTempDate.day}
                                            disabled={!displayTempDate.month}
                                            onChange={(e) => handleSelectChange('day', e.target.value)}
                                            className={`w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-center ${!displayTempDate.month ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                        >
                                            <option value="">روز</option>
                                            {displayValidDays.map(day => (
                                                <option key={day} value={day}>{day}</option>
                                            ))}
                                        </select>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex-1">
                                        <select
                                            value={displayTempDate.day}
                                            disabled={!displayTempDate.month}
                                            onChange={(e) => handleSelectChange('day', e.target.value)}
                                            className={`w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-center ${!displayTempDate.month ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                        >
                                            <option value="">روز</option>
                                            {displayValidDays.map(day => (
                                                <option key={day} value={day}>{day}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex-1">
                                        <select
                                            value={displayTempDate.month}
                                            disabled={!displayTempDate.year}
                                            onChange={(e) => handleSelectChange('month', e.target.value)}
                                            className={`w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-center ${!displayTempDate.year ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                        >
                                            <option value="">ماه</option>
                                            {displayMonths.map(month => (
                                                <option key={month.id} value={month.id}>
                                                    {month.value}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex-1">
                                        <select
                                            value={displayTempDate.year}
                                            onChange={(e) => handleSelectChange('year', e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-center cursor-pointer"
                                        >
                                            <option value="">سال</option>
                                            {displayYears.map(year => (
                                                <option key={year} value={year}>{year}</option>
                                            ))}
                                        </select>
                                    </div>
                                </>
                            )}
                        </div>

                        {showTime && (
                            <div className="flex gap-2 items-center mt-2 border-t border-gray-200 dark:border-gray-700 pt-2">

                                <div className="flex-1">
                                    <select
                                        value={displayTempDate.minute}
                                        onChange={(e) => handleSelectChange('minute', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-center cursor-pointer"
                                    >
                                        <option value="">دقیقه</option>
                                        {minutes.map(minute => (
                                            <option key={minute} value={minute}>
                                                {minute.toString().padStart(2, '0')}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <span className="text-gray-400 dark:text-gray-500 font-bold text-lg">:</span>

                                <div className="flex-1">
                                    <select
                                        value={displayTempDate.hour}
                                        onChange={(e) => handleSelectChange('hour', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-center cursor-pointer"
                                    >
                                        <option value="">ساعت</option>
                                        {hours.map(hour => (
                                            <option key={hour} value={hour}>
                                                {hour.toString().padStart(2, '0')}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex-1 flex justify-center items-center gap-2">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {displayTempDate.hour && displayTempDate.minute ? (
                                            <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                                {displayTempDate.hour.toString().padStart(2, '0')}:
                                                {displayTempDate.minute.toString().padStart(2, '0')}
                                            </span>
                                        ) : (
                                            'زمان را انتخاب کنید'
                                        )}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className={`flex ${showGregorian ? 'justify-between' : 'justify-end'} mt-3`}>
                            {showGregorian && (
                                <button
                                    type="button"
                                    onClick={toggleViewMode}
                                    className="text-xs px-2.5 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors cursor-pointer"
                                >
                                    {internalViewMode === 'jalali' ? 'میلادی' : 'شمسی'}
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={handleConfirm}
                                disabled={
                                    !displayTempDate.day ||
                                    !displayTempDate.month ||
                                    !displayTempDate.year ||
                                    (showTime && (!displayTempDate.hour || !displayTempDate.minute))
                                }
                                className={`
                                    px-6 py-2
                                    flex items-center gap-2
                                    rounded-lg
                                    bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700
                                    text-white
                                    transition-colors
                                    duration-200
                                    disabled:opacity-50
                                    disabled:cursor-not-allowed
                                    cursor-pointer
                                    text-sm font-medium
                                    ${confirmButtonStyle}
                                `}
                            >
                                <svg className="w-4 h-4 fill-transparent">
                                    <use xlinkHref="#icon-checked" />
                                </svg>
                                <span>{confirmButtonText}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )
            }
        </div >
    );
};

export default React.memo(UnifiedDateTimePicker);