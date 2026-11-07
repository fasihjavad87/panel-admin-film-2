export const MovieStatusOptions = [
  { id: "draft", title: "پیش‌نویس", description: "قابل مشاهده برای کاربر نیست" },
  { id: "publish", title: "منتشر شده", description: "قابل مشاهده برای کاربر" },
];

export const getMovieStatusText = (value) => {
  return MovieStatusOptions.find((o) => o.id === value)?.title || "نامشخص";
};

export const getMovieStatusBadge = (value) => {
  const config = {
    draft: {
      bg: "bg-yellow-50 border-yellow-200",
      icon: "icon-pen-bold-duotone",
      iconColor: "text-yellow-600",
      text: "text-yellow-800",
    },
    publish: {
      bg: "bg-green-50 border-green-200",
      icon: "icon-check-circle-bold-duotone",
      iconColor: "text-green-600",
      text: "text-green-800",
    },
    default: {
      bg: "bg-gray-50 border-gray-200",
      icon: "icon-question-circle-bold-duotone",
      iconColor: "text-gray-600",
      text: "text-gray-800",
    },
  };
  return config[value] || config.default;
};