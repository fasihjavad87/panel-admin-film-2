import React, { useState, useEffect, useRef } from 'react';

const Input2 = ({
    // Basic props
    name,
    type = 'text',
    label = null,
    labelColor = null,
    iconLabelStyle = '',
    iconLabel = null,
    placeholder = '',
    placeholderColor = null,
    value: initialValue = '',
    required = false,
    requiredColor = 'text-red-500',
    disabled = false,
    readOnly = false,
    autoFocus = false,
    autoComplete = 'off',

    // Icon props
    icon = null,
    iconPosition = null,
    iconColor = null,
    iconFocusColor = '!text-blue-500',
    iconSize = 'w-5 h-5',

    // Addon props
    addon = null,
    addonColor = null,
    addonPosition = null,

    // Helper & messages
    helperText = null,
    helperTextColor = null,
    error = null,
    success = null,
    touched = false,

    // Size & style
    size = 'md',
    rounded = 'lg',
    variant = 'default',
    inputClass = '',
    wrapperClass = '',

    // Validation & constraints
    min = null,
    max = null,
    step = null,
    minLength = null,
    maxLength = null,
    pattern = null,

    // Direction
    dir = 'auto',
    ltr = false,
    rtl = false,

    // Password toggle
    passwordShowIcon = null,
    passwordHideIcon = null,
    passwordIconColor = null,
    passwordTogglePosition = 'right',

    // Mask
    mask = null,

    // Events
    onChange,
    onBlur,
    onFocus,
    onInput,

    // For textarea
    rows = 3,
}) => {
    // State
    const [showPassword, setShowPassword] = useState(false);
    const [inputValue, setInputValue] = useState(initialValue);
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);

    // Determine if it's password type
    const isPassword = type === 'password';
    const currentType = isPassword && showPassword ? 'text' : type;

    // Direction
    const textDirection = ltr ? 'ltr' : rtl ? 'rtl' : dir;

    // Get raw value (without mask characters)
    const getRawValue = (formattedValue, maskType) => {
        if (!formattedValue) return '';
        if (maskType === 'card_number') {
            return formattedValue.replace(/-/g, '');
        }
        if (maskType === 'phone') {
            return formattedValue.replace(/-/g, '');
        }
        if (maskType === 'national_code') {
            return formattedValue.replace(/-/g, '');
        }
        return formattedValue;
    };

    // Get digit count from formatted value
    const getDigitCount = (formattedValue, maskType) => {
        if (!formattedValue) return 0;
        if (maskType === 'card_number' || maskType === 'phone' || maskType === 'national_code') {
            return formattedValue.replace(/-/g, '').length;
        }
        return formattedValue.length;
    };

    // Format card number (16 digits: 1234-5678-9012-3456)
    const formatCardNumber = (digits) => {
        if (!digits) return '';
        // محدودیت روی تعداد ارقام
        let limitedDigits = digits;
        if (maxLength && digits.length > maxLength) {
            limitedDigits = digits.slice(0, maxLength);
        }
        if (limitedDigits.length === 0) return '';

        const parts = [];
        for (let i = 0; i < limitedDigits.length; i += 4) {
            parts.push(limitedDigits.slice(i, i + 4));
        }
        return parts.join('-');
    };

    // Format phone number (example: 919-714-3425)
    const formatPhoneNumber = (digits) => {
        if (!digits) return '';

        // حذف صفر اول اگر وجود داشت
        let cleaned = digits;
        if (cleaned.startsWith('0')) {
            cleaned = cleaned.substring(1);
        }

        // محدودیت روی تعداد ارقام
        let limitedDigits = cleaned;
        if (maxLength && cleaned.length > maxLength) {
            limitedDigits = cleaned.slice(0, maxLength);
        }

        if (limitedDigits.length === 0) return '';

        // فرمت‌بندی: 919-714-3425
        if (limitedDigits.length <= 3) {
            return limitedDigits;
        } else if (limitedDigits.length <= 6) {
            return `${limitedDigits.slice(0, 3)}-${limitedDigits.slice(3)}`;
        } else {
            return `${limitedDigits.slice(0, 3)}-${limitedDigits.slice(3, 6)}-${limitedDigits.slice(6, 10)}`;
        }
    };

    // Format national code (10 digits: 123-4567890)
    const formatNationalCode = (digits) => {
        if (!digits) return '';

        let limitedDigits = digits;
        if (maxLength && digits.length > maxLength) {
            limitedDigits = digits.slice(0, maxLength);
        }

        if (limitedDigits.length === 0) return '';

        if (limitedDigits.length <= 3) {
            return limitedDigits;
        } else {
            return `${limitedDigits.slice(0, 3)}-${limitedDigits.slice(3)}`;
        }
    };

    // Mask handler
    const applyMask = (value) => {
        if (!mask) return value;

        // Extract only digits
        const digits = value.replace(/\D/g, '');

        if (mask === 'card_number') {
            return formatCardNumber(digits);
        }

        if (mask === 'phone') {
            return formatPhoneNumber(digits);
        }

        if (mask === 'national_code') {
            return formatNationalCode(digits);
        }

        return value;
    };

    // Handle value change
    const handleChange = (e) => {
        let newDisplayValue = e.target.value;
        let newRawValue = newDisplayValue;

        if (mask) {
            // Extract digits only
            const digits = newDisplayValue.replace(/\D/g, '');

            if (mask === 'card_number') {
                let limitedDigits = digits;
                if (maxLength && digits.length > maxLength) {
                    limitedDigits = digits.slice(0, maxLength);
                }
                newDisplayValue = formatCardNumber(limitedDigits);
                newRawValue = limitedDigits;
            }
            else if (mask === 'phone') {
                // حذف صفر اول برای محاسبه
                let cleaned = digits;
                if (cleaned.startsWith('0')) {
                    cleaned = cleaned.substring(1);
                }

                let limitedDigits = cleaned;
                if (maxLength && cleaned.length > maxLength) {
                    limitedDigits = cleaned.slice(0, maxLength);
                }
                newDisplayValue = formatPhoneNumber(limitedDigits);
                newRawValue = limitedDigits;
            }
            else if (mask === 'national_code') {
                let limitedDigits = digits;
                if (maxLength && digits.length > maxLength) {
                    limitedDigits = digits.slice(0, maxLength);
                }
                newDisplayValue = formatNationalCode(limitedDigits);
                newRawValue = limitedDigits;
            }

            setInputValue(newDisplayValue);

            // ارسال مقدار خام (بدون خط تیره) به بیرون
            if (onChange) {
                onChange(newRawValue, name);
            }
        } else {
            setInputValue(newDisplayValue);
            if (onChange) {
                onChange(newDisplayValue, name);
            }
        }

        if (onInput) {
            onInput(newDisplayValue, name);
        }
    };

    const handleBlur = (e) => {
        setIsFocused(false);
        if (onBlur) {
            const rawValue = mask ? getRawValue(e.target.value, mask) : e.target.value;
            onBlur(name, rawValue);
        }
    };

    const handleFocus = (e) => {
        setIsFocused(true);
        if (onFocus) {
            onFocus(name, e.target.value);
        }
    };

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    // Sync with external value
    useEffect(() => {
        if (initialValue !== getRawValue(inputValue, mask)) {
            if (mask && initialValue) {
                const formatted = applyMask(initialValue.toString());
                setInputValue(formatted);
            } else {
                setInputValue(initialValue);
            }
        }
    }, [initialValue, mask]);

    // Size classes
    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-3 py-2.5 text-sm',
        lg: 'px-4 py-3 text-base',
    };

    // Rounded classes
    const roundedClasses = {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        full: 'rounded-full',
    };

    // Variant classes
    const variantClasses = {
        default: 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-0',
        outlined: 'border border-gray-200 dark:border-gray-700 bg-transparent focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-0',
        filled: 'border-0 bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-700 focus:ring-1 focus:ring-blue-500 outline-0',
        flushed: 'border-0 border-b-2 border-gray-200 dark:border-gray-700 bg-transparent rounded-none focus:border-blue-500 focus:ring-0',
        unstyled: 'border-0 bg-transparent text-gray-900 dark:text-white focus:ring-0',
    };

    // Color helper
    const processColorClasses = (color, prefix = '', defaultLight = null, defaultDark = null) => {
        if (!color) {
            if (defaultLight || defaultDark) {
                let result = '';
                if (defaultLight) result += defaultLight;
                if (defaultDark) result += ` dark:${defaultDark}`;
                return result;
            }
            return '';
        }

        if (typeof color === 'string') {
            return color;
        }

        if (Array.isArray(color)) {
            let result = '';
            if (color[0]) result += color[0];
            if (color[1]) result += ` dark:${color[1]}`;
            return result;
        }

        return '';
    };

    // Build input classes
    let inputClasses = `
        w-full
        ${sizeClasses[size] || sizeClasses.md}
        ${roundedClasses[rounded] || roundedClasses.lg}
        ${variantClasses[variant] || variantClasses.default}
        transition-all duration-200
        ${disabled ? 'opacity-50 cursor-not-allowed select-none' : ''}
        ${readOnly ? 'opacity-90 cursor-default select-none' : ''}
        ${inputClass}
    `;

    // Text color
    const textColorClass = processColorClasses(null, '', 'text-gray-900', 'text-white');
    if (textColorClass) inputClasses += ` ${textColorClass}`;

    // Placeholder color
    const placeholderColorClass = processColorClasses(placeholderColor, 'placeholder:', 'text-gray-500', 'text-gray-400');
    if (placeholderColorClass) inputClasses += ` ${placeholderColorClass}`;

    // Calculate paddings for icons and addons
    let leftPadding = '';
    let rightPadding = '';

    const hasLeftIcon = icon && iconPosition === 'left';
    const hasRightIcon = icon && iconPosition === 'right';
    const hasLeftAddon = addon && addonPosition === 'left';
    const hasRightAddon = addon && addonPosition === 'right';
    const passwordOnLeft = isPassword && passwordTogglePosition === 'left';
    const passwordOnRight = isPassword && passwordTogglePosition === 'right';

    let leftElements = 0;
    if (passwordOnLeft) leftElements++;
    if (hasLeftAddon) leftElements++;
    if (hasLeftIcon) leftElements++;

    let rightElements = 0;
    if (passwordOnRight) rightElements++;
    if (hasRightAddon) rightElements++;
    if (hasRightIcon) rightElements++;

    if (leftElements === 1) {
        if (passwordOnLeft || hasLeftAddon) leftPadding = 'pl-12';
        else if (hasLeftIcon) leftPadding = 'pl-10';
    } else if (leftElements === 2) {
        if (passwordOnLeft && hasLeftAddon) leftPadding = 'pl-24';
        else if (passwordOnLeft && hasLeftIcon) leftPadding = 'pl-20';
        else if (hasLeftAddon && hasLeftIcon) leftPadding = 'pl-[85px]';
    } else if (leftElements === 3) {
        leftPadding = 'pl-28';
    }

    if (rightElements === 1) {
        if (passwordOnRight || hasRightAddon) rightPadding = 'pr-12';
        else if (hasRightIcon) rightPadding = 'pr-10';
    } else if (rightElements === 2) {
        if (passwordOnRight && hasRightAddon) rightPadding = 'pr-24';
        else if (passwordOnRight && hasRightIcon) rightPadding = 'pr-20';
        else if (hasRightAddon && hasRightIcon) rightPadding = 'pr-[85px]';
    } else if (rightElements === 3) {
        rightPadding = 'pr-28';
    }

    inputClasses += ` ${leftPadding} ${rightPadding}`;

    // Get element offsets
    const getLeftOffset = (elementType) => {
        let offset = 0;
        if (elementType === 'password') return 'left-0';
        if (elementType === 'addon') {
            if (passwordOnLeft) offset = 48;
            return offset === 48 ? 'left-12' : 'left-0';
        }
        if (elementType === 'icon') {
            if (passwordOnLeft) offset += 48;
            if (hasLeftAddon) offset += 48;
            if (offset === 48) return 'left-12';
            if (offset === 96) {
                if (passwordOnLeft && hasLeftAddon) return 'left-24';
                return 'left-20';
            }
            return 'left-0';
        }
        return 'left-0';
    };

    const getRightOffset = (elementType) => {
        let offset = 0;
        if (elementType === 'password') return 'right-0';
        if (elementType === 'addon') {
            if (passwordOnRight) offset = 48;
            return offset === 48 ? 'right-12' : 'right-0';
        }
        if (elementType === 'icon') {
            if (passwordOnRight) offset += 48;
            if (hasRightAddon) offset += 48;
            if (offset === 48) return 'right-12';
            if (offset === 96) {
                if (passwordOnRight && hasRightAddon) return 'right-24';
                return 'right-20';
            }
            return 'right-0';
        }
        return 'right-0';
    };

    const borderClasses = {
        left: 'border-r border-r-0 rounded-l-lg',
        right: 'border-l border-l-0 rounded-r-lg',
    };

    const getAddonClasses = (position) => {
        return `!px-3 text-gray-500 dark:text-gray-400 text-sm h-full flex items-center ${borderClasses[position]}`;
    };

    const getAddonPassClasses = (position) => {
        return `!px-2.5 text-gray-500 dark:text-gray-400 text-sm h-full flex items-center ${borderClasses[position]}`;
    };

    // محاسبه تعداد ارقام واقعی برای نمایش
    const currentDigitCount = getDigitCount(inputValue, mask);

    return (
        <div className={`relative ${wrapperClass}`}>
            {/* Label */}
            {label && (
                <label htmlFor={name} className={`block select-none text-sm font-medium ${processColorClasses(labelColor, '', 'text-gray-700', 'text-gray-300')} mb-2`}>
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
            )}

            <div className="relative">
                {/* Password Toggle Left */}
                {passwordOnLeft && (
                    <div className={`absolute inset-y-0 ${getLeftOffset('password')} flex items-center`}>
                        <button
                            type="button"
                            onClick={togglePassword}
                            className={`${getAddonPassClasses('left')} ${processColorClasses(passwordIconColor)} cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-all`}
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
                )}

                {/* Left Addon */}
                {hasLeftAddon && (
                    <div className={`absolute inset-y-0 ${getLeftOffset('addon')} flex items-center z-50`}>
                        <span className={`${getAddonClasses('left')} ${processColorClasses(addonColor)} select-none`}>
                            {addon}
                        </span>
                    </div>
                )}

                {/* Left Icon */}
                {hasLeftIcon && (
                    <div className={`absolute inset-y-0 ${getLeftOffset('icon')} flex items-center pl-3 pointer-events-none`}>
                        <svg className={`${iconSize} ${processColorClasses(iconColor, '', 'text-gray-400', 'text-gray-400')} ${isFocused ? iconFocusColor : ''}  fill-transparent`}>
                            <use xlinkHref={`#${icon}`} />
                        </svg>
                    </div>
                )}

                {/* Input or Textarea */}
                {type === 'textarea' ? (
                    <textarea
                        ref={inputRef}
                        id={name}
                        name={name}
                        placeholder={placeholder}
                        value={inputValue}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onFocus={handleFocus}
                        disabled={disabled}
                        readOnly={readOnly}
                        autoFocus={autoFocus}
                        autoComplete={autoComplete}
                        dir={textDirection}
                        minLength={minLength}
                        maxLength={undefined}
                        rows={rows}
                        className={`${inputClasses} resize-none`}
                    />
                ) : (
                    <input
                        ref={inputRef}
                        id={name}
                        name={name}
                        type={currentType}
                        placeholder={placeholder}
                        value={inputValue}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onFocus={handleFocus}
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
                        className={inputClasses}
                    />
                )}

                {/* Right Icon */}
                {hasRightIcon && (
                    <div className={`absolute inset-y-0 ${getRightOffset('icon')} flex items-center pr-3 pointer-events-none`}>
                        <svg className={`${iconSize} ${processColorClasses(iconColor, '', 'text-gray-400', 'text-gray-400')} ${isFocused ? iconFocusColor : ''}  fill-transparent`}>
                            <use xlinkHref={`#${icon}`} />
                        </svg>
                    </div>
                )}

                {/* Right Addon */}
                {hasRightAddon && (
                    <div className={`absolute inset-y-0 ${getRightOffset('addon')} flex items-center z-50`}>
                        <span className={`${getAddonClasses('right')} ${processColorClasses(addonColor)} select-none`}>
                            {addon}
                        </span>
                    </div>
                )}

                {/* Password Toggle Right */}
                {passwordOnRight && (
                    <div className={`absolute inset-y-0 ${getRightOffset('password')} flex items-center`}>
                        <button
                            type="button"
                            onClick={togglePassword}
                            className={`${getAddonPassClasses('right')} ${processColorClasses(passwordIconColor)} cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-all`}
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
                )}
            </div>

            {/* Helper Text */}
            {helperText && (
                <p className={`mt-1 text-xs ${processColorClasses(helperTextColor, '', 'text-gray-500', 'text-gray-400')}`}>
                    {helperText}
                </p>
            )}

            {/* Error Message */}
            {(touched && error) && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>
            )}

            {/* Success Message */}
            {success && (
                <p className="mt-1 text-xs text-green-600 dark:text-green-400">{success}</p>
            )}

            {/* Character Counter - نمایش تعداد ارقام واقعی (بدون احتساب -) */}
            {maxLength && mask && (
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-left">
                    <span>{currentDigitCount}</span> / {maxLength}
                </div>
            )}

            {maxLength && !mask && (
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-left">
                    <span>{inputValue?.length || 0}</span> / {maxLength}
                </div>
            )}
        </div>
    );
};

export default Input2;