'use client'

import { Eye, Pencil, Trash2 } from 'lucide-react'

type Column<T> = {
  key: keyof T | 'actions'
  label: string
  render?: (row: T) => React.ReactNode
}

type CrudTableProps<T> = {
  columns: Column<T>[]
  data: T[]
}

export default function CrudTable<T extends { id: number }>({
  columns,
  data,
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
        {data.map(row => (
          <tr key={row.id}>
            {columns.map(col => (
              <td key={String(col.key)} style={td}>
                {col.key === 'actions' ? (
                  <div style={actions}>
                    <Eye size={16} />
                    <Pencil size={16} />
                    <Trash2 size={16} />
                  </div>
                ) : col.render ? (
                  col.render(row)
                ) : (
                  String(row[col.key])
                )}
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
  borderCollapse: 'collapse' as const,
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
  borderBottom: '1px solid #e1e6ef',
  fontSize: 14,
}

const actions = {
  display: 'flex',
  gap: 10,
  cursor: 'pointer',
}
