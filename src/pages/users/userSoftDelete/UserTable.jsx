import React, { useState } from 'react';
import { usersGetTrashedService } from '@/services/users';
import PaginatedTable from '@/components/PaginatedTable';
import { NavLink, useNavigate } from 'react-router-dom';
import useServerTable from '@/hooks/useServerTable';
import { createUserColumns } from './UserColumns';
import { openConfirmModal, openAlertModal } from '@/components/Modal/modal';
import { useHasPermission } from '@/hooks/useHasPermission';
import { userRestoreService, userForceDeleteService } from '@/services/users';
import { toast } from '@/components/Toast/ToastContainer';


const UsersTable = () => {
    const navigate = useNavigate()
    const [selectedUsers, setSelectedUsers] = useState([]);
    const { data, loading, currentPage, setCurrentPage, search, setSearch, pageCount, refresh } = useServerTable({
        service: usersGetTrashedService,
        perPage: 50
    })
    // const hasPerm = useHasPermission('create-user');



    const restoreUser = async (user) => {
        const confirmed = await openConfirmModal({
            title: "بازگردانی کاربر",
            message: `آیا از بازگردانی کاربر "${user.name}" مطمئن هستید؟`,
            confirmText: "بازگردانی شود",
            cancelText: "انصراف",
            variant: "info", // ✅ تغییر به info چون عملیات بازگردانیه
            icon: "restart",
        });

        if (confirmed) {
            try {
                // ✅ صدا زدن سرویس بازگردانی
                const response = await userRestoreService(user.id);

                if (response.status === 200 || response.status === 201) {
                    // ✅ نمایش پیام موفقیت
                    // await openAlertModal({
                    //     title: "عملیات موفق",
                    //     message: `کاربر "${user.name}" با موفقیت بازگردانی شد`,
                    //     confirmText: "متوجه شدم",
                    //     variant: "success",
                    //     icon: "check-circle",
                    // });
                    await toast.success(`کاربر "${user.name}" با موفقیت بازگردانی شد`, {
                        title: 'موفق',
                        duration: 5000,
                    });

                    // ✅ بارگذاری مجدد دیتا
                    refresh();
                }
            } catch (error) {
                // ✅ مدیریت خطا
                console.error("Error restoring user:", error);
                // await openAlertModal({
                //     title: "خطا",
                //     message: error.response?.data?.message || "خطا در بازگردانی کاربر",
                //     confirmText: "متوجه شدم",
                //     variant: "danger",
                //     icon: "alert-triangle",
                // });
                await toast.error(error.response?.data?.message || "خطا در بازگردانی کاربر", {
                    title: 'خطا',
                    duration: 5000,
                });
            }
        }
    };

    // ✅ تابع حذف دائمی کاربر
    const forceDeleteUser = async (user) => {
        const confirmed = await openConfirmModal({
            title: "حذف دائمی کاربر",
            message: `آیا از حذف دائمی کاربر "${user.name}" مطمئن هستید؟ این عملیات غیرقابل بازگشت است!`,
            confirmText: "حذف شود",
            cancelText: "انصراف",
            variant: "danger",
            icon: "trash-bin-minimalistic",
        });

        if (confirmed) {
            try {
                // ✅ صدا زدن سرویس حذف دائمی
                const response = await userForceDeleteService(user.id);

                if (response.status === 200 || response.status === 204) {
                    // ✅ نمایش پیام موفقیت
                    // await openAlertModal({
                    //     title: "عملیات موفق",
                    //     message: `کاربر "${user.name}" با موفقیت حذف شد`,
                    //     confirmText: "متوجه شدم",
                    //     variant: "success",
                    //     icon: "check-circle",
                    // });
                    await toast.success(`کاربر "${user.name}" با موفقیت حذف شد`, {
                        title: 'موفق',
                        duration: 5000,
                    });

                    // ✅ بارگذاری مجدد دیتا
                    refresh();
                }
            } catch (error) {
                // ✅ مدیریت خطا
                console.error("Error force deleting user:", error);
                // await openAlertModal({
                //     title: "خطا",
                //     message: error.response?.data?.message || "خطا در حذف کاربر",
                //     confirmText: "متوجه شدم",
                //     variant: "danger",
                //     icon: "alert-triangle",
                // });
                await toast.error(error.response?.data?.message || "خطا در حذف کاربر", {
                    title: 'خطا',
                    duration: 5000,
                });
            }
        }
    };

    const dataInfo = createUserColumns({
        onView: (user) => console.log("View:", user),
        onRestore: restoreUser,
        onForceDelete: forceDeleteUser,
        // onDelete: (user) => console.log("Delete:", user),
    })




    const tableSetting = {
        title: 'لیست کاربران حذف شده',
        searchPlaceholder: 'جست و جو ...',
        selectable: true,
        countSelect: true,
        loading: loading
    }


    return (

        <>
            <PaginatedTable
                serverSide={true}

                data={data}
                dataInfo={dataInfo}
                currentPage={currentPage}
                pageCount={pageCount}
                onPageChange={setCurrentPage}
                searchValue={search}
                onSearch={setSearch}
                selectedRows={selectedUsers}
                setSelectedRows={setSelectedUsers}
                tableSetting={tableSetting}
            >
                {/* {hasPerm &&
                    <NavLink
                        to={'/users/add-user'}
                        // onClick={() => navigate('/users/add-user')}
                        // onClick={() => modalRef.current?.open()}
                        className="flex justify-center items-center py-[5px] px-[11px] gap-1 bg-blue-50 hover:bg-blue-100 text-custom-blue border-[1.4px] border-custom-blue text-[18px] rounded-md transition cursor-pointer"
                    >
                        <i className="fa-regular fa-plus"></i>
                        <span className="text-[16px]">افزودن</span>
                    </NavLink>
                } */}
            </PaginatedTable>
        </>
    );
}

export default UsersTable;
