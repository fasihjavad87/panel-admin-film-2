// import React, { Children, useEffect, useState } from "react";

// // let numOfPage = 3
// const PaginatedTable = ({
//   data,
//   dataInfo,
//   children,
//   numOfPage = 10,
//   tableSetting,
//   selectedRows,
//   setSelectedRows,

//   serverSide = false,

//   currentPage: serverCurrentPage,
//   pageCount: serverPageCount,

//   onPageChange,
//   onSearch,

//   paddingRow = "px-4 py-3",

//   searchValue = "",
// }) => {
//   const [initData, setInitData] = useState(data);
//   const [dataTable, setDatatable] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   // const [pages, setPages] = useState([])
//   const [pageCount, setPageCount] = useState(1);
//   const [searchChar, setSearchChar] = useState("");

//   const activeCurrentPage = serverSide ? serverCurrentPage : currentPage;

//   const activePageCount = serverSide ? serverPageCount : pageCount;

//   const finalDataTable = serverSide ? data : dataTable;

//   const pages = Array.from({ length: activePageCount || 0 }, (_, i) => i + 1);

//   const changePage = (page) => {
//     if (serverSide) {
//       onPageChange?.(page);
//     } else {
//       setCurrentPage(page);
//     }
//   };

//   useEffect(() => {
//     if (serverSide) return;

//     let pCount = Math.ceil(initData.length / numOfPage);

//     setPageCount(pCount);
//   }, [initData, serverSide]);

//   useEffect(() => {
//     if (serverSide) return;

//     let start = currentPage * numOfPage - numOfPage;
//     let end = currentPage * numOfPage;

//     setDatatable(initData.slice(start, end));
//   }, [currentPage, initData, serverSide]);

//   useEffect(() => {
//     if (serverSide) return;

//     const searchableFields = dataInfo
//       .filter((item) => item.searchable)
//       .map((item) => item.field);

//     const filteredData = data.filter((row) =>
//       searchableFields.some((field) =>
//         String(row[field] ?? "")
//           .toLowerCase()
//           .includes(searchChar.toLowerCase()),
//       ),
//     );

//     setInitData(filteredData);

//     setCurrentPage(1);
//   }, [searchChar, data, serverSide]);

//   const renderColumnDataField = (column, data) => {
//     if (column.field) {
//       return data[column.field];
//     } else if (column.elements) {
//       return column.elements(data);
//     }
//     return null;
//   };

//   const handleSelectAll = () => {
//     if (selectedRows.length === data.length) {
//       setSelectedRows([]);
//     } else {
//       setSelectedRows(data.map((item) => item.id));
//     }
//   };

//   const handleSelectRow = (id) => {
//     if (selectedRows.includes(id)) {
//       setSelectedRows(selectedRows.filter((item) => item !== id));
//     } else {
//       setSelectedRows([...selectedRows, id]);
//     }
//   };

//   return (
//     <div className="p-4 bg-white rounded-md border border-gray-300">
//       <div className="flex flex-row justify-between items-center mb-4 gap-3 select-none">
//         <div className="flex gap-3 items-center">
//           <h2 className="text-lg font-semibold text-custom-blue">
//             {tableSetting.title || "لیست معمولی"}
//           </h2>
//         </div>
//         <div className="flex items-center gap-2">
//           {/* <button
//                         // onClick={funcBtnAdd}
//                         className="flex justify-center items-center py-[5px] px-[11px] gap-1 bg-blue-50 hover:bg-blue-100 text-custom-blue border-[1.4px] border-custom-blue text-[18px] rounded-md transition cursor-pointer"
//                     >
//                         <i className="fa-regular fa-plus"></i>
//                         <span className="text-[16px]">افزودن</span>
//                     </button> */}
//           {children}
//           <div className="relative">
//             <input
//               type="text"
//               placeholder={tableSetting.searchPlaceholder || "جستجو..."}
//               value={serverSide ? searchValue : searchChar}
//               onChange={(e) => {
//                 if (serverSide) {
//                   onSearch?.(e.target.value);
//                 } else {
//                   setSearchChar(e.target.value);
//                 }
//               }}
//               className="pr-8 pl-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-blue focus:border-transparent text-sm w-full md:w-64"
//             />
//             <svg className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 fill-transparent">
//               <use xlinkHref="#icon-magnifer"></use>
//             </svg>
//           </div>
//         </div>
//       </div>

//       {tableSetting.loading ? (
//         <div className="overflow-x-auto">
//           <table className="min-w-full table-fixed">
//             <thead>
//               <tr className="border-b border-gray-200">
//                 {tableSetting.selectable && (
//                   <th className="px-4 py-3 w-[60px]">
//                     <div className="w-5 h-5 bg-gray-200 rounded animate-pulse mx-auto"></div>
//                   </th>
//                 )}

//                 {dataInfo.map((item, index) => (
//                   <th key={index} className="px-4 py-3">
//                     <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
//                   </th>
//                 ))}
//               </tr>
//               ÷
//             </thead>

//             <tbody>
//               {[1, 2, 3].map((row) => (
//                 <tr key={row} className="border-b border-gray-100">
//                   {tableSetting.selectable && (
//                     <td className="px-4 py-4">
//                       <div className="w-5 h-5 bg-gray-200 rounded animate-pulse mx-auto"></div>
//                     </td>
//                   )}

//                   {dataInfo.map((col, index) => (
//                     <td key={index} className="px-4 py-4">
//                       <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
//                     </td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : !data || data.length === 0 ? (
//         <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-200 rounded-lg">
//           <div className="w-20 h-20 flex items-center justify-center rounded-full bg-blue-50">
//             <i className="fa-regular fa-folder-open text-4xl text-custom-blue"></i>
//           </div>

//           <h5 className="mt-4 text-lg font-semibold text-gray-700">
//             {tableSetting.titleNull || "هیچ رکوردی یافت نشد"}
//           </h5>

//           <span className="mt-2 text-sm text-gray-500">
//             در حال حاضر داده‌ای برای نمایش وجود ندارد
//           </span>
//         </div>
//       ) : (
//         <div className="overflow-x-auto scroll-content">
//           <table className="w-max min-w-full divide-y divide-gray-200 select-none table-fixed">
//             <colgroup>
//               {tableSetting.selectable && <col style={{ width: "60px" }} />}

//               {dataInfo.map((i, idx) => (
//                 <col
//                   key={i.field || `col-${idx}`}
//                   style={{ width: i.width || "auto" }}
//                 />
//               ))}
//             </colgroup>

//             <thead className="bg-gray-50">
//               <tr>
//                 {tableSetting.selectable ? (
//                   <th className="px-4 py-3 w-[60px]">
//                     <label className="relative flex items-center justify-center w-5 h-5 cursor-pointer group">
//                       <input
//                         type="checkbox"
//                         checked={
//                           data.length > 0 && selectedRows.length === data.length
//                         }
//                         onChange={handleSelectAll}
//                         className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded group-hover:shadow-md border border-slate-300 checked:bg-custom-blue checked:border-custom-blue"
//                       />
//                       <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 peer-checked:opacity-100">
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           className="h-3.5 w-3.5"
//                           viewBox="0 0 20 20"
//                           fill="currentColor"
//                           stroke="currentColor"
//                           strokeWidth="1"
//                         >
//                           <path
//                             fillRule="evenodd"
//                             d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                             clipRule="evenodd"
//                           ></path>
//                         </svg>
//                       </span>
//                     </label>
//                   </th>
//                 ) : null}
//                 {dataInfo.map((i, idx) => (
//                   <th
//                     key={i.field || `field${idx}`}
//                     className={`px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider `}
//                     // style={{ width: i.width || "auto" }}
//                   >
//                     <div className="flex items-center gap-1 justify-start">
//                       {i.title}
//                     </div>
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {finalDataTable.map((d) => (
//                 <tr
//                   key={d.id}
//                   className="hover:bg-teal-50 transition duration-150"
//                 >
//                   {tableSetting.selectable ? (
//                     <td className="px-4 py-3">
//                       <label className="relative flex items-center justify-center w-5 h-5 cursor-pointer group">
//                         <input
//                           type="checkbox"
//                           checked={selectedRows.includes(d.id)}
//                           onChange={() => handleSelectRow(d.id)}
//                           className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded group-hover:shadow-md border border-slate-300 checked:bg-custom-blue checked:border-custom-blue"
//                         />
//                         <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 peer-checked:opacity-100">
//                           <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             className="h-3.5 w-3.5"
//                             viewBox="0 0 20 20"
//                             fill="currentColor"
//                             stroke="currentColor"
//                             strokeWidth="1"
//                           >
//                             <path
//                               fillRule="evenodd"
//                               d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                               clipRule="evenodd"
//                             ></path>
//                           </svg>
//                         </span>
//                       </label>
//                     </td>
//                   ) : null}
//                   {dataInfo.map((i, idx) => (
//                     // <td key={i.field || `${i.title}_${d.id}_${idx}`} className={` whitespace-nowrap truncate ${i.padding || 'px-4 py-3'}`} style={{ width: i.width || 'auto' }}>
//                     //     {/* {d[i.field]} */}
//                     //     {renderColumnDataField(i, d)}
//                     // </td>
//                     <td
//                       key={i.field || `${i.title}_${d.id}_${idx}`}
//                       className={`${i.padding || "px-4 py-3"}`}
//                     //   style={{ width: i.width || "auto" }}
//                     >
//                       {i.field ? (
//                         <div className="w-full truncate">
//                           {renderColumnDataField(i, d)}
//                         </div>
//                       ) : (
//                         renderColumnDataField(i, d)
//                       )}
//                     </td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       <div
//         className={`flex ${tableSetting.countSelect ? "justify-between" : "justify-end"} items-center mt-4 pt-3 border-t border-gray-200 select-none1`}
//       >
//         {tableSetting.countSelect ? (
//           <div className="flex gap-0.5 text-sm text-gray-500 select-none">
//             <span className="text-custom-blue">{selectedRows.length}</span>
//             <span>انتخاب شده</span>
//             {/* {`${selectedRows.length} انتخاب شده`} */}
//           </div>
//         ) : null}

//         {activePageCount > 1 ? (
//           <nav aria-label="Page navigation" dir="ltr" className="flex gap-1">
//             <button
//               className={`flex items-center justify-center w-9 h-9 rounded-md border transition ${
//                 activeCurrentPage === 1
//                   ? "bg-white text-gray-400 border-gray-300 cursor-not-allowed"
//                   : "bg-white text-custom-blue border-gray-300 hover:bg-blue-50 cursor-pointer"
//               }`}
//               disabled={activeCurrentPage === 1}
//               onClick={() => changePage(activeCurrentPage - 1)}
//             >
//               <svg className="w-[22px] h-[22px] fill-transparent">
//                 <use xlinkHref="#icon-alt-arrow-left"></use>
//               </svg>
//             </button>

//             {pages.map((page) => (
//               <button
//                 key={page}
//                 className={`flex justify-center items-center pt-0.5 w-9 h-9 rounded-md border transition cursor-pointer ${
//                   activeCurrentPage === page
//                     ? "bg-blue-50 text-custom-blue border-custom-blue"
//                     : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
//                 }`}
//                 // onClick={() => onPageChange(page)}
//                 onClick={() => changePage(page)}
//               >
//                 {page}
//               </button>
//             ))}

//             <button
//               className={`flex items-center justify-center w-9 h-9 rounded-md border transition ${
//                 activeCurrentPage === activePageCount
//                   ? "bg-white text-gray-400 border-gray-300 cursor-not-allowed"
//                   : "bg-white text-custom-blue border-gray-300 hover:bg-blue-50 cursor-pointer"
//               }`}
//               onClick={() => changePage(activeCurrentPage + 1)}
//               disabled={activeCurrentPage === activePageCount}
//             >
//               <svg className="w-[22px] h-[22px] fill-transparent">
//                 <use xlinkHref="#icon-alt-arrow-right"></use>
//               </svg>
//             </button>
//           </nav>
//         ) : null}
//       </div>
//     </div>
//   );
// };

// export default PaginatedTable;

import React, { useEffect, useState, useMemo } from "react";

const PaginatedTable = ({
  data,
  dataInfo,
  children,
  numOfPage = 10,
  tableSetting,
  selectedRows,
  setSelectedRows,

  serverSide = false,

  currentPage: serverCurrentPage,
  pageCount: serverPageCount,

  onPageChange,
  onSearch,

  paddingRow = "px-4 py-3",

  searchValue = "",
}) => {
  const [initData, setInitData] = useState(data);
  const [dataTable, setDatatable] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [searchChar, setSearchChar] = useState("");

  const activeCurrentPage = serverSide ? serverCurrentPage : currentPage;
  const activePageCount = serverSide ? serverPageCount : pageCount;
  const finalDataTable = serverSide ? data : dataTable;

  const pages = Array.from({ length: activePageCount || 0 }, (_, i) => i + 1);

  // ✅ محاسبه عرض کل جدول بر اساس عرض ستون‌ها
  // این باعث می‌شه جدول همیشه عرض ثابت ستون‌ها رو حفظ کنه
  // و اگر مجموع عرض‌ها از عرض کانتینر بیشتر شد، اسکرول افقی بخوره
  const totalWidth = useMemo(() => {
    let total = 0;
    if (tableSetting?.selectable) total += 60;
    dataInfo?.forEach((col) => {
      const w = parseInt(col.width);
      total += isNaN(w) ? 150 : w; // پیش‌فرض ۱۵۰px اگر width نداشت
    });
    return total;
  }, [dataInfo, tableSetting?.selectable]);

  const changePage = (page) => {
    if (serverSide) {
      onPageChange?.(page);
    } else {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    if (serverSide) return;
    let pCount = Math.ceil(initData.length / numOfPage);
    setPageCount(pCount);
  }, [initData, serverSide, numOfPage]);

  useEffect(() => {
    if (serverSide) return;
    let start = currentPage * numOfPage - numOfPage;
    let end = currentPage * numOfPage;
    setDatatable(initData.slice(start, end));
  }, [currentPage, initData, serverSide, numOfPage]);

  useEffect(() => {
    if (serverSide) return;

    const searchableFields = dataInfo
      .filter((item) => item.searchable)
      .map((item) => item.field);

    const filteredData = data.filter((row) =>
      searchableFields.some((field) =>
        String(row[field] ?? "")
          .toLowerCase()
          .includes(searchChar.toLowerCase()),
      ),
    );

    setInitData(filteredData);
    setCurrentPage(1);
  }, [searchChar, data, serverSide, dataInfo]);

  const renderColumnDataField = (column, data) => {
    if (column.field) {
      return data[column.field];
    } else if (column.elements) {
      return column.elements(data);
    }
    return null;
  };

  const handleSelectAll = () => {
    if (selectedRows.length === data.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(data.map((item) => item.id));
    }
  };

  const handleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((item) => item !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  return (
    <div className="p-4 bg-white rounded-md border border-gray-300">
      <div className="flex flex-row justify-between items-center mb-4 gap-3 select-none">
        <div className="flex gap-3 items-center">
          <h2 className="text-lg font-semibold text-custom-blue">
            {tableSetting.title || "لیست معمولی"}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {children}
          <div className="relative">
            <input
              type="text"
              placeholder={tableSetting.searchPlaceholder || "جستجو..."}
              value={serverSide ? searchValue : searchChar}
              onChange={(e) => {
                if (serverSide) {
                  onSearch?.(e.target.value);
                } else {
                  setSearchChar(e.target.value);
                }
              }}
              className="pr-8 pl-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-blue focus:border-transparent text-sm w-full md:w-64"
            />
            <svg className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 fill-transparent">
              <use xlinkHref="#icon-magnifer"></use>
            </svg>
          </div>
        </div>
      </div>

      {tableSetting.loading ? (
        <div className="overflow-x-auto">
          <table className="min-w-full table-fixed">
            <thead>
              <tr className="border-b border-gray-200">
                {tableSetting.selectable && (
                  <th className="px-4 py-3 w-[60px]">
                    <div className="w-5 h-5 bg-gray-200 rounded animate-pulse mx-auto"></div>
                  </th>
                )}
                {dataInfo.map((item, index) => (
                  <th key={index} className="px-4 py-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((row) => (
                <tr key={row} className="border-b border-gray-100">
                  {tableSetting.selectable && (
                    <td className="px-4 py-4">
                      <div className="w-5 h-5 bg-gray-200 rounded animate-pulse mx-auto"></div>
                    </td>
                  )}
                  {dataInfo.map((col, index) => (
                    <td key={index} className="px-4 py-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : !data || data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-200 rounded-lg">
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-blue-50">
            <i className="fa-regular fa-folder-open text-4xl text-custom-blue"></i>
          </div>
          <h5 className="mt-4 text-lg font-semibold text-gray-700">
            {tableSetting.titleNull || "هیچ رکوردی یافت نشد"}
          </h5>
          <span className="mt-2 text-sm text-gray-500">
            در حال حاضر داده‌ای برای نمایش وجود ندارد
          </span>
        </div>
      ) : (
        <div className="w-full overflow-x-auto scroll-content">
          {/* ✅ جدول با عرض ثابت = مجموع عرض ستون‌ها */}
          <table
            className="table-fixed divide-y divide-gray-200 select-none"
            // style={{ minWidth: "100%" }}
            //  style={{ width: "100%", minWidth: `${totalWidth}px` }}
             style={{ width: "100%", minWidth: `${totalWidth}px` }}
          >
            <colgroup>
              {tableSetting.selectable && <col style={{ width: "60px" }} />}
              {dataInfo.map((i, idx) => (
                <col
                  key={i.field || `col-${idx}`}
                  style={{ width: `${parseInt(i.width) || 150}px` }}
                />
              ))}
            </colgroup>

            <thead className="bg-gray-50">
              <tr>
                {tableSetting.selectable ? (
                  <th className="px-4 py-3 w-[60px]">
                    <label className="relative flex items-center justify-center w-5 h-5 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={
                          data.length > 0 && selectedRows.length === data.length
                        }
                        onChange={handleSelectAll}
                        className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded group-hover:shadow-md border border-slate-300 checked:bg-custom-blue checked:border-custom-blue"
                      />
                      <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 peer-checked:opacity-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3.5 w-3.5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          stroke="currentColor"
                          strokeWidth="1"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </span>
                    </label>
                  </th>
                ) : null}
                {dataInfo.map((i, idx) => (
                  <th
                    key={i.field || `field${idx}`}
                    className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider overflow-hidden"
                  >
                    <div className="flex items-center gap-1 justify-start truncate">
                      {i.title}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {finalDataTable.map((d) => (
                <tr
                  key={d.id}
                  className="hover:bg-teal-50 transition duration-150"
                >
                  {tableSetting.selectable ? (
                    <td className="px-4 py-3">
                      <label className="relative flex items-center justify-center w-5 h-5 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(d.id)}
                          onChange={() => handleSelectRow(d.id)}
                          className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded group-hover:shadow-md border border-slate-300 checked:bg-custom-blue checked:border-custom-blue"
                        />
                        <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 peer-checked:opacity-100">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3.5 w-3.5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            stroke="currentColor"
                            strokeWidth="1"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </span>
                      </label>
                    </td>
                  ) : null}
                  {dataInfo.map((i, idx) => (
                    <td
                      key={i.field || `${i.title}_${d.id}_${idx}`}
                      className={`${i.padding || "px-4 py-3"} overflow-hidden`}
                    >
                      {i.field ? (
                        <div
                          className="w-full truncate"
                          title={String(renderColumnDataField(i, d) ?? "")}
                        >
                          {renderColumnDataField(i, d)}
                        </div>
                      ) : (
                        renderColumnDataField(i, d)
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div
        className={`flex ${
          tableSetting.countSelect ? "justify-between" : "justify-end"
        } items-center mt-4 pt-3 border-t border-gray-200 select-none1`}
      >
        {tableSetting.countSelect ? (
          <div className="flex gap-0.5 text-sm text-gray-500 select-none">
            <span className="text-custom-blue">{selectedRows.length}</span>
            <span>انتخاب شده</span>
          </div>
        ) : null}

        {activePageCount > 1 ? (
          <nav aria-label="Page navigation" dir="ltr" className="flex gap-1">
            <button
              className={`flex items-center justify-center w-9 h-9 rounded-md border transition ${
                activeCurrentPage === 1
                  ? "bg-white text-gray-400 border-gray-300 cursor-not-allowed"
                  : "bg-white text-custom-blue border-gray-300 hover:bg-blue-50 cursor-pointer"
              }`}
              disabled={activeCurrentPage === 1}
              onClick={() => changePage(activeCurrentPage - 1)}
            >
              <svg className="w-[22px] h-[22px] fill-transparent">
                <use xlinkHref="#icon-alt-arrow-left"></use>
              </svg>
            </button>

            {pages.map((page) => (
              <button
                key={page}
                className={`flex justify-center items-center pt-0.5 w-9 h-9 rounded-md border transition cursor-pointer ${
                  activeCurrentPage === page
                    ? "bg-blue-50 text-custom-blue border-custom-blue"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
                }`}
                onClick={() => changePage(page)}
              >
                {page}
              </button>
            ))}

            <button
              className={`flex items-center justify-center w-9 h-9 rounded-md border transition ${
                activeCurrentPage === activePageCount
                  ? "bg-white text-gray-400 border-gray-300 cursor-not-allowed"
                  : "bg-white text-custom-blue border-gray-300 hover:bg-blue-50 cursor-pointer"
              }`}
              onClick={() => changePage(activeCurrentPage + 1)}
              disabled={activeCurrentPage === activePageCount}
            >
              <svg className="w-[22px] h-[22px] fill-transparent">
                <use xlinkHref="#icon-alt-arrow-right"></use>
              </svg>
            </button>
          </nav>
        ) : null}
      </div>
    </div>
  );
};

export default PaginatedTable;
