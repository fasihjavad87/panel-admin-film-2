// // src/pages/movies/movieMedia/MediaStarCard.jsx

// import React from "react";

// const isImage = (mimeType) => mimeType?.startsWith("image/");

// const MediaStarCard = ({ file, isPrimary, onSetPrimary, onRemove }) => {
//   return (
//     <div
//       className={`relative group bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 border-2 overflow-hidden ${
//         isPrimary
//           ? "border-amber-400 ring-4 ring-amber-200"
//           : "border-transparent hover:border-indigo-300"
//       }`}
//     >
//       {/* ⭐ دکمه ستاره (انتخاب رسانه اصلی) */}
//       <button
//         type="button"
//         onClick={() => onSetPrimary(file.id)}
//         className={`absolute top-2 right-2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all border-2 duration-200 cursor-pointer shadow-md ${
//           isPrimary
//             ? "bg-amber-400 border-amber-500 text-white scale-110"
//             : "bg-white/90 border-gray-300 hover:bg-amber-50 hover:border-amber-400 text-gray-500 hover:text-amber-400"
//         }`}
//         data-tooltip-text={isPrimary ? "رسانه اصلی" : "انتخاب به عنوان اصلی"}
//         data-tooltip-position="top"
//       >
//         <svg className="w-[18px] h-[18px] fill-transparent">
//           <use xlinkHref={`#icon-star-bold`}></use>
//         </svg>
//       </button>

//       {/* ❌ دکمه حذف (اختیاری) */}
//       {onRemove && (
//         <button
//           type="button"
//           onClick={() => onRemove(file.id)}
//           className="absolute top-2 left-2 z-10 w-7 h-7 rounded-md flex items-center justify-center bg-red-500/90 hover:bg-red-600 text-white transition cursor-pointer shadow-md"
//           data-tooltip-text="حذف از لیست"
//           data-tooltip-position="top"
//         >
//           <svg className="w-[14px] h-[14px] fill-transparent">
//             <use xlinkHref="#icon-close-circle"></use>
//           </svg>
//         </button>
//       )}

//       {/* بندانگشتی */}
//       <div className="aspect-square flex items-center justify-center p-2 bg-gray-50 dark:bg-gray-800">
//         {isImage(file.mime_type) ? (
//           <img
//             src={file.thumb_url || file.url}
//             alt={file.title || file.name}
//             className="object-cover w-full h-full rounded-lg shadow-inner"
//             loading="lazy"
//           />
//         ) : (
//           <div className="text-gray-400 flex flex-col items-center">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               strokeWidth="1.2"
//               stroke="currentColor"
//               className="w-14 h-14"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.25 10.125H8.25m5.25 0H12c7.87-4.223 9.471-12.015 1.5-17.25-2.028-.853-4.04-1.28-6.108-1.28H6.75A2.25 2.25 0 0 0 4.5 4.5v15c0 1.242.492 2.443 1.35 3.3.858.857 2.059 1.35 3.3 1.35h6.75c1.242 0 2.443-.492 3.3-1.35.857-.858 1.35-2.059 1.35-3.3v-1.5"
//               />
//             </svg>
//             <span className="text-[10px] mt-1 text-gray-500">
//               {file.extension?.toUpperCase() || "FILE"}
//             </span>
//           </div>
//         )}
//       </div>

//       {/* نام فایل */}
//       <div className="p-2 text-xs text-center truncate bg-white dark:bg-gray-900 dark:text-gray-300 border-t border-gray-100 dark:border-gray-800">
//         {file.title || file.name}
//       </div>

//       {/* برچسب «اصلی» */}
//       {isPrimary && (
//         <div className="absolute bottom-10 right-2 z-10 px-2 py-0.5 bg-amber-400 text-white text-[10px] font-bold rounded shadow">
//           اصلی
//         </div>
//       )}
//     </div>
//   );
// };

// export default MediaStarCard;


// src/pages/movies/movieMedia/MediaStarCard.jsx

import React from "react";

const isImage = (mimeType) => mimeType?.startsWith("image/");

const MediaStarCard = ({ file, isPrimary, onSetPrimary, onRemove }) => {
  return (
    <div
      className={`relative group bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 border-2 overflow-hidden ${
        isPrimary
          ? "border-amber-400 ring-4 ring-amber-200"
          : "border-transparent hover:border-indigo-300"
      }`}
    >
      {/* ⭐ دکمه ستاره (انتخاب رسانه اصلی) — راست بالا */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onSetPrimary(file.id);
        }}
        className={`absolute group top-2 right-2 z-10 w-7 h-7 rounded-md flex items-center justify-center transition-all border-2 duration-200 cursor-pointer shadow-md ${
          isPrimary
            ? "bg-amber-500 border-amber-500 scale-110 text-white"
            : "bg-white/90 border-gray-300 hover:bg-amber-50 hover:border-amber-400 text-gray-600 hover:text-amber-400 group-hover:border-amber-400 group-hover:text-amber-400"
        }`}
        data-tooltip-text={isPrimary ? "رسانه اصلی" : "انتخاب به عنوان اصلی"}
        data-tooltip-position="top"
      >
        <svg className="w-[18px] h-[18px] fill-transparent">
          <use xlinkHref="#icon-star-bold"></use>
        </svg>
      </button>

      {/* ❌ دکمه حذف — چپ بالا */}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(file.id);
          }}
          className={`absolute group top-2 left-2 z-10 w-7 h-7 rounded-md flex items-center justify-center transition-all border-2 duration-200 cursor-pointer shadow-md ${
            isPrimary
              ? "scale-110"
              : ""
          } bg-white/90 border-gray-300 hover:bg-red-50 hover:border-red-400 text-gray-600 hover:text-red-500`}
          data-tooltip-text="حذف از لیست"
          data-tooltip-position="top"
        >
          <svg className="w-[18px] h-[18px] fill-transparent">
            <use xlinkHref="#icon-close-circle"></use>
          </svg>
        </button>
      )}

      {/* بندانگشتی */}
      <div className="aspect-square flex items-center justify-center p-2 bg-gray-50 dark:bg-gray-800">
        {isImage(file.mime_type) ? (
          <img
            src={file.thumb_url || file.url}
            alt={file.title || file.name}
            className="object-cover w-full h-full rounded-lg shadow-inner"
            loading="lazy"
          />
        ) : (
          <div className="text-gray-400 text-6xl flex flex-col items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.2"
              stroke="currentColor"
              className="w-14 h-14"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.25 10.125H8.25m5.25 0H12c7.87-4.223 9.471-12.015 1.5-17.25-2.028-.853-4.04-1.28-6.108-1.28H6.75A2.25 2.25 0 0 0 4.5 4.5v15c0 1.242.492 2.443 1.35 3.3.858.857 2.059 1.35 3.3 1.35h6.75c1.242 0 2.443-.492 3.3-1.35.857-.858 1.35-2.059 1.35-3.3v-1.5"
              />
            </svg>
            <span className="text-[10px] mt-1 text-gray-500">
              {file.extension?.toUpperCase() || "FILE"}
            </span>
          </div>
        )}
      </div>

      {/* نام فایل */}
      <div className="p-2 text-xs text-center truncate bg-white dark:bg-gray-900 dark:text-gray-300 border-t border-gray-100 dark:border-gray-800">
        {file.title || file.name}
      </div>

      {/* برچسب «اصلی» */}
      {isPrimary && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 px-2 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded shadow">
          اصلی
        </div>
      )}

      {/* overlay برای hover */}
      <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/5 transition-all duration-300 pointer-events-none" />
    </div>
  );
};

export default MediaStarCard;