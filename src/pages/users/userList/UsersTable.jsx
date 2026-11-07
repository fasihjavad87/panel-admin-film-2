import React, { useState } from "react";
import {
  usersGetService,
  userSoftDeleteService,
  userGroupSoftDeleteService,
} from "@/services/users";
import PaginatedTable from "@/components/PaginatedTable";
import { NavLink, useNavigate } from "react-router-dom";
import useServerTable from "@/hooks/useServerTable";
import { createUserColumns } from "./UserColumns";
import { openConfirmModal, openAlertModal } from "@/components/Modal/modal";
import { useHasPermission } from "@/hooks/useHasPermission";
import { toast } from "@/components/Toast/ToastContainer";
import Tooltip2 from "@/components/Tooltip2";

const UsersTable = () => {
  const navigate = useNavigate();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const {
    data,
    loading,
    currentPage,
    setCurrentPage,
    search,
    setSearch,
    pageCount,
    refresh,
  } = useServerTable({
    service: usersGetService,
    perPage: 50,
  });
  const hasPerm1 = useHasPermission("create-user");
  const hasPerm2 = useHasPermission("delete-user");

  const deleteUser = async (user) => {
    const confirmed = await openConfirmModal({
      title: "حذف کاربر",
      message: `آیا از حذف کاربر "${user.name}" مطمئن هستید؟`,
      confirmText: "حذف شود",
      cancelText: "انصراف",
      variant: "danger",
      icon: "trash-bin-minimalistic",
    });
    if (confirmed) {
      try {
        // ✅ صدا زدن سرویس حذف دائمی
        const response = await userSoftDeleteService(user.id);

        if (response.status === 200 || response.status === 204) {
          // ✅ نمایش پیام موفقیت
          // await openAlertModal({
          //     title: "عملیات موفق",
          //     message: `کاربر "${user.name}" با موفقیت حذف شد`,
          //     confirmText: "متوجه شدم",
          //     variant: "success",
          //     icon: "check-circle",
          // });
          await toast.success(`کاربر "${user.name}" با موفقیت حذف موقت شد`, {
            title: "موفق",
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
        await toast.error(
          error.response?.data?.message || "خطا در حذف موقت کاربر",
          {
            title: "خطا",
            duration: 5000,
          },
        );
      }
    }
  };

  const groupDeleteUser = async () => {
    if (selectedUsers.length === 0) {
      toast.warning("لطفاً حداقل یک کاربر را انتخاب کنید", {
        title: "توجه",
        duration: 3000,
      });
      return;
    }

    const confirmed = await openConfirmModal({
      title: "حذف کاربر",
      message: `آیا از حذف تعداد "${selectedUsers.length}" کاربر مطمئن هستید؟`,
      confirmText: "حذف شود",
      cancelText: "انصراف",
      variant: "danger",
      icon: "trash-bin-minimalistic",
    });
    if (confirmed) {
      try {
        // const userIds = selectedUsers.map(user => user.id);
        // ✅ صدا زدن سرویس حذف دائمی
        const response = await userGroupSoftDeleteService({
          ids: selectedUsers,
        });

        if (response.status === 200 || response.status === 204) {
          // ✅ نمایش پیام موفقیت
          // await openAlertModal({
          //     title: "عملیات موفق",
          //     message: `کاربر "${user.name}" با موفقیت حذف شد`,
          //     confirmText: "متوجه شدم",
          //     variant: "success",
          //     icon: "check-circle",
          // });
          await toast.success(
            `تعداد "${selectedUsers.length}" کاربر با موفقیت حذف موقت شد`,
            {
              title: "موفق",
              duration: 5000,
            },
          );

          setSelectedUsers([]);
          // ✅ بارگذاری مجدد دیتا
          refresh();
          // console.log(selectedUsers.length);
        }
      } catch (error) {
        // ✅ مدیریت خطا
        console.error("Error group force deleting user:", error);
        // await openAlertModal({
        //     title: "خطا",
        //     message: error.response?.data?.message || "خطا در حذف کاربر",
        //     confirmText: "متوجه شدم",
        //     variant: "danger",
        //     icon: "alert-triangle",
        // });
        await toast.error(
          error.response?.data?.message || "خطا در حذف موقت کاربر",
          {
            title: "خطا",
            duration: 5000,
          },
        );
      }
    }
  };

  const dataInfo = createUserColumns({
    onView: (user) => console.log("View:", user),
    // onEdit: (user) => console.log("Edit:", user),
    onDelete: deleteUser,
    // onDelete: (user) => console.log("Delete:", user),
  });

  const tableSetting = {
    title: "لیست کاربران",
    searchPlaceholder: "جست و جو ...",
    selectable: true,
    countSelect: true,
    loading: loading,
  };

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
        <div className="flex gap-2">
          {hasPerm2 && selectedUsers.length > 0 && (
            <Tooltip2
              placement="top"
              text={<span>حذف موقت ({selectedUsers.length})</span>}
            >
              <button
                // to={'/users/add-user'}
                // onClick={() => navigate('/users/add-user')}
                // onClick={() => modalRef.current?.open()}
                onClick={groupDeleteUser}
                className="flex justify-center items-center p-1.5 gap-1 bg-red-50 hover:bg-red-100 text-red-500 border-[1.4px] border-red-500 text-[18px] rounded-md transition cursor-pointer"
              >
                {/* <i className="fa-regular fa-plus"></i> */}
                <svg className="w-22px h-22px fill-transparent">
                  <use xlinkHref="#icon-trash-bin-minimalistic"></use>
                </svg>
                {/* <span className="text-[16px]">حذف دسته جمعی</span> */}
                {/* <span className="text-[16px]">حذف دسته جمعی ({selectedMovies.length})</span> */}
              </button>
            </Tooltip2>
          )}
          {hasPerm1 && (
            <Tooltip2 text="افزودن" placement="top">
              <NavLink
                to={"/users/add-user"}
                // onClick={() => navigate('/users/add-user')}
                // onClick={() => modalRef.current?.open()}
                className="flex justify-center items-center p-1.5 gap-1 bg-blue-50 hover:bg-blue-100 text-custom-blue border-[1.4px] border-custom-blue text-[18px] rounded-md transition cursor-pointer"
              >
                {/* <i className="fa-regular fa-plus"></i> */}
                <svg className="w-22px h-22px fill-transparent">
                  <use xlinkHref="#icon-plus"></use>
                </svg>
                {/* <span className="text-[16px]">افزودن</span> */}
              </NavLink>
            </Tooltip2>
          )}
        </div>
      </PaginatedTable>
    </>
  );
};

export default UsersTable;
