import React, { useEffect, useState } from "react";
import {
  permissionsGetService,
  permissionDeleteService,
} from "@/services/permissions";
import PaginatedTable from "@/components/PaginatedTable";
import { NavLink, useNavigate } from "react-router-dom";
import useServerTable from "@/hooks/useServerTable";
import { createPermissionColumns } from "./PermissionColumns";
import { openConfirmModal, openAlertModal } from "@/components/Modal/modal";
import { useHasPermission } from "@/hooks/useHasPermission";
import { toast } from "@/components/Toast/ToastContainer";
import { useTableRefresh } from "@/hooks/useTableRefresh";
import Tooltip2 from "@/components/Tooltip2";

const PermissionsTable = () => {
  const navigate = useNavigate();
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const { registerRefresh, unregisterRefresh } = useTableRefresh();
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
    service: permissionsGetService,
    perPage: 50,
  });
  const hasPerm = useHasPermission("create-permission");

  useEffect(() => {
    registerRefresh("permissions", refresh);

    return () => unregisterRefresh("permissions");
  }, []);

  const deletePermission = async (permission) => {
    const confirmed = await openConfirmModal({
      title: "حذف مجوز",
      message: `آیا از حذف مجوز "${permission.name}" مطمئن هستید؟`,
      confirmText: "حذف شود",
      cancelText: "انصراف",
      variant: "danger",
      icon: "trash-bin-minimalistic",
    });
    if (confirmed) {
      try {
        // ✅ صدا زدن سرویس حذف دائمی
        const response = await permissionDeleteService(permission.id);

        if (response.status === 200 || response.status === 204) {
          // ✅ نمایش پیام موفقیت
          // await openAlertModal({
          //     title: "عملیات موفق",
          //     message: `کاربر "${user.name}" با موفقیت حذف شد`,
          //     confirmText: "متوجه شدم",
          //     variant: "success",
          //     icon: "check-circle",
          // });
          await toast.success(`مجوز "${permission.name}" با موفقیت حذف شد`, {
            title: "موفق",
            duration: 5000,
          });

          // ✅ بارگذاری مجدد دیتا
          refresh();
        }
      } catch (error) {
        // ✅ مدیریت خطا
        console.error("Error force deleting permission:", error);
        // await openAlertModal({
        //     title: "خطا",
        //     message: error.response?.data?.message || "خطا در حذف کاربر",
        //     confirmText: "متوجه شدم",
        //     variant: "danger",
        //     icon: "alert-triangle",
        // });
        await toast.error(error.response?.data?.message || "خطا در حذف مجوز", {
          title: "خطا",
          duration: 5000,
        });
      }
    }
  };

  const dataInfo = createPermissionColumns({
    onView: (permission) => console.log("View:", permission),
    // onEdit: (user) => console.log("Edit:", user),
    onDelete: deletePermission,
    // onDelete: (user) => console.log("Delete:", user),
  });

  const tableSetting = {
    title: "لیست مجوز ها",
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
        selectedRows={selectedPermissions}
        setSelectedRows={setSelectedPermissions}
        tableSetting={tableSetting}
      >
        {hasPerm && (
          <Tooltip2 text="افزودن" placement="top">
            <NavLink
              to={"/users/permissions/add-permission"}
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
      </PaginatedTable>
    </>
  );
};

export default PermissionsTable;
