// components/Form/UnifiedTextarea.jsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ErrorMessage, useFormikContext } from 'formik';

const UnifiedTextarea = ({
    // ===== Basic Props =====
    name,
    label = null,
    placeholder = '',
    required = false,
    disabled = false,
    readOnly = false,
    autoFocus = false,
    rows = 4,

    // ===== Styling =====
    className = '',
    wrapperClass = '',
    inputClass = '',
    size = 'md',
    rounded = 'lg',
    variant = 'default',

    // ===== Colors =====
    labelColor = 'text-gray-700 dark:text-gray-300',
    placeholderColor = 'placeholder:text-gray-500 dark:placeholder:text-gray-400',
    textColor = 'text-gray-900 dark:text-white',
    requiredColor = 'text-red-500',

    // ===== Icons =====
    icon = null,
    iconPosition = 'left',
    iconColor = 'text-gray-400 dark:text-gray-400',
    iconFocusColor = '!text-blue-500',
    iconSize = 'w-5 h-5',
    iconLabel = null,
    iconLabelStyle = '',

    // ===== Addon =====
    addon = null,
    addonColor = 'text-gray-500 dark:text-gray-400',
    addonPosition = 'left',

    // ===== Validation =====
    minLength = null,
    maxLength = null,

    // ===== Helpers =====
    helperText = null,
    helperTextColor = 'text-gray-500 dark:text-gray-400',
    error = null,
    success = null,

    // ===== Direction =====
    dir = 'auto',
    ltr = false,
    rtl = false,

    // ===== Events =====
    onChange,
    onBlur,
    onFocus,
    onInput,

    // ===== Clear =====
    clearable = false,
    clearText = 'پاک کردن',

    // ===== Counter =====
    showCount = false,
}) => {
    // ============================================
    // HOOKS
    // ============================================
    const formikContext = useFormikContext();
    const { values, setFieldValue, setFieldTouched } = formikContext || {};

    // ============================================
    // REFS
    // ============================================
    const leftAddonRef = useRef(null);
    const rightAddonRef = useRef(null);
    const textareaRef = useRef(null);

    // ============================================
    // STATE
    // ============================================
    const [isFocused, setIsFocused] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [leftAddonWidth, setLeftAddonWidth] = useState(0);
    const [rightAddonWidth, setRightAddonWidth] = useState(0);

    // ============================================
    // DERIVED STATE
    // ============================================
    const currentValue = values?.[name] ?? '';
    const textDirection = rtl ? 'rtl' : ltr ? 'ltr' : dir;

    // ============================================
    // HANDLERS
    // ============================================
    const handleInputChange = useCallback((e) => {
        const rawValue = e.target.value;

        setInputValue(rawValue);

        if (setFieldValue) {
            setFieldValue(name, rawValue);
            setFieldTouched?.(name, true);
        }

        onChange?.(rawValue, name);
        onInput?.(rawValue, name);
    }, [name, setFieldValue, setFieldTouched, onChange, onInput]);

    const handleFocus = useCallback((e) => {
        setIsFocused(true);
        onFocus?.(name, e.target.value);
    }, [onFocus, name]);

    const handleBlur = useCallback((e) => {
        setIsFocused(false);
        setFieldTouched?.(name, true);
        onBlur?.(name, e.target.value);
    }, [name, setFieldTouched, onBlur]);

    const handleClear = useCallback(() => {
        setFieldValue?.(name, '');
        setFieldTouched?.(name, true);
        setInputValue('');
    }, [name, setFieldValue, setFieldTouched]);

    // ============================================
    // EFFECTS
    // ============================================
    useEffect(() => {
        setInputValue(currentValue);
    }, [currentValue]);

    useEffect(() => {
        if (autoFocus && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [autoFocus]);

    useEffect(() => {
        setLeftAddonWidth(leftAddonRef.current?.offsetWidth || 0);
        setRightAddonWidth(rightAddonRef.current?.offsetWidth || 0);
    }, [addon, addonPosition]);

    // ============================================
    // STYLE CONFIG
    // ============================================
    const styles = {
        size: {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-3 py-2.5 text-sm',
            lg: 'px-4 py-3 text-base',
        },
        rounded: {
            none: 'rounded-none',
            sm: 'rounded-sm',
            md: 'rounded-md',
            lg: 'rounded-lg',
            xl: 'rounded-xl',
            full: 'rounded-full',
        },
        variant: {
            default: 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-0',
            outlined: 'border border-gray-200 dark:border-gray-700 bg-transparent focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-0',
            filled: 'border-0 bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-700 focus:ring-1 focus:ring-blue-500 outline-0',
            flushed: 'border-0 border-b-2 border-gray-200 dark:border-gray-700 bg-transparent rounded-none focus:border-blue-500 focus:ring-0',
            unstyled: 'border-0 bg-transparent focus:ring-0',
        },
        addon: {
            left: 'border-r border-r-0 rounded-l-lg',
            right: 'border-l border-l-0 rounded-r-lg',
        }
    };

    // ============================================
    // LAYOUT CALCULATIONS
    // ============================================
    const hasLeftIcon = icon && iconPosition === 'left';
    const hasRightIcon = icon && iconPosition === 'right';
    const hasLeftAddon = addon && addonPosition === 'left';
    const hasRightAddon = addon && addonPosition === 'right';

    const leftPadding =
        (hasLeftIcon ? 40 : 0) +
        (hasLeftAddon ? leftAddonWidth : 0);

    const rightPadding =
        (hasRightIcon ? 40 : 0) +
        (hasRightAddon ? rightAddonWidth : 0);

    // ============================================
    // RENDER HELPERS
    // ============================================
    const renderIcon = (position) => {
        if (!icon) return null;
        if (position === 'left' && !hasLeftIcon) return null;
        if (position === 'right' && !hasRightIcon) return null;

        const isLeft = position === 'left';
        const classes = `
            absolute top-3 
            ${isLeft ? 'left-0 pl-3' : 'right-0 pr-3'} 
            flex items-center pointer-events-none z-10
        `;

        return (
            <div className={classes}>
                <svg className={`
                    ${iconSize} 
                    ${iconColor} 
                    ${isFocused ? iconFocusColor : ''} 
                    fill-transparent
                `}>
                    <use xlinkHref={`#${icon}`} />
                </svg>
            </div>
        );
    };

    const renderAddon = (position) => {
        if (!addon) return null;
        if (position === 'left' && !hasLeftAddon) return null;
        if (position === 'right' && !hasRightAddon) return null;

        const isLeft = position === 'left';
        const classes = `
            absolute top-0 
            ${isLeft ? 'left-0' : 'right-0'} 
            flex items-start h-full z-10
        `;
        const addonClasses = `
            !px-3 text-sm h-full flex items-center 
            ${styles.addon[position]} 
            ${addonColor}
            select-none
            ${isLeft ? 'rounded-l-lg' : 'rounded-r-lg'}
        `;

        return (
            <div className={classes}>
                <span ref={isLeft ? leftAddonRef : rightAddonRef} className={addonClasses}>
                    {addon}
                </span>
            </div>
        );
    };

    // ============================================
    // MAIN RENDER
    // ============================================
    const textareaClasses = `
        w-full
        ${styles.size[size] || styles.size.md}
        ${styles.rounded[rounded] || styles.rounded.lg}
        ${styles.variant[variant] || styles.variant.default}
        transition-all duration-200
        resize-y min-h-[80px]
        ${disabled ? 'opacity-50 cursor-not-allowed select-none' : ''}
        ${readOnly ? 'opacity-90 cursor-default select-none' : ''}
        ${inputClass}
        ${textColor}
        ${placeholderColor}
    `;

    return (
        <div className={`relative ${wrapperClass}`}>
            {/* Label Section */}
            {label && (
                <div className="flex items-center justify-between mb-1.5">
                    <label
                        htmlFor={name}
                        className={`block select-none text-sm font-medium ${labelColor}`}
                    >
                        <div className="flex items-center gap-1">
                            {iconLabel && (
                                <svg className={`w-5 h-5 ${iconLabelStyle} fill-transparent`}>
                                    <use xlinkHref={`#${iconLabel}`} />
                                </svg>
                            )}
                            <span>{label}</span>
                            {required && <span className={`${requiredColor} text-sm`}>*</span>}
                        </div>
                    </label>

                    <button
                        type="button"
                        onClick={handleClear}
                        className={`
                            px-3 py-1 text-xs bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 rounded-lg transition-colors duration-200 cursor-pointer
                            ${clearable && currentValue && !disabled
                                ? 'opacity-100 visible'
                                : 'opacity-0 invisible'}
                        `}
                    >
                        {clearText}
                    </button>
                </div>
            )}

            {/* Textarea Container */}
            <div className="relative">
                {renderAddon('left')}
                {renderIcon('left')}

                <textarea
                    ref={textareaRef}
                    id={name}
                    name={name}
                    value={inputValue}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    readOnly={readOnly}
                    autoFocus={autoFocus}
                    rows={rows}
                    dir={textDirection}
                    minLength={minLength}
                    maxLength={maxLength}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className={`${textareaClasses} ${className} scrollbar-thin`}
                    style={{
                        paddingLeft: leftPadding || undefined,
                        paddingRight: rightPadding || undefined,
                    }}
                />

                {renderIcon('right')}
                {renderAddon('right')}
            </div>

            {/* Messages Section */}
            <div className="mt-1 space-y-0.5">
                {helperText && (
                    <p className={`text-xs px-1 ${helperTextColor}`}>
                        {helperText}
                    </p>
                )}

                <ErrorMessage name={name}>
                    {(msg) => (
                        <p className="text-xs text-red-600 dark:text-red-400">{msg}</p>
                    )}
                </ErrorMessage>

                {success && (
                    <p className="text-xs text-green-600 dark:text-green-400">{success}</p>
                )}
            </div>

            {/* Character Counter */}
            {showCount && maxLength && (
                <div className="flex justify-end mt-1">
                    <span className={`
                        text-xs transition-colors duration-200
                        ${(inputValue?.length || 0) > maxLength * 0.9 ? 'text-orange-500' : 'text-gray-400'}
                    `}>
                        {inputValue?.length || 0} / {maxLength}
                    </span>
                </div>
            )}
        </div>
    );
};

export default React.memo(UnifiedTextarea);