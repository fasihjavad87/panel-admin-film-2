import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ErrorMessage } from 'formik';

const FileUploader = ({
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
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [uploadProgress, setUploadProgress] = useState({});
    const [animation, setAnimation] = useState('');
    const [errorAnimation, setErrorAnimation] = useState(''); // انیمیشن جداگانه برای ارور
    const [tempFiles, setTempFiles] = useState([]);
    const [tempPreviews, setTempPreviews] = useState([]);
    const [errorMessage, setErrorMessage] = useState(''); // state برای ارور
    const fileInputRef = useRef(null);
    const containerRef = useRef(null);

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

    // بستن با انیمیشن
    const closeWithAnimation = useCallback((callback) => {
        setAnimation('slide-out');
        setTimeout(() => {
            callback();
            setAnimation('');
        }, 300);
    }, []);

    // بستن پیکر با کلیک خارج
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target) && isOpen) {
                closeWithAnimation(() => {
                    setTempFiles([...files]);
                    setTempPreviews([...previews]);
                    setIsOpen(false);
                    setErrorMessage('');
                    setErrorAnimation('');
                });
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, files, previews]);

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
                // پاک کردن preview های اضافی
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

        // شبیه‌سازی آپلود
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

        // if (tempPreviews[index] && tempPreviews[index].startsWith('blob:')) {
        //     URL.revokeObjectURL(tempPreviews[index]);
        // }

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
        closeWithAnimation(() => setIsOpen(false));
    };

    const handleCancel = () => {
        // بازگرداندن به حالت اولیه
        setTempFiles([...files]);
        setTempPreviews([...previews]);
        clearErrorWithAnimation();
        closeWithAnimation(() => setIsOpen(false));
    };

    const handleClearAll = (e) => {
        e.stopPropagation();
        clearErrorWithAnimation();
        // tempPreviews.forEach(preview => {
        //     if (preview && preview.startsWith('blob:')) {
        //         URL.revokeObjectURL(preview);
        //     }
        // });
        setTempFiles([]);
        setTempPreviews([]);
        setUploadProgress({});
    };

    const handleClearSelected = (e) => {
        e.stopPropagation();
        handleClearAll(e);
    };

    const triggerFileInput = () => {
        if (!disabled) {
            clearErrorWithAnimation();
            fileInputRef.current?.click();
        }
    };

    // Toggle باز و بسته شدن
    const handleToggle = () => {
        if (disabled) return;

        if (!isOpen) {
            // باز کردن
            setTempFiles([...files]);
            setTempPreviews([...previews]);
            setIsOpen(true);
            setAnimation('slide-in');
            clearErrorWithAnimation();
        } else {
            // بستن
            closeWithAnimation(() => {
                setTempFiles([...files]);
                setTempPreviews([...previews]);
                setIsOpen(false);
                clearErrorWithAnimation();
            });
        }
    };

    // کامپوننت دایره پیشرفت
    const ProgressCircle = ({ progress, size = 36 }) => {
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
                <span className="absolute text-[10px] font-medium text-blue-600">
                    {progress}%
                </span>
            </div>
        );
    };

    // نمایش فایل‌های انتخاب شده
    const getDisplayValue = () => {
        if (files.length === 0) return '';
        if (files.length === 1) return files[0].name;
        return `${files.length} فایل انتخاب شده`;
    };

    return (
        <div className={`relative ${className}`} ref={containerRef}>
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
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {label}
                    {required && <span className="text-red-500 mr-1">*</span>}
                    {multiple && (
                        <span className="text-xs text-gray-500 mr-2">
                            (حداکثر {maxFiles} فایل)
                        </span>
                    )}
                </label>
            )}

            <div
                onClick={handleToggle}
                className={`group relative flex items-center justify-between w-full px-4 py-2.5 bg-white border rounded-xl cursor-pointer transition-all duration-200
                    ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}
                    ${isOpen
                        ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-sm'
                        : 'border-gray-300 hover:border-gray-400 hover:shadow-sm'
                    }`}
            >
                <div className="flex items-center gap-2">
                    <svg className={`w-5 h-5 fill-transparent transition-colors ${isOpen ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}`}>
                        <use xlinkHref="#icon-image"></use>
                    </svg>
                    <span className={`${getDisplayValue() ? 'text-gray-800' : 'text-gray-400'} truncate`}>
                        {getDisplayValue() || placeholder}
                    </span>
                </div>

                <div className="flex items-center gap-1">
                    {clearable && getDisplayValue() && !disabled && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setFiles([]);
                                setPreviews([]);
                                formik.setFieldValue(name, []);
                                clearErrorWithAnimation();
                            }}
                            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <svg className="w-4 h-4 text-gray-400 hover:text-red-500 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                    <svg className={`w-22px h-22px fill-transparent text-gray-400 transition-transform duration-200 cursor-pointer ${isOpen ? 'rotate-180' : ''}`}>
                        <use xlinkHref="#icon-alt-arrow-down"></use>
                    </svg>
                </div>
            </div>

            <ErrorMessage name={name}>
                {msg => <div className="text-red-500 text-xs mt-1 mr-1">{msg}</div>}
            </ErrorMessage>

            {isOpen && !disabled && (
                <div className={`absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 z-50 select-none overflow-hidden ${animation}`}>
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3">
                        <div className="flex items-center justify-between text-white">
                            <div className="flex gap-0.5 text-sm font-medium">
                                <span>انتخاب فایل</span>
                                {(tempFiles.length > 0) && (
                                    <span>({tempFiles.length})</span>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="p-1 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="p-4">
                        {/* دکمه آپلود */}
                        <div className="flex items-center justify-between gap-3 mb-4">
                            <button
                                type="button"
                                onClick={triggerFileInput}
                                className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium cursor-pointer flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                انتخاب فایل
                            </button>

                            {(tempFiles.length > 0) && (
                                <button
                                    type="button"
                                    onClick={handleClearSelected}
                                    className="px-4 py-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium cursor-pointer"
                                >
                                    پاک کردن همه
                                </button>
                            )}
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

                        {/* نمایش ارور داخل مودال با انیمیشن */}
                        {errorMessage && (
                            <div className={`mb-3 p-2 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center gap-2 ${errorAnimation}`}>
                                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="flex-1">{errorMessage}</span>
                                <button
                                    onClick={clearErrorWithAnimation}
                                    className="text-red-400 hover:text-red-600"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        )}

                        {/* لیست فایل‌ها */}
                        {tempFiles.length > 0 && (
                            <div className="flex flex-col gap-2.5">
                                <div className='flex flex-col gap-2 max-h-64 overflow-y-auto scrollbar-thin *:ml-1'>
                                    {tempFiles.map((file, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors select-none group"
                                        >
                                            {/* آیکون فایل */}
                                            <div className="w-10 h-10 flex-shrink-0 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
                                                {file.type?.startsWith('image/') ? (
                                                    <img
                                                        src={tempPreviews[index]}
                                                        alt={file.name}
                                                        className="w-full h-full object-cover rounded-lg"
                                                    />
                                                ) : (
                                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                )}
                                            </div>

                                            {/* اطلاعات فایل */}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-700 truncate" title={file.name}>
                                                    {file.name}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    {(file.size / 1024).toFixed(1)} KB
                                                </p>
                                            </div>

                                            {/* وضعیت آپلود */}
                                            <div className="flex-shrink-0">
                                                {uploadProgress[file.name] !== undefined && uploadProgress[file.name] < 100 ? (
                                                    <ProgressCircle progress={uploadProgress[file.name]} />
                                                ) : uploadProgress[file.name] === 100 ? (
                                                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                ) : (
                                                    <div className='flex items-center gap-1'>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => handleRemoveFile(index, e)}
                                                            className="p-1 text-gray-400 hover:text-red-500 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors  cursor-pointer"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                        <div className='p-1 text-green-500 bg-green-100 group-hover:bg-green-200 rounded-lg transition-colors'>
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <span className='text-[13px]'>لطفا بعد از هر تغییر دکمه <span className='text-blue-500'>تایید</span> رو بزنید</span>
                                </div>
                            </div>
                        )}

                        {tempFiles.length === 0 && (
                            <div className="text-center py-8">
                                <svg className="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <p className="text-sm text-gray-400">هیچ فایلی انتخاب نشده است</p>
                                <p className="text-xs text-gray-400 mt-1">فرمت‌های مجاز: {accept}</p>
                            </div>
                        )}

                        {/* دکمه‌ها */}
                        <div className="flex gap-2 pt-4 mt-1 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium cursor-pointer"
                            >
                                انصراف
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirm}
                                className="flex-1 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all text-sm font-medium cursor-pointer shadow-sm"
                            >
                                تایید
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileUploader;