// AvatarUploader.jsx
import React, { useState } from 'react';
import UnifiedFileUploader from './UnifiedFileUploader';

const AvatarUploader = ({
    formik,
    initialAvatar,
    title = 'آواتار فعلی',
    description = 'برای تغییر، فایل جدید آپلود کنید',
    ...props
}) => {
    const [avatarPreview, setAvatarPreview] = useState(initialAvatar);

    return (
        <div className="space-y-4">
            {/* نمایش آواتار فعلی */}
            {avatarPreview && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <img
                        src={avatarPreview}
                        alt={title}
                        className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                    />
                    <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {description}
                        </p>
                    </div>
                </div>
            )}

            {/* آپلودر */}
            <UnifiedFileUploader
                {...props}
                formik={formik}
                onUploadSuccess={(file) => {
                    // وقتی فایل جدید آپلود شد، پیش‌نمایش قبلی رو پاک کن
                    setAvatarPreview(null);
                }}
            />
        </div>
    );
};

export default AvatarUploader;