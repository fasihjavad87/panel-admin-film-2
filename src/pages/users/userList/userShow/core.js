export const getRoleText = (isAdmin) => {
  return isAdmin ? "ادمین" : "کاربر";
};

export const getRoleBadge = (isAdmin) => {
  // if (isAdmin) {
  //     return 'bg-blue-100 text-blue-700 border-blue-300'
  // } else {
  //     return 'bg-slate-100 text-slate-700 border-slate-300'
  // }

  const RolesConfig = {
    admin: {
      bg: "bg-green-50 border-green-200",
      icon: "icon-check-circle-bold-duotone",
      iconColor: "text-green-600",
      text: "text-green-800",
    },
    user: {
      bg: "bg-blue-50 border-blue-200",
      icon: "icon-close-circle-bold-duotone",
      iconColor: "text-blue-600",
      text: "text-blue-800",
    },
    default: {
      bg: "bg-gray-50 border-gray-200",
      icon: "icon-question-circle-bold-duotone",
      iconColor: "text-gray-600",
      text: "text-gray-800",
    },
    // active: "bg-green-100 text-green-700 border-green-300",
    // banned: "bg-red-100 text-red-700 border-red-300",
    // verified: "bg-blue-100 text-blue-700 border-blue-300",
    // unverified: "bg-yellow-100 text-yellow-700 border-yellow-300",
    // default: "bg-gray-100 text-gray-700",
  };

  const colorClass =
    (isAdmin ? RolesConfig.admin : RolesConfig.user) || RolesConfig.default;

  return colorClass;
  // return (
  //     <span
  //         className={`text-xs rounded-full border ${isAdmin
  //             ? "bg-blue-100 text-blue-700 border-blue-300"
  //             : "bg-slate-100 text-slate-700 border-slate-300"
  //             }`}
  //     >
  //         {/* {isAdmin ? "ادمین" : "کاربر"} */}
  //         {getRoleText(isAdmin)}
  //     </span>
  // );
};

export const getStatusText = (status) => {
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

export const getStatusBadge = (status) => {
  // const statusText = getStatusText(status);

  const statusConfig = {
    active: {
      bg: "bg-green-50 border-green-200",
      icon: "icon-check-circle-bold-duotone",
      iconColor: "text-green-600",
      text: "text-green-800",
    },
    banned: {
      bg: "bg-red-50 border-red-200",
      icon: "icon-minus-circle-bold-duotone",
      iconColor: "text-red-600",
      text: "text-red-800",
    },
    verified: {
      bg: "bg-blue-50 border-blue-200",
      icon: "icon-add-circle-bold-duotone",
      iconColor: "text-blue-600",
      text: "text-blue-800",
    },
    unverified: {
      bg: "bg-yellow-50 border-yellow-200",
      icon: "icon-close-circle-bold-duotone",
      iconColor: "text-yellow-600",
      text: "text-yellow-800",
    },
    default: {
      bg: "bg-gray-50 border-gray-200",
      icon: "icon-question-circle-bold-duotone",
      iconColor: "text-gray-600",
      text: "text-gray-800",
    },
    // active: "bg-green-100 text-green-700 border-green-300",
    // banned: "bg-red-100 text-red-700 border-red-300",
    // verified: "bg-blue-100 text-blue-700 border-blue-300",
    // unverified: "bg-yellow-100 text-yellow-700 border-yellow-300",
    // default: "bg-gray-100 text-gray-700",
  };

  const colorClass = statusConfig[status] || statusConfig.default;

  return colorClass;

  // return (
  //     <span className={`px-2 py-1 text-xs rounded-full border ${colorClass}`}>
  //         {statusText}
  //     </span>
  // );
};
