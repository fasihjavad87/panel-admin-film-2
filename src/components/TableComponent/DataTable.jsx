// components/DataTable.jsx
import TableRow from "./TableRow";
import TableHeaderColumn from "./TableHeaderColumn";

const DataTable = ({
    columns,
    data,
    sortable,
    dynamic,
    sortConfig,
    onSort,

    selectable,
    selectedRows,
    onSelectRow,
    onSelectAll
}) => {
    if (!data || data.length === 0) {
        return (
            <div className="text-center py-12">
                <h5 className="text-center my-5 text-red-500">
                    هیچ رکوردی یافت نشد
                </h5>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto scroll-content">
            <table className="min-w-full divide-y divide-gray-200 select-none table-fixed">
                <thead className="bg-gray-50">
                    <tr>
                        {selectable && (
                            <th className="px-4 py-3 w-[60px]">
                                <label  className="flex items-center cursor-pointer relative group">
                                    <input
                                        type="checkbox"
                                        onChange={onSelectAll}
                                        className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded group-hover:shadow-md border border-slate-300 checked:bg-custom-blue checked:border-custom-blue"
                                        checked={
                                            data.length > 0 &&
                                            data.every(row =>
                                                selectedRows.includes(row.id)
                                            )
                                        }
                                    />
                                    <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                        </svg>
                                    </span>
                                </label>
                            </th>
                        )}
                        {columns.map((col, index) => (
                            <TableHeaderColumn
                                key={col.field || `header_${index}`}
                                column={col}
                                index={index}
                                sortable={sortable}
                                dynamic={dynamic}
                                sortConfig={sortConfig}
                                onSort={onSort}
                            />
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((row) => (
                        <TableRow
                            key={row.id}
                            row={row}
                            columns={columns}
                            rowId={row.id}

                            selectable={selectable}
                            selected={selectedRows.includes(row.id)}
                            onSelectRow={onSelectRow}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;