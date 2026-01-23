'use client'

type Props = {
  page: number
  total: number
  pageSize: number
  onPageChange: (page: number) => void
}

export default function CrudPagination({
  page,
  total,
  pageSize,
  onPageChange,
}: Props) {
  if (total === 0) return null

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  const inicio = (page - 1) * pageSize + 1
  const fim = Math.min(page * pageSize, total)

  return (
    <div style={container}>
      <span>
        Exibindo {inicio}–{fim} de {total}
      </span>

      <div style={pager}>
        <button
          style={{
            ...pagerBtn,
            ...(page === 1 ? pagerDisabled : {}),
          }}
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          Anterior
        </button>

        <button style={pagerActive}>{page}</button>

        <button
          style={{
            ...pagerBtn,
            ...(page === totalPages ? pagerDisabled : {}),
          }}
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Próximo
        </button>
      </div>
    </div>
  )
}

/* ===== styles ===== */

const container = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 16,
  fontSize: 13,
  color: '#4b5563',
}

const pager = {
  display: 'flex',
  gap: 6,
}

const pagerBtn = {
  padding: '6px 12px',
  borderRadius: 6,
  border: '1px solid #d1d5db',
  background: '#fff',
  cursor: 'pointer',
}

const pagerActive = {
  padding: '6px 12px',
  borderRadius: 6,
  background: '#2563eb',
  color: '#fff',
  border: 'none',
  fontWeight: 600,
}

const pagerDisabled = {
  opacity: 0.5,
  cursor: 'not-allowed',
}
