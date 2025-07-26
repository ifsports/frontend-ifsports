import type { RowData, TableColumn } from "@/types/table";
import TableCell from "./table-cell";

export interface TableRowProps {
  row: RowData;
  rowIndex: number;
  columns: TableColumn[];
  onRowAction?: (actionType: string, row: RowData, rowIndex: number) => void;
  gridCols: string;
  isLast: boolean;
}

export default function TableRow ({ row, rowIndex, columns, onRowAction, gridCols, isLast }: TableRowProps) {
  return (
    <tr className={`grid ${gridCols} gap-16 py-4 px-4 text-gray-900 ${
      !isLast ? 'border-b border-gray-300' : ''
    }`}>
      {columns.map((column, colIndex) => (
        <TableCell
          key={colIndex}
          column={column}
          row={row}
          rowIndex={rowIndex}
          onRowAction={onRowAction}
        />
      ))}
    </tr>
  );
};