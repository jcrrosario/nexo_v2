'use client'

import { useEffect, useState } from 'react'
import { FileText, FileSpreadsheet, Plus } from 'lucide-react'
import CrudLayout from '../../components/CrudLayout'
import CrudTable from '../../components/CrudTable'
import CrudPagination from '../../components/CrudPagination'
import { api } from '@/lib/api'

type Usuario = {
  user_id: string
  nome: string
  email: string
  ativo: 'Sim' | 'Não'
}

export default function UsuariosPage() {
  const [busca, setBusca] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize] = useState(5)

  const [data, setData] = useState<Usuario[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  async function carregarUsuarios() {
    setLoading(true)
    try {
      const res = await api.get(
        `/entity/usuarios?page=${page}&limit=${pageSize}&search=${busca}`,
      )

      setData(res.data)
      setTotal(res.total)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarUsuarios()
  }, [page, busca])

  return (
    <CrudLayout
      title="Usuários"
      subtitle="Gerencie os usuários do sistema"
      actions={
        <div style={actionsBar}>
          <button style={btnPdf}>
            <FileText size={16} />
            PDF
          </button>

          <button style={btnExcel}>
            <FileSpreadsheet size={16} />
            Excel
          </button>

          <button style={btnNovo}>
            <Plus size={16} />
            Novo usuário
          </button>
        </div>
      }
    >
      <input
        placeholder="Buscar usuário..."
        value={busca}
        onChange={e => {
          setBusca(e.target.value)
          setPage(1)
        }}
        style={search}
      />

      <CrudTable
        loading={loading}
        columns={[
          { key: 'nome', label: 'Nome' },
          { key: 'email', label: 'E-mail' },
          {
            key: 'ativo',
            label: 'Status',
            render: u => (
              <span
                style={{
                  padding: '4px 10px',
                  borderRadius: 12,
                  fontSize: 12,
                  fontWeight: 500,
                  background:
                    u.ativo === 'Sim' ? '#e7f6ec' : '#fdecea',
                  color:
                    u.ativo === 'Sim' ? '#1e7e34' : '#c62828',
                }}
              >
                {u.ativo === 'Sim' ? 'Ativo' : 'Inativo'}
              </span>
            ),
          },
          { key: 'actions', label: 'Ações' },
        ]}
        data={data}
      />

      <CrudPagination
        page={page}
        total={total}
        pageSize={pageSize}
        onPageChange={setPage}
      />
    </CrudLayout>
  )
}

/* ===== styles ===== */

const search = {
  width: 280,
  padding: '8px 12px',
  marginBottom: 16,
  borderRadius: 6,
  border: '1px solid #d1d5db',
  fontSize: 14,
}

const actionsBar = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
}

const baseBtn = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: '8px 14px',
  borderRadius: 6,
  fontSize: 14,
  border: 'none',
  cursor: 'pointer',
}

const btnPdf = {
  ...baseBtn,
  background: '#0b1a3a',
  color: '#fff',
}

const btnExcel = {
  ...baseBtn,
  background: '#166534',
  color: '#fff',
}

const btnNovo = {
  ...baseBtn,
  background: '#16a34a',
  color: '#fff',
}
