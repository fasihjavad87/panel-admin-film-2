// components/UserActions.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import ActionIcon from '@/components/ActionIcon';

const Actions = ({ rowData, onView, onRestore, onForceDelete }) => {
    return (
        <div className="flex gap-2">
            {/* <ActionIcon
                icon='icon-shield-user'
                className='bg-purple-50 hover:bg-purple-100 text-purple-600'
                title='مشاهده دسترسی ها'
                permission='view-permission'
            /> */}
            {/* <ActionIcon
                onClick={() => onView(rowData)}
                icon='icon-eye'
                className='bg-blue-50 hover:bg-blue-100 text-blue-600'
                title='مشاهده جزئیات'
                permission='view-user'
            /> */}
            <ActionIcon
                onClick={()=> onRestore(rowData)}
                icon='icon-restart'
                className='bg-blue-50 hover:bg-blue-100 text-blue-600'
                title='بازگردانی کاربر'
                permission='restore-user'
            />
            <ActionIcon
                onClick={() => onForceDelete(rowData)}
                icon='icon-trash-bin-minimalistic'
                className='bg-red-50 hover:bg-red-100 text-red-600'
                title='حذف دائمی کاربر'
                permission='force-delete-user'
            />
        </div>
    );
};

export default Actions;