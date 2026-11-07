import React, { useEffect, useState } from "react";
import { rolesGetService, roleDeleteService } from "@/services/roles";
import PaginatedTable from "@/components/PaginatedTable";
import { NavLink, useNavigate } from "react-router-dom";
import useServerTable from "@/hooks/useServerTable";
import { createRoleColumns } from "./RoleColumns";
import { openConfirmModal, openAlertModal } from "@/components/Modal/modal";
import { useHasPermission } from "@/hooks/useHasPermission";
import { toast } from "@/components/Toast/ToastContainer";
import { useTableRefresh } from "@/hooks/useTableRefresh";
import Tooltip2 from "@/components/Tooltip2";

const RolesTable = () => {
  const navigate = useNavigate();
  const [selectedRoles, setSelectedRoles] = useState([]);
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
    service: rolesGetService,
    perPage: 50,
  });
  const hasPerm = useHasPermission("create-role");

  useEffect(() => {
    registerRefresh("roles", refresh);

    return () => unregisterRefresh("roles");
  }, []);

  const deleteRole = async (role) => {
    const confirmed = await openConfirmModal({
      title: "حذف نقش",
      message: `آیا از حذف نقش "${role.name}" مطمئن هستید؟`,
      confirmText: "حذف شود",
      cancelText: "انصراف",
      variant: "danger",
      icon: "trash-bin-minimalistic",
    });
    if (confirmed) {
      try {
        // ✅ صدا زدن سرویس حذف دائمی
        const response = await roleDeleteService(role.id);

        if (response.status === 200 || response.status === 204) {
          // ✅ نمایش پیام موفقیت
          // await openAlertModal({
          //     title: "عملیات موفق",
          //     message: `کاربر "${user.name}" با موفقیت حذف شد`,
          //     confirmText: "متوجه شدم",
          //     variant: "success",
          //     icon: "check-circle",
          // });
          await toast.success(`نقش "${role.name}" با موفقیت حذف شد`, {
            title: "موفق",
            duration: 5000,
          });

          // ✅ بارگذاری مجدد دیتا
          refresh();
        }
      } catch (error) {
        // ✅ مدیریت خطا
        console.error("Error force deleting role:", error);
        // await openAlertModal({
        //     title: "خطا",
        //     message: error.response?.data?.message || "خطا در حذف کاربر",
        //     confirmText: "متوجه شدم",
        //     variant: "danger",
        //     icon: "alert-triangle",
        // });
        await toast.error(error.response?.data?.message || "خطا در حذف نقش", {
          title: "خطا",
          duration: 5000,
        });
      }
    }
  };

  const dataInfo = createRoleColumns({
    onView: (role) => console.log("View:", role),
    // onEdit: (user) => console.log("Edit:", user),
    onDelete: deleteRole,
    // onDelete: (user) => console.log("Delete:", user),
  });

  const tableSetting = {
    title: "لیست نقش ها",
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
        selectedRows={selectedRoles}
        setSelectedRows={setSelectedRoles}
        tableSetting={tableSetting}
      >
 
        {hasPerm && (
          <Tooltip2 text="افزودن" placement="top">
            <NavLink
              to={"/users/roles/add-role"}
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

export default RolesTable;
