import React from "react";
import Actions from "./Actions";
import jMoment from "moment-jalaali";

const getActiveBadge = (isActive) => {
  return (
    <span
      className={`px-2 py-1 text-xs rounded-full border ${
        isActive
          ? "bg-green-100 text-green-700 border-green-300"
          : "bg-red-100 text-red-700 border-red-300"
      }`}
    >
      {/* {isAdmin ? "ادمین" : "کاربر"} */}
      {getIsActiveText(isActive)}
    </span>
  );
};

const getIsActiveText = (isActive) => {
  return isActive ? "فعال" : "غیر فعال";
};

// const getStatusBadge = (status) => {
//   const statusText = getStatusText(status);

//   const statusConfig = {
//     active: "bg-green-100 text-green-700 border-green-300",
//     banned: "bg-red-100 text-red-700 border-red-300",
//     verified: "bg-blue-100 text-blue-700 border-blue-300",
//     unverified: "bg-yellow-100 text-yellow-700 border-yellow-300",
//     default: "bg-gray-100 text-gray-700",
//   };

//   const colorClass = statusConfig[status] || statusConfig.default;

//   return (
//     <span className={`px-2 py-1 text-xs rounded-full border ${colorClass}`}>
//       {statusText}
//     </span>
//   );
// };

// const getStatusText = (status) => {
//   switch (status) {
//     case "active":
//       return "فعال";
//     case "banned":
//       return "مسدود شده";
//     case "verified":
//       return "تایید شده";
//     case "unverified":
//       return "تایید نشده";
//     default:
//       return "نامشخص";
//   }
// };

export const createRoleColumns = ({ onView, onEdit, onDelete }) => [
  {
    field: "name",
    title: "نام انگلیسی",
    // sortKey: "name",
    width: "200px",
    // sortable: true,
    searchable: true,
  },
  {
    field: "title",
    title: "نام فارسی",
    // sortKey: "title",
    width: "200px",
    // sortable: true,
    searchable: true,
  },
  {
    field: "description",
    title: "توضیحات",
    // sortKey: "description",
    width: "150px",
    // sortable: true,
    searchable: true,
  },
  {
    title: "نقش",
    width: "150px",
    elements: (rowData) => getActiveBadge(rowData.is_active),
  },

  {
    title: "تاریخ ایجاد",
    width: "200px",
    elements: (rowData) => (
      <span className="font-normal">
        {jMoment(rowData.created_at).format("jYYYY/jM/jD")}
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
        onEdit={onEdit}
        onDelete={onDelete}
        // onDelete={(user) => console.log("Delete:", user)}
      />
    ),
  },
];
