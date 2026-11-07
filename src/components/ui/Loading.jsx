import React from "react";

const Loading = ({ text = "در حال بارگذاری..." }) => {
    return (
        // <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-[9999]">
        //     <div className="relative">
        //         <div className="h-16 w-16 rounded-full border-4 border-gray-200"></div>

        //         <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
        //     </div>

        //     <p className="mt-5 text-gray-600 text-sm font-medium animate-pulse">
        //         {text}
        //     </p>
        // </div>

        <div className="fixed inset-0 bg-slate-50 flex items-center justify-center z-50">
            <div className="flex flex-col items-center">

                <div className="flex gap-2">
                    <span className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></span>
                    <span
                        className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                    ></span>
                    <span
                        className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                    ></span>
                </div>

                <p className="mt-5 text-gray-500 font-medium">
                    {text}
                </p>
            </div>
        </div>
    );
};

export default Loading;