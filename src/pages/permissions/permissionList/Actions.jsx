// components/UserActions.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import ActionIcon from '@/components/ActionIcon';

const Actions = ({ rowData, onView, onEdit, onDelete }) => {
    return (
        <div className="flex gap-2">
            {/* <ActionIcon
                to={`/users/roles/${rowData.id}/permissions`}
                icon='icon-shield-keyhole-minimalistic'
                className='bg-purple-50 hover:bg-purple-100 text-purple-600'
                title='مشاهده مجوز ها'
                permission='view-permission'
            /> */}
            {/* <button
                // onClick={() => onView(rowData)}
                className="p-1.5 rounded-md bg-purple-50 hover:bg-purple-100 text-purple-600 cursor-pointer transition"
                title="مشاهده دسترسی ها"
            >
                <svg className="w-[22px] h-[22px] fill-transparent">
                    <use xlinkHref="#icon-shield-user"></use>
                </svg>
            </button> */}
            {/* <ActionIcon
                // onClick={() => onView(rowData)}
                to={`/users/permissions/${rowData.id}`}
                icon='icon-eye'
                className='bg-blue-50 hover:bg-blue-100 text-blue-600'
                title='مشاهده جزئیات'
                permission='view-permission'
            /> */}
            {/* <button
                onClick={() => onView(rowData)}
                className="p-1.5 rounded-md bg-blue-50 hover:bg-blue-100 text-custom-blue cursor-pointer transition"
                title="مشاهده جزئیات"
            >
                <svg className="w-[22px] h-[22px] fill-transparent">
                    <use xlinkHref="#icon-eye"></use>
                </svg>
            </button> */}
            {/* <NavLink
                to={`/users/edit-user/${rowData.id}`}
                // onClick={() => onEdit(rowData)}
                className="p-1.5 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-600 cursor-pointer transition"
                title="ویرایش کاربر"
            >
                <svg className="w-[22px] h-[22px] fill-transparent">
                    <use xlinkHref="#icon-pen-new-square"></use>
                </svg>
            </NavLink> */}
            <ActionIcon
                to={`/users/permissions/edit-permission/${rowData.id}`}
                icon='icon-pen-new-square'
                className='bg-amber-50 hover:bg-amber-100 text-amber-600'
                title='ویرایش مجوز'
                permission='update-permission'
            />
            <ActionIcon
                onClick={() => onDelete(rowData)}
                icon='icon-trash-bin-minimalistic'
                className='bg-red-50 hover:bg-red-100 text-red-600'
                title='حذف مجوز'
                permission='delete-permission'
            />
            {/* <button
                onClick={() => onDelete(rowData)}
                className="p-1.5 rounded-md bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer transition"
                title="حذف کاربر"
            >
                <svg className="w-[22px] h-[22px] fill-transparent">
                    <use xlinkHref="#icon-trash-bin-minimalistic"></use>
                </svg>
            </button> */}
        </div>
    );
};

export default Actions;