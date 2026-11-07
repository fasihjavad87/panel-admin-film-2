import { ErrorMessage, FastField, useFormikContext } from 'formik';
import React, { useState } from 'react';

const Textarea = ({
    name,
    label,
    className = '',
    placeholder = '',
    rows = 4,
    required = false,
    disabled = false,
    clearable = true,
    icon = '#icon-edit',
    maxLength,
    showCount = false
}) => {

    const [isFocused, setIsFocused] = useState(false);

    // دسترسی به فرمیک
    const { values, setFieldValue } = useFormikContext();

    const value = values[name] || '';

    const handleClear = () => {
        setFieldValue(name, '');
    };

    return (
        <div className={`w-full ${className}`}>

            {label && (
                <div className='flex justify-between items-cente mb-1.5'>

                    <label className="block text-sm font-medium text-gray-700 ">
                        {icon && (
                            <svg className="inline w-4 h-4 ml-1 text-gray-500 fill-transparent">
                                <use xlinkHref={icon}></use>
                            </svg>
                        )}

                        {label}

                        {required && (
                            <span className="text-red-500 mr-1">*</span>
                        )}
                    </label>
                    {/* دکمه پاک کردن */}
                    {clearable && value && !disabled && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="px-3 py-1 text-xs bg-red-50 hover:bg-red-100 rounded-lg
                            text-red-500 hover:text-red-600
                            transition-colors duration-200 cursor-pointer
                        "
                        >
                            پاک کردن
                        </button>
                    )}
                </div>
            )}

            <div
                className={`
                    group relative flex items-stretch w-full bg-white border rounded-xl transition-all duration-200
                    ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}
                    ${isFocused
                        ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-sm'
                        : 'border-gray-300 hover:border-gray-400 hover:shadow-sm'
                    }
                `}
            >

                <FastField
                    as="textarea"
                    name={name}
                    rows={rows}
                    disabled={disabled}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="
                        flex-1 px-4 py-2.5 bg-transparent outline-none rounded-xl
                        text-gray-800 placeholder:text-gray-400 resize-y
                        focus:ring-0 disabled:bg-gray-100 disabled:cursor-not-allowed scrollbar-thin
                    "
                />



            </div>

            {/* شمارنده */}
            {showCount && maxLength && (
                <div className="flex justify-end mt-1">
                    <span
                        className={`
                            text-xs transition-colors duration-200
                            ${value.length > maxLength * 0.9
                                ? 'text-orange-500'
                                : 'text-gray-400'
                            }
                        `}
                    >
                        {value.length} / {maxLength}
                    </span>
                </div>
            )}

            <ErrorMessage name={name}>
                {msg => (
                    <div className="text-red-500 text-xs mt-1 mr-1">
                        {msg}
                    </div>
                )}
            </ErrorMessage>

        </div>
    );
};

export default Textarea;