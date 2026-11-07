export const EpisodeStatusOptions = [
  { id: "draft", title: "پیش‌نویس" },
  { id: "scheduled", title: "زمان‌بندی شده" },
  { id: "published", title: "منتشر شده" },
];

export const getEpisodeStatusText = (value) => {
  return EpisodeStatusOptions.find((o) => o.id === value)?.title || "نامشخص";
};

export const getEpisodeStatusBadge = (value) => {
  const config = {
    draft: {
      bg: "bg-gray-50 border-gray-200",
      icon: "icon-pen-bold-duotone",
      iconColor: "text-gray-600",
      text: "text-gray-800",
    },
    scheduled: {
      bg: "bg-yellow-50 border-yellow-200",
      icon: "icon-clock-circle-bold-duotone",
      iconColor: "text-yellow-600",
      text: "text-yellow-800",
    },
    published: {
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