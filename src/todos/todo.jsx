import { openConfirmModal, openAlertModal } from '../components/Modal/modal';

const DemoComponent = () => {

    const deleteUser = async (name) => {

        const result = await openConfirmModal({
            // title: 'حذف کاربر',
            title: `حذف کاربر ${name}`,
            message: 'آیا از حذف این کاربر مطمئن هستید؟',
            confirmText: 'حذف',
            cancelText: 'لغو',
            // variant: 'warning',
            icon: 'eye',
            styles: {
                iconBg: 'bg-purple-100 hover:bg-purple-200 transition',
                iconColor: 'text-purple-600',
                button: 'bg-purple-500 hover:bg-purple-700',
            }
        });

        if (result) {
            openAlertModal({
                title: 'موفقیت',
                message: 'کاربر با موفقیت ایجاد شد',
                confirmText: 'باشه',
                variant: 'success',
                icon: 'check-circle'
            });
            // console.log('ok');
        } else {
             openAlertModal({
                title: 'شکست',
                message: 'مشکلی در عملیات به وجود امد',
                confirmText: 'باشه',
                variant: 'danger',
                icon: 'close-circle'
            });
            // console.log('cancel');
        }
    };

    return (
        <div className="p-8">
            <button
                onClick={() => deleteUser('جواد')}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
            >
                حذف فایل
            </button>
        </div>
    );
};

export default DemoComponent;