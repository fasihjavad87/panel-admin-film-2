import React from "react";
import MediaCard from "./MediaCard";

const MediaGrid = ({ items, selectedIds, onToggleSelect, onOpenDetails }) => {
  if (!items.length) {
    return (
      <div className="p-12 text-center text-gray-500 border-dashed border-2 rounded-lg">
        <p className="font-bold text-lg">هیچ رسانه‌ای یافت نشد.</p>
        <p className="text-sm mt-2">
          برای شروع به تب "آپلود فایل جدید" بروید.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 gap-3">
      {items.map((file) => (
        <MediaCard
          key={file.id}
          file={file}
          isSelected={selectedIds.includes(file.id)}
          onToggleSelect={onToggleSelect}
          onOpenDetails={onOpenDetails}
        />
      ))}
    </div>
  );
};

export default MediaGrid;