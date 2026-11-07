import React from 'react';
import { ErrorMessage, useFormikContext } from 'formik';

const Checkbox = ({
    name,
    label,
    labelKey = 'title',
    options = [],
    className = '',
    gap='gap-x-5 gap-y-6',
    classParentCheckBox='',
    colorlableitem = '',
    colorcheckitem = '',
    colorcheckitemicon = '',
}) => {

    const { values, setFieldValue } = useFormikContext();

    const selectedValues = values[name] || [];

    const handleChange = (id) => {

        const value = String(id);

        const newValues = selectedValues.includes(value)
            ? selectedValues.filter(v => v !== value)
            : [...selectedValues, value];

        setFieldValue(name, newValues);
    };

    return (
        // <div className={`mb-2 ${className}`}>
        <div className={`${className}`}>

            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                </label>
            )}

            {/* <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"> */}
            <div className={`flex flex-wrap ${gap} ${classParentCheckBox}`}>

                {options.map((option) => {

                    const value = String(option.id);

                    const checked = selectedValues.includes(value);

                    return (
                        <label
                            key={option.id}
                            className="flex items-center gap-1.5 cursor-pointer select-none w-[140px]"
                        >

                            <div className="relative flex items-center">

                                <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => handleChange(option.id)}
                                    className={`
                                        peer h-5 w-5 appearance-none rounded
                                        border border-slate-300
                                        checked:bg-custom-blue
                                        checked:border-custom-blue
                                        cursor-pointer transition-all
                                        ${colorcheckitem}
                                    `}
                                />

                                <span
                                    className={`
                                        absolute left-1/2 top-1/2
                                        -translate-x-1/2 -translate-y-1/2
                                        opacity-0 peer-checked:opacity-100
                                        pointer-events-none text-white
                                        ${colorcheckitemicon}
                                    `}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-3.5 w-3.5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        />
                                    </svg>
                                </span>

                            </div>

                            <span
                                className={`
                                    text-sm text-gray-700 truncate
                                    ${colorlableitem}
                                `}
                            >
                                {option[labelKey]}
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

export default Checkbox;