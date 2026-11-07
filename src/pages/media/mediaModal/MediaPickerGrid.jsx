// src/pages/media/mediaModal/MediaPickerGrid.jsx
import React from "react";
import MediaPickerCard from "./MediaPickerCard";

const MediaPickerGrid = ({ items, selectedIds, onToggleSelect }) => {
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
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
      {items.map((file) => (
        <MediaPickerCard
          key={file.id}
          file={file}
          isSelected={selectedIds.includes(file.id)}
          onToggleSelect={onToggleSelect}
        />
      ))}
    </div>
  );
};

export default MediaPickerGrid;