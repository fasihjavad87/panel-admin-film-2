export const SkeletonField = () => (
    <div className="animate-pulse">
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
        <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
    </div>
);

export const SkeletonSwitch = () => (
    <div className="animate-pulse">
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        <div className="h-7 w-14 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
    </div>
);

export const SkeletonSelect = () => (
    <div className="animate-pulse">
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
        <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
    </div>
);


export const SkeletonAvatarUploader = () => (
    <div className="space-y-4 animate-pulse">
        {/* اسکلتون نمایش آواتار فعلی */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            {/* دایره آواتار */}
            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600 border-2 border-gray-300 dark:border-gray-500"></div>

            {/* متن‌ها */}
            <div className="flex-1 space-y-2">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-600 rounded"></div>
                <div className="h-3 w-40 bg-gray-200 dark:bg-gray-600 rounded"></div>
            </div>
        </div>

        {/* اسکلتون آپلودر */}
        <div>
            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
    </div>
);

export const SkeletonTextarea = () => (
    <div className="animate-pulse">
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
        <div className="h-24 w-full bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
    </div>
);

export const SkeletonButton = (className) => (
    <div className="animate-pulse">
        {/* <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div> */}
        <div className={`h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg ${className}`}></div>
    </div>
);