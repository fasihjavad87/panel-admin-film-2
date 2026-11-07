// components/UserActions.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import ActionIcon from "@/components/ActionIcon";
import Tooltip from "@/components/Tooltip";
import { useHasPermission } from "@/hooks/useHasPermission";

const Actions = ({ rowData, onView, onEdit, onDelete }) => {
  const ACTION_PERMISSIONS = {
    devices: "view-user-device",
    roles: "view-permission",
    view: "view-user",
    edit: "update-user",
    delete: "delete-user",
  };

  const hasAnyActionPermission = useHasPermission(
    Object.values(ACTION_PERMISSIONS),
  );

  return (
    <div className="flex gap-2">
      {/* <ActionIcon
        to={`/users/${rowData.id}/roles`}
        icon="icon-shield-user"
        className="bg-purple-50 hover:bg-purple-100 text-purple-600"
        title="مشاهده دسترسی ها"
        permission="view-permission"
      />
      <ActionIcon
        // onClick={() => onView(rowData)}
        to={`/users/${rowData.id}`}
        icon="icon-eye"
        className="bg-blue-50 hover:bg-blue-100 text-blue-600"
        title="مشاهده جزئیات"
        permission="view-user"
      /> */}
      {/* <ActionIcon
        to={`/users/edit-user/${rowData.id}`}
        icon="icon-pen-new-square"
        className="bg-amber-50 hover:bg-amber-100 text-amber-600"
        title="ویرایش کاربر"
        permission="update-user"
      />
      <ActionIcon
        onClick={() => onDelete(rowData)}
        icon="icon-trash-bin-minimalistic"
        className="bg-red-50 hover:bg-red-100 text-red-600"
        title="حذف کاربر"
        permission="delete-user"
      /> */}
      {/* <ActionIcon
                // onClick={() => onDelete(rowData)}
                icon='icon-menu-dots'
                className='bg-green-50 hover:bg-green-100 text-green-600'
                title='بیشتر'
                permission='delete-user'
            /> */}

      {hasAnyActionPermission && (
        <Tooltip
          placement="right"
          offset={10}
          trigger="click"
          closeOnContentClick="data-attr"
          content={
            // <div className="grid grid-cols-3 gap-1 bg-white shadow-xl border rounded-lg p-1 min-w-20 max-w-40">
            // <div
            //   className="grid gap-1 bg-white shadow-xl border rounded-lg p-1 w-fit"
            //   style={{
            //     gridTemplateColumns: "repeat(3, min-content)",
            //     maxWidth: "140px",
            //   }}
            // >
            // <div
            //   className="grid grid-cols-3 gap-1 bg-white shadow-xl border rounded-lg p-1 w-fit max-w-40"
            //   style={{
            //     gridTemplateColumns: "repeat(3, max-content)",
            //   }}
            // >
            <div className="flex flex-wrap gap-1 bg-white shadow-xl border rounded-lg p-1 w-fit max-w-[120px]">
              {/* <button className="flex gap-0.5 pt-1.5 pb-1 pl-3 pr-1 rounded-md cursor-pointer transition bg-amber-50 hover:bg-amber-100 text-amber-600">
              <svg className="w-[22px] h-[22px] fill-transparent">
                <use xlinkHref={`#icon-pen-new-square`}></use>
              </svg>
              <span>ویرایش کاربر</span>
            </button>
            <button className="flex gap-0.5 pt-1.5 pb-1 pl-3 pr-1 rounded-md cursor-pointer transition bg-red-50 hover:bg-red-100 text-red-600">
              <svg className="w-[22px] h-[22px] fill-transparent">
                <use xlinkHref={`#icon-trash-bin-minimalistic`}></use>
              </svg>
              <span>حذف کاربر</span>
            </button> */}
              {/* <button className="w-max h-max p-1.5 rounded-md cursor-pointer transition bg-green-50 hover:bg-green-100 text-green-600">
              <svg className="w-[22px] h-[22px] fill-transparent">
                <use xlinkHref={`#icon-menu-dots`}></use>
              </svg>
            </button>
            <button className="w-max h-max p-1.5 rounded-md cursor-pointer transition bg-green-50 hover:bg-green-100 text-green-600">
              <svg className="w-[22px] h-[22px] fill-transparent">
                <use xlinkHref={`#icon-menu-dots`}></use>
              </svg>
            </button>
            <button className="w-max h-max p-1.5 rounded-md cursor-pointer transition bg-green-50 hover:bg-green-100 text-green-600">
              <svg className="w-[22px] h-[22px] fill-transparent">
                <use xlinkHref={`#icon-menu-dots`}></use>
              </svg>
            </button> */}
              {/* <button data-close-tooltip className="w-max h-max p-1.5 rounded-md cursor-pointer transition bg-green-50 hover:bg-green-100 text-green-600">
              <svg className="w-[22px] h-[22px] fill-transparent">
                <use xlinkHref={`#icon-monitor-smartphone`}></use>
              </svg>
            </button> */}
              <ActionIcon
                to={`/users/${rowData.id}/devices`}
                icon="icon-monitor-smartphone"
                className="bg-sky-50 hover:bg-sky-100 text-sky-600"
                title="مشاهده دستگاه ها"
                permission="view-user-device"
                data-close-tooltip
              />
              <ActionIcon
                to={`/users/${rowData.id}/roles`}
                icon="icon-shield-user"
                className="bg-purple-50 hover:bg-purple-100 text-purple-600"
                title="مشاهده دسترسی ها"
                permission="view-permission"
                data-close-tooltip
              />
              <ActionIcon
                // onClick={() => onView(rowData)}
                to={`/users/${rowData.id}`}
                icon="icon-eye"
                className="bg-blue-50 hover:bg-blue-100 text-blue-600"
                title="مشاهده جزئیات"
                permission="view-user"
                data-close-tooltip
              />
              <ActionIcon
                to={`/users/edit-user/${rowData.id}`}
                icon="icon-pen-new-square"
                className="bg-amber-50 hover:bg-amber-100 text-amber-600"
                title="ویرایش کاربر"
                permission="update-user"
                data-close-tooltip
              />
              <ActionIcon
                onClick={() => onDelete(rowData)}
                icon="icon-trash-bin-minimalistic"
                className="bg-red-50 hover:bg-red-100 text-red-600"
                title="حذف کاربر"
                // data-tooltip-text="حذف کاربر"
                // data-tooltip-position="top"
                permission="delete-user"
                data-close-tooltip
              />
            </div>
          }
        >
           {/* <ActionIcon
                // onClick={() => onDelete(rowData)}
                icon="icon-menu-dots"
                className="bg-blue-50 hover:bg-blue-100 text-blue-600"
                // title="حذف کاربر"
                data-tooltip-text="بیشتر"
                data-tooltip-position="top"
                // permission="delete-user"
                // data-close-tooltip
              /> */}
          <button
            data-tooltip-text="بیشتر"
            data-tooltip-position="top"
            className="p-1.5 rounded-md cursor-pointer transition bg-blue-50 hover:bg-blue-100 text-blue-600"
          >
            <svg className="w-[22px] h-[22px] fill-transparent">
              <use xlinkHref={`#icon-menu-dots`}></use>
            </svg>
          </button>
        </Tooltip>
      )}
    </div>
  );
};

export default Actions;
