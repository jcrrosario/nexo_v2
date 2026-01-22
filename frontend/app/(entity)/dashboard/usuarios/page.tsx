'use client'

import { useState } from 'react'
import CrudLayout from '../../components/CrudLayout'
import CrudTable from '../../components/CrudTable'

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

  const filtrados = MOCK.filter(
    u =>
      u.nome.toLowerCase().includes(busca.toLowerCase()) ||
      u.email.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <CrudLayout
      title="Usuários"
      subtitle="Gerencie os usuários do sistema"
      actions={
        <button style={btnNovo}>+ Novo usuário</button>
      }
    >
      <input
        placeholder="Buscar usuário..."
        value={busca}
        onChange={e => setBusca(e.target.value)}
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
        data={filtrados}
      />
    </CrudLayout>
  )
}

/* ===== styles ===== */

const search = {
  width: 260,
  padding: '8px 10px',
  marginBottom: 16,
  borderRadius: 6,
  border: '1px solid #ccc',
}

const btnNovo = {
  background: '#16a34a',
  color: '#fff',
  padding: '8px 14px',
  borderRadius: 6,
  border: 'none',
  cursor: 'pointer',
}
