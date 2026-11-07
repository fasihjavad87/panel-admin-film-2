import React, { useState, useEffect, useRef } from 'react';
import { Field } from 'formik';

const SearchableSelect = ({
    name,
    model = [],
    searchable = true,
    searchFields = ['title', 'e_name'],
    displayField = 'title',
    displayValue = null,
    valueField = 'id',
    subField = null,
    subToField = false,
    placeholder = 'انتخاب کنید',
    searchPlaceholder = 'جستجو...',
    clearText = null,
    noResultsText = 'موردی یافت نشد',
    noItemsText = 'هیچ آیتمی موجود نیست',
    icon = null,
    iconHeader = false,
    iconToField = false,
    iconItems = false,
    required = false,
    label = null,
    isEnum = false,
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

                const selectedItem = field.value;
                const error = meta.error;
                const touched = meta.touched;

                // بستن هنگام کلیک خارج - بهینه شده
                useEffect(() => {
                    const handleClickOutside = (event) => {
                        // بررسی اگر کامپوننت unmount شده
                        if (!isMounted.current) return;
                        
                        // بررسی اگر dropdown باز نیست
                        if (!open) return;
                        
                        // بررسی اگر روی دکمه یا داخل کامپوننت کلیک شده
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
                }, [open, isTouched, form, name]); // اضافه کردن open به وابستگی‌ها

                // فیلتر کردن آیتم‌ها
                const filteredItems = () => {
                    if (!searchable || !search) return model;
                    
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

                // پیدا کردن آیتم انتخاب شده
                const getSelectedItem = () => {
                    if (!selectedItem) return null;
                    
                    if (isEnum) {
                        return model.find(item => item[valueField] == selectedItem) || null;
                    }
                    return model.find(item => item.id == selectedItem) || null;
                };

                // دریافت متن نمایشی
                const getDisplayText = (item) => {
                    if (!item) return '';
                    if (displayValue && item[displayValue]) return item[displayValue];
                    if (isEnum && item.label) return item.label;
                    if (isEnum && item[displayField]) return item[displayField];
                    return item[displayField] || 'بدون عنوان';
                };

                // دریافت متن دوم
                const getSubText = (item) => {
                    if (!item || !subField || !item[subField]) return '';
                    return item[subField];
                };

                // دریافت حرف اول
                const getInitial = (item) => {
                    if (!item) return '';
                    const text = getDisplayText(item);
                    return text.charAt(0).toUpperCase();
                };

                // انتخاب آیتم
                const selectItem = (itemId) => {
                    const oldValue = selectedItem;
                    
                    setOpen(false);
                    
                    if (oldValue !== itemId) {
                        setIsTouched(true);
                    }
                    
                    if (clearSearchOnClose) {
                        setSearch('');
                    }
                    
                    // استفاده از setTimeout برای جلوگیری از race condition
                    setTimeout(() => {
                        if (isMounted.current) {
                            form.setFieldValue(name, itemId);
                            form.setFieldTouched(name, true);
                        }
                    }, 0);
                };

                // پاک کردن انتخاب
                const clearSelection = () => {
                    const oldValue = selectedItem;
                    
                    setOpen(false);
                    
                    if (oldValue !== '') {
                        setIsTouched(true);
                    }
                    
                    if (clearSearchOnClose) {
                        setSearch('');
                    }
                    
                    setTimeout(() => {
                        if (isMounted.current) {
                            form.setFieldValue(name, '');
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

                // blur دکمه
                const handleButtonBlur = () => {
                    if (!open) {
                        if (!isTouched) {
                            setIsTouched(true);
                        }
                        form.setFieldTouched(name, true);
                    }
                };

                // نمایش خطا
                const showError = error && (touched || isTouched);
                const isValid = required ? (selectedItem && selectedItem !== '') : true;
                const selectedItemData = getSelectedItem();
                const items = filteredItems();

                return (
                    <div className={`md:col-span-3 ${className}`} ref={wrapperRef}>
                        {label && (
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 select-none">
                                <div className="flex items-center gap-1">
                                    {icon && iconHeader && (
                                        <svg className="w-18px h-18px fill-transparent">
                                            <use xlinkHref={`#${icon}`} />
                                        </svg>
                                    )}
                                    <span>{label}</span>
                                    {required && <span className="text-red-500">*</span>}
                                </div>
                            </label>
                        )}

                        <div className="relative">
                            <button
                                ref={buttonRef}
                                onClick={handleButtonClick}
                                onBlur={handleButtonBlur}
                                type="button"
                                className={`w-full pr-3 pl-1.5 py-2.5 text-right border rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-white flex items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-all group ${
                                    open
                                        ? 'border-blue-500 ring-1 ring-blue-500'
                                        : showError && !isValid
                                        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-800'
                                        : 'border-gray-300 dark:border-gray-600'
                                }`}
                                title={selectedItemData ? getDisplayText(selectedItemData) : ''}
                            >
                                <div className="flex-1 min-w-0">
                                    {selectedItemData ? (
                                        <div className="flex items-center gap-2">
                                            {iconToField && (
                                                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 text-xs font-bold flex-shrink-0">
                                                    {getInitial(selectedItemData)}
                                                </div>
                                            )}
                                            <div className="truncate text-sm">
                                                <div className="font-medium truncate">
                                                    {getDisplayText(selectedItemData)}
                                                </div>
                                                {subToField && getSubText(selectedItemData) && (
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                        {getSubText(selectedItemData)}
                                                    </div>
                                                )}
                                            </div>
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
                                <div className="flex items-center gap-1 flex-shrink-0">
                                    <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </button>

                            {open && (
                                <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl max-h-[250px] overflow-auto">
                                    {searchable && (
                                        <div className="sticky select-none z-10 top-0 bg-white dark:bg-gray-800 p-2 border-b border-gray-200 dark:border-gray-700">
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
                                        {/* clear item */}
                                        {model.length > 0 && !(search && items.length === 0) && (
                                            <div
                                                onClick={clearSelection}
                                                className={`pl-3 pr-1.5 py-2 relative hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center justify-between transition-colors rounded-md ${
                                                    !selectedItem ? 'bg-gray-100 dark:bg-gray-700' : ''
                                                }`}
                                            >
                                                <div className="flex items-center gap-2 select-none">
                                                    {iconItems && (
                                                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-600">
                                                            {icon ? (
                                                                <svg className="w-18px h-18px text-gray-600 dark:text-gray-300 fill-transparent">
                                                                    <use xlinkHref={`#${icon}`} />
                                                                </svg>
                                                            ) : (
                                                                <svg className="w-18px h-18px text-gray-600 dark:text-gray-300 fill-transparent">
                                                                    <use xlinkHref="#icon-x-circle" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="font-semibold text-sm text-gray-800 dark:text-gray-200">
                                                            {clearText || placeholder}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* items */}
                                        {items.length > 0 ? (
                                            items.map((item, index) => (
                                                <div
                                                    key={item.id || item.value || index}
                                                    onClick={() => selectItem(isEnum ? item[valueField] : item.id)}
                                                    className={`relative pl-3 pr-1.5 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center justify-between rounded-md transition-colors select-none ${
                                                        selectedItem == (isEnum ? item[valueField] : item.id)
                                                            ? 'bg-blue-50 dark:bg-blue-900/20'
                                                            : ''
                                                    }`}
                                                >
                                                    <div className="grid grid-cols-[auto,1fr] gap-2 items-center grid-flow-col">
                                                        {iconItems && (
                                                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 text-sm font-bold">
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

                        {error && !required && showError && (
                            <span className="text-red-500 text-sm mt-1 block">{error}</span>
                        )}
                    </div>
                );
            }}
        </Field>
    );
};

export default SearchableSelect;