import React from "react";
import Actions from "./Actions";
import jMoment from "moment-jalaali";

const getRoleBadge = (isAdmin) => {
  return (
    <span
      className={`px-2 py-1 text-xs rounded-full border ${
        isAdmin
          ? "bg-blue-100 text-blue-700 border-blue-300"
          : "bg-slate-100 text-slate-700 border-slate-300"
      }`}
    >
      {/* {isAdmin ? "ادمین" : "کاربر"} */}
      {getRoleText(isAdmin)}
    </span>
  );
};

const getRoleText = (isAdmin) => {
  return isAdmin ? "ادمین" : "کاربر";
};

const getStatusBadge = (status) => {
  const statusText = getStatusText(status);

  const statusConfig = {
    active: "bg-green-100 text-green-700 border-green-300",
    banned: "bg-red-100 text-red-700 border-red-300",
    verified: "bg-blue-100 text-blue-700 border-blue-300",
    unverified: "bg-yellow-100 text-yellow-700 border-yellow-300",
    default: "bg-gray-100 text-gray-700",
  };

  const colorClass = statusConfig[status] || statusConfig.default;

  return (
    <span className={`px-2 py-1 text-xs rounded-full border ${colorClass}`}>
      {statusText}
    </span>
  );
};

const getStatusText = (status) => {
  switch (status) {
    case "active":
      return "فعال";
    case "banned":
      return "مسدود شده";
    case "verified":
      return "تایید شده";
    case "unverified":
      return "تایید نشده";
    default:
      return "نامشخص";
  }
};

export const createUserColumns = ({ onView, onRestore, onForceDelete }) => [
  {
    title: "عکس",
    name: "avatar",
    width: "60px",
    padding: "py-3",
    elements: (rowData) => (
      <div className="flex justify-center">
        <img
          src={rowData.avatar_url}
          alt="image"
          className="table-avatar w-10 h-10 rounded-full object-cover"
        />
      </div>
    ),
  },
  {
    field: "name",
    title: "نام",
    sortKey: "name",
    width: "200px",
    sortable: true,
    searchable: true,
  },
  {
    field: "username",
    title: "نام کاربری",
    sortKey: "username",
    width: "150px",
    sortable: true,
    searchable: true,
  },
  {
    field: "email",
    title: "ایمیل",
    sortKey: "email",
    width: "250px",
    sortable: true,
    searchable: true,
  },
  {
    title: "نقش",
    width: "150px",
    elements: (rowData) => getRoleBadge(rowData.is_admin),
  },

  {
    title: "وضعیت",
    width: "150px",
    elements: (rowData) => getStatusBadge(rowData.status),
  },

  {
    title: "تاریخ ایجاد",
    width: "20%",
    elements: (rowData) => (
      <span className="font-normal">
        {jMoment(rowData.created_at).format("jYYYY/jM/jD")}
      </span>
    ),
  },
  {
    title: "تاریخ حذف",
    width: "200px",
    elements: (rowData) => (
      <span className="font-normal">
        {jMoment(rowData.deleted_at).format("jYYYY/jM/jD")}
      </span>
    ),
  },
  {
    field: null,
    title: "عملیات",
    width: "200px",
    elements: (rowData) => (
      <Actions
        rowData={rowData}
        onView={onView}
        onRestore={onRestore}
        onForceDelete={onForceDelete}
        // onDelete={(user) => console.log("Delete:", user)}
      />
    ),
  },
];
