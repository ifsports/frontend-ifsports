export interface TableColumn {
  key: string;
  header: string;
  width?: string;
  render?: (row: RowData, rowIndex: number, onRowAction?: (actionType: string, row: RowData, rowIndex: number) => void) => React.ReactNode;
}

export type RowData = Record<string, any>;