import { ErrorMessage } from 'formik';
import jMoment from 'moment-jalaali';
import React, { useEffect, useState, useRef, useCallback } from 'react';

const months = [
    { id: 1, name: "فروردین", days: 31 },
    { id: 2, name: "اردیبهشت", days: 31 },
    { id: 3, name: "خرداد", days: 31 },
    { id: 4, name: "تیر", days: 31 },
    { id: 5, name: "مرداد", days: 31 },
    { id: 6, name: "شهریور", days: 31 },
    { id: 7, name: "مهر", days: 30 },
    { id: 8, name: "آبان", days: 30 },
    { id: 9, name: "آذر", days: 30 },
    { id: 10, name: "دی", days: 30 },
    { id: 11, name: "بهمن", days: 30 },
    { id: 12, name: "اسفند", days: 29 },
];

const DatePicker = ({ formik, name, label, yearsLimit = { from: 100, to: 10 }, initialDate, className = '', placeholder = 'انتخاب تاریخ', required = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedDay, setSelectedDay] = useState('');
    const [yearsList, setYearsList] = useState([]);
    const [isInitialized, setIsInitialized] = useState(false);
    
    // state برای نگهداری مقادیر موقت در پنل
    const [tempYear, setTempYear] = useState('');
    const [tempMonth, setTempMonth] = useState('');
    const [tempDay, setTempDay] = useState('');
    
    const containerRef = useRef(null);

    const currentValue = formik.values[name];
    const currentYear = jMoment().jYear();

    // تابع تشخیص سال کبیسه شمسی
    const isLeapYear = (year) => {
        const remainders = [1, 5, 9, 13, 17, 22, 26, 30];
        const yearMod = year % 33;
        return remainders.includes(yearMod);
    };

    // گرفتن تعداد روزهای یک ماه با در نظر گرفتن کبیسه
    const getMonthDays = (year, month) => {
        if (month < 7) return 31;
        if (month < 12) return 30;
        return isLeapYear(year) ? 30 : 29;
    };

    // ساخت لیست سال‌ها
    const generateYearsList = useCallback(() => {
        const fromLimit = yearsLimit?.from ?? 100;
        const toLimit = yearsLimit?.to ?? 10;
        
        const from = currentYear - fromLimit;
        const to = currentYear + toLimit;
        
        const years = [];
        for (let i = from; i <= to; i++) {
            years.push(i);
        }
        return years;
    }, [yearsLimit?.from, yearsLimit?.to, currentYear]);

    // مقداردهی اولیه
    useEffect(() => {
        if (isInitialized) return;

        let dateToSet = initialDate || currentValue;
        
        if (dateToSet) {
            let parts = dateToSet.includes('/') ? dateToSet.split('/') : null;
            
            if (parts && parts.length === 3) {
                const year = parseInt(parts[0]);
                const month = parseInt(parts[1]);
                const day = parseInt(parts[2]);
                
                if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
                    setSelectedYear(year.toString());
                    setSelectedMonth(month.toString());
                    setSelectedDay(day.toString());
                    setIsInitialized(true);
                    return;
                }
            }
            
            const m = jMoment(dateToSet, 'jYYYY/jM/jD');
            if (m.isValid()) {
                setSelectedYear(m.jYear().toString());
                setSelectedMonth((m.jMonth() + 1).toString());
                setSelectedDay(m.jDate().toString());
                setIsInitialized(true);
            }
        } else {
            setIsInitialized(true);
        }
    }, [initialDate, currentValue, isInitialized]);

    // آپدیت لیست سال‌ها
    useEffect(() => {
        const newYearsList = generateYearsList();
        setYearsList(newYearsList);
    }, [generateYearsList]);

    // آپدیت فرمیک
    useEffect(() => {
        if (selectedYear && selectedMonth && selectedDay) {
            const formattedDate = `${selectedYear}/${selectedMonth}/${selectedDay}`;
            if (formattedDate !== currentValue) {
                formik.setFieldValue(name, formattedDate);
            }
        } else if (!selectedYear && !selectedMonth && !selectedDay && currentValue) {
            formik.setFieldValue(name, '');
        }
    }, [selectedYear, selectedMonth, selectedDay]);

    // بستن پیکر با کلیک خارج
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                handleCancel(); // بجای setIsOpen(false) مستقیم، از handleCancel استفاده کن
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [tempYear, tempMonth, tempDay]);

    // گرفتن روزهای معتبر ماه
    const getValidDays = useCallback(() => {
        if (!tempYear || !tempMonth) return [];
        
        const year = parseInt(tempYear);
        const month = parseInt(tempMonth);
        const daysInMonth = getMonthDays(year, month);
        
        return Array.from({ length: daysInMonth }, (_, i) => i + 1);
    }, [tempYear, tempMonth]);

    const validDays = getValidDays();

    // نمایش تاریخ انتخاب شده در input
    const getDisplayValue = () => {
        if (selectedYear && selectedMonth && selectedDay) {
            const monthName = months.find(m => m.id === parseInt(selectedMonth))?.name || '';
            return `${selectedDay} ${monthName} ${selectedYear}`;
        }
        return '';
    };

    // باز کردن پنل - مقدارهای موقت رو برابر مقدارهای اصلی می‌کنیم
    const handleOpen = () => {
        setTempYear(selectedYear);
        setTempMonth(selectedMonth);
        setTempDay(selectedDay);
        
        if (!selectedYear) {
            const currentYearStr = currentYear.toString();
            setTempYear(currentYearStr);
        }
        
        setIsOpen(true);
    };

    // تایید - مقدارهای موقت رو به اصلی کپی می‌کنیم
    const handleConfirm = () => {
        if (tempYear && tempMonth && tempDay) {
            setSelectedYear(tempYear);
            setSelectedMonth(tempMonth);
            setSelectedDay(tempDay);
            setIsOpen(false);
        }
    };

    // انصراف - فقط پنل رو می‌بندیم بدون تغییر مقدار اصلی
    const handleCancel = () => {
        setIsOpen(false);
    };

    const handleClear = (e) => {
        e.stopPropagation();
        setSelectedYear('');
        setSelectedMonth('');
        setSelectedDay('');
        setTempYear('');
        setTempMonth('');
        setTempDay('');
        formik.setFieldValue(name, '');
        setIsOpen(false);
    };

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {label}
                    {required && <span className="text-red-500 mr-1">*</span>}
                </label>
            )}

            <div
                onClick={handleOpen}
                className={`group relative flex items-center justify-between w-full px-4 py-2.5 bg-white border rounded-xl cursor-pointer transition-all duration-200
                    ${isOpen 
                        ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-sm' 
                        : 'border-gray-300 hover:border-gray-400 hover:shadow-sm'
                    }`}
            >
                <div className="flex items-center gap-2">
                    <svg className={`w-5 h-5 transition-colors ${isOpen ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className={`${getDisplayValue() ? 'text-gray-800' : 'text-gray-400'}`}>
                        {getDisplayValue() || placeholder}
                    </span>
                </div>
                
                <div className="flex items-center gap-1">
                    {getDisplayValue() && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <svg className="w-4 h-4 text-gray-400 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                    <svg className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            <ErrorMessage name={name}>
                {msg => <div className="text-red-500 text-xs mt-1 mr-1">{msg}</div>}
            </ErrorMessage>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden" style={{ animation: 'fadeIn 0.15s ease-out' }}>
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3">
                        <div className="flex items-center justify-between text-white">
                            <span className="text-sm font-medium">انتخاب تاریخ</span>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="p-1 rounded-full hover:bg-white/20 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="p-4 space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">سال</label>
                                <select
                                    value={tempYear}
                                    onChange={(e) => setTempYear(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-center"
                                >
                                    <option value="">انتخاب سال</option>
                                    {yearsList.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs text-gray-500 mb-1">ماه</label>
                                <select
                                    value={tempMonth}
                                    onChange={(e) => setTempMonth(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-center"
                                >
                                    <option value="">انتخاب ماه</option>
                                    {months.map(month => (
                                        <option key={month.id} value={month.id}>{month.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {tempYear && tempMonth && (
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">روز</label>
                                <div className="grid grid-cols-7 gap-1.5 max-h-40 overflow-y-auto p-1 scrollbar-thin">
                                    {validDays.map(day => (
                                        <button
                                            key={day}
                                            type="button"
                                            onClick={() => setTempDay(day.toString())}
                                            className={`
                                                py-2 rounded-lg text-sm font-medium transition-all duration-150
                                                ${tempDay === day.toString()
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

                        <div className="flex gap-2 pt-2 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
                            >
                                انصراف
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirm}
                                disabled={!tempYear || !tempMonth || !tempDay}
                                className={`
                                    flex-1 px-3 py-2 rounded-lg text-white text-sm font-medium transition-all
                                    ${tempYear && tempMonth && tempDay
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

export default DatePicker;