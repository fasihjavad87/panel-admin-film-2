import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FastField, ErrorMessage, useFormikContext } from 'formik';

const Input2 = ({
    // ===== Basic Props =====
    name,
    type = 'text',
    label = null,
    placeholder = '',
    required = false,
    disabled = false,
    readOnly = false,
    autoFocus = false,
    autoComplete = 'off',

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

    // ===== Password Toggle =====
    passwordShowIcon = null,
    passwordHideIcon = null,
    passwordIconColor = 'text-gray-500 dark:text-gray-400',
    passwordTogglePosition = 'right',

    // ===== Validation =====
    min = null,
    max = null,
    step = null,
    minLength = null,
    maxLength = null,
    pattern = null,

    // ===== Helpers =====
    helperText = null,
    helperTextColor = 'text-gray-500 dark:text-gray-400',
    error = null,
    success = null,

    // ===== Direction =====
    dir = 'auto',
    ltr = false,
    rtl = false,

    // ===== Mask =====
    mask = null,

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
    const inputRef = useRef(null);

    // ============================================
    // STATE
    // ============================================
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [leftAddonWidth, setLeftAddonWidth] = useState(0);
    const [rightAddonWidth, setRightAddonWidth] = useState(0);

    // ============================================
    // DERIVED STATE
    // ============================================
    const isPassword = type === 'password';
    // const currentValue = values?.[name] || '';
    const currentValue = values?.[name] ?? '';
    const textDirection = rtl ? 'rtl' : ltr ? 'ltr' : dir;
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    // ============================================
    // PASSWORD TOGGLE
    // ============================================
    const togglePassword = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowPassword(prev => !prev);
    }, []);

    // ============================================
    // MASK FUNCTIONS
    // ============================================
    const formatCardNumber = useCallback((digits) => {
        if (!digits) return '';
        let limited = digits;
        if (maxLength && digits.length > maxLength) {
            limited = digits.slice(0, maxLength);
        }
        if (limited.length === 0) return '';
        const parts = [];
        for (let i = 0; i < limited.length; i += 4) {
            parts.push(limited.slice(i, i + 4));
        }
        return parts.join('-');
    }, [maxLength]);

    const formatPhoneNumber = useCallback((digits) => {
        if (!digits) return '';
        let cleaned = digits.replace(/^0/, '');
        let limited = cleaned;
        if (maxLength && cleaned.length > maxLength) {
            limited = cleaned.slice(0, maxLength);
        }
        if (limited.length === 0) return '';
        if (limited.length <= 3) return limited;
        if (limited.length <= 6) {
            return `${limited.slice(0, 3)}-${limited.slice(3)}`;
        }
        return `${limited.slice(0, 3)}-${limited.slice(3, 6)}-${limited.slice(6, 10)}`;
    }, [maxLength]);

    const formatNationalCode = useCallback((digits) => {
        if (!digits) return '';
        let limited = digits;
        if (maxLength && digits.length > maxLength) {
            limited = digits.slice(0, maxLength);
        }
        if (limited.length === 0) return '';
        if (limited.length <= 3) return limited;
        return `${limited.slice(0, 3)}-${limited.slice(3)}`;
    }, [maxLength]);

    const applyMask = useCallback((value) => {
        if (!mask) return value;
        const digits = value.replace(/\D/g, '');
        if (mask === 'card_number') return formatCardNumber(digits);
        if (mask === 'phone') return formatPhoneNumber(digits);
        if (mask === 'national_code') return formatNationalCode(digits);
        return value;
    }, [mask, formatCardNumber, formatPhoneNumber, formatNationalCode]);

    const getRawValue = useCallback((formattedValue) => {
        if (!formattedValue || !mask) return formattedValue;
        return formattedValue.replace(/-/g, '');
    }, [mask]);

    const getDigitCount = useCallback((formattedValue) => {
        if (!formattedValue || !mask) return formattedValue?.length || 0;
        return formattedValue.replace(/-/g, '').length;
    }, [mask]);

    // ============================================
    // HANDLERS
    // ============================================
    const handleInputChange = useCallback((e) => {
        let rawValue = e.target.value;
        let displayValue = rawValue;

        if (mask) {
            const digits = rawValue.replace(/\D/g, '');
            if (mask === 'card_number') {
                let limited = digits;
                if (maxLength && digits.length > maxLength) {
                    limited = digits.slice(0, maxLength);
                }
                displayValue = formatCardNumber(limited);
                rawValue = limited;
            } else if (mask === 'phone') {
                let cleaned = digits.replace(/^0/, '');
                let limited = cleaned;
                if (maxLength && cleaned.length > maxLength) {
                    limited = cleaned.slice(0, maxLength);
                }
                displayValue = formatPhoneNumber(limited);
                rawValue = limited;
            } else if (mask === 'national_code') {
                let limited = digits;
                if (maxLength && digits.length > maxLength) {
                    limited = digits.slice(0, maxLength);
                }
                displayValue = formatNationalCode(limited);
                rawValue = limited;
            }
            setInputValue(displayValue);
        } else {
            setInputValue(rawValue);
        }

        if (setFieldValue) {
            setFieldValue(name, rawValue);
            setFieldTouched?.(name, true);
        }

        onChange?.(rawValue, name);
        onInput?.(rawValue, name);
    }, [mask, maxLength, formatCardNumber, formatPhoneNumber, formatNationalCode, name, setFieldValue, setFieldTouched, onChange, onInput]);

    const handleFocus = useCallback((e) => {
        setIsFocused(true);
        onFocus?.(name, e.target.value);
    }, [onFocus, name]);

    const handleBlur = useCallback((e) => {
        setIsFocused(false);
        setFieldTouched?.(name, true);
        const rawValue = mask ? getRawValue(e.target.value) : e.target.value;
        onBlur?.(name, rawValue);
    }, [name, setFieldTouched, onBlur, mask, getRawValue]);

    const handleClear = useCallback(() => {
        setFieldValue?.(name, '');
        setFieldTouched?.(name, true);
        // setInputValue('');
    }, [name, setFieldValue, setFieldTouched]);

    // ============================================
    // EFFECTS
    // ============================================
    useEffect(() => {
        if (mask && currentValue) {
            const formatted = applyMask(currentValue.toString());
            setInputValue(formatted);
        } else {
            setInputValue(currentValue);
        }
    }, [currentValue, mask, applyMask]);

    useEffect(() => {
        if (autoFocus && inputRef.current) {
            inputRef.current.focus();
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
            // md: 'px-3 py-2.5 text-sm',
            md: 'px-3 py-[11px] text-sm',
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
    const passwordOnLeft = isPassword && passwordTogglePosition === 'left';
    const passwordOnRight = isPassword && passwordTogglePosition === 'right';

    // Calculate paddings dynamically
    const leftPadding =
        (passwordOnLeft ? 48 : 0) +
        (hasLeftIcon ? 40 : 0) +
        (hasLeftAddon ? leftAddonWidth : 0);

    const rightPadding =
        (passwordOnRight ? 48 : 0) +
        (hasRightIcon ? 40 : 0) +
        (hasRightAddon ? rightAddonWidth : 0);

    // ============================================
    // RENDER HELPERS
    // ============================================
    const renderIcon = (position) => {
        // فقط اگه آیکون وجود داشته باشه و موقعیتش درست باشه رندر کن
        if (!icon) return null;
        if (position === 'left' && !hasLeftIcon) return null;
        if (position === 'right' && !hasRightIcon) return null;

        const isLeft = position === 'left';
        const classes = `
            absolute inset-y-0 
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
        // فقط اگه addon وجود داشته باشه و موقعیتش درست باشه رندر کن
        if (!addon) return null;
        if (position === 'left' && !hasLeftAddon) return null;
        if (position === 'right' && !hasRightAddon) return null;

        const isLeft = position === 'left';
        const classes = `
            absolute inset-y-0 
            ${isLeft ? 'left-0' : 'right-0'} 
            flex items-center z-10
        `;
        const addonClasses = `
            !px-3 text-sm h-full flex items-center 
            ${styles.addon[position]} 
            ${addonColor}
            select-none
        `;

        return (
            <div className={classes}>
                <span ref={isLeft ? leftAddonRef : rightAddonRef} className={addonClasses}>
                    {addon}
                </span>
            </div>
        );
    };

    const renderPasswordToggle = (position) => {
        // فقط برای password و موقعیت درست رندر کن
        if (!isPassword) return null;
        if (position === 'left' && !passwordOnLeft) return null;
        if (position === 'right' && !passwordOnRight) return null;

        const isLeft = position === 'left';
        const classes = `
            absolute inset-y-0 
            ${isLeft ? 'left-0' : 'right-0'} 
            flex items-center z-10
        `;
        const addonClasses = `
            !px-2.5 text-sm h-full flex items-center 
            ${styles.addon[position]} 
            ${passwordIconColor}
            cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-all
        `;

        return (
            <div className={classes}>
                <button
                    type="button"
                    onClick={togglePassword}
                    className={addonClasses}
                >
                    {!showPassword ? (
                        passwordShowIcon ? (
                            <svg className={`${iconSize} fill-transparent`}>
                                <use xlinkHref={`#${passwordShowIcon}`} />
                            </svg>
                        ) : (
                            <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        )
                    ) : (
                        passwordHideIcon ? (
                            <svg className={`${iconSize} fill-transparent`}>
                                <use xlinkHref={`#${passwordHideIcon}`} />
                            </svg>
                        ) : (
                            <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                        )
                    )}
                </button>
            </div>
        );
    };

    // ============================================
    // MAIN RENDER
    // ============================================
    const inputClasses = `
        w-full
        ${styles.size[size] || styles.size.md}
        ${styles.rounded[rounded] || styles.rounded.lg}
        ${styles.variant[variant] || styles.variant.default}
        transition-all duration-200
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
                <div className="flex items-center justify-between mb-2">
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

                    {/* <div className="w-20 flex justify-end">
                        {clearable && !!currentValue && !disabled && (
                            <button
                                type="button"
                                onClick={handleClear}
                                className="px-3 py-1 text-xs bg-red-50 hover:bg-red-100 text-red-500 rounded-lg"
                            >
                                {clearText}
                            </button>
                        )}
                    </div> */}
                    {/* {clearable && !!inputValue && !disabled && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="px-3 py-1 text-xs bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 rounded-lg transition-colors duration-200 cursor-pointer"
                        >
                            {clearText}
                        </button>
                    )} */}
                    {/* {clearable && !disabled && ( */}
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
                    {/* )} */}
                </div>
            )}

            {/* Input Container */}
            <div className="relative">
                {/* فقط در صورتی که شرط‌ها درست باشه رندر میشن */}
                {renderPasswordToggle('left')}
                {renderAddon('left')}
                {renderIcon('left')}

                {/* <FastField name={name}>
                    {({ field }) => (
                        <input
                            {...field}
                            ref={inputRef}
                            id={name}
                            type={inputType}
                            value={inputValue}
                            placeholder={placeholder}
                            required={required}
                            disabled={disabled}
                            readOnly={readOnly}
                            autoFocus={autoFocus}
                            autoComplete={autoComplete}
                            dir={textDirection}
                            min={min}
                            max={max}
                            step={step}
                            minLength={minLength}
                            maxLength={undefined}
                            pattern={pattern}
                            onChange={handleInputChange}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            className={`${inputClasses} ${className}`}
                            style={{
                                paddingLeft: leftPadding || undefined,
                                paddingRight: rightPadding || undefined,
                            }}
                        />
                    )}
                </FastField> */}
                <input
                    ref={inputRef}
                    id={name}
                    name={name}
                    type={inputType}
                    value={inputValue}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    readOnly={readOnly}
                    autoComplete={autoComplete}
                    dir={textDirection}
                    min={min}
                    max={max}
                    step={step}
                    minLength={minLength}
                    // maxLength={undefined}
                    maxLength={mask ? undefined : maxLength}
                    pattern={pattern}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className={`${inputClasses} ${className}`}
                    style={{
                        paddingLeft: leftPadding || undefined,
                        paddingRight: rightPadding || undefined,
                    }}
                />

                {renderIcon('right')}
                {renderAddon('right')}
                {renderPasswordToggle('right')}
            </div>

            {/* Messages Section */}
            {/* {(helperText || error || success) && ( */}
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
            {/* )} */}

            {/* Character Counter */}
            {showCount && maxLength && (
                <div className="flex justify-end mt-1">
                    <span className={`
                        text-xs transition-colors duration-200
                        ${(mask ? getDigitCount(inputValue) : inputValue?.length || 0) > maxLength * 0.9 ? 'text-orange-500' : 'text-gray-400'}
                    `}>
                        {mask ? getDigitCount(inputValue) : inputValue?.length || 0} / {maxLength}
                    </span>
                </div>
            )}
        </div>
    );
};

export default React.memo(Input2);