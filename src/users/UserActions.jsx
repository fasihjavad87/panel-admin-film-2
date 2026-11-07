// components/UserActions.jsx
import React from 'react';

const UserActions = ({ rowData, onDelete, onEdit, onView }) => {
    return (
        <div className="flex gap-2">
            <button
                // onClick={() => onView(rowData)}
                className="p-1.5 rounded-md bg-purple-50 hover:bg-purple-100 text-purple-600 cursor-pointer transition"
                title="مشاهده دسترسی ها"
            >
                <svg className="w-[22px] h-[22px] fill-transparent">
                    <use xlinkHref="#icon-shield-user"></use>
                </svg>
            </button>
            <button
                onClick={() => onView(rowData)}
                className="p-1.5 rounded-md bg-blue-50 hover:bg-blue-100 text-custom-blue cursor-pointer transition"
                title="مشاهده جزئیات"
            >
                <svg className="w-[22px] h-[22px] fill-transparent">
                    <use xlinkHref="#icon-eye"></use>
                </svg>
            </button>
            <button
                onClick={() => onEdit(rowData)}
                className="p-1.5 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-600 cursor-pointer transition"
                title="ویرایش کاربر"
            >
                <svg className="w-[22px] h-[22px] fill-transparent">
                    <use xlinkHref="#icon-pen-new-square"></use>
                </svg>
            </button>
            <button
                onClick={() => onDelete(rowData)}
                className="p-1.5 rounded-md bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer transition"
                title="حذف کاربر"
            >
                <svg className="w-[22px] h-[22px] fill-transparent">
                    <use xlinkHref="#icon-trash-bin-minimalistic"></use>
                </svg>
            </button>
        </div>
    );
};

export default UserActions;