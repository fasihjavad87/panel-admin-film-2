// components/PaginatedDataTable2.jsx
import React, { useEffect, useState, useMemo } from "react";

const PaginatedDataTable2 = ({
    // پراپ های اصلی
    children,
    tableData,
    dataInfo,
    loading,

    // پراپ های صفحه‌بندی
    pageCount,
    currentPage,
    setCurrentPage,
    itemsPerPage = 10,

    // پراپ های سرچ
    searchParams,
    handleSearch,

    // پراپ های سورت
    sortable = true,
    defaultSort = { key: null, direction: 'asc' },

    // حالت کار
    dynamic = false,

    customRenderers = {},
    title,
    titleBtnAdd,
    funcBtnAdd,
}) => {
    const pageRange = 3;
    const [pages, setPages] = useState([]);

    // State های مربوط به سورت (برای حالت استاتیک)
    const [sortConfig, setSortConfig] = useState(defaultSort);

    // State های مربوط به سرچ (برای حالت استاتیک)
    const [localSearchTerm, setLocalSearchTerm] = useState('');
    const [localCurrentPage, setLocalCurrentPage] = useState(1);

    // Debounce timeout
    let timeout;

    // ================ اول: فیلتر کردن دیتا ================
    const filteredData = useMemo(() => {
        if (dynamic) return tableData || [];

        if (!localSearchTerm.trim()) return tableData || [];

        return (tableData || []).filter(item => {
            return dataInfo.some(column => {
                if (column.searchable === false) return false;

                let value = '';
                if (column.field) {
                    value = String(item[column.field] || '').toLowerCase();
                } else if (column.elements && column.searchable !== false) {
                    if (column.getSearchText) {
                        value = String(column.getSearchText(item)).toLowerCase();
                    } else {
                        return false;
                    }
                }

                return value.includes(localSearchTerm.toLowerCase());
            });
        });
    }, [tableData, localSearchTerm, dynamic, dataInfo]);

    // ================ دوم: سورت کردن دیتا ================
    const filteredAndSortedData = useMemo(() => {
        if (dynamic) return filteredData;

        if (!sortConfig.key || !sortable) return filteredData;

        return [...filteredData].sort((a, b) => {
            let aValue, bValue;

            const column = dataInfo.find(col => col.sortKey === sortConfig.key || col.field === sortConfig.key);

            if (column?.field) {
                aValue = a[column.field];
                bValue = b[column.field];
            } else if (column?.getSortValue) {
                aValue = column.getSortValue(a);
                bValue = column.getSortValue(b);
            } else {
                return 0;
            }

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
            }

            const aStr = String(aValue || '').toLowerCase();
            const bStr = String(bValue || '').toLowerCase();

            if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filteredData, sortConfig, dynamic, sortable, dataInfo]);

    // ================ سوم: صفحه‌بندی دیتا ================
    const paginatedData = useMemo(() => {
        if (dynamic) return tableData || [];

        const startIndex = (localCurrentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredAndSortedData.slice(startIndex, endIndex);
    }, [dynamic, filteredAndSortedData, localCurrentPage, itemsPerPage, tableData]);

    // ================ چهارم: محاسبه صفحات (بعد از همه محاسبات) ================
    useEffect(() => {
        if (dynamic && pageCount) {
            let pArr = [];
            for (let i = 1; i <= pageCount; i++) pArr.push(i);
            setPages(pArr);
        } else if (!dynamic) {
            let pArr = [];
            const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
            for (let i = 1; i <= totalPages; i++) pArr.push(i);
            setPages(pArr);
        }
    }, [dynamic, pageCount, filteredAndSortedData.length, itemsPerPage]);

    // ================ منطق هندلرها ================
    const handleSetSearchChar = (char) => {
        if (dynamic) {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                handleSearch(char);
            }, 2000);
        } else {
            setLocalSearchTerm(char);
            setLocalCurrentPage(1);
        }
    };

    const handleSort = (key) => {
        if (!sortable || dynamic) return;

        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handlePageChange = (page) => {
        if (dynamic) {
            setCurrentPage(page);
        } else {
            setLocalCurrentPage(page);
        }
    };

    const renderCellValue = (rowData, column) => {
        if (column.field) {
            return rowData[column.field];
        } else if (column.elements) {
            return column.elements(rowData);
        }
        return null;
    };

    // محاسبه اطلاعات صفحه‌بندی برای نمایش
    const getPaginationInfo = () => {
        if (dynamic) {
            return {
                start: ((currentPage - 1) * itemsPerPage) + 1,
                end: Math.min(currentPage * itemsPerPage, tableData?.length || 0),
                total: tableData?.length || 0
            };
        } else {
            const start = ((localCurrentPage - 1) * itemsPerPage) + 1;
            const end = Math.min(localCurrentPage * itemsPerPage, filteredAndSortedData.length);
            return {
                start: filteredAndSortedData.length === 0 ? 0 : start,
                end: end,
                total: filteredAndSortedData.length
            };
        }
    };

    // تعیین دیتای نهایی برای نمایش
    const displayData = dynamic ? (tableData || []) : paginatedData;
    const displayLoading = dynamic ? loading : false;
    const displayCurrentPage = dynamic ? currentPage : localCurrentPage;
    const paginationInfo = getPaginationInfo();

    // پاک کردن timeout هنگام unmount
    useEffect(() => {
        return () => {
            if (timeout) clearTimeout(timeout);
        };
    }, []);

    return (
        <div className="p-4 bg-white rounded-md border border-gray-300">
            {/* هدر جدول با سرچ */}
            <div className="flex flex-row justify-between items-center mb-4 gap-3 select-none">
                <div className="flex gap-3 items-center">
                    <h2 className="text-lg font-semibold text-custom-blue">{title || 'لیست معمولی'}</h2>
                    {/* {children} */}
                </div>
                <div className="flex items-center gap-2">
                    {/* <button className="flex justify-center items-center p-2 gap-1 bg-blue-50 hover:bg-blue-100 text-custom-blue border-[1.4px] border-custom-blue text-[19px] rounded-md transition cursor-pointer">
                        <i class="fa-regular fa-plus"></i>
                        <span>افزون</span>
                    </button> */}
                    <button onClick={funcBtnAdd} className="flex justify-center items-center py-[5px] px-[11px] gap-1 bg-blue-50 hover:bg-blue-100 text-custom-blue border-[1.4px] border-custom-blue text-[18px] rounded-md transition cursor-pointer">
                        <i className="fa-regular fa-plus"></i>
                        <span className="text-[16px]">{titleBtnAdd || 'افزودن'}</span>
                    </button>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder={searchParams?.placeholder || "جستجو..."}
                            value={dynamic ? searchParams?.value || '' : localSearchTerm}
                            onChange={(e) => handleSetSearchChar(e.target.value)}
                            className="pr-8 pl-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-blue focus:border-transparent text-sm w-full md:w-64"
                        />
                        <svg className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 fill-transparent">
                            <use xlinkHref="#icon-search"></use>
                        </svg>
                    </div>
                </div>
            </div>

            {/* نمایش لودینگ یا دیتا */}
            {displayLoading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-custom-blue"></div>
                </div>
            ) : displayData.length ? (
                <div className="overflow-x-auto scroll-content">
                    <table className="min-w-full divide-y divide-gray-200 select-none table-fixed">
                        <thead className="bg-gray-50">
                            <tr>
                                {dataInfo.map((col, index) => (
                                    <th
                                        key={col.field || `notField__${index}`}
                                        className={`px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider ${col.sortable !== false && sortable && !dynamic ? 'cursor-pointer hover:bg-gray-100 transition' : ''}`}
                                        style={{ width: col.width || 'auto' }}
                                        onClick={() => col.sortable !== false && sortable && !dynamic && handleSort(col.sortKey || col.field)}
                                    >
                                        <div className="flex items-center gap-1 justify-start">
                                            {col.title}
                                            {!dynamic && sortable && col.sortable !== false && sortConfig.key === (col.sortKey || col.field) && (
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    {sortConfig.direction === 'asc' ?
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /> :
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    }
                                                </svg>
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {displayData.map((row) => (
                                <tr key={row.id} className="hover:bg-teal-50 transition duration-150">
                                    {dataInfo.map((col, idx) => (
                                        <td key={`${col.field || col.title}_${row.id}_${idx}`} style={{ width: col.width || 'auto' }} className="px-4 py-3 whitespace-nowrap">
                                            {renderCellValue(row, col)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-12">
                    <h5 className="text-center my-5 text-red-500">هیچ رکوردی یافت نشد</h5>
                </div>
            )}

            {/* صفحه‌بندی */}
            {pages.length > 1 && (
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200 select-none">
                    <div className="text-sm text-gray-500">
                        نمایش {paginationInfo.start} تا {paginationInfo.end} از {paginationInfo.total} کاربر
                    </div>
                    <nav aria-label="Page navigation" dir="ltr" className="flex gap-1">
                        <button
                            className={`flex items-center justify-center w-9 h-9 rounded-md border transition cursor-pointer ${displayCurrentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-custom-blue border-gray-300 hover:bg-blue-50'}`}
                            onClick={() => handlePageChange(displayCurrentPage - 1)}
                            disabled={displayCurrentPage === 1}
                        >
                            <svg className="w-[22px] h-[22px] fill-transparent">
                                <use xlinkHref="#icon-alt-arrow-left"></use>
                            </svg>
                        </button>

                        {displayCurrentPage > pageRange && (
                            <button
                                className="w-9 h-9 rounded-md border bg-white text-gray-700 border-gray-300 hover:bg-blue-50 transition cursor-pointer"
                                onClick={() => handlePageChange(1)}
                            >
                                1
                            </button>
                        )}

                        {pages.map((page) => {
                            return page < displayCurrentPage + pageRange && page > displayCurrentPage - pageRange ? (
                                <button
                                    key={page}
                                    className={`w-9 h-9 rounded-md border transition cursor-pointer ${displayCurrentPage === page
                                        ? 'bg-custom-blue text-white border-custom-blue'
                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'
                                        }`}
                                    onClick={() => handlePageChange(page)}
                                >
                                    {page}
                                </button>
                            ) : null;
                        })}

                        {displayCurrentPage <= pages.length - pageRange && (
                            <button
                                className="w-9 h-9 rounded-md border bg-white text-gray-700 border-gray-300 hover:bg-blue-50 transition cursor-pointer"
                                onClick={() => handlePageChange(pages.length)}
                            >
                                {pages.length}
                            </button>
                        )}

                        <button
                            className={`flex items-center justify-center w-9 h-9 rounded-md border transition cursor-pointer ${displayCurrentPage === pages.length ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-custom-blue border-gray-300 hover:bg-blue-50'}`}
                            onClick={() => handlePageChange(displayCurrentPage + 1)}
                            disabled={displayCurrentPage === pages.length}
                        >
                            <svg className="w-[22px] h-[22px] fill-transparent">
                                <use xlinkHref="#icon-alt-arrow-right"></use>
                            </svg>
                        </button>
                    </nav>
                </div>
            )}
        </div>
    );
};

export default PaginatedDataTable2;