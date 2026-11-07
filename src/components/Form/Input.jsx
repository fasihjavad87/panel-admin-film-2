import React, { useState } from 'react';

const Input = ({
    type = 'text',
    name,
    label,
    placeholder,
    value,
    onChange,
    onBlur,
    error,
    touched,
    icon,
    size = 'md',
    variant = 'default',
    disabled = false,
    required = false,
    className = '',
    helpText, // ✅ اینجا اضافه شد
    ...others // بقیه props ها فقط برای input میرن
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [localValue, setLocalValue] = useState(value || '');

    const handleChange = (e) => {
        const newValue = e.target.value;
        setLocalValue(newValue);
        if (onChange) onChange(newValue);
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = (e) => {
        setIsFocused(false);
        if (onBlur) onBlur(e);
    };

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2.5 text-base',
        lg: 'px-5 py-3 text-lg',
    };

    const baseClasses = `
    w-full
    transition-all
    duration-200
    ease-in-out
    bg-white
    dark:bg-gray-800
    border-2
    rounded-lg
    outline-none
    focus:outline-none
    ${sizeClasses[size]}
  `;

    const stateClasses = (() => {
        if (disabled) {
            return 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 cursor-not-allowed text-gray-400';
        }
        if (error && touched) {
            return 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-800';
        }
        if (isFocused) {
            return 'border-blue-500  focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800';
        }
        return 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500';
    })();

    const floatingLabelClasses = `
    absolute
    right-3
    transition-all
    duration-200
    pointer-events-none
    bg-white
    dark:bg-gray-800
    px-1
    text-gray-500
    dark:text-gray-400
    ${isFocused || localValue || placeholder
            ? `-top-2.5 right-2 text-xs ${size === 'sm' ? 'text-[10px]' : 'text-xs'} text-blue-500 dark:text-blue-400`
            : `top-1/2 -translate-y-1/2 ${size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-base' : 'text-sm'}`
        }
    ${(isFocused || localValue || placeholder) ? 'bg-white dark:bg-gray-800' : ''}
  `;

    const normalLabelClasses = `
    block
    mb-2
    text-sm
    font-medium
    text-gray-700
    dark:text-gray-300
    ${required ? 'after:content-["*"] after:ml-1 after:text-red-500' : ''}
  `;

    return (
        <div className={`w-full ${className}`}>
            {variant === 'floating' ? (
                <div className="relative">
                    <input
                        type={type}
                        name={name}
                        value={value !== undefined ? value : localValue}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        disabled={disabled}
                        placeholder={placeholder}
                        className={`${baseClasses} ${stateClasses} ${icon ? 'pl-10' : ''}`}
                        {...others}
                    />
                    {label && <label className={floatingLabelClasses}>{label}</label>}
                    {icon && (
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            {icon}
                        </div>
                    )}
                </div>
            ) : (
                <>
                    {label && <label className={normalLabelClasses}>{label}</label>}
                    <div className="relative">
                        {icon && (
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                {icon}
                            </div>
                        )}
                        <input
                            type={type}
                            name={name}
                            value={value !== undefined ? value : localValue}
                            onChange={handleChange}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            disabled={disabled}
                            placeholder={placeholder}
                            className={`${baseClasses} ${stateClasses} ${icon ? 'pl-10' : ''}`}
                            {...others}
                        />
                    </div>
                </>
            )}

            {error && touched && (
                <div className="mt-1.5 flex items-center gap-1.5 text-red-500 animate-shake">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs md:text-sm">{error}</span>
                </div>
            )}

            {/* ✅ الان helpText درست کار میکنه */}
            {helpText && !error && (
                <div className="mt-1.5 text-xs text-gray-400 dark:text-gray-500">
                    {helpText}
                </div>
            )}
        </div>
    );
};

export default Input;