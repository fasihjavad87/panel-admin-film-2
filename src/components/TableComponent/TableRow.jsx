// components/TableRow.jsx
import TableCell from "./TableCell";

const TableRow = ({ row, columns, rowId, selectable, selected, onSelectRow }) => {
    return (
        <tr key={rowId} className="hover:bg-teal-50 transition duration-150">
            {selectable && (
                <td className="px-4 py-3">
                    <label className="flex items-center cursor-pointer relative group">
                        <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => onSelectRow(rowId)}
                            className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded group-hover:shadow-md border border-slate-300 checked:bg-custom-blue checked:border-custom-blue"
                        />
                        <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                            </svg>
                        </span>
                    </label>
                </td>
            )}
            {columns.map((col, idx) => (
                <TableCell
                    key={`${col.field || col.title}_${rowId}_${idx}`}
                    column={col}
                    rowData={row}
                    width={col.width}
                />
            ))}
        </tr>
    );
};

export default TableRow;