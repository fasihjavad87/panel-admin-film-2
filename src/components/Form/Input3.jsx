import React, { useState } from 'react';
import { FastField, ErrorMessage, useFormikContext } from 'formik';

const Input3 = ({
    name,
    type = 'text',
    label,
    placeholder = '',
    required = false,
    disabled = false,
    icon = null,
    clearable = false,
    maxLength,
    showCount = false,
    className = '',
}) => {

    const [isFocused, setIsFocused] = useState(false);

    const { values, setFieldValue } = useFormikContext();

    const value = values[name] || '';

    const handleClear = () => {
        setFieldValue(name, '');
    };

    return (
        <div className={`w-full ${className}`}>

            {/* LABEL */}
            {label && (
                <div className="flex items-center justify-between mb-1.5">

                    <label className="text-sm font-medium text-gray-700">

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

                    {clearable && value && !disabled && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="
                                px-2 py-1 text-xs rounded-lg
                                bg-red-50 hover:bg-red-100
                                text-red-500 hover:text-red-600
                                transition-all cursor-pointer
                            "
                        >
                            پاک کردن
                        </button>
                    )}

                </div>
            )}

            {/* INPUT */}
            <div
                className={`
                    relative border rounded-xl transition-all duration-200
                    ${isFocused
                        ? 'border-blue-500 ring-2 ring-blue-500/20'
                        : 'border-gray-300 hover:border-gray-400'
                    }
                    ${disabled ? 'bg-gray-100 opacity-60' : 'bg-white'}
                `}
            >

                <FastField
                    name={name}
                >
                    {({ field }) => (
                        <input
                            {...field}
                            value={field.value || ''}
                            type={type}
                            placeholder={placeholder}
                            disabled={disabled}
                            maxLength={maxLength}
                            onFocus={() => setIsFocused(true)}
                            onBlur={(e) => {
                                setIsFocused(false);
                                field.onBlur(e);
                            }}
                            className="
                                w-full px-4 py-2.5 rounded-xl
                                bg-transparent outline-none
                                text-gray-800
                                placeholder:text-gray-400
                            "
                        />
                    )}
                </FastField>

            </div>

            {/* COUNTER */}
            {showCount && maxLength && (
                <div className="flex justify-end mt-1">
                    <span
                        className={`
                            text-xs
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

            {/* ERROR */}
            <ErrorMessage name={name}>
                {(msg) => (
                    <div className="text-red-500 text-xs mt-1 mr-1">
                        {msg}
                    </div>
                )}
            </ErrorMessage>

        </div>
    );
};

export default Input3;