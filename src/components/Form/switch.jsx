import React from 'react';
import { ErrorMessage, useFormikContext } from 'formik';

const Switch = ({
    name,
    label = null,
    required = false,
    disabled = false,
    size = 'md',
    className = '',
    colorToggle = 'bg-white',
    colorWrapper = 'bg-indigo-600 dark:bg-indigo-500',
}) => {

    const { values, setFieldValue } = useFormikContext();

    const checked = values[name] || false;

    const sizes = {
        sm: {
            wrapper: 'w-8 h-4',
            toggle: 'w-3 h-3',
            translate: 'translate-x-4',
        },

        md: {
            wrapper: 'w-12 h-6',
            toggle: 'w-5 h-5',
            translate: 'translate-x-6',
        },

        lg: {
            wrapper: 'w-16 h-8',
            toggle: 'w-7 h-7',
            translate: 'translate-x-8',
        },
    };

    const currentSize = sizes[size] || sizes.md;

    const handleToggle = () => {

        if (disabled) return;

        setFieldValue(name, !checked);
    };

    return (
        <div className={`flex flex-col gap-y-2 ${className}`}>

            {/* LABEL */}
            {label && (
                <div className="flex items-center justify-between">

                    <label
                        htmlFor={name}
                        className="text-sm font-medium text-gray-700"
                    >
                        {label}

                        {required && (
                            <span className="text-red-500 mr-1">*</span>
                        )}

                    </label>

                    <ErrorMessage name={name}>
                        {(msg) => (
                            <span className="text-red-500 text-xs">
                                {msg}
                            </span>
                        )}
                    </ErrorMessage>

                </div>
            )}

            {/* SWITCH */}
            <label
                className={`
                    relative inline-flex
                    ${currentSize.wrapper}
                    ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
                `}
            >

                <input
                    type="checkbox"
                    id={name}
                    checked={checked}
                    onChange={handleToggle}
                    disabled={disabled}
                    className="sr-only peer"
                />

                {/* BACKGROUND */}
                <span
                    className={`
                        absolute inset-0 rounded-full
                        transition-all duration-200
                        ${checked
                            ? colorWrapper
                            : 'bg-gray-300 dark:bg-gray-600'
                        }
                    `}
                />

                {/* TOGGLE */}
                <span
                    className={`
                        absolute left-0.5 top-0.5
                        rounded-full shadow-md
                        transition-all duration-200
                        ${currentSize.toggle}
                        ${checked
                            ? currentSize.translate
                            : 'translate-x-0'
                        }
                        ${colorToggle}
                    `}
                />

            </label>

            {/* ERROR بدون LABEL */}
            {!label && (
                <ErrorMessage name={name}>
                    {(msg) => (
                        <span className="text-red-500 text-xs">
                            {msg}
                        </span>
                    )}
                </ErrorMessage>
            )}

        </div>
    );
};

export default Switch;