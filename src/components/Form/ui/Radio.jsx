import React from 'react';
import { ErrorMessage, useFormikContext } from 'formik';

const Radio = ({
    name,
    label,
    options = [],
    className = '',
    colorlableitem = '',
    colorradioitem = '',
    colorradioitemicon = '',
}) => {

    const { values, setFieldValue } = useFormikContext();

    // const selectedValue = String(values[name] || '');
    const selectedValue = values[name] !== undefined && values[name] !== null ? String(values[name]) : '';

    const handleChange = (id) => {
        // setFieldValue(name, String(id));
        setFieldValue(name, id);
    };

    return (
        <div className={`mb-2 ${className}`}>

            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                </label>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">

                {options.map((option) => {

                    const value = String(option.id);

                    const checked = selectedValue === value;

                    return (
                        <label
                            key={option.id}
                            className="flex items-center gap-1.5 cursor-pointer select-none"
                        >

                            <div className="relative flex items-center">

                                <input
                                    type="radio"
                                    name={name}
                                    checked={checked}
                                    onChange={() => handleChange(option.id)}
                                    className={`
                                        peer h-5 w-5 appearance-none rounded-full
                                        border border-slate-300
                                        checked:bg-custom-blue
                                        checked:border-custom-blue
                                        cursor-pointer transition-all
                                        ${colorradioitem}
                                    `}
                                />

                                <span
                                    className={`
                                        absolute left-1/2 top-1/2
                                        -translate-x-1/2 -translate-y-1/2
                                        opacity-0 peer-checked:opacity-100
                                        pointer-events-none text-white
                                        ${colorradioitemicon}
                                    `}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-3 w-3"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <circle
                                            cx="10"
                                            cy="10"
                                            r="5"
                                        />
                                    </svg>
                                </span>

                            </div>

                            <span
                                className={`
                                    text-sm text-gray-700
                                    ${colorlableitem}
                                `}
                            >
                                {option.title}
                            </span>

                        </label>
                    );
                })}

            </div>

            <ErrorMessage
                name={name}
                component="div"
                className="text-red-500 text-sm mt-2"
            />

        </div>
    );
};

export default Radio;