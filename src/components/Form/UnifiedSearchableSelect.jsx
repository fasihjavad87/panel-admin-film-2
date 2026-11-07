// components/Form/UnifiedSearchableSelect.jsx

import React, {
    useEffect,
    useMemo,
    useRef,
    useCallback,
} from 'react';

import { useField } from 'formik';

import { useSearchableSelect } from '../../hooks/useSearchableSelect';
import { openAlertModal } from '../Modal/modal';

const UnifiedSearchableSelect = ({
    name,

    model = [],
    mode = 'single',

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

    className = '',

    countTop = false,
    clearTop = false,
    countBottom = false,
    countToField = false,

    maxSelections = null,
}) => {

    // FORMK
    const [field, meta, helpers] = useField(name);

    const isMulti = mode === 'multi';

    const currentValue = useMemo(() => {
        return isMulti
            ? (field.value || [])
            : field.value;
    }, [field.value, isMulti]);

    // SEARCHABLE HOOK
    const {
        open,
        setOpen,

        search,
        setSearch,

        isTouched,

        wrapperRef,

        filteredItems,

        selectItem: hookSelectItem,

        clearSelection,

    } = useSearchableSelect({
        model,
        searchable,
        searchFields,
        clearSearchOnClose,
        autoFocusSearch,

        isMulti,

        value: currentValue,

        onChange: (newValue) => {
            helpers.setValue(newValue);
            helpers.setTouched(true);
        },

        onTouched: () => {
            helpers.setTouched(true);
        },

        maxSelections,
    });

    // SEARCH INPUT REF
    const searchInputRef = useRef(null);


    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target)
            ) {
                setOpen(false);
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

    }, [wrapperRef, setOpen]);

    // AUTO FOCUS
    useEffect(() => {

        if (
            open &&
            searchable &&
            autoFocusSearch &&
            searchInputRef.current
        ) {

            const timer = setTimeout(() => {

                searchInputRef.current.focus();

                const length =
                    searchInputRef.current.value.length;

                searchInputRef.current.setSelectionRange(
                    length,
                    length
                );

            }, 50);

            return () => clearTimeout(timer);
        }

    }, [open, searchable, autoFocusSearch]);

    // MODEL MAP
    const modelMap = useMemo(() => {

        return new Map(
            model.map(item => [
                String(item[valueField]),
                item
            ])
        );

    }, [model, valueField]);

    // FILTERED ITEMS
    const items = useMemo(() => {
        return filteredItems();
    }, [filteredItems, search]);

    // DISPLAY TEXT
    const getDisplayText = useCallback((item) => {

        if (!item) return '';

        if (displayValue && item[displayValue]) {
            return item[displayValue];
        }

        if (isEnum && item.label) {
            return item.label;
        }

        return item[displayField] || 'بدون عنوان';

    }, [
        displayField,
        displayValue,
        isEnum
    ]);

    // SUB TEXT
    const getSubText = useCallback((item) => {

        if (!item || !subField) return '';

        return item[subField] || '';

    }, [subField]);

    // INITIAL
    const getInitial = useCallback((item) => {

        return getDisplayText(item)
            .charAt(0)
            .toUpperCase();

    }, [getDisplayText]);

    // SELECTED ITEM
    const selectedItemData = useMemo(() => {

        if (isMulti || !currentValue) {
            return null;
        }

        return modelMap.get(String(currentValue)) || null;

    }, [
        isMulti,
        currentValue,
        modelMap
    ]);

    // SELECTED ITEMS
    const selectedItemsData = useMemo(() => {

        if (
            !isMulti ||
            !Array.isArray(currentValue)
        ) {
            return [];
        }

        return currentValue
            .map(id => modelMap.get(String(id)))
            .filter(Boolean);

    }, [
        isMulti,
        currentValue,
        modelMap
    ]);

    // COUNT
    const selectionCount = useMemo(() => {

        return isMulti
            ? currentValue.length
            : 0;

    }, [isMulti, currentValue]);

    // SELECT ITEM
    const selectItem = useCallback((itemId) => {

        if (
            isMulti &&
            maxSelections &&
            currentValue.length >= maxSelections &&
            !currentValue.includes(itemId)
        ) {

            openAlertModal({
                title: 'محدودیت انتخاب',
                message: `شما حداکثر می‌توانید ${maxSelections} گزینه انتخاب کنید.`,
                confirmText: 'باشه',
                variant: 'warning',
            });

            return;
        }

        hookSelectItem(itemId);

    }, [
        isMulti,
        maxSelections,
        currentValue,
        hookSelectItem
    ]);

    // REMOVE ITEM
    const removeItem = useCallback((itemId, e) => {

        e.stopPropagation();

        hookSelectItem(itemId);

    }, [hookSelectItem]);

    // CLEAR ALL
    const clearAll = useCallback(() => {

        setSearch('');
        clearSelection();
        setOpen(false);

    }, [
        setSearch,
        clearSelection,
        setOpen
    ]);

    // VALIDATION
    const showError =
        meta.error &&
        (meta.touched || isTouched);

    const isValid = required
        ? (
            isMulti
                ? currentValue.length > 0
                : currentValue && currentValue !== ''
        )
        : true;

    return (
        <div
            // md:col-span-3
            className={` ${className}`}
            ref={wrapperRef}
        >

            {/* LABEL */}
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 select-none">

                    <div className="flex items-center justify-between pl-2">

                        <div className="flex items-center gap-1">

                            {icon && iconHeader && (
                                <svg className="w-[18px] h-[18px] fill-transparent">
                                    <use xlinkHref={`#${icon}`} />
                                </svg>
                            )}

                            <span>{label}</span>

                            {required && (
                                <span className="text-red-500">*</span>
                            )}

                            {isMulti &&
                                countTop &&
                                selectionCount > 0 && (
                                    <span className="text-sm text-blue-600">
                                        ({selectionCount} انتخاب)
                                    </span>
                                )}

                        </div>

                        {isMulti &&
                            clearTop &&
                            selectionCount > 0 && (
                                <span
                                    onClick={clearAll}
                                    className="text-sm text-red-600 cursor-pointer hover:underline"
                                >
                                    حذف همه
                                </span>
                            )}

                    </div>

                </label>
            )}

            {/* BUTTON */}
            <div className="relative">

                <button
                    type="button"

                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setOpen(!open);
                    }}

                    onBlur={() => {
                        if (!open) {
                            helpers.setTouched(true);
                        }
                    }}

                    className={`
                        w-full
                        pr-3 pl-1.5 py-2.5
                        text-right
                        border rounded-lg
                        bg-white dark:bg-gray-700
                        text-gray-700 dark:text-white
                        flex items-center
                        cursor-pointer
                        hover:bg-gray-50
                        transition-all

                        ${open
                            ? 'border-blue-500 ring-1 ring-blue-500'
                            : showError && !isValid
                                ? 'border-red-500'
                                : 'border-gray-300 dark:border-gray-600'
                        }
                    `}
                >

                    {/* CONTENT */}
                    <div className="flex-1 min-w-0 text-right">

                        {/* MULTI */}
                        {isMulti && selectionCount > 0 ? (

                            <div className="flex flex-wrap gap-1">

                                {selectedItemsData.map(item => (

                                    <div
                                        key={item[valueField]}
                                        className="
                                            flex items-center gap-1
                                            bg-blue-50
                                            text-custom-blue
                                            pr-2 pl-1.5 py-1
                                            border border-custom-blue
                                            rounded-full text-xs
                                        "
                                    >

                                        <span className="font-semibold">
                                            {getDisplayText(item)}
                                        </span>

                                        <i
                                            onClick={(e) =>
                                                removeItem(
                                                    item[valueField],
                                                    e
                                                )
                                            }
                                            className="
                                                fa-light fa-xmark
                                                text-red-500
                                                cursor-pointer
                                            "
                                        />

                                    </div>

                                ))}

                            </div>

                        ) : !isMulti && selectedItemData ? (

                            <div className="flex items-center gap-2">

                                {iconToField && (
                                    <div className="
                                        w-6 h-6 rounded-full
                                        bg-blue-100
                                        flex items-center justify-center
                                        text-blue-600 text-xs font-bold
                                        flex-shrink-0
                                    ">
                                        {getInitial(selectedItemData)}
                                    </div>
                                )}

                                <div className="truncate">

                                    <div className="font-medium truncate">
                                        {getDisplayText(selectedItemData)}
                                    </div>

                                    {subToField &&
                                        getSubText(selectedItemData) && (
                                            <div className="text-xs text-gray-500 truncate">
                                                {getSubText(selectedItemData)}
                                            </div>
                                        )}

                                </div>

                            </div>

                        ) : (

                            <div className="text-gray-500 text-sm flex items-center gap-2">

                                {iconToField && (
                                    <div className="
                                        w-6 h-6 rounded-full
                                        bg-gray-100
                                        flex items-center justify-center
                                    ">

                                        {icon ? (
                                            <svg className="w-4 h-4 fill-transparent">
                                                <use xlinkHref={`#${icon}`} />
                                            </svg>
                                        ) : (
                                            <svg
                                                className="w-4 h-4 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M19 9l-7 7-7-7"
                                                />
                                            </svg>
                                        )}

                                    </div>
                                )}

                                <span>{placeholder}</span>

                            </div>

                        )}

                    </div>

                    {/* RIGHT */}
                    <div className="flex items-center gap-1 mr-2">

                        {isMulti &&
                            countToField &&
                            selectionCount > 0 && (
                                <span className="
                                    bg-blue-600 text-white
                                    text-xs rounded-full
                                    w-5 h-5
                                    flex items-center justify-center
                                ">
                                    {selectionCount}
                                </span>
                            )}

                        <svg
                            className={`
                                w-4 h-4 text-gray-400
                                transition-transform
                                ${open ? 'rotate-180' : ''}
                            `}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>

                    </div>

                </button>

                {/* DROPDOWN */}
                {open && (

                    <div className="
                        absolute z-50 mt-1 w-full
                        bg-white dark:bg-gray-800
                        border border-gray-300
                        rounded-lg shadow-xl
                        
                    ">

                        {/* SEARCH */}
                        {searchable && (

                            <div className="
                                sticky top-0
                                bg-white
                                p-2
                                border-b
                            ">

                                <div className="relative">

                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        value={search}
                                        autoComplete="off"
                                        placeholder={searchPlaceholder}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        className="
                                            w-full pl-9 pr-3 py-2
                                            border rounded-lg
                                            bg-gray-50
                                            text-sm
                                            focus:outline-none
                                            focus:ring-2
                                            focus:ring-blue-500
                                        "
                                    />

                                    <div className="
                                        absolute left-3 top-1/2
                                        -translate-y-1/2
                                        text-gray-400
                                    ">
                                        <svg className="w-4 h-4 fill-transparent">
                                            <use xlinkHref="#icon-search" />
                                        </svg>
                                    </div>

                                </div>

                            </div>

                        )}

                        {/* ITEMS */}
                        <div className="p-1 flex flex-col gap-1 max-h-[240px] overflow-auto scrollbar-thin">

                            {!isMulti &&
                                model.length > 0 &&
                                !(search && items.length === 0) && (

                                    <div
                                        onClick={clearSelection}
                                        className="
                                            p-2 rounded-md
                                            hover:bg-gray-100
                                            cursor-pointer
                                        "
                                    >
                                        <div className="font-semibold text-sm">
                                            {clearText || placeholder}
                                        </div>
                                    </div>

                                )}

                            {items.length > 0 ? (

                                items.map(item => {

                                    const itemId =
                                        item[valueField];

                                    const checked =
                                        isMulti
                                            ? currentValue.includes(itemId)
                                            : currentValue == itemId;

                                    return (

                                        <div
                                            key={itemId}

                                            onClick={() =>
                                                selectItem(itemId)
                                            }

                                            className={`
                                                p-2 rounded-md
                                                cursor-pointer
                                                hover:bg-gray-100
                                                ${checked
                                                    ? 'bg-blue-50'
                                                    : ''
                                                }
                                            `}
                                        >

                                            <div className="flex gap-2 items-center">

                                                {/* CHECKBOX */}
                                                {isMulti && (

                                                    <div className={`
                                                        w-5 h-5
                                                        border rounded
                                                        flex items-center justify-center

                                                        ${checked
                                                            ? 'bg-custom-blue border-custom-blue'
                                                            : 'border-gray-400 bg-white'
                                                        }
                                                    `}>

                                                        {checked && (
                                                            <svg
                                                                className="w-4 h-4 text-white"
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

                                                )}

                                                {/* ICON */}
                                                {iconItems && (
                                                    <div className="
                                                        w-6 h-6 rounded-full
                                                        bg-blue-100
                                                        flex items-center justify-center
                                                        text-blue-600
                                                        text-xs font-bold
                                                    ">
                                                        {getInitial(item)}
                                                    </div>
                                                )}

                                                {/* CONTENT */}
                                                <div>

                                                    <div className="
                                                        font-semibold
                                                        text-sm
                                                        text-gray-800
                                                        truncate
                                                    ">
                                                        {getDisplayText(item)}
                                                    </div>

                                                    {getSubText(item) && (
                                                        <div className="
                                                            text-xs
                                                            text-gray-500
                                                            truncate
                                                        ">
                                                            {getSubText(item)}
                                                        </div>
                                                    )}

                                                </div>

                                            </div>

                                        </div>

                                    );

                                })

                            ) : (

                                <div className="
                                    px-3 py-4
                                    text-center text-sm
                                    text-gray-500
                                ">
                                    {model.length === 0
                                        ? noItemsText
                                        : noResultsText
                                    }
                                </div>

                            )}

                        </div>

                    </div>

                )}

            </div>

            {/* BOTTOM COUNT */}
            {isMulti &&
                countBottom &&
                maxSelections && (
                    <div className="mt-1 text-xs text-gray-500">
                        {selectionCount} از {maxSelections} انتخاب ممکن
                    </div>
                )}

            {/* ERROR */}
            {showError && !isValid && (

                <div className="
                    mt-1.5
                    flex items-center gap-1.5
                    text-red-500
                ">

                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4m0 4h.01"
                        />
                    </svg>

                    <span className="text-xs md:text-sm">
                        {meta.error ||
                            `لطفاً ${label || 'این فیلد'} را انتخاب کنید`
                        }
                    </span>

                </div>

            )}

        </div>
    );
};

export default React.memo(UnifiedSearchableSelect);