// components/UserActions.jsx
import ActionIcon from '@/components/ActionIcon';

const Actions = ({ rowData, onDelete }) => {
    return (
        <div className="flex gap-2">
            <ActionIcon
                to={`/countries/edit-country/${rowData.id}`}
                icon='icon-pen-new-square'
                className='bg-amber-50 hover:bg-amber-100 text-amber-600'
                title='ویرایش کشور'
                permission='update-country'
            />
            <ActionIcon
                onClick={() => onDelete(rowData)}
                icon='icon-trash-bin-minimalistic'
                className='bg-red-50 hover:bg-red-100 text-red-600'
                title='حذف کشور'
                permission='delete-country'
            />
        </div>
    );
};

export default Actions;