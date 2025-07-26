import type { RowData, TableColumn } from "@/types/table";
import TableHeader from "./table-header";
import TableBody from "./table-body";

export interface DataTableProps {
  columns: TableColumn[];
  data: RowData[];
  onRowAction?: (actionType: string, row: RowData, rowIndex: number) => void;
  className?: string;
  responsive?: boolean;
}

export default function DataTable({ columns, data, onRowAction, className = "", responsive = true }: DataTableProps) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className={`font-sans text-sm w-full mt-5 border-collapse table-auto ${responsive ? 'min-w-[47rem]' : ''}`}>
        <TableHeader columns={columns} />
        <TableBody
          columns={columns}
          data={data}
          onRowAction={onRowAction}
        />
      </table>
    </div>
  );
};