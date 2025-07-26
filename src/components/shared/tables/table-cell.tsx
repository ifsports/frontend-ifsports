import type { RowData, TableColumn } from "@/types/table";

export interface TableCellProps {
  column: TableColumn;
  row: RowData;
  rowIndex: number;
  onRowAction?: (actionType: string, row: RowData, rowIndex: number) => void;
}

export default function TableCell ({ column, row, rowIndex, onRowAction }: TableCellProps) {
  const renderContent = () => {
    if (column.render) {
      return column.render(row, rowIndex, onRowAction);
    }
    
    if (column.key) {
      return row[column.key];
    }
    
    return null;
  };

  return (
    <td className="w-full flex gap-2 items-center text-left">
      {renderContent()}
    </td>
  );
};