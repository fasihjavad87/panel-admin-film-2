import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ErrorMessage } from 'formik';

const UnifiedFileUploader = ({
    formik,
    name,
    label,
    multiple = false,
    accept = 'image/*',
    maxSize = 5 * 1024 * 1024,
    maxFiles = 5,
    className = '',
    placeholder = 'برای آپلود فایل کلیک کنید',
    required = false,
    disabled = false,
    clearable = true,
    onUploadStart,
    onUploadSuccess,
    onUploadError,
    aggregateSuccessAlerts = false,
    labelColor = 'text-gray-700 dark:text-gray-300',
    iconLabel = 'icon-gallery',
    iconLabelStyle = '',
    icon = 'icon-gallery',
    iconColor = 'text-gray-400 dark:text-gray-400',
    clearText = 'حذف همه',
    selectFileText = 'انتخاب فایل',
    count = false,
    cancelButtonText = 'انصراف',
    cancelButtonStyle = '',
    confirmButtonText = 'تایید',
    confirmButtonStyle = '',
}) => {
    const [showConfig, setShowConfig] = useState(false);
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [uploadProgress, setUploadProgress] = useState({});
    const [animation, setAnimation] = useState('');
    const [errorAnimation, setErrorAnimation] = useState('');
    const [tempFiles, setTempFiles] = useState([]);
    const [tempPreviews, setTempPreviews] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const fileInputRef = useRef(null);
    const pickerRef = useRef(null);

    const currentValue = formik.values[name];

    // مقداردهی اولیه
    useEffect(() => {
        if (currentValue && Array.isArray(currentValue) && currentValue.length > 0) {
            setFiles(currentValue);
            const newPreviews = currentValue.map(file => {
                if (file instanceof File) {
                    return URL.createObjectURL(file);
                }
                return file.preview || file.url;
            });
            setPreviews(newPreviews);
        }
    }, [currentValue]);

    // پاک کردن URL های موقت
    useEffect(() => {
        return () => {
            previews.forEach(preview => {
                if (preview && preview.startsWith('blob:')) {
                    URL.revokeObjectURL(preview);
                }
            });
        };
    }, [previews]);

    // بستن پیکر با کلیک خارج
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target) && showConfig) {
                handleCancel();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showConfig, tempFiles, tempPreviews]);

    const showError = (message) => {
        setErrorMessage(message);
        setErrorAnimation('slide-in');
        onUploadError?.(message);
    };

    const clearErrorWithAnimation = () => {
        if (errorMessage) {
            setErrorAnimation('slide-out');
            setTimeout(() => {
                setErrorMessage('');
                setErrorAnimation('');
            }, 300);
        }
    };

    const validateFile = (file) => {
        const acceptedTypes = accept.split(',').map(t => t.trim());
        const fileType = file.type;
        const fileExt = '.' + file.name.split('.').pop().toLowerCase();

        const isAccepted = acceptedTypes.some(type => {
            if (type.includes('/*')) {
                const mainType = type.split('/')[0];
                return fileType.startsWith(mainType);
            }
            return fileType === type || fileExt === type;
        });

        if (!isAccepted) {
            showError(`نوع فایل ${file.name} مجاز نیست. فرمت‌های مجاز: ${accept}`);
            return false;
        }

        if (file.size > maxSize) {
            showError(`حجم فایل ${file.name} بیشتر از ${(maxSize / 1024 / 1024).toFixed(1)}MB است`);
            return false;
        }

        return true;
    };

    const processFiles = (newFiles) => {
        clearErrorWithAnimation();

        const validFiles = [];
        const validPreviews = [];

        for (let file of newFiles) {
            if (validateFile(file)) {
                validFiles.push(file);
                const preview = URL.createObjectURL(file);
                validPreviews.push(preview);
            }
        }

        if (validFiles.length === 0) return;

        let updatedFiles;
        let updatedPreviews;

        if (multiple) {
            const totalFiles = tempFiles.length + validFiles.length;
            if (totalFiles > maxFiles) {
                showError(`حداکثر ${maxFiles} فایل می‌توانید آپلود کنید.`);
                validPreviews.forEach(preview => {
                    if (preview && preview.startsWith('blob:')) {
                        URL.revokeObjectURL(preview);
                    }
                });
                return;
            }
            updatedFiles = [...tempFiles, ...validFiles];
            updatedPreviews = [...tempPreviews, ...validPreviews];
        } else {
            tempPreviews.forEach(preview => {
                if (preview && preview.startsWith('blob:')) {
                    URL.revokeObjectURL(preview);
                }
            });
            updatedFiles = [validFiles[0]];
            updatedPreviews = [validPreviews[0]];
        }

        setTempFiles(updatedFiles);
        setTempPreviews(updatedPreviews);

        validFiles.forEach(file => {
            simulateUpload(file);
        });
    };

    const simulateUpload = (file) => {
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));

        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            setUploadProgress(prev => ({ ...prev, [file.name]: progress }));

            if (progress >= 100) {
                clearInterval(interval);
                setUploadProgress(prev => {
                    const newProgress = { ...prev };
                    delete newProgress[file.name];
                    return newProgress;
                });
                // onUploadSuccess?.(file);
            }
        }, 200);
    };

    const handleFileSelect = (e) => {
        e.stopPropagation();
        clearErrorWithAnimation();
        const selectedFiles = Array.from(e.target.files);
        processFiles(selectedFiles);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleRemoveFile = (index, e) => {
        e.stopPropagation();
        clearErrorWithAnimation();

        const newFiles = tempFiles.filter((_, i) => i !== index);
        const newPreviews = tempPreviews.filter((_, i) => i !== index);

        setTempFiles(newFiles);
        setTempPreviews(newPreviews);

        if (tempFiles[index] && tempFiles[index].name) {
            setUploadProgress(prev => {
                const newProgress = { ...prev };
                delete newProgress[tempFiles[index].name];
                return newProgress;
            });
        }
    };

    const handleConfirm = () => {

        previews.forEach(preview => {
            if (preview && preview.startsWith('blob:')) {
                URL.revokeObjectURL(preview);
            }
        })

        setFiles(tempFiles);
        setPreviews(tempPreviews);
        formik.setFieldValue(name, tempFiles);

        const newFiles = tempFiles.filter(file =>
            !files.some(existingFile =>
                existingFile.name === file.name &&
                existingFile.size === file.size &&
                existingFile.lastModified === file.lastModified
            )
        );

        if (aggregateSuccessAlerts) {
            if (newFiles.length > 0) {
                onUploadSuccess?.(newFiles);
            }
        } else (
            newFiles.forEach(file => {
                onUploadSuccess?.(file);
            })
        )

        clearErrorWithAnimation();
        closeWithAnimation(() => setShowConfig(false));
    };

    const handleCancel = () => {
        setTempFiles([...files]);
        setTempPreviews([...previews]);
        clearErrorWithAnimation();
        closeWithAnimation(() => setShowConfig(false));
    };

    const handleClearAll = () => {
        clearErrorWithAnimation();
        setTempFiles([]);
        setTempPreviews([]);
        setUploadProgress({});
    };

    const triggerFileInput = () => {
        if (!disabled) {
            clearErrorWithAnimation();
            fileInputRef.current?.click();
        }
    };

    const handleToggleConfig = () => {
        if (disabled) return;

        if (showConfig) {
            closeWithAnimation(() => setShowConfig(false));
        } else {
            setTempFiles([...files]);
            setTempPreviews([...previews]);
            setShowConfig(true);
            setAnimation('slide-in');
            clearErrorWithAnimation();
        }
    };

    const closeWithAnimation = (callback) => {
        setAnimation('slide-out');
        setTimeout(() => {
            callback();
            setAnimation('');
        }, 300);
    };

    const ProgressCircle = ({ progress, size = 28 }) => {
        const radius = (size - 6) / 2;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (progress / 100) * circumference;

        return (
            <div className="relative inline-flex items-center justify-center">
                <svg width={size} height={size} className="transform -rotate-90">
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="3"
                    />
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="3"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="transition-all duration-300"
                    />
                </svg>
                <span className="absolute text-[9px] font-medium text-blue-600">
                    {progress}%
                </span>
            </div>
        );
    };

    const getDisplayValue = () => {
        if (files.length === 0) return '';
        if (files.length === 1) return files[0].name;
        return `${files.length} فایل انتخاب شده`;
    };

    return (
        <div className={` ${className}`} ref={pickerRef}>
            <style>{`
                @keyframes slideInFromMiddle {
                    0% {
                        opacity: 0;
                        transform: scale(0.95) translateY(-10px);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }

                @keyframes slideOutToMiddle {
                    0% {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                    100% {
                        opacity: 0;
                        transform: scale(0.95) translateY(-10px);
                    }
                }

                .slide-in {
                    animation: slideInFromMiddle 0.3s cubic-bezier(0.34, 1.2, 0.64, 1) forwards !important;
                }

                .slide-out {
                    animation: slideOutToMiddle 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards !important;
                }
            `}</style>

            {label && (
                <div className='flex items-center justify-between mb-2 select-none'>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {/* <div className="flex items-center justify-between"> */}
                        <div className="flex gap-1 items-center">
                            <svg className={`w-[18px] h-[18px] fill-transparent ${iconLabelStyle}`}>
                                <use xlinkHref={`#${iconLabel}`} />
                            </svg>
                            <span className={`${labelColor}`}>{label}</span>
                            {required && <span className="text-red-500">*</span>}
                            {multiple && (
                                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                                    (حداکثر {maxFiles} فایل)
                                </span>
                            )}
                        </div>
                        {/* {clearable && getDisplayValue() && !disabled && ( */}
                        {/* <div> */}
                        {/* <button
                                type='button'
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setFiles([]);
                                    setPreviews([]);
                                    formik.setFieldValue(name, []);
                                    clearErrorWithAnimation();
                                    closeWithAnimation(() => setShowConfig(false));
                                }}
                                className={`px-3 py-1 text-xs bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 rounded-lg transition-colors duration-200 cursor-pointer
                                                ${clearable && getDisplayValue() && !disabled
                                        ? 'opacity-100 visible'
                                        : 'opacity-0 invisible'}
                                                `}
                            >
                                حذف همه
                            </button> */}
                        {/* </div> */}
                        {/* )} */}
                        {/* </div> */}
                    </label>
                    <button
                        type='button'
                        onClick={(e) => {
                            e.stopPropagation();
                            setFiles([]);
                            setPreviews([]);
                            formik.setFieldValue(name, []);
                            clearErrorWithAnimation();
                            closeWithAnimation(() => setShowConfig(false));
                        }}
                        className={`px-3 py-1 text-xs bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 rounded-lg transition-colors duration-200 cursor-pointer
                                                ${clearable && getDisplayValue() && !disabled
                                ? 'opacity-100 visible'
                                : 'opacity-0 invisible'}
                                                `}
                    >
                        {clearText}
                    </button>
                </div>
            )}

            <div className="relative">
                <button
                    type="button"
                    onClick={handleToggleConfig}
                    className={`
                        w-full pr-3 pl-1.5 py-[9px] text-right
                        border rounded-lg
                        bg-white dark:bg-gray-700
                        text-gray-700 dark:text-white
                        flex items-center cursor-pointer
                        hover:bg-gray-50 dark:hover:bg-gray-600
                        transition-all group
                        ${disabled ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed opacity-60' : ''}
                        ${showConfig
                            ? 'border-blue-500 ring-1 ring-blue-500'
                            : 'border-gray-300 dark:border-gray-600'
                        }
                    `}
                >
                    <div className="flex-1 min-w-0">
                        {getDisplayValue() ? (
                            <div className="flex items-center gap-2">
                                <div className="
                                    w-6 h-6 rounded-full
                                    bg-blue-100 dark:bg-blue-900
                                    flex items-center justify-center
                                    text-blue-600 dark:text-blue-300
                                    text-xs font-bold flex-shrink-0
                                ">
                                    {getDisplayValue().charAt(0).toUpperCase()}
                                </div>
                                <div className="truncate">
                                    <div className="font-medium truncate text-sm">
                                        {getDisplayValue()}
                                    </div>
                                    {/* {files.length > 0 && (
                                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                            {files.length} فایل انتخاب شده
                                        </div>
                                    )} */}
                                </div>
                            </div>
                        ) : (
                            <div className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-2">
                                <div className="
                                    w-6 h-6 rounded-full
                                    bg-gray-100 dark:bg-gray-700
                                    flex items-center justify-center
                                ">
                                    <svg className={`w-4 h-4 fill-transparent ${iconColor}`}>
                                        <use xlinkHref={`#${icon}`} />
                                    </svg>
                                    {/* <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg> */}
                                </div>
                                <span>{placeholder || 'برای آپلود فایل کلیک کنید'}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                        {count && getDisplayValue() && files.length > 0 && (
                            <span className="
                                bg-blue-600 text-white
                                text-xs rounded-full
                                w-5 h-5
                                flex items-center justify-center
                            ">
                                {files.length}
                            </span>
                        )}
                        <svg className={`w-[18px] h-[18px] text-gray-400 fill-transparent transition-transform ${showConfig ? 'rotate-180' : ''}`}>
                            <use xlinkHref="#icon-alt-arrow-down" />
                        </svg>
                        {/* <svg
                            className={`
                                w-4 h-4 text-gray-400
                                transition-transform
                                ${showConfig ? 'rotate-180' : ''}
                            `}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                             
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg> */}
                    </div>
                </button>

                <ErrorMessage name={name}>
                    {msg => <div className="text-red-500 text-sm mt-1 block">{msg}</div>}
                </ErrorMessage>

                {showConfig && !disabled && (
                    <div className={`
                        absolute z-50 mt-1 w-full
                        bg-white dark:bg-gray-800
                        border border-gray-300 dark:border-gray-600
                        rounded-lg shadow-xl select-none
                        max-h-[400px] overflow-auto scrollbar-thin
                        transition-all duration-100
                        ${animation === 'slide-in' ? 'opacity-100 scale-100' : ''}
                        ${animation === 'slide-out' ? 'opacity-0 scale-95' : ''}
                    `}>
                        {/* هدر */}
                        <div className="
                            sticky z-10 top-0
                            bg-white dark:bg-gray-800
                            p-2
                            border-b border-gray-200 dark:border-gray-700
                            flex justify-between items-center
                        ">
                            <div className="flex gap-1 items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                                <span>انتخاب فایل</span>
                                {(tempFiles.length > 0) && (
                                    <span className='text-blue-600 dark:text-blue-400'>({tempFiles.length})</span>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={triggerFileInput}
                                    className="
                                        px-3 py-1 text-xs
                                        bg-blue-50 dark:bg-blue-900/30
                                        text-blue-600 dark:text-blue-400
                                        rounded-lg
                                        hover:bg-blue-100 dark:hover:bg-blue-900/50
                                        transition-colors cursor-pointer
                                    "
                                >
                                    {selectFileText}
                                </button>
                                {(tempFiles.length > 0) && (
                                    <button
                                        type="button"
                                        onClick={handleClearAll}
                                        className="
                                            px-3 py-1 text-xs
                                            bg-red-50 dark:bg-red-900/30
                                            text-red-500 dark:text-red-400
                                            rounded-lg
                                            hover:bg-red-100 dark:hover:bg-red-900/50
                                            transition-colors cursor-pointer
                                        "
                                    >
                                        {clearText}
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="
                                        p-1 text-xs
                                        text-gray-400 hover:text-red-500 dark:hover:text-red-300
                                        bg-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700
                                        rounded-lg transition-colors cursor-pointer
                                    "
                                >

                                    <svg className="w-4 h-4 fill-transparent">
                                        <use xlinkHref="#icon-closed" />
                                    </svg>
                                    {/* <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg> */}
                                </button>
                            </div>
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept={accept}
                            multiple={multiple}
                            onChange={handleFileSelect}
                            className="hidden"
                            disabled={disabled}
                        />

                        {/* نمایش ارور */}
                        {errorMessage && (
                            <div className={`m-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm flex items-center gap-2 ${errorAnimation}`}>
                                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="flex-1">{errorMessage}</span>
                                <button onClick={clearErrorWithAnimation} className="text-red-400 hover:text-red-600 dark:hover:text-red-300">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        )}

                        {/* لیست فایل‌ها */}
                        <div className="p-1 flex flex-col gap-1">
                            {tempFiles.length > 0 ? (
                                <>
                                    {tempFiles.map((file, index) => (
                                        // <div
                                        //     key={index}
                                        //     className={`
                                        //         relative pl-3 pr-1.5 py-2
                                        //         hover:bg-gray-100 dark:hover:bg-gray-700
                                        //         rounded-md transition-colors
                                        //         flex items-center justify-between
                                        //     `}
                                        // >
                                        //     <div className="grid grid-cols-[auto,1fr] gap-2 items-center">
                                        //         {/* آیکون/پیش‌نمایش */}
                                        //         <div className="
                                        //             w-8 h-8 rounded-full
                                        //             bg-blue-100 dark:bg-blue-900
                                        //             flex items-center justify-center
                                        //             text-blue-600 dark:text-blue-300
                                        //             text-xs font-bold
                                        //             flex-shrink-0
                                        //             overflow-hidden
                                        //         ">
                                        //             {file.type?.startsWith('image/') ? (
                                        //                 <img src={tempPreviews[index]} alt={file.name} className="w-full h-full object-cover" />
                                        //             ) : (
                                        //                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        //                 </svg>
                                        //             )}
                                        //         </div>

                                        //         {/* اطلاعات فایل */}
                                        //         <div className="min-w-0">
                                        //             <div className="font-semibold text-sm text-gray-800 dark:text-gray-200 truncate">
                                        //                 {file.name}
                                        //             </div>
                                        //             <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                        //                 {(file.size / 1024).toFixed(1)} KB
                                        //             </div>
                                        //         </div>
                                        //     </div>

                                        //     {/* وضعیت آپلود و دکمه حذف */}
                                        //     <div className="flex items-center gap-2">
                                        //         {uploadProgress[file.name] !== undefined && uploadProgress[file.name] < 100 ? (
                                        //             <ProgressCircle progress={uploadProgress[file.name]} />
                                        //         ) : uploadProgress[file.name] === 100 ? (
                                        //             <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        //             </svg>
                                        //         ) : (
                                        //             <button
                                        //                 type="button"
                                        //                 onClick={(e) => handleRemoveFile(index, e)}
                                        //                 className="
                                        //                     p-1 text-gray-400 hover:text-red-500
                                        //                     bg-gray-100 dark:bg-gray-700
                                        //                     hover:bg-gray-200 dark:hover:bg-gray-600
                                        //                     rounded-lg transition-colors cursor-pointer
                                        //                 "
                                        //             >
                                        //                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        //                 </svg>
                                        //             </button>
                                        //         )}
                                        //     </div>
                                        // </div>
                                        <div
                                            key={index}
                                            className="flex items-center gap-3 p-2 ml-1.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                                        >
                                            {/* آیکون/پیش‌نمایش */}
                                            <div className="w-10 h-10 flex-shrink-0 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center overflow-hidden">
                                                {file.type?.startsWith('image/') ? (
                                                    <img src={tempPreviews[index]} alt={file.name} className="w-full h-full object-cover rounded-lg" />
                                                ) : (
                                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                )}
                                            </div>

                                            {/* اطلاعات فایل */}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate" title={file.name}>
                                                    {file.name}
                                                </p>
                                                <p className="text-xs text-gray-400 dark:text-gray-500">
                                                    {(file.size / 1024).toFixed(1)} KB
                                                </p>
                                            </div>

                                            {/* وضعیت آپلود و دکمه‌ها */}
                                            <div className="flex-shrink-0">
                                                <div className='flex items-center gap-1'>
                                                    {uploadProgress[file.name] !== undefined && uploadProgress[file.name] < 100 ? (
                                                        <ProgressCircle progress={uploadProgress[file.name]} />
                                                    ) : uploadProgress[file.name] === 100 ? (
                                                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    ) : (
                                                        <>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => handleRemoveFile(index, e)}
                                                                className="p-1 text-gray-400 hover:text-red-500 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors cursor-pointer"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                            </button>
                                                            <div className='p-1 text-green-500 bg-green-100 dark:bg-green-900/30 group-hover:bg-green-200 dark:group-hover:bg-green-900/50 rounded-lg transition-colors'>
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="px-3 py-1 text-xs text-gray-500 dark:text-gray-400">
                                        لطفا بعد از هر تغییر دکمه <span className='text-blue-500 dark:text-blue-400'>{confirmButtonText}</span> رو بزنید
                                    </div>
                                </>
                            ) : (
                                <div className="px-3 py-4 text-center text-gray-500 dark:text-gray-400">
                                    <svg className="w-8 h-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <div className="text-sm">هیچ فایلی انتخاب نشده است</div>
                                    <div className="text-xs mt-1">فرمت‌های مجاز: {accept}</div>
                                </div>
                            )}
                        </div>

                        {/* دکمه‌ها */}
                        <div className="
                            sticky bottom-0
                            bg-white dark:bg-gray-800
                            p-2
                            border-t border-gray-200 dark:border-gray-700
                            flex gap-2
                        ">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className={`
                                    flex-1 px-3 py-2
                                    rounded-lg
                                    border border-gray-300 dark:border-gray-600
                                    text-gray-700 dark:text-gray-300
                                    hover:bg-gray-50 dark:hover:bg-gray-700
                                    transition-colors text-sm font-medium cursor-pointer
                                    ${cancelButtonStyle}
                                `}
                            >
                                {cancelButtonText}
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirm}
                                className={`
                                    flex-1 px-3 py-2
                                    rounded-lg
                                    bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700
                                    text-white
                                    transition-all text-sm font-medium cursor-pointer shadow-sm
                                    ${confirmButtonStyle}
                                `}
                            >
                                {confirmButtonText}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UnifiedFileUploader;