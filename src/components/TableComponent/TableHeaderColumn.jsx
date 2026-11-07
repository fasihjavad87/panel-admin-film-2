// components/TableHeaderColumn.jsx
const TableHeaderColumn = ({
    column,
    index,
    sortable,
    dynamic,
    sortConfig,
    onSort
}) => {
    const isSortable = column.sortable !== false && sortable && !dynamic;
    const isSorted = !dynamic && sortable && column.sortable !== false &&
        sortConfig.key === (column.sortKey || column.field);

    return (
        <th
            key={column.field || `notField__${index}`}
            className={`px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider ${isSortable ? 'cursor-pointer hover:bg-gray-100 transition' : ''
                }`}
            style={{ width: column.width || 'auto' }}
            onClick={() => isSortable && onSort(column.sortKey || column.field)}
        >
            <div className="flex items-center gap-1 justify-start">
                {column.title}
                {isSorted && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {sortConfig.direction === 'asc' ?
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /> :
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        }
                    </svg>
                )}
            </div>
        </th>
    );
};

export default TableHeaderColumn;