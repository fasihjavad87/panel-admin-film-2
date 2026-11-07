import React, { useRef, useState } from "react";
import { mediaUploadService } from "@/services/media";
import { toast } from "@/components/Toast/ToastContainer";
import { useFormikContext } from "formik";
import Input2 from "@/components/Form/ui/UnifiedInput";
import Tooltip2 from "@/components/Tooltip2";

export const createEmptyRow = () => ({
  id: crypto.randomUUID(), // شناسه یکتا برای هر ردیف
  file: null,
  preview: null,
  title: "",
});

const MediaUpload = ({ onUploaded }) => {
  const { values, setFieldValue, isSubmitting, setSubmitting } =
    useFormikContext();
  //   const [rows, setRows] = useState([createEmptyRow()]);
  const rows = values.rows || [];
  //   const [loading, setLoading] = useState(false);
  const [dragActiveId, setDragActiveId] = useState(null); // برای هایلایت drop zone

  // ==================== آپلود ====================
  const handleUpload = async () => {
    const validRows = rows.filter((r) => r.file);
    if (!validRows.length) {
      toast.warning("حداقل یک فایل انتخاب کنید.");
      return;
    }

    // setLoading(true);
    setSubmitting(true);

    const formData = new FormData();
    validRows.forEach((row) => {
      formData.append("files[]", row.file);
    });
    validRows.forEach((row) => {
      formData.append("titles[]", row.title?.trim() || "");
    });

    try {
      const res = await mediaUploadService(formData);

      if (res.status === 201) {
        const { data, uploaded, failed } = res.data;
        const uploadedItems = data.map((item) => item.data);

        toast.success(`${uploaded} فایل با موفقیت آپلود شد.`);
        if (failed > 0) {
          toast.warning(`${failed} فایل آپلود نشد.`);
        }

        setFieldValue("rows", [createEmptyRow()]);
        onUploaded?.(uploadedItems);
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // ==================== مدیریت ردیف‌ها ====================
  const addRow = () => {
    setFieldValue("rows", [...rows, createEmptyRow()]);
  };

  const removeRow = (id) => {
    const next = rows.filter((r) => r.id !== id);
    setFieldValue("rows", next.length ? next : [createEmptyRow()]);
  };

  const updateRow = (id, patch) => {
    setFieldValue(
      "rows",
      rows.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    );
  };

  // ==================== انتخاب فایل (input) ====================
  const handleFileSelect = (id, file) => {
    if (!file) return;

    // آزاد کردن URL قبلی (جلوگیری از memory leak)
    const row = rows.find((r) => r.id === id);
    if (row?.preview) {
      URL.revokeObjectURL(row.preview);
    }

    const preview = file.type.startsWith("image/")
      ? URL.createObjectURL(file)
      : null;

    updateRow(id, { file, preview });
  };

  // ==================== Drag & Drop ====================
  const handleDragOver = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveId(id);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveId(null);
  };

  const handleDrop = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveId(null);

    const droppedFiles = Array.from(e.dataTransfer.files || []);
    if (!droppedFiles.length) return;

    // 🔹 اگه یک فایل روی یه ردیف خالی افتاد، همون ردیف رو پر کن
    if (droppedFiles.length === 1) {
      handleFileSelect(id, droppedFiles[0]);
      return;
    }

    // 🔹 اگه چند فایل افتاد:
    // اون ردیف رو با اولین فایل پر کن، بقیه رو به عنوان ردیف جدید اضافه کن

    const [first, ...rest] = droppedFiles;

    const firstPreview = first.type.startsWith("image/")
      ? URL.createObjectURL(first)
      : null;

    const updated = rows.map((r) =>
      r.id === id ? { ...r, file: first, preview: firstPreview } : r,
    );

    const newRows = rest.map((f) => ({
      id: crypto.randomUUID(),
      file: f,
      preview: f.type.startsWith("image/") ? URL.createObjectURL(f) : null,
      title: "",
    }));

    setFieldValue("rows", [...updated, ...newRows]);
  };

  return (
    // <div className="w-full max-w-3xl mx-auto space-y-4">
    <div className="grid grid-cols-3 gap-4">
      {rows.map((row, index) => (
        <UploadRow
          key={row.id}
          row={row}
          index={index}
          isDragActive={dragActiveId === row.id}
          canRemove={rows.length > 1}
          onFileSelect={(file) => handleFileSelect(row.id, file)}
          onTitleChange={(value) => updateRow(row.id, { title: value })}
          onRemove={() => removeRow(row.id)}
          onDragOver={(e) => handleDragOver(e, row.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, row.id)}
        />
      ))}

      {/* دکمه + برای اضافه کردن ردیف جدید */}
      <div className="flex items-end flex-wrap gap-2">
        <button
          type="button"
          onClick={addRow}
          className="group py-[9px] px-[11px] border-2 border-dashed border-indigo-300 text-indigo-600 rounded-lg  transition flex items-center justify-center font-medium cursor-pointer"
        >
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>

          <span
            className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 translate-x-2
               group-hover:max-w-xs group-hover:opacity-100 group-hover:translate-x-0
               group-hover:mr-2
               transition-all duration-300 ease-out"
          >
            افزودن فایل جدید
          </span>
        </button>
        {/* دکمه آپلود */}
        <button
          type="button"
          onClick={handleUpload}
          disabled={isSubmitting || !rows.some((r) => r.file)}
          className="flex-1 py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-50 disabled:pointer-events-none transition duration-150"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin h-5 w-5 mr-3"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              در حال ذخیره فایل‌ها...
            </>
          ) : (
            `شروع آپلود (${rows.filter((r) => r.file).length})`
          )}
        </button>
      </div>
    </div>
  );
};

export default MediaUpload;

// ============================================================
// ردیف آپلود (کامپوننت جدا برای خوانایی)
// ============================================================
const UploadRow = ({
  row,
  index,
  isDragActive,
  canRemove,
  onFileSelect,
  onRemove,
  onDragOver,
  onDragLeave,
  onDrop,
}) => {
  const inputRef = useRef(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
    // ریست input برای انتخاب مجدد همون فایل
    e.target.value = "";
  };

  return (
    <div className="relative flex items-stretch gap-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-3 shadow-sm">
      {/* ============ کادر آپلود (سمت چپ) ============ */}
      <div
        onClick={handleClick}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative w-24 h-24 flex-shrink-0 rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer transition-all overflow-hidden ${
          isDragActive
            ? "border-indigo-500 bg-indigo-50 scale-105"
            : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50"
        }`}
      >
        {row.preview ? (
          // پیش‌نمایش عکس
          <img
            src={row.preview}
            alt={row.file?.name}
            className="w-full h-full object-cover"
          />
        ) : row.file ? (
          // فایل غیر عکس
          <div className="text-gray-400 flex flex-col items-center text-xs p-1 text-center">
            <svg
              className="w-6 h-6 mb-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span className="truncate w-full">{row.file.name}</span>
          </div>
        ) : (
          // حالت خالی: آیکون آپلود
          <div className="text-gray-400 flex flex-col items-center">
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <span className="text-[10px] mt-1">انتخاب فایل</span>
          </div>
        )}

        {/* input مخفی */}
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleInputChange}
        />
      </div>

      {/* ============ فیلدهای سمت راست ============ */}
      <div className="flex-1 flex justify-center flex-col gap-2">
        <div className="flex items-start gap-2">
          <div className="flex-1">
            <Input2
              name={`rows[${index}].title`}
              label=" عنوان (اختیاری)"
              placeholder="عنوان رسانه را وارد کنید..."
              clearable={false}
              showCount
              maxLenght={255}
              rtl
            />
            {/* <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              عنوان (اختیاری)
            </label>
            <input
              type="text"
              value={row.title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="عنوان رسانه را وارد کنید..."
              className="w-full rounded-md text-sm border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
            /> */}
          </div>

          {canRemove && (
            <Tooltip2 text="حذف این ردیف" placement="top">
              <button
                type="button"
                onClick={onRemove}
                // title="حذف این ردیف"
                className="absolute top-1 left-1 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition cursor-pointer"
              >
                {/* <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg> */}
                <svg className="w-[18px] h-[18px] fill-transparent">
                  <use xlinkHref="#icon-trash-bin-minimalistic"></use>
                </svg>
              </button>
            </Tooltip2>
          )}
        </div>

        {/* اطلاعات فایل */}
        {row.file && (
          <p className="text-xs text-gray-500 truncate">
            {row.file.name} — {(row.file.size / 1024).toFixed(1)} KB
          </p>
        )}
      </div>
    </div>
  );
};
