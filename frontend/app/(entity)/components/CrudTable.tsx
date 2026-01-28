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
            style={{
              background:
                index % 2 === 0 ? '#eef2f7' : '#ffffff',
              transition: 'background 120ms ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#e0e7ff'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background =
                index % 2 === 0 ? '#eef2f7' : '#ffffff'
            }}
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
  borderRadius: 10,
  overflow: 'hidden',
}

const th = {
  textAlign: 'left' as const,
  padding: '11px 14px',
  background: 'linear-gradient(180deg, #0b1a3a, #0a1630)',
  color: '#fff',
  fontWeight: 600,
  fontSize: 14,
}

const td = {
  padding: '11px 14px',
  borderBottom: '1px solid #dbe0ea',
  fontSize: 14,
  color: '#111827',
}
