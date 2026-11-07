import React, { useState, useEffect, useRef } from 'react';
import { Field } from 'formik';
import { openAlertModal } from '../Modal/modal';

const SearchableSelctMulti = ({
    name,
    model = [],
    searchable = true,
    searchFields = ['title', 'e_name'],
    displayField = 'title',
    subField = null,
    placeholder = 'انتخاب کنید',
    searchPlaceholder = 'جستجو...',
    clearText = null,
    noResultsText = 'موردی یافت نشد',
    noItemsText = 'هیچ آیتمی موجود نیست',
    icon = null,
    iconHeader = false,
    iconToField = false,
    iconItems = false,
    countTop = false,
    clearTop = false,
    countBottom = false,
    countToField = false,
    required = false,
    label = null,
    maxSelections = null,
    autoFocusSearch = true,
    clearSearchOnClose = true,
    className = ''
}) => {

    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [isTouched, setIsTouched] = useState(false);

    const searchInputRef = useRef(null);
    const wrapperRef = useRef(null);
    const buttonRef = useRef(null);
    const isMounted = useRef(true);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    // فوکوس روی جستجو هنگام باز شدن
    useEffect(() => {
        if (open && searchable && autoFocusSearch) {
            setTimeout(() => {
                if (searchInputRef.current && isMounted.current) {
                    searchInputRef.current.focus();
                    const length = searchInputRef.current.value.length;
                    searchInputRef.current.setSelectionRange(length, length);
                }
            }, 100);
        }

        if (!open && clearSearchOnClose) {
            setSearch('');
        }
    }, [open, searchable, autoFocusSearch, clearSearchOnClose]);

    return (
        <Field name={name}>
            {({ field, form, meta }) => {

                const selectedItems = field.value || [];
                const error = meta.error;
                const touched = meta.touched;

                // بستن هنگام کلیک خارج - بهینه شده
                useEffect(() => {
                    const handleClickOutside = (event) => {
                        // بررسی اگر کامپوننت unmount شده
                        if (!isMounted.current) return;

                        // بررسی اگر dropdown باز نیست
                        if (!open) return;

                        // بررسی اگر روی کامپوننت کلیک شده
                        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                            setOpen(false);
                            if (isTouched) {
                                form.setFieldTouched(name, true);
                            }
                        }
                    };

                    // فقط در صورت باز بودن dropdown listener اضافه شود
                    if (open) {
                        document.addEventListener('mousedown', handleClickOutside);
                    }

                    return () => {
                        document.removeEventListener('mousedown', handleClickOutside);
                    };
                }, [open, isTouched, form, name]);

                // فیلتر کردن آیتم‌ها
                const filteredItems = () => {
                    if (!searchable || !search) {
                        return model;
                    }

                    return model.filter(item => {
                        return searchFields.some(field => {
                            if (item[field]) {
                                return item[field]
                                    .toString()
                                    .toLowerCase()
                                    .includes(search.toLowerCase());
                            }
                            return false;
                        });
                    });
                };

                // بررسی انتخاب
                const isSelected = (itemId) => {
                    return selectedItems.includes(itemId);
                };

                // اضافه یا حذف آیتم
                const toggleItem = (itemId) => {
                    let newSelectedItems = [...selectedItems];
                    const index = newSelectedItems.indexOf(itemId);

                    if (index > -1) {
                        newSelectedItems.splice(index, 1);
                    } else {
                        if (maxSelections && newSelectedItems.length >= maxSelections) {
                            openAlertModal({
                                title: 'محدودیت انتخاب',
                                message: `شما حداکثر می‌توانید ${maxSelections} گزینه انتخاب کنید.`,
                                confirmText: 'باشه',
                                variant: 'warning',
                                icon: 'danger-circle'
                            });
                            return;
                        }
                        newSelectedItems.push(itemId);
                    }

                    setIsTouched(true);

                    setTimeout(() => {
                        if (isMounted.current) {
                            form.setFieldValue(name, newSelectedItems);
                            form.setFieldTouched(name, true);
                        }
                    }, 0);
                };

                // حذف آیتم
                const removeItem = (itemId, event) => {
                    event.stopPropagation();
                    event.preventDefault();

                    const newSelectedItems = selectedItems.filter(id => id !== itemId);
                    setIsTouched(true);

                    setTimeout(() => {
                        if (isMounted.current) {
                            form.setFieldValue(name, newSelectedItems);
                            form.setFieldTouched(name, true);
                        }
                    }, 0);
                };

                // پاک کردن همه
                const clearAll = () => {
                    setSearch('');
                    setIsTouched(true);
                    setOpen(false);

                    setTimeout(() => {
                        if (isMounted.current) {
                            form.setFieldValue(name, []);
                            form.setFieldTouched(name, true);
                        }
                    }, 0);
                };

                // کلیک روی دکمه
                const handleButtonClick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setOpen(!open);
                };

                // آیتم‌های انتخاب شده
                const getSelectedItemsData = () => {
                    if (!Array.isArray(selectedItems) || selectedItems.length === 0) {
                        return [];
                    }
                    return model.filter(item => selectedItems.includes(item.id));
                };

                // متن نمایشی
                const getDisplayText = (item) => {
                    if (!item) return '';
                    return item[displayField] || 'بدون عنوان';
                };

                // متن دوم
                const getSubText = (item) => {
                    if (!item || !subField || !item[subField]) {
                        return '';
                    }
                    return item[subField];
                };

                // حرف اول
                const getInitial = (item) => {
                    if (!item) return '';
                    const text = getDisplayText(item);
                    return text.charAt(0).toUpperCase();
                };

                // تعداد انتخاب
                const getSelectionCount = () => {
                    return selectedItems.length;
                };

                // خلاصه انتخاب‌ها
                const getSelectionSummary = () => {
                    const items = getSelectedItemsData();
                    if (items.length === 0) return '';

                    const names = items.slice(0, 2).map(item => getDisplayText(item));
                    let summary = names.join(', ');

                    if (items.length > 2) {
                        summary += ` و ${items.length - 2} مورد دیگر`;
                    }
                    return summary;
                };

                // blur
                const handleButtonBlur = () => {
                    if (open) return;

                    if (!isTouched) {
                        setIsTouched(true);
                    }
                    form.setFieldTouched(name, true);
                };

                // نمایش خطا
                const showError = error && (touched || isTouched);
                const isValid = required ? selectedItems.length > 0 : true;

                const items = filteredItems();
                const selectedItemsData = getSelectedItemsData();

                return (
                    <div className={`md:col-span-3 ${className}`} ref={wrapperRef}>
                        {label && (
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <div className="flex items-center justify-between pl-2">
                                    <div className="flex gap-1">
                                        {icon && iconHeader && (
                                            <svg className="w-18px h-18px fill-transparent">
                                                <use xlinkHref={`#${icon}`} />
                                            </svg>
                                        )}
                                        <span>{label}</span>
                                        {required && <span className="text-red-500">*</span>}
                                        {countTop && getSelectionCount() > 0 && (
                                            <span className="text-sm text-blue-600 dark:text-blue-400">
                                                ({getSelectionCount()} انتخاب)
                                            </span>
                                        )}
                                    </div>

                                    {clearTop && getSelectionCount() > 0 && (
                                        <div>
                                            <span
                                                onClick={clearAll}
                                                className="text-sm text-red-600 dark:text-red-400 cursor-pointer hover:underline"
                                            >
                                                حذف همه
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </label>
                        )}

                        <div className="relative">
                            <button
                                ref={buttonRef}
                                onClick={handleButtonClick}
                                onBlur={handleButtonBlur}
                                type="button"
                                className={`w-full pr-3 pl-1.5 py-2.5 text-right border rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-white flex items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-all group ${open
                                        ? 'border-blue-500 ring-1 ring-blue-500'
                                        : showError && !isValid
                                            ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-800'
                                            : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                title={getSelectionSummary()}
                            >
                                <div className="flex-1 min-w-0 text-right">
                                    {getSelectionCount() > 0 ? (
                                        <div className="flex flex-wrap gap-1">
                                            {selectedItemsData.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex items-center justify-center gap-1 bg-blue-50 dark:bg-blue-900 text-custom-blue dark:text-blue-200 pr-2 pl-1.5 py-1 border border-custom-blue rounded-full text-xs group"
                                                >
                                                    <span className='font-semibold'>{getDisplayText(item)}</span>
                                                    {/* <span
                                                        onClick={(e) => removeItem(item.id, e)}
                                                        className="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100 cursor-pointer"
                                                    > */}
                                                        <i 
                                                        onClick={(e) => removeItem(item.id, e)}
                                                        className="fa-light fa-xmark text-[13px] text-red-500 group-hover:text-red-700 transition"></i>
                                                    {/* </span> */}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-2">
                                            {iconToField && (
                                                <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                                    {icon ? (
                                                        <svg className="w-4 h-4 fill-transparent">
                                                            <use xlinkHref={`#${icon}`} />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    )}
                                                </div>
                                            )}
                                            <span>{placeholder}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-1 flex-shrink-0 mr-2">
                                    {countToField && getSelectionCount() > 0 && (
                                        <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                            {getSelectionCount()}
                                        </span>
                                    )}
                                    <svg
                                        className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </button>

                            {open && (
                                <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl max-h-[300px] overflow-auto">
                                    {searchable && (
                                        <div className="sticky z-10 top-0 bg-white dark:bg-gray-800 p-2 border-b border-gray-200 dark:border-gray-700">
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={search}
                                                    onChange={(e) => setSearch(e.target.value)}
                                                    ref={searchInputRef}
                                                    placeholder={searchPlaceholder}
                                                    className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-white focus:border-blue-500 text-sm"
                                                    autoComplete="off"
                                                    onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
                                                />
                                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                    <svg className="w-18px h-18px fill-transparent">
                                                        <use xlinkHref="#icon-search" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="p-1 flex flex-col gap-1">
                                        {items.length > 0 ? (
                                            items.map((item) => (
                                                <div
                                                    key={item.id}
                                                    onClick={() => toggleItem(item.id)}
                                                    className={`relative pl-3 pr-1.5 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center justify-between rounded-md transition-colors ${isSelected(item.id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                                        }`}
                                                >
                                                    <div className="flex gap-2 items-center">
                                                        <div className="flex items-center justify-center">
                                                            <div
                                                                className={`w-5 h-5 border rounded flex items-center justify-center ${isSelected(item.id)
                                                                        ? 'bg-custom-blue border-custom-blue'
                                                                        : 'border-gray-400 dark:border-gray-500 bg-white dark:bg-gray-700'
                                                                    }`}
                                                            >
                                                                {isSelected(item.id) && (
                                                                    <svg
                                                                        className="w-18px h-18px text-white"
                                                                        fill="currentColor"
                                                                        viewBox="0 0 20 20"
                                                                    >
                                                                        <path
                                                                            fillRule="evenodd"
                                                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                            clipRule="evenodd"
                                                                        />
                                                                    </svg>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            {iconItems && (
                                                                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 text-xs font-bold">
                                                                    {getInitial(item)}
                                                                </div>
                                                            )}
                                                            <div className="min-w-0">
                                                                <div className="font-semibold text-sm text-gray-800 dark:text-gray-200 truncate">
                                                                    {getDisplayText(item)}
                                                                </div>
                                                                {getSubText(item) && (
                                                                    <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                                                        {getSubText(item)}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : model.length === 0 ? (
                                            <div className="px-3 py-4 text-center text-gray-500 dark:text-gray-400">
                                                <div className="text-sm">{noItemsText}</div>
                                            </div>
                                        ) : (
                                            <div className="px-3 py-4 text-center text-gray-500 dark:text-gray-400">
                                                <div className="text-sm">{noResultsText}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {showError && !isValid && (
                            <div className="mt-1.5 flex items-center gap-1.5 text-red-500 animate-shake">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-xs md:text-sm">
                                    {error || `لطفاً ${label || 'این فیلد'} را انتخاب کنید`}
                                </span>
                            </div>
                        )}

                        {countBottom && maxSelections && (
                            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                {getSelectionCount()} از {maxSelections} انتخاب ممکن
                            </div>
                        )}
                    </div>
                );
            }}
        </Field>
    );
};

export default SearchableSelctMulti;