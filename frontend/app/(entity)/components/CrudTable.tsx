'use client'

import React from 'react'

type Column<T> = {
  key: keyof T | 'actions'
  label: string
  render?: (row: T) => React.ReactNode
}

type CrudTableProps<T> = {
  columns: Column<T>[]
  data: T[]
  rowKey?: (row: T, index: number) => string | number
}

export default function CrudTable<T extends Record<string, any>>({
  columns,
  data,
  rowKey,
}: CrudTableProps<T>) {
  return (
    <table style={table}>
      <thead>
        <tr>
          {columns.map(col => (
            <th key={String(col.key)} style={th}>
              {col.label}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.map((row, index) => (
          <tr
            key={
              rowKey
                ? rowKey(row, index)
                : `${row.user_id ?? 'row'}-${index}`
            }
          >
            {columns.map(col => (
              <td key={String(col.key)} style={td}>
                {col.render
                  ? col.render(row)
                  : col.key === 'actions'
                  ? null
                  : row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

/* ===== styles ===== */

const table = {
  width: '100%',
  borderCollapse: 'collapse',
}

const th = {
  textAlign: 'left' as const,
  padding: '10px 12px',
  background: '#0b1a3a',
  color: '#fff',
  fontWeight: 600,
}

const td = {
  padding: '10px 12px',
  borderBottom: '1px solid #e5e7eb',
  fontSize: 14,
}
