'use client'

import { useEffect, useState } from 'react'
import { FileText, FileSpreadsheet, Plus, X } from 'lucide-react'
import CrudLayout from '../../components/CrudLayout'
import CrudTable from '../../components/CrudTable'
import CrudPagination from '../../components/CrudPagination'
import { api } from '@/lib/api'

type Usuario = {
  user_id: string
  nome: string
  email: string
  perfil: 'Administrador' | 'Usuario'
  ativo: 'Sim' | 'Não'
}

export default function UsuariosPage() {
  const [dados, setDados] = useState<Usuario[]>([])
  const [busca, setBusca] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [open, setOpen] = useState(false)

  const [form, setForm] = useState<any>({
    user_id: '',
    nome: '',
    email: '',
    senha: '',
    perfil: 'Usuario',
    ativo: 'Sim',
    foto: null,
  })

  const pageSize = 5

  async function carregar() {
    const res = await api.get(
      `/entity/usuarios?page=${page}&limit=${pageSize}&search=${busca}`,
    )
    setDados(res.data)
    setTotal(res.total)
  }

  useEffect(() => {
    carregar()
  }, [page, busca])

  async function salvar() {
    await api.post('/entity/usuarios', form)
    setOpen(false)
    setForm({
      user_id: '',
      nome: '',
      email: '',
      senha: '',
      perfil: 'Usuario',
      ativo: 'Sim',
      foto: null,
    })
    carregar()
  }

  return (
    <CrudLayout
      title="Usuários"
      subtitle="Gerencie os usuários do sistema"
      actions={
        <div style={actions}>
          <button style={btnDark}><FileText size={16} /> PDF</button>
          <button style={btnExcel}><FileSpreadsheet size={16} /> Excel</button>
          <button style={btnPrimary} onClick={() => setOpen(true)}>
            <Plus size={16} /> Novo usuário
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
            key: 'ativo',
            label: 'Status',
            render: u => (
              <span style={u.ativo === 'Sim' ? badgeAtivo : badgeInativo}>
                {u.ativo === 'Sim' ? 'Ativo' : 'Inativo'}
              </span>
            ),
          },
          { key: 'actions', label: 'Ações' },
        ]}
        data={dados}
      />

      <CrudPagination
        page={page}
        total={total}
        pageSize={pageSize}
        onPageChange={setPage}
      />

      {/* MODAL */}
      {open && (
        <div style={overlay}>
          <div style={modal}>
            <div style={modalHeader}>
              <h2>Novo usuário</h2>
              <X onClick={() => setOpen(false)} style={{ cursor: 'pointer' }} />
            </div>

            <div style={grid}>
              <input placeholder="Usuário" onChange={e => setForm({ ...form, user_id: e.target.value })} style={input} />
              <input placeholder="Nome" onChange={e => setForm({ ...form, nome: e.target.value })} style={input} />
              <input placeholder="E-mail" onChange={e => setForm({ ...form, email: e.target.value })} style={input} />
              <input placeholder="Senha" type="password" onChange={e => setForm({ ...form, senha: e.target.value })} style={input} />

              <select onChange={e => setForm({ ...form, perfil: e.target.value })} style={input}>
                <option value="Usuario">Usuário</option>
                <option value="Administrador">Administrador</option>
              </select>

              <select onChange={e => setForm({ ...form, ativo: e.target.value })} style={input}>
                <option value="Sim">Ativo</option>
                <option value="Não">Inativo</option>
              </select>

              <input type="file" style={input} />
            </div>

            <div style={modalFooter}>
              <button style={btnCancel} onClick={() => setOpen(false)}>Cancelar</button>
              <button style={btnPrimary} onClick={salvar}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </CrudLayout>
  )
}

/* ===== styles ===== */

const search = {
  width: 280,
  padding: '8px 12px',
  borderRadius: 6,
  border: '1px solid #d1d5db',
  marginBottom: 16,
}

const actions = { display: 'flex', gap: 10 }

const btnPrimary = { background: '#16a34a', color: '#fff', padding: '8px 14px', borderRadius: 6, border: 'none' }
const btnExcel = { background: '#166534', color: '#fff', padding: '8px 14px', borderRadius: 6, border: 'none' }
const btnDark = { background: '#0b1a3a', color: '#fff', padding: '8px 14px', borderRadius: 6, border: 'none' }
const btnCancel = { background: '#e5e7eb', padding: '8px 14px', borderRadius: 6, border: 'none' }

const badgeAtivo = { background: '#e7f6ec', color: '#1e7e34', padding: '4px 10px', borderRadius: 12 }
const badgeInativo = { background: '#fdecea', color: '#c62828', padding: '4px 10px', borderRadius: 12 }

const overlay = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.4)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}

const modal = {
  background: '#fff',
  borderRadius: 12,
  width: 520,
  padding: 24,
}

const modalHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 16,
}

const grid = {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: 12,
}

const input = {
  padding: '10px 12px',
  borderRadius: 6,
  border: '1px solid #d1d5db',
  fontSize: 14,
}

const modalFooter = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 10,
  marginTop: 20,
}
