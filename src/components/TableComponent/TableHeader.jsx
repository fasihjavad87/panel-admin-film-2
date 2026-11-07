// components/TableHeader.jsx
import React from "react";

const TableHeader = ({
    title,
    titleBtnAdd,
    funcBtnAdd,
    searchParams,
    searchValue,
    onSearchChange,
    dynamic
}) => {
    return (
        <div className="flex flex-row justify-between items-center mb-4 gap-3 select-none">
            <div className="flex gap-3 items-center">
                <h2 className="text-lg font-semibold text-custom-blue">
                    {title || 'لیست معمولی'}
                </h2>
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={funcBtnAdd}
                    className="flex justify-center items-center py-[5px] px-[11px] gap-1 bg-blue-50 hover:bg-blue-100 text-custom-blue border-[1.4px] border-custom-blue text-[18px] rounded-md transition cursor-pointer"
                >
                    <i className="fa-regular fa-plus"></i>
                    <span className="text-[16px]">{titleBtnAdd || 'افزودن'}</span>
                </button>
                <div className="relative">
                    <input
                        type="text"
                        placeholder={searchParams?.placeholder || "جستجو..."}
                        value={searchValue}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pr-8 pl-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-blue focus:border-transparent text-sm w-full md:w-64"
                    />
                    <svg className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 fill-transparent">
                        <use xlinkHref="#icon-search"></use>
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default TableHeader;