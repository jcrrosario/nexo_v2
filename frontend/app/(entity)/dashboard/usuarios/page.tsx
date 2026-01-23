'use client'

import { useState } from 'react'
import { FileText, FileSpreadsheet, Plus } from 'lucide-react'
import CrudLayout from '../../components/CrudLayout'
import CrudTable from '../../components/CrudTable'
import CrudPagination from '../../components/CrudPagination'

type Usuario = {
  id: number
  nome: string
  email: string
  status: 'Ativo' | 'Inativo'
}

const MOCK: Usuario[] = [
  { id: 1, nome: 'Jean Rosario', email: 'jean@nexo.com', status: 'Ativo' },
  { id: 2, nome: 'Maria Silva', email: 'maria@nexo.com', status: 'Ativo' },
  { id: 3, nome: 'Carlos Souza', email: 'carlos@nexo.com', status: 'Inativo' },
]

export default function UsuariosPage() {
  const [busca, setBusca] = useState('')
  const [page, setPage] = useState(1)

  const pageSize = 5

  const filtrados = MOCK.filter(
    u =>
      u.nome.toLowerCase().includes(busca.toLowerCase()) ||
      u.email.toLowerCase().includes(busca.toLowerCase())
  )

  const inicio = (page - 1) * pageSize
  const fim = page * pageSize
  const dadosPagina = filtrados.slice(inicio, fim)

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
        columns={[
          { key: 'nome', label: 'Nome' },
          { key: 'email', label: 'E-mail' },
          {
            key: 'status',
            label: 'Status',
            render: u => (
              <span
                style={{
                  padding: '4px 10px',
                  borderRadius: 12,
                  fontSize: 12,
                  fontWeight: 500,
                  background:
                    u.status === 'Ativo' ? '#e7f6ec' : '#fdecea',
                  color:
                    u.status === 'Ativo' ? '#1e7e34' : '#c62828',
                }}
              >
                {u.status}
              </span>
            ),
          },
          { key: 'actions', label: 'Ações' },
        ]}
        data={dadosPagina}
      />

      <CrudPagination
        page={page}
        total={filtrados.length}
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
