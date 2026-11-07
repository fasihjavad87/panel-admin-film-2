export const PlaybackStatusOptions = [
  { id: "upcoming", title: "به زودی" },
  { id: "airing", title: "در حال پخش" },
  { id: "ended", title: "پایان یافته" },
];

export const getPlaybackStatusText = (value) => {
  return PlaybackStatusOptions.find((o) => o.id === value)?.title || "نامشخص";
};

export const getPlaybackStatusBadge = (value) => {
  const config = {
    upcoming: {
      bg: "bg-sky-50 border-sky-200",
      icon: "icon-clock-circle-bold-duotone",
      iconColor: "text-sky-600",
      text: "text-sky-800",
    },
    airing: {
      bg: "bg-orange-50 border-orange-200",
      icon: "icon-stopwatch-play-bold-duotone",
      iconColor: "text-orange-600",
      text: "text-orange-800",
    },
    ended: {
      bg: "bg-gray-50 border-gray-200",
      icon: "icon-check-circle-bold-duotone",
      iconColor: "text-gray-600",
      text: "text-gray-800",
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