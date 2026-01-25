'use client'

import { useEffect, useState, CSSProperties } from 'react'
import {
  FileText,
  FileSpreadsheet,
  Plus,
  X,
  Pencil,
  Trash2,
  Clock,
} from 'lucide-react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
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
  created_at: string
  updated_at: string
  user_id_log: string
}

export default function UsuariosPage() {
  const [dados, setDados] = useState<Usuario[]>([])
  const [busca, setBusca] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const [open, setOpen] = useState(false)
  const [editando, setEditando] = useState(false)
  const [confirmar, setConfirmar] = useState<Usuario | null>(null)
  const [logUsuario, setLogUsuario] = useState<Usuario | null>(null)

  const [form, setForm] = useState<any>({
    user_id: '',
    nome: '',
    email: '',
    senha: '',
    perfil: 'Usuario',
    ativo: 'Sim',
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

  function gerarPDF() {
    const doc = new jsPDF()

    doc.setFontSize(18)
    doc.text('Relatório de Usuários', 14, 20)

    doc.setFontSize(11)
    doc.setTextColor(100)
    doc.text(
      `Gerado em: ${new Date().toLocaleString()}`,
      14,
      28,
    )

    autoTable(doc, {
      startY: 36,
      head: [['Nome', 'E-mail', 'Perfil', 'Status']],
      body: dados.map(u => [
        u.nome,
        u.email,
        u.perfil,
        u.ativo === 'Sim' ? 'Ativo' : 'Inativo',
      ]),
      styles: {
        fontSize: 10,
        cellPadding: 6,
      },
      headStyles: {
        fillColor: [11, 26, 58],
        textColor: 255,
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250],
      },
    })

    const totalPages = doc.getNumberOfPages()

    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i)
      doc.setFontSize(9)
      doc.setTextColor(120)
      doc.text(
        `Página ${i} de ${totalPages}`,
        doc.internal.pageSize.width - 40,
        doc.internal.pageSize.height - 10,
      )
    }

    doc.save('usuarios.pdf')
  }

  function novoUsuario() {
    setForm({
      user_id: '',
      nome: '',
      email: '',
      senha: '',
      perfil: 'Usuario',
      ativo: 'Sim',
    })
    setEditando(false)
    setOpen(true)
  }

  function editarUsuario(usuario: Usuario) {
    setForm(usuario)
    setEditando(true)
    setOpen(true)
  }

  async function salvar() {
    if (editando) {
      await api.put(`/entity/usuarios/${form.user_id}`, form)
    } else {
      await api.post('/entity/usuarios', form)
    }

    setOpen(false)
    carregar()
  }

  async function excluir() {
    if (!confirmar) return
    await api.put(`/entity/usuarios/${confirmar.user_id}/excluir`, {})
    setConfirmar(null)
    carregar()
  }

  return (
    <CrudLayout
      title="Usuários"
      subtitle="Gerencie os usuários do sistema"
      actions={
        <div style={actions}>
          <button style={btnDark} onClick={gerarPDF}>
            <FileText size={16} /> PDF
          </button>
          <button style={btnExcel}>
            <FileSpreadsheet size={16} /> Excel
          </button>
          <button style={btnPrimary} onClick={novoUsuario}>
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
                {u.ativo}
              </span>
            ),
          },
          {
            key: 'actions',
            label: 'Ações',
            render: u => (
              <div style={{ display: 'flex', gap: 6 }}>
                <button style={btnIcon} onClick={() => editarUsuario(u)}>
                  <Pencil size={14} />
                </button>
                <button style={btnInfo} onClick={() => setLogUsuario(u)}>
                  <Clock size={14} />
                </button>
                <button style={btnDelete} onClick={() => setConfirmar(u)}>
                  <Trash2 size={14} />
                </button>
              </div>
            ),
          },
        ]}
        data={dados}
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

const search: CSSProperties = {
  width: 280,
  padding: '8px 12px',
  borderRadius: 6,
  border: '1px solid #d1d5db',
  marginBottom: 16,
}

const actions: CSSProperties = { display: 'flex', gap: 10 }

const btnPrimary: CSSProperties = { background: '#16a34a', color: '#fff', padding: '8px 14px', borderRadius: 6, border: 'none' }
const btnExcel: CSSProperties = { background: '#166534', color: '#fff', padding: '8px 14px', borderRadius: 6, border: 'none' }
const btnDark: CSSProperties = { background: '#0b1a3a', color: '#fff', padding: '8px 14px', borderRadius: 6, border: 'none' }

const btnIcon: CSSProperties = {
  background: '#e5e7eb',
  border: 'none',
  borderRadius: 6,
  padding: 6,
}

const btnInfo: CSSProperties = {
  background: '#0b1a3a',
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  padding: 6,
}

const btnDelete: CSSProperties = {
  background: '#dc2626',
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  padding: '6px 10px',
}

const badgeAtivo: CSSProperties = { background: '#e7f6ec', color: '#1e7e34', padding: '4px 10px', borderRadius: 12 }
const badgeInativo: CSSProperties = { background: '#fdecea', color: '#c62828', padding: '4px 10px', borderRadius: 12 }
