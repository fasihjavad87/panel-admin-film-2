// export const ContentTypeOptions = [
//   {
//     id: "movie",
//     title: "فیلم",
//     description: "محتوای تک‌قسمتی",
//   },
//   {
//     id: "series",
//     title: "سریال",
//     description: "محتوای چندقسمتی",
//   },
// ];

// export const getContentTypeText = (value) => {
//   return ContentTypeOptions.find((o) => o.id === value)?.title || "نامشخص";
// };

// export const getContentTypeBadge = (value) => {
//   const config = {
//     movie: {
//       bg: "bg-blue-50 border-blue-200",
//       icon: "icon-clapperboard-play-bold-duotone",
//       iconColor: "text-blue-600",
//       text: "text-blue-800",
//     },
//     series: {
//       bg: "bg-purple-50 border-purple-200",
//       icon: "icon-tv-bold-duotone",
//       iconColor: "text-purple-600",
//       text: "text-purple-800",
//     },
//     default: {
//       bg: "bg-gray-50 border-gray-200",
//       icon: "icon-question-circle-bold-duotone",
//       iconColor: "text-gray-600",
//       text: "text-gray-800",
//     },
//   };
//   return config[value] || config.default;
// };

// src/enums/contentTypeStatus.js

export const ContentTypeOptions = [
  { id: "movie", title: "فیلم", description: "محتوای تک‌قسمتی" },
  { id: "series", title: "سریال", description: "محتوای چندقسمتی" },
];

// ⬇️⬇️⬇️ ثابت‌ها (جلوگیری از string خام) ⬇️⬇️⬇️
export const CONTENT_TYPE = {
  MOVIE: "movie",
  SERIES: "series",
};

export const isSeries = (value) => value === CONTENT_TYPE.SERIES;
export const isMovie = (value) => value === CONTENT_TYPE.MOVIE;

export const getContentTypeText = (value) => {
  return ContentTypeOptions.find((o) => o.id === value)?.title || "نامشخص";
};

export const getContentTypeBadge = (value) => {
  const config = {
    movie: {
      bg: "bg-blue-50 border-blue-200",
      icon: "icon-clapperboard-play-bold-duotone",
      iconColor: "text-blue-600",
      text: "text-blue-800",
    },
    series: {
      bg: "bg-purple-50 border-purple-200",
      icon: "icon-tv-bold-duotone",
      iconColor: "text-purple-600",
      text: "text-purple-800",
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