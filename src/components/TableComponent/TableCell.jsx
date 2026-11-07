// components/TableCell.jsx
const TableCell = ({ column, rowData, width }) => {
    const renderCellValue = () => {
        if (column.field) {
            return rowData[column.field];
        } else if (column.elements) {
            return column.elements(rowData);
        }
        return null;
    };

    return (
        <td
            style={{ width: width || 'auto' }}
            className="px-4 py-3 whitespace-nowrap"
        >
            {renderCellValue()}
        </td>
    );
};

export default TableCell;