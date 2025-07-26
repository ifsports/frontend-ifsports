import React from 'react';
import { TableColumn } from '@/types/table';

export interface TableHeaderProps {
  columns: TableColumn[];
}

export default function TableHeader({ columns }: TableHeaderProps) {
  return (
    <thead className='bg-[#F9FAFB] '>
      <tr className="border border-[#E2E8F0] overflow-hidden">
        {columns.map((column) => (
          <th
            key={column.key}
            className={`
              py-3 px-4 text-left font-semibold text-[#9CA3AF]
              text-md
              ${column.key === 'actions' ? 'text-right' : ''} 
              ${column.width ? `w-[${column.width.replace('fr', '')}fr]` : ''} 
            `}
            style={{
                width: column.width ? (column.width === '2fr' ? '40%' : '20%') : undefined
            }}
          >
            {column.header}
          </th>
        ))}
      </tr>
    </thead>
  );
}