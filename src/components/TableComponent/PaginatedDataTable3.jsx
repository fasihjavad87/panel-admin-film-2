// components/PaginatedDataTable2.jsx
import React, { useEffect, useState, useMemo } from "react";
import TableHeader from "./TableHeader";
import DataTable from "./DataTable";
import Pagination from "./Pagination";
import LoadingSpinner from "./LoadingSpinner";

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
    showCountPage = true,
    paginationInfo = null,

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

    selectable = false,
    selectedRows = [],
    onSelectionChange,
}) => {
    // State های مربوط به سورت (برای حالت استاتیک)
    const [sortConfig, setSortConfig] = useState(defaultSort);

    // State های مربوط به سرچ (برای حالت استاتیک)
    const [localSearchTerm, setLocalSearchTerm] = useState('');
    const [localCurrentPage, setLocalCurrentPage] = useState(1);

    // Debounce timeout
    // let timeout;
    const timeoutRef = React.useRef(null);

    // ================ منطق فیلتر، سورت و صفحه‌بندی ================
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

    const filteredAndSortedData = useMemo(() => {
        if (dynamic) return filteredData;
        if (!sortConfig.key || !sortable) return filteredData;

        return [...filteredData].sort((a, b) => {
            let aValue, bValue;

            const column = dataInfo.find(col =>
                col.sortKey === sortConfig.key || col.field === sortConfig.key
            );

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

    const paginatedData = useMemo(() => {
        if (dynamic) return tableData || [];
        const startIndex = (localCurrentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredAndSortedData.slice(startIndex, endIndex);
    }, [dynamic, filteredAndSortedData, localCurrentPage, itemsPerPage, tableData]);

    // محاسبه صفحات
    const totalPages = dynamic
        ? pageCount
        : Math.ceil(filteredAndSortedData.length / itemsPerPage);

    // ================ هندلرها ================
    const handleSetSearchChar = (char) => {
        if (dynamic) {
            // clearTimeout(timeout);
            // timeout = setTimeout(() => {
            //     handleSearch(char);
            // }, 2000);
            clearTimeout(timeoutRef.current);

            timeoutRef.current = setTimeout(() => {
                handleSearch(char);
            }, 500);
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

    // const getPaginationInfo = () => {
    //     if (dynamic) {
    //         return {
    //             start: ((currentPage - 1) * itemsPerPage) + 1,
    //             end: Math.min(currentPage * itemsPerPage, tableData?.length || 0),
    //             total: tableData?.length || 0
    //         };
    //     } else {
    //         const start = ((localCurrentPage - 1) * itemsPerPage) + 1;
    //         const end = Math.min(localCurrentPage * itemsPerPage, filteredAndSortedData.length);
    //         return {
    //             start: filteredAndSortedData.length === 0 ? 0 : start,
    //             end: end,
    //             total: filteredAndSortedData.length
    //         };
    //     }
    // };

    const calculatedPaginationInfo = dynamic
        ? (paginationInfo || {
            start: 0,
            end: 0,
            total: 0
        })
        : {
            start:
                filteredAndSortedData.length === 0
                    ? 0
                    : ((localCurrentPage - 1) * itemsPerPage) + 1,
            end: Math.min(
                localCurrentPage * itemsPerPage,
                filteredAndSortedData.length
            ),
            total: filteredAndSortedData.length
        };

    // تعیین دیتای نهایی برای نمایش
    const displayData = dynamic ? (tableData || []) : paginatedData;
    const displayCurrentPage = dynamic ? currentPage : localCurrentPage;
    // const paginationInfo = getPaginationInfo();
    const finalPaginationInfo = calculatedPaginationInfo;



    //قسمت CheckBox Select
    const isRowSelected = (rowId) => {
        return selectedRows.includes(rowId);
    };

    const handleSelectRow = (rowId) => {
        if (!onSelectionChange) return;

        if (selectedRows.includes(rowId)) {
            onSelectionChange(
                selectedRows.filter(id => id !== rowId)
            );
        } else {
            onSelectionChange([...selectedRows, rowId]);
        }
    };

    const handleSelectAll = () => {
        if (!onSelectionChange) return;

        const currentIds = displayData.map(item => item.id);

        const allSelected = currentIds.every(id =>
            selectedRows.includes(id)
        );

        if (allSelected) {
            onSelectionChange(
                selectedRows.filter(id => !currentIds.includes(id))
            );
        } else {
            onSelectionChange([
                ...new Set([
                    ...selectedRows,
                    ...currentIds
                ])
            ]);
        }
    };

    // پاک کردن timeout هنگام unmount
    useEffect(() => {
        return () => {
            // if (timeout) clearTimeout(timeout);
            clearTimeout(timeoutRef.current);
        };
    }, []);

    return (
        <div className="p-4 bg-white rounded-md border border-gray-300">
            <TableHeader
                title={title}
                titleBtnAdd={titleBtnAdd}
                funcBtnAdd={funcBtnAdd}
                searchParams={searchParams}
                searchValue={dynamic ? searchParams?.value || '' : localSearchTerm}
                onSearchChange={handleSetSearchChar}
                dynamic={dynamic}
            />

            {loading ? (
                <LoadingSpinner />
            ) : displayData.length ? (
                <DataTable
                    columns={dataInfo}
                    data={displayData}
                    sortable={sortable}
                    dynamic={dynamic}
                    sortConfig={sortConfig}
                    onSort={handleSort}

                    selectable={selectable}
                    selectedRows={selectedRows}
                    onSelectRow={handleSelectRow}
                    onSelectAll={handleSelectAll}
                />
            ) : (
                <div className="text-center py-12">
                    <h5 className="text-center my-5 text-red-500">
                        هیچ رکوردی یافت نشد
                    </h5>
                </div>
            )}

            {totalPages > 1 && (
                <Pagination
                    currentPage={displayCurrentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    paginationInfo={finalPaginationInfo}
                    showCountPage={showCountPage}
                />
            )}
        </div>
    );
};

export default PaginatedDataTable2;