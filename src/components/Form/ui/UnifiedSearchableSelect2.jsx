// // components/Form/UnifiedSearchableSelect.jsx

// import React, {
//     useEffect,
//     useMemo,
//     useRef,
//     useCallback,
// } from 'react';

// import { useField } from 'formik';

// import { useSearchableSelect } from '@/hooks/useSearchableSelect';
// import { openAlertModal } from '@/components/Modal/modal';

// const UnifiedSearchableSelect = ({
//     name,

//     model = [],
//     mode = 'single', // multi or single

//     searchable = true,
//     searchFields = ['title', 'e_name'],

//     displayField = 'title',
//     displayValue = null,
//     valueField = 'id',

//     subField = null,
//     subToField = false,

//     placeholder = 'انتخاب کنید',
//     searchPlaceholder = 'جستجو...',

//     clearText = null,
//     noResultsText = 'موردی یافت نشد',
//     noItemsText = 'هیچ آیتمی موجود نیست',

//     icon = null,
//     iconHeader = false,
//     iconToField = false,
//     iconItems = false,

//     required = false,
//     label = null,

//     isEnum = false,
//     sizePanel = '300px',

//     autoFocusSearch = true,
//     clearSearchOnClose = true,

//     className = '',

//     countTop = false,
//     clearTop = false,
//     countBottom = false,
//     countToField = false,
//     py = 'py-2.5',
//     maxSelections = null,
// }) => {

//     // FORMIK
//     const [field, meta, helpers] = useField(name);

//     const isMulti = mode === 'multi';

//     const currentValue = useMemo(() => {
//         return isMulti
//             ? (field.value || [])
//             : field.value;
//     }, [field.value, isMulti]);

//     // SEARCHABLE HOOK
//     const {
//         open,
//         setOpen,

//         search,
//         setSearch,

//         isTouched,

//         wrapperRef,

//         filteredItems,

//         selectItem: hookSelectItem,

//         clearSelection,

//     } = useSearchableSelect({
//         model,
//         searchable,
//         searchFields,
//         clearSearchOnClose,
//         autoFocusSearch,

//         isMulti,

//         value: currentValue,

//         onChange: (newValue) => {
//             helpers.setValue(newValue);
//             helpers.setTouched(true);
//         },

//         onTouched: () => {
//             helpers.setTouched(true);
//         },

//         maxSelections,
//     });

//     // SEARCH INPUT REF
//     const searchInputRef = useRef(null);

//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (
//                 wrapperRef.current &&
//                 !wrapperRef.current.contains(event.target)
//             ) {
//                 setOpen(false);
//             }
//         };

//         document.addEventListener('mousedown', handleClickOutside);

//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, [wrapperRef, setOpen]);

//     // AUTO FOCUS
//     useEffect(() => {
//         if (
//             open &&
//             searchable &&
//             autoFocusSearch &&
//             searchInputRef.current
//         ) {
//             const timer = setTimeout(() => {
//                 searchInputRef.current.focus();
//                 const length = searchInputRef.current.value.length;
//                 searchInputRef.current.setSelectionRange(length, length);
//             }, 100);

//             return () => clearTimeout(timer);
//         }
//     }, [open, searchable, autoFocusSearch]);

//     // CLEAR SEARCH ON CLOSE
//     useEffect(() => {
//         if (!open && clearSearchOnClose) {
//             setSearch('');
//         }
//     }, [open, clearSearchOnClose, setSearch]);

//     // MODEL MAP
//     const modelMap = useMemo(() => {
//         return new Map(
//             model.map(item => [
//                 String(item[valueField]),
//                 item
//             ])
//         );
//     }, [model, valueField]);

//     // FILTERED ITEMS
//     const items = useMemo(() => {
//         return filteredItems();
//     }, [filteredItems, search]);

//     // DISPLAY TEXT
//     const getDisplayText = useCallback((item) => {
//         if (!item) return '';

//         if (displayValue && item[displayValue]) {
//             return item[displayValue];
//         }

//         if (isEnum && item.label) {
//             return item.label;
//         }

//         return item[displayField] || 'بدون عنوان';
//     }, [displayField, displayValue, isEnum]);

//     // SUB TEXT
//     const getSubText = useCallback((item) => {
//         if (!item || !subField) return '';
//         return item[subField] || '';
//     }, [subField]);

//     // INITIAL
//     const getInitial = useCallback((item) => {
//         if (!item) return '';
//         return getDisplayText(item).charAt(0).toUpperCase();
//     }, [getDisplayText]);

//     // SELECTED ITEM
//     const selectedItemData = useMemo(() => {
//         if (isMulti || !currentValue) {
//             return null;
//         }
//         return modelMap.get(String(currentValue)) || null;
//     }, [isMulti, currentValue, modelMap]);

//     // SELECTED ITEMS
//     const selectedItemsData = useMemo(() => {
//         if (!isMulti || !Array.isArray(currentValue)) {
//             return [];
//         }
//         return currentValue
//             .map(id => modelMap.get(String(id)))
//             .filter(Boolean);
//     }, [isMulti, currentValue, modelMap]);

//     // COUNT
//     const selectionCount = useMemo(() => {
//         return isMulti ? currentValue.length : 0;
//     }, [isMulti, currentValue]);

//     // SELECTION SUMMARY
//     const getSelectionSummary = useCallback(() => {
//         const items = selectedItemsData;
//         if (items.length === 0) return '';

//         const names = items.slice(0, 2).map(item => getDisplayText(item));
//         let summary = names.join('، ');

//         if (items.length > 2) {
//             summary += ` و ${items.length - 2} مورد دیگر`;
//         }

//         return summary;
//     }, [selectedItemsData, getDisplayText]);

//     // SELECT ITEM
//     const selectItem = useCallback((itemId) => {
//         if (
//             isMulti &&
//             maxSelections &&
//             currentValue.length >= maxSelections &&
//             !currentValue.includes(itemId)
//         ) {
//             openAlertModal({
//                 title: 'محدودیت انتخاب',
//                 message: `حداکثر ${maxSelections} آیتم می‌توانید انتخاب کنید.`,
//                 confirmText: 'باشه',
//                 variant: 'warning',
//             });
//             return;
//         }

//         hookSelectItem(itemId);
//     }, [isMulti, maxSelections, currentValue, hookSelectItem]);

//     // REMOVE ITEM
//     const removeItem = useCallback((itemId, e) => {
//         e.stopPropagation();
//         hookSelectItem(itemId);
//     }, [hookSelectItem]);

//     // CLEAR ALL
//     const clearAll = useCallback(() => {
//         setSearch('');
//         clearSelection();
//         setOpen(false);
//     }, [setSearch, clearSelection, setOpen]);

//     // VALIDATION
//     const showError = meta.error && (meta.touched || isTouched);

//     const isValid = required
//         ? (isMulti ? currentValue.length > 0 : currentValue && currentValue !== '')
//         : true;

//     return (
//         <div
//             className={` ${className}`}
//             ref={wrapperRef}
//         >
//             {/* LABEL */}
//             {/* {label && ( */}
//             {/* <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 select-none">
//                     <div className="flex items-center justify-between pl-2"> */}
//             {/* <div className="flex gap-1 items-center">
//                             {icon && iconHeader && (
//                                 <svg className="w-[18px] h-[18px] fill-transparent">
//                                     <use xlinkHref={`#${icon}`} />
//                                 </svg>
//                             )}
//                             <span>{label}</span>
//                             {required && (
//                                 <span className="text-red-500">*</span>
//                             )}
//                             {isMulti && countTop && selectionCount > 0 && (
//                                 <span className="text-sm text-blue-600 dark:text-blue-400">
//                                     ({selectionCount} انتخاب)
//                                 </span>
//                             )}
//                         </div> */}
//             {/* {isMulti && clearTop && selectionCount > 0 && ( */}
//             {/* <div>
//                                 <span
//                                     onClick={clearAll}
//                                     // className="text-sm text-red-600 dark:text-red-400 cursor-pointer"
//                                     className={`px-3 py-1 text-xs bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 rounded-lg transition-colors duration-200 cursor-pointer
//                                                 ${clearTop 
//                                             ? 'opacity-100 visible'
//                                             : 'opacity-0 invisible'}
//                                                 `}
//                                 >
//                                     حذف همه
//                                 </span>
//                             </div> */}
//             {/* )} */}
//             {/* </div>
//                 </label> */}
//             {/* )} */}


//             {label && (
//                 <div className='flex items-center justify-between mb-2 select-none'>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                         {/* <div className="flex items-center justify-between"> */}
//                         <div className="flex gap-1 items-center">
//                             {icon && iconHeader && (
//                                 <svg className="w-[18px] h-[18px] fill-transparent">
//                                     <use xlinkHref={`#${icon}`} />
//                                 </svg>
//                             )}
//                             <span>{label}</span>
//                             {required && (
//                                 <span className="text-red-500">*</span>
//                             )}
//                             {isMulti && countTop && selectionCount > 0 && (
//                                 <span className="text-sm text-blue-600 dark:text-blue-400">
//                                     ({selectionCount} انتخاب)
//                                 </span>
//                             )}
//                         </div>
//                         {/* {clearable && getDisplayValue() && !disabled && ( */}
//                         {/* <div> */}
//                         {/* <button
//                                 type='button'
//                                 onClick={(e) => {
//                                     e.stopPropagation();
//                                     setFiles([]);
//                                     setPreviews([]);
//                                     formik.setFieldValue(name, []);
//                                     clearErrorWithAnimation();
//                                     closeWithAnimation(() => setShowConfig(false));
//                                 }}
//                                 className={`px-3 py-1 text-xs bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 rounded-lg transition-colors duration-200 cursor-pointer
//                                                 ${clearable && getDisplayValue() && !disabled
//                                         ? 'opacity-100 visible'
//                                         : 'opacity-0 invisible'}
//                                                 `}
//                             >
//                                 حذف همه
//                             </button> */}
//                         {/* </div> */}
//                         {/* )} */}
//                         {/* </div> */}
//                     </label>
//                     {/* ${isMulti && clearTop && selectionCount > 0 */}
//                     <button
//                         type='button'
//                         onClick={clearAll}
//                         className={`px-3 py-1 text-xs bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 rounded-lg transition-colors duration-200 cursor-pointer
//                                                 ${clearTop 
//                                 ? 'opacity-100 visible'
//                                 : 'opacity-0 invisible'}
//                                                 `}
//                     >
//                         حذف همه
//                     </button>
//                 </div>
//             )}

//             {/* BUTTON */}
//             <div className="relative">
//                 <button
//                     type="button"
//                     onClick={() => setOpen(!open)}
//                     className={`
//                         w-full pr-3 pl-1.5 ${py} text-right
//                         border rounded-lg
//                         bg-white dark:bg-gray-700
//                         text-gray-700 dark:text-white
//                         flex items-center cursor-pointer
//                         hover:bg-gray-50 dark:hover:bg-gray-600
//                         transition-all group
//                         ${open
//                             ? 'border-blue-500 ring-1 ring-blue-500'
//                             : showError && !isValid
//                                 ? 'border-red-500'
//                                 : 'border-gray-300 dark:border-gray-600'
//                         }
//                     `}
//                     title={getSelectionSummary()}
//                 >
//                     <div className="flex-1 min-w-0 select-none">
//                         {/* MULTI SELECTED */}
//                         {isMulti && selectionCount > 0 ? (
//                             <div className="flex flex-wrap gap-1">
//                                 {selectedItemsData.map(item => (
//                                     <div
//                                         key={item[valueField]}
//                                         className="
//                                             inline-flex items-center gap-1
//                                             bg-blue-100 dark:bg-blue-900
//                                             text-blue-800 dark:text-blue-200
//                                             px-2 py-1
//                                             rounded-full text-xs
//                                             cursor-default
//                                         "
//                                     >
//                                         <span>{getDisplayText(item)}</span>
//                                         <span
//                                             // type="button"
//                                             role='button'
//                                             tabIndex={0}
//                                             onClick={(e) => removeItem(item[valueField], e)}
//                                             className="
//                                                 text-blue-600 dark:text-blue-300
//                                                 hover:text-blue-800 dark:hover:text-blue-100
//                                                 cursor-pointer
//                                             "
//                                         >
//                                             <svg className="w-3 h-3 fill-transparent">
//                                                 <use xlinkHref='#icon-closed' />
//                                             </svg>
//                                             {/* <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
//                                                 <path
//                                                     fillRule="evenodd"
//                                                     d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
//                                                     clipRule="evenodd"
//                                                 />
//                                             </svg> */}
//                                         </span>
//                                     </div>
//                                 ))}
//                             </div>
//                         ) : !isMulti && selectedItemData ? (
//                             <div className="flex items-center gap-2">
//                                 {iconToField && (
//                                     <div className="
//                                         w-6 h-6 rounded-full
//                                         bg-blue-100 dark:bg-blue-900
//                                         flex items-center justify-center
//                                         text-blue-600 dark:text-blue-300
//                                         text-xs font-bold flex-shrink-0
//                                     ">
//                                         {getInitial(selectedItemData)}
//                                     </div>
//                                 )}
//                                 <div className="truncate">
//                                     <div className="font-medium truncate text-sm">
//                                         {getDisplayText(selectedItemData)}
//                                     </div>
//                                     {subToField && getSubText(selectedItemData) && (
//                                         <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
//                                             {getSubText(selectedItemData)}
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         ) : (
//                             <div className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-2">
//                                 {iconToField && (
//                                     <div className="
//                                         w-6 h-6 rounded-full
//                                         bg-gray-100 dark:bg-gray-700
//                                         flex items-center justify-center
//                                     ">
//                                         {icon ? (
//                                             <svg className="w-4 h-4 fill-transparent">
//                                                 <use xlinkHref={`#${icon}`} />
//                                             </svg>
//                                         ) : (
//                                             <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                                             </svg>
//                                         )}
//                                     </div>
//                                 )}
//                                 <span>{placeholder}</span>
//                             </div>
//                         )}
//                     </div>

//                     <div className="flex items-center gap-1 flex-shrink-0 ml-2">
//                         {isMulti && countToField && selectionCount > 0 && (
//                             <span className="
//                                 bg-blue-600 text-white
//                                 text-xs rounded-full
//                                 w-5 h-5
//                                 flex items-center justify-center
//                             ">
//                                 {selectionCount}
//                             </span>
//                         )}
//                         <svg
//                             className={`
//                                 w-4 h-4 text-gray-400
//                                 transition-transform
//                                 ${open ? 'rotate-180' : ''}
//                             `}
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                         >
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                         </svg>
//                     </div>
//                 </button>

//                 {/* DROPDOWN */}
//                 {open && (
//                     <div
//                         className={`
//                             absolute z-50 mt-1 w-full
//                             bg-white dark:bg-gray-800
//                             border border-gray-300 dark:border-gray-600
//                             rounded-lg shadow-xl select-none
//                             overflow-auto scrollbar-thin
//                             transition-all duration-100
//                             opacity-100 scale-100 
//                         `}
//                         style={{ maxHeight: sizePanel }}
//                     >
//                         {/* SEARCH */}
//                         {searchable && (
//                             <div className="
//                                 sticky z-10 top-0
//                                 bg-white dark:bg-gray-800
//                                 p-2
//                                 border-b border-gray-200 dark:border-gray-700
//                             ">
//                                 <div className="relative">
//                                     <input
//                                         ref={searchInputRef}
//                                         type="text"
//                                         value={search}
//                                         onChange={(e) => setSearch(e.target.value)}
//                                         placeholder={searchPlaceholder}
//                                         className="
//                                             w-full pl-9 pr-3 py-2
//                                             border border-gray-300 dark:border-gray-600
//                                             rounded-lg
//                                             bg-gray-50 dark:bg-gray-900
//                                             text-gray-700 dark:text-white
//                                             focus:border-blue-500
//                                             text-sm
//                                             outline-none
//                                         "
//                                         autoComplete="off"
//                                         onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
//                                     />
//                                     <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
//                                         <svg className="w-[18px] h-[18px] fill-transparent">
//                                             <use xlinkHref="#icon-magnifer" />
//                                         </svg>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}

//                         {/* ITEMS */}
//                         <div className="p-1 flex flex-col gap-1">
//                             {/* CLEAR OPTION */}
//                             {!isMulti && model.length > 0 && !(search && items.length === 0) && (
//                                 <div
//                                     onClick={clearAll}
//                                     className={`
//                                         pl-3 pr-1.5 py-2
//                                         relative
//                                         hover:bg-gray-100 dark:hover:bg-gray-700
//                                         cursor-pointer
//                                         flex items-center justify-between
//                                         transition-colors rounded-md
//                                         ${!currentValue
//                                             ? 'bg-gray-100 dark:bg-gray-700'
//                                             : 'hover:bg-gray-100 dark:hover:bg-gray-700'
//                                         }
//                                     `}
//                                 >
//                                     <div className="flex items-center gap-2 select-none">
//                                         {iconItems && (
//                                             <div className="
//                                                 w-8 h-8 rounded-full
//                                                 flex items-center justify-center
//                                                 bg-gray-200 dark:bg-gray-600
//                                             ">
//                                                 {icon ? (
//                                                     <svg className="w-[18px] h-[18px] text-gray-600 dark:text-gray-300 fill-transparent">
//                                                         <use xlinkHref={`#${icon}`} />
//                                                     </svg>
//                                                 ) : (
//                                                     <svg className="w-[18px] h-[18px] text-gray-600 dark:text-gray-300 fill-transparent">
//                                                         <use xlinkHref="#icon-x-circle" />
//                                                     </svg>
//                                                 )}
//                                             </div>
//                                         )}
//                                         <div>
//                                             <div className="font-semibold text-sm text-gray-800 dark:text-gray-200">
//                                                 {clearText || placeholder}
//                                             </div>
//                                         </div>
//                                     </div>
//                                     {!currentValue && (
//                                         <span className="absolute top-1 left-1 bg-indigo-300 text-indigo-600 p-0.5 rounded-sm">
//                                             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                                                 <path
//                                                     fillRule="evenodd"
//                                                     d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                                                     clipRule="evenodd"
//                                                 />
//                                             </svg>
//                                         </span>
//                                     )}
//                                 </div>
//                             )}

//                             {/* ITEMS LIST */}
//                             {items.length > 0 ? (
//                                 items.map(item => {
//                                     const itemId = item[valueField];
//                                     const checked = isMulti
//                                         ? currentValue.includes(itemId)
//                                         : currentValue == itemId;

//                                     return (
//                                         <div
//                                             key={itemId}
//                                             onClick={() => selectItem(itemId)}
//                                             className={`
//                                                 relative pl-3 pr-1.5 py-2
//                                                 hover:bg-gray-100 dark:hover:bg-gray-700
//                                                 cursor-pointer
//                                                 flex items-center justify-between
//                                                 rounded-md transition-colors
//                                                 ${checked
//                                                     ? 'bg-blue-50 dark:bg-blue-900/20'
//                                                     : ''
//                                                 }
//                                             `}
//                                         >
//                                             <div className="grid grid-cols-[auto,1fr] gap-2 items-center grid-flow-col">
//                                                 {/* CHECKBOX - فقط برای حالت چند انتخابی */}
//                                                 {isMulti && (
//                                                     <div className="w-5 h-5 flex items-center justify-center">
//                                                         <div
//                                                             className={`
//                                                                 w-4 h-4 border rounded
//                                                                 flex items-center justify-center
//                                                                 ${checked
//                                                                     ? 'bg-blue-600 border-blue-600'
//                                                                     : 'border-gray-400 dark:border-gray-500 bg-white dark:bg-gray-700'
//                                                                 }
//                                                             `}
//                                                         >
//                                                             {checked && (
//                                                                 <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
//                                                                     <path
//                                                                         fillRule="evenodd"
//                                                                         d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                                                                         clipRule="evenodd"
//                                                                     />
//                                                                 </svg>
//                                                             )}
//                                                         </div>
//                                                     </div>
//                                                 )}

//                                                 {/* ICON & CONTENT */}
//                                                 <div className="flex items-center gap-2">
//                                                     {iconItems && (
//                                                         <div className="
//                                                             w-8 h-8 rounded-full
//                                                             bg-blue-100 dark:bg-blue-900
//                                                             flex items-center justify-center
//                                                             text-blue-600 dark:text-blue-300
//                                                              text-sm font-bold
//                                                             flex-shrink-0
//                                                         ">
//                                                             {getInitial(item)}
//                                                         </div>
//                                                     )}
//                                                     <div className="min-w-0">
//                                                         <div className="font-semibold text-sm text-gray-800 dark:text-gray-200 truncate">
//                                                             {getDisplayText(item)}
//                                                         </div>
//                                                         {getSubText(item) && (
//                                                             <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
//                                                                 {getSubText(item)}
//                                                             </div>
//                                                         )}
//                                                     </div>
//                                                 </div>
//                                             </div>

//                                             {/* TICK MARK - برای حالت تکی (مثل کد لاراولی) */}
//                                             {!isMulti && checked && (
//                                                 <span className="absolute top-1 left-1 bg-indigo-300 text-indigo-600 p-0.5 rounded-sm">
//                                                     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                                                         <path
//                                                             fillRule="evenodd"
//                                                             d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                                                             clipRule="evenodd"
//                                                         />
//                                                     </svg>
//                                                 </span>
//                                             )}
//                                         </div>
//                                     );
//                                 })
//                             ) : (
//                                 <div className="px-3 py-4 text-center text-gray-500 dark:text-gray-400">
//                                     <svg className="w-8 h-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                     </svg>
//                                     <div className="text-sm">{model.length === 0 ? noItemsText : noResultsText}</div>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 )}
//             </div>

//             {/* BOTTOM COUNT */}
//             {isMulti && countBottom && maxSelections && (
//                 <div className="mt-1 text-xs select-none text-gray-500 dark:text-gray-400">
//                     {selectionCount} از {maxSelections} انتخاب ممکن
//                 </div>
//             )}

//             {/* ERROR */}
//             {showError && !isValid && (
//                 <span className="text-red-500 text-sm mt-1 select-none block">
//                     {meta.error}
//                 </span>
//             )}
//         </div>
//     );
// };

// export default React.memo(UnifiedSearchableSelect);



// components/Form/UnifiedSearchableSelect.jsx

import React, {
    useEffect,
    useMemo,
    useRef,
    useState,   // ⬇️⬇️⬇️ جدید
    useCallback,
} from 'react';

import { useField } from 'formik';

import { useSearchableSelect } from '@/hooks/useSearchableSelect';
import { openAlertModal } from '@/components/Modal/modal';

const UnifiedSearchableSelect = ({
    name,

    model = [],
    mode = 'single', // multi or single

    searchable = true,
    searchFields = ['title', 'e_name'],

    displayField = 'title',
    displayValue = null,
    valueField = 'id',

    subField = null,
    subToField = false,

    placeholder = 'انتخاب کنید',
    searchPlaceholder = 'جستجو...',

    clearText = null,
    noResultsText = 'موردی یافت نشد',
    noItemsText = 'هیچ آیتمی موجود نیست',

    icon = null,
    iconHeader = false,
    iconToField = false,
    iconItems = false,

    required = false,
    label = null,

    isEnum = false,
    sizePanel = '300px',

    autoFocusSearch = true,
    clearSearchOnClose = true,

    className = '',

    countTop = false,
    clearTop = false,
    countBottom = false,
    countToField = false,
    py = 'py-2.5',
    maxSelections = null,
}) => {

    // FORMIK
    const [field, meta, helpers] = useField(name);

    const isMulti = mode === 'multi';

    const currentValue = useMemo(() => {
        return isMulti
            ? (field.value || [])
            : field.value;
    }, [field.value, isMulti]);

    // ⬇️⬇️⬇️ جدید: state جهت باز شدن پنل ⬇️⬇️⬇️
    const [dropDirection, setDropDirection] = useState('down');

    // SEARCHABLE HOOK
    const {
        open,
        setOpen,

        search,
        setSearch,

        isTouched,

        wrapperRef,

        filteredItems,

        selectItem: hookSelectItem,

        clearSelection,

    } = useSearchableSelect({
        model,
        searchable,
        searchFields,
        clearSearchOnClose,
        autoFocusSearch,

        isMulti,

        value: currentValue,

        onChange: (newValue) => {
            helpers.setValue(newValue);
            helpers.setTouched(true);
        },

        onTouched: () => {
            helpers.setTouched(true);
        },

        maxSelections,
    });

    // SEARCH INPUT REF
    const searchInputRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [wrapperRef, setOpen]);

    // ⬇️⬇️⬇️ جدید: تشخیص جهت باز شدن (بالا/پایین) ⬇️⬇️⬇️
    useEffect(() => {
        if (!open || !wrapperRef.current) return;

        const computeDirection = () => {
            const trigger = wrapperRef.current;
            if (!trigger) return;

            const rect = trigger.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const spaceBelow = viewportHeight - rect.bottom;
            const spaceAbove = rect.top;

            // ارتفاع پنل (از sizePanel)
            const panelHeight = parseInt(sizePanel, 10) || 300;
            const margin = 20;

            // اگه فضای پایین کافی نیست ولی فضای بالا بیشتره → به بالا باز کن
            if (
                spaceBelow < panelHeight + margin &&
                spaceAbove > spaceBelow
            ) {
                setDropDirection('up');
            } else {
                setDropDirection('down');
            }
        };

        computeDirection();

        // با اسکرول/ریسایز دوباره محاسبه کن
        window.addEventListener('scroll', computeDirection, true);
        window.addEventListener('resize', computeDirection);

        return () => {
            window.removeEventListener('scroll', computeDirection, true);
            window.removeEventListener('resize', computeDirection);
        };
    }, [open, sizePanel, wrapperRef]);

    // AUTO FOCUS
    useEffect(() => {
        if (
            open &&
            searchable &&
            autoFocusSearch &&
            searchInputRef.current
        ) {
            const timer = setTimeout(() => {
                searchInputRef.current.focus();
                const length = searchInputRef.current.value.length;
                searchInputRef.current.setSelectionRange(length, length);
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [open, searchable, autoFocusSearch]);

    // CLEAR SEARCH ON CLOSE
    useEffect(() => {
        if (!open && clearSearchOnClose) {
            setSearch('');
        }
    }, [open, clearSearchOnClose, setSearch]);

    // MODEL MAP
    const modelMap = useMemo(() => {
        return new Map(
            model.map(item => [
                String(item[valueField]),
                item
            ])
        );
    }, [model, valueField]);

    // FILTERED ITEMS
    const items = useMemo(() => {
        return filteredItems();
    }, [filteredItems, search]);

    // DISPLAY TEXT
    const getDisplayText = useCallback((item) => {
        if (!item) return '';

        if (displayValue && item[displayValue]) {
            return item[displayValue];
        }

        if (isEnum && item.label) {
            return item.label;
        }

        return item[displayField] || 'بدون عنوان';
    }, [displayField, displayValue, isEnum]);

    // SUB TEXT
    const getSubText = useCallback((item) => {
        if (!item || !subField) return '';
        return item[subField] || '';
    }, [subField]);

    // INITIAL
    const getInitial = useCallback((item) => {
        if (!item) return '';
        return getDisplayText(item).charAt(0).toUpperCase();
    }, [getDisplayText]);

    // SELECTED ITEM
    const selectedItemData = useMemo(() => {
        if (isMulti || !currentValue) {
            return null;
        }
        return modelMap.get(String(currentValue)) || null;
    }, [isMulti, currentValue, modelMap]);

    // SELECTED ITEMS
    const selectedItemsData = useMemo(() => {
        if (!isMulti || !Array.isArray(currentValue)) {
            return [];
        }
        return currentValue
            .map(id => modelMap.get(String(id)))
            .filter(Boolean);
    }, [isMulti, currentValue, modelMap]);

    // COUNT
    const selectionCount = useMemo(() => {
        return isMulti ? currentValue.length : 0;
    }, [isMulti, currentValue]);

    // SELECTION SUMMARY
    const getSelectionSummary = useCallback(() => {
        const items = selectedItemsData;
        if (items.length === 0) return '';

        const names = items.slice(0, 2).map(item => getDisplayText(item));
        let summary = names.join('، ');

        if (items.length > 2) {
            summary += ` و ${items.length - 2} مورد دیگر`;
        }

        return summary;
    }, [selectedItemsData, getDisplayText]);

    // SELECT ITEM
    const selectItem = useCallback((itemId) => {
        if (
            isMulti &&
            maxSelections &&
            currentValue.length >= maxSelections &&
            !currentValue.includes(itemId)
        ) {
            openAlertModal({
                title: 'محدودیت انتخاب',
                message: `حداکثر ${maxSelections} آیتم می‌توانید انتخاب کنید.`,
                confirmText: 'باشه',
                variant: 'warning',
            });
            return;
        }

        hookSelectItem(itemId);
    }, [isMulti, maxSelections, currentValue, hookSelectItem]);

    // REMOVE ITEM
    const removeItem = useCallback((itemId, e) => {
        e.stopPropagation();
        hookSelectItem(itemId);
    }, [hookSelectItem]);

    // CLEAR ALL
    const clearAll = useCallback(() => {
        setSearch('');
        clearSelection();
        setOpen(false);
    }, [setSearch, clearSelection, setOpen]);

    // VALIDATION
    const showError = meta.error && (meta.touched || isTouched);

    const isValid = required
        ? (isMulti ? currentValue.length > 0 : currentValue && currentValue !== '')
        : true;

    return (
        <div
            className={` ${className}`}
            ref={wrapperRef}
        >
            {/* LABEL */}
            {label && (
                <div className='flex items-center justify-between mb-2 select-none'>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        <div className="flex gap-1 items-center">
                            {icon && iconHeader && (
                                <svg className="w-[18px] h-[18px] fill-transparent">
                                    <use xlinkHref={`#${icon}`} />
                                </svg>
                            )}
                            <span>{label}</span>
                            {required && (
                                <span className="text-red-500">*</span>
                            )}
                            {isMulti && countTop && selectionCount > 0 && (
                                <span className="text-sm text-blue-600 dark:text-blue-400">
                                    ({selectionCount} انتخاب)
                                </span>
                            )}
                        </div>
                    </label>
                    <button
                        type='button'
                        onClick={clearAll}
                        className={`px-3 py-1 text-xs bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 rounded-lg transition-colors duration-200 cursor-pointer
                                                ${clearTop
                                ? 'opacity-100 visible'
                                : 'opacity-0 invisible'}
                                                `}
                    >
                        حذف همه
                    </button>
                </div>
            )}

            {/* BUTTON */}
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setOpen(!open)}
                    className={`
                        w-full pr-3 pl-1.5 ${py} text-right
                        border rounded-lg
                        bg-white dark:bg-gray-700
                        text-gray-700 dark:text-white
                        flex items-center cursor-pointer
                        hover:bg-gray-50 dark:hover:bg-gray-600
                        transition-all group
                        ${open
                            ? 'border-blue-500 ring-1 ring-blue-500'
                            : showError && !isValid
                                ? 'border-red-500'
                                : 'border-gray-300 dark:border-gray-600'
                        }
                    `}
                    title={getSelectionSummary()}
                >
                    <div className="flex-1 min-w-0 select-none">
                        {/* MULTI SELECTED */}
                        {isMulti && selectionCount > 0 ? (
                            <div className="flex flex-wrap gap-1">
                                {selectedItemsData.map(item => (
                                    <div
                                        key={item[valueField]}
                                        className="
                                            inline-flex items-center gap-1
                                            bg-blue-100 dark:bg-blue-900
                                            text-blue-800 dark:text-blue-200
                                            px-2 py-1
                                            rounded-full text-xs
                                            cursor-default
                                        "
                                    >
                                        <span>{getDisplayText(item)}</span>
                                        <span
                                            role='button'
                                            tabIndex={0}
                                            onClick={(e) => removeItem(item[valueField], e)}
                                            className="
                                                text-blue-600 dark:text-blue-300
                                                hover:text-blue-800 dark:hover:text-blue-100
                                                cursor-pointer
                                            "
                                        >
                                            <svg className="w-3 h-3 fill-transparent">
                                                <use xlinkHref='#icon-closed' />
                                            </svg>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : !isMulti && selectedItemData ? (
                            <div className="flex items-center gap-2">
                                {iconToField && (
                                    <div className="
                                        w-6 h-6 rounded-full
                                        bg-blue-100 dark:bg-blue-900
                                        flex items-center justify-center
                                        text-blue-600 dark:text-blue-300
                                        text-xs font-bold flex-shrink-0
                                    ">
                                        {getInitial(selectedItemData)}
                                    </div>
                                )}
                                <div className="truncate">
                                    <div className="font-medium truncate text-sm">
                                        {getDisplayText(selectedItemData)}
                                    </div>
                                    {subToField && getSubText(selectedItemData) && (
                                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                            {getSubText(selectedItemData)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-2">
                                {iconToField && (
                                    <div className="
                                        w-6 h-6 rounded-full
                                        bg-gray-100 dark:bg-gray-700
                                        flex items-center justify-center
                                    ">
                                        {icon ? (
                                            <svg className="w-4 h-4 fill-transparent">
                                                <use xlinkHref={`#${icon}`} />
                                            </svg>
                                        ) : (
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        )}
                                    </div>
                                )}
                                <span>{placeholder}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                        {isMulti && countToField && selectionCount > 0 && (
                            <span className="
                                bg-blue-600 text-white
                                text-xs rounded-full
                                w-5 h-5
                                flex items-center justify-center
                            ">
                                {selectionCount}
                            </span>
                        )}
                        <svg
                            className={`
                                w-4 h-4 text-gray-400
                                transition-transform
                                ${open ? 'rotate-180' : ''}
                            `}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </button>

                {/* DROPDOWN */}
                {open && (
                    <div
                        className={`
                            absolute z-50 w-full
                            bg-white dark:bg-gray-800
                            border border-gray-300 dark:border-gray-600
                            rounded-lg shadow-xl select-none
                            overflow-auto scrollbar-thin
                            transition-all duration-100
                            opacity-100 scale-100
                            ${dropDirection === 'up' ? 'bottom-full mb-1' : 'top-full mt-1'}
                        `}
                        style={{ maxHeight: sizePanel }}
                    >
                        {/* SEARCH */}
                        {searchable && (
                            <div className="
                                sticky z-10 top-0
                                bg-white dark:bg-gray-800
                                p-2
                                border-b border-gray-200 dark:border-gray-700
                            ">
                                <div className="relative">
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder={searchPlaceholder}
                                        className="
                                            w-full pl-9 pr-3 py-2
                                            border border-gray-300 dark:border-gray-600
                                            rounded-lg
                                            bg-gray-50 dark:bg-gray-900
                                            text-gray-700 dark:text-white
                                            focus:border-blue-500
                                            text-sm
                                            outline-none
                                        "
                                        autoComplete="off"
                                        onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
                                    />
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <svg className="w-[18px] h-[18px] fill-transparent">
                                            <use xlinkHref="#icon-magnifer" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ITEMS */}
                        <div className="p-1 flex flex-col gap-1">
                            {/* CLEAR OPTION */}
                            {!isMulti && model.length > 0 && !(search && items.length === 0) && (
                                <div
                                    onClick={clearAll}
                                    className={`
                                        pl-3 pr-1.5 py-2
                                        relative
                                        hover:bg-gray-100 dark:hover:bg-gray-700
                                        cursor-pointer
                                        flex items-center justify-between
                                        transition-colors rounded-md
                                        ${!currentValue
                                            ? 'bg-gray-100 dark:bg-gray-700'
                                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }
                                    `}
                                >
                                    <div className="flex items-center gap-2 select-none">
                                        {iconItems && (
                                            <div className="
                                                w-8 h-8 rounded-full
                                                flex items-center justify-center
                                                bg-gray-200 dark:bg-gray-600
                                            ">
                                                {icon ? (
                                                    <svg className="w-[18px] h-[18px] text-gray-600 dark:text-gray-300 fill-transparent">
                                                        <use xlinkHref={`#${icon}`} />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-[18px] h-[18px] text-gray-600 dark:text-gray-300 fill-transparent">
                                                        <use xlinkHref="#icon-x-circle" />
                                                    </svg>
                                                )}
                                            </div>
                                        )}
                                        <div>
                                            <div className="font-semibold text-sm text-gray-800 dark:text-gray-200">
                                                {clearText || placeholder}
                                            </div>
                                        </div>
                                    </div>
                                    {!currentValue && (
                                        <span className="absolute top-1 left-1 bg-indigo-300 text-indigo-600 p-0.5 rounded-sm">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* ITEMS LIST */}
                            {items.length > 0 ? (
                                items.map(item => {
                                    const itemId = item[valueField];
                                    const checked = isMulti
                                        ? currentValue.includes(itemId)
                                        : currentValue == itemId;

                                    return (
                                        <div
                                            key={itemId}
                                            onClick={() => selectItem(itemId)}
                                            className={`
                                                relative pl-3 pr-1.5 py-2
                                                hover:bg-gray-100 dark:hover:bg-gray-700
                                                cursor-pointer
                                                flex items-center justify-between
                                                rounded-md transition-colors
                                                ${checked
                                                    ? 'bg-blue-50 dark:bg-blue-900/20'
                                                    : ''
                                                }
                                            `}
                                        >
                                            <div className="grid grid-cols-[auto,1fr] gap-2 items-center grid-flow-col">
                                                {/* CHECKBOX - فقط برای حالت چند انتخابی */}
                                                {isMulti && (
                                                    <div className="w-5 h-5 flex items-center justify-center">
                                                        <div
                                                            className={`
                                                                w-4 h-4 border rounded
                                                                flex items-center justify-center
                                                                ${checked
                                                                    ? 'bg-blue-600 border-blue-600'
                                                                    : 'border-gray-400 dark:border-gray-500 bg-white dark:bg-gray-700'
                                                                }
                                                            `}
                                                        >
                                                            {checked && (
                                                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                        clipRule="evenodd"
                                                                    />
                                                                </svg>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* ICON & CONTENT */}
                                                <div className="flex items-center gap-2">
                                                    {iconItems && (
                                                        <div className="
                                                            w-8 h-8 rounded-full
                                                            bg-blue-100 dark:bg-blue-900
                                                            flex items-center justify-center
                                                            text-blue-600 dark:text-blue-300
                                                             text-sm font-bold
                                                            flex-shrink-0
                                                        ">
                                                            {getInitial(item)}
                                                        </div>
                                                    )}
                                                    <div className="min-w-0">
                                                        <div className="font-semibold text-sm text-gray-800 dark:text-gray-200 truncate">
                                                            {getDisplayText(item)}
                                                        </div>
                                                        {getSubText(item) && (
                                                            <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                                                {getSubText(item)}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* TICK MARK - برای حالت تکی */}
                                            {!isMulti && checked && (
                                                <span className="absolute top-1 left-1 bg-indigo-300 text-indigo-600 p-0.5 rounded-sm">
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </span>
                                            )}
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="px-3 py-4 text-center text-gray-500 dark:text-gray-400">
                                    <svg className="w-8 h-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div className="text-sm">{model.length === 0 ? noItemsText : noResultsText}</div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* BOTTOM COUNT */}
            {isMulti && countBottom && maxSelections && (
                <div className="mt-1 text-xs select-none text-gray-500 dark:text-gray-400">
                    {selectionCount} از {maxSelections} انتخاب ممکن
                </div>
            )}

            {/* ERROR */}
            {showError && !isValid && (
                <span className="text-red-500 text-sm mt-1 select-none block">
                    {meta.error}
                </span>
            )}
        </div>
    );
};

export default React.memo(UnifiedSearchableSelect);