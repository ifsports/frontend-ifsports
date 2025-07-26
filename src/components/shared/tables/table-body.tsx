import React from 'react';
import { TableColumn, RowData } from '@/types/table';

export interface TableBodyProps {
  columns: TableColumn[];
  data: RowData[];
  onRowAction?: (actionType: string, row: RowData, rowIndex: number) => void;
}

export default function TableBody({ columns, data, onRowAction }: TableBodyProps) {
  const isLastRow = (index: number) => index === data.length - 1;

  return (
    <tbody>
      {data.map((row, rowIndex) => (
        <tr
          key={rowIndex}
          className={`
            ${!isLastRow(rowIndex) ? 'border-b border-[#E2E8F0]' : ''}
          `}
        >
          {columns.map((column) => (
            <td
              key={`${column.key}-${rowIndex}`}
              className={`
                py-3 px-4 text-sm text-gray-800 whitespace-nowrap
                ${column.key === 'actions' ? 'text-right' : 'text-left'}
              `}
              style={{
                  width: column.width ? (column.width === '2fr' ? '40%' : '20%') : undefined
              }}
            >
              {column.render ? column.render(row, rowIndex, onRowAction) : row[column.key]}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}