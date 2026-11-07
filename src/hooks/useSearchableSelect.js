// hooks/useSearchableSelect.js
import { useState, useEffect, useRef } from "react";

export const useSearchableSelect = ({
  model = [],
  searchable = true,
  searchFields = ["title", "e_name"],
  clearSearchOnClose = true,
  autoFocusSearch = true,
  isMulti = false,
  value = isMulti ? [] : "",
  onChange,
  onTouched,
  maxSelections = null,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isTouched, setIsTouched] = useState(false);

  const wrapperRef = useRef(null);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!open && clearSearchOnClose) {
      setSearch("");
    }
  }, [open, clearSearchOnClose]);

  // بستن هنگام کلیک خارج
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!isMounted.current || !open) return;
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
        if (onTouched && isTouched) onTouched();
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, isTouched, onTouched]);

  const filteredItems = () => {
    if (!searchable || !search) return model;
    return model.filter((item) => {
      return searchFields.some((field) => {
        return item[field]
          ?.toString()
          .toLowerCase()
          .includes(search.toLowerCase());
      });
    });
  };

  const selectItem = (itemId) => {
    if (isMulti) {
      let newValue;
      const isAlreadySelected = value.includes(itemId);
      
      if (isAlreadySelected) {
        // حذف آیتم - حفظ ترتیب آیتم‌های باقی‌مانده
        newValue = value.filter((id) => id !== itemId);
      } else {
        // اضافه کردن آیتم جدید در انتهای آرایه (حفظ ترتیب انتخاب)
        if (maxSelections && value.length >= maxSelections) {
          newValue = value; // تغییری ایجاد نکن
        } else {
          newValue = [...value, itemId]; // اضافه کردن به انتها
        }
      }

      if (newValue !== value && (!maxSelections || newValue.length <= maxSelections)) {
        onChange?.(newValue);
        setIsTouched(true);
      }
    } else {
      if (value !== itemId) {
        onChange?.(itemId);
        setIsTouched(true);
      }
    }
    if (!isMulti) setOpen(false);
  };

  const clearSelection = () => {
    onChange?.(isMulti ? [] : "");
    setIsTouched(true);
    if (!isMulti) setOpen(false);
  };

  return {
    open,
    setOpen,
    search,
    setSearch,
    isTouched,
    wrapperRef,
    filteredItems,
    selectItem,
    clearSelection,
    value,
  };
};