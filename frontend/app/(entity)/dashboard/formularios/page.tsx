'use client'

import { useEffect, useState, CSSProperties } from 'react'
import { useRouter } from 'next/navigation'
import {
  FileText,
  FileSpreadsheet,
  Plus,
  Pencil,
  Trash2,
  Clock,
  ListChecks,
} from 'lucide-react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import CrudLayout from '../../components/CrudLayout'
import CrudTable from '../../components/CrudTable'
import CrudPagination from '../../components/CrudPagination'
import { api } from '@/lib/api'

type Formulario = {
  form_id: number
  nome: string
  descricao: string
  created_at: string
  updated_at: string
  user_id_log: string
}

export default function FormulariosPage() {
  const router = useRouter()

  const [dados, setDados] = useState<Formulario[]>([])
  const [busca, setBusca] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const [open, setOpen] = useState(false)
  const [editando, setEditando] = useState(false)
  const [confirmar, setConfirmar] = useState<Formulario | null>(null)
  const [log, setLog] = useState<Formulario | null>(null)

  const [form, setForm] = useState<any>({
    nome: '',
    descricao: '',
  })

  const pageSize = 5

  async function carregar() {
    const res = await api.get(
      `/entity/formularios?page=${page}&limit=${pageSize}&search=${busca}`,
    )

    if (Array.isArray(res)) {
      setDados(res)
      setTotal(res.length)
    } else {
      setDados(res?.data ?? [])
      setTotal(res?.total ?? 0)
    }
  }

  useEffect(() => {
    carregar()
  }, [page, busca])

  function novo() {
    setForm({ nome: '', descricao: '' })
    setEditando(false)
    setOpen(true)
  }

  function editar(f: Formulario) {
    setForm(f)
    setEditando(true)
    setOpen(true)
  }

  async function salvar() {
    if (editando) {
      await api.put(`/entity/formularios/${form.form_id}`, form)
    } else {
      await api.post('/entity/formularios', form)
    }
    setOpen(false)
    carregar()
  }

  async function excluir() {
    if (!confirmar) return
    await api.put(`/entity/formularios/${confirmar.form_id}/excluir`, {})
    setConfirmar(null)
    carregar()
  }

  function gerarPDF() {
    const doc = new jsPDF()
    doc.text('Relatório de Formulários', 14, 20)

    autoTable(doc, {
      startY: 30,
      head: [['Título da pesquisa', 'Descrição']],
      body: dados.map(d => [d.nome, d.descricao]),
      headStyles: {
        fillColor: [11, 26, 58],
        textColor: 255,
      },
    })

    doc.save('formularios.pdf')
  }

  function gerarExcel() {
    const ws = XLSX.utils.json_to_sheet(
      dados.map(d => ({
        Nome: d.nome,
        Descrição: d.descricao,
      })),
    )

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Formulários')
    XLSX.writeFile(wb, 'formularios.xlsx')
  }

  return (
    <CrudLayout
      title="Formulários"
      subtitle="Cadastro de formulários da pesquisas da NR-1"
      actions={
        <div style={actions}>
          <button style={btnDark} onClick={gerarPDF}>
            <FileText size={16} /> PDF
          </button>
          <button style={btnExcel} onClick={gerarExcel}>
            <FileSpreadsheet size={16} /> Excel
          </button>
          <button style={btnPrimary} onClick={novo}>
            <Plus size={16} /> Novo Formulário
          </button>
        </div>
      }
    >
      <input
        placeholder="Buscar formulário..."
        value={busca}
        onChange={e => {
          setBusca(e.target.value)
          setPage(1)
        }}
        style={search}
      />

      <CrudTable
        columns={[
          { key: 'nome', label: 'Título da pesquisa' },
          { key: 'descricao', label: 'Descrição' },
          {
            key: 'actions',
            label: 'Ações',
            render: f => (
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  style={btnDarkIcon}
                  onClick={() =>
                    router.push(
                      `/dashboard/formularios/editor/${f.form_id}`,
                    )
                  }
                >
                  <ListChecks size={14} />
                </button>

                <button style={btnIcon} onClick={() => editar(f)}>
                  <Pencil size={14} />
                </button>

                <button style={btnInfo} onClick={() => setLog(f)}>
                  <Clock size={14} />
                </button>

                <button
                  style={btnDelete}
                  onClick={() => setConfirmar(f)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ),
          },
        ]}
        data={dados ?? []}
      />

      <CrudPagination
        page={page}
        total={total}
        pageSize={pageSize}
        onPageChange={setPage}
      />

      {open && (
        <div style={overlay}>
          <div style={modal}>
            <h3>{editando ? 'Editar' : 'Novo'} Formulário</h3>

            <input
              placeholder="Título da pesquisa"
              value={form.nome}
              onChange={e =>
                setForm({ ...form, nome: e.target.value })
              }
              style={input}
            />

            <textarea
              placeholder="Descrição"
              value={form.descricao}
              onChange={e =>
                setForm({ ...form, descricao: e.target.value })
              }
              style={{ ...input, marginTop: 12 }}
            />

            <div style={modalFooter}>
              <button
                style={btnCancel}
                onClick={() => setOpen(false)}
              >
                Cancelar
              </button>
              <button style={btnPrimary} onClick={salvar}>
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmar && (
        <div style={overlay}>
          <div style={modal}>
            <h3>Confirmar Exclusão</h3>

            <p style={{ marginTop: 10 }}>
              Deseja realmente excluir o formulário
              <strong> {confirmar.nome}</strong>?
            </p>

            <div style={modalFooter}>
              <button
                style={btnCancel}
                onClick={() => setConfirmar(null)}
              >
                Cancelar
              </button>

              <button
                style={btnDelete}
                onClick={excluir}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {log && (
        <div style={overlay}>
          <div style={modal}>
            <h3>Log do Registro</h3>

            <p><strong>Criado em:</strong> {new Date(log.created_at).toLocaleString()}</p>

            {log.updated_at && (
              <p><strong>Atualizado em:</strong> {new Date(log.updated_at).toLocaleString()}</p>
            )}

            <p><strong>Último usuário:</strong> {log.user_id_log}</p>

            <div style={modalFooter}>
              <button
                style={btnPrimary}
                onClick={() => setLog(null)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </CrudLayout>
  )
}

/* ===== estilos ===== */

const search: CSSProperties = {
  width: 280,
  padding: '8px 12px',
  borderRadius: 6,
  border: '1px solid #d1d5db',
  marginBottom: 16,
}

const actions: CSSProperties = { display: 'flex', gap: 10 }

const btnPrimary: CSSProperties = {
  background: '#16a34a',
  color: '#fff',
  padding: '8px 14px',
  borderRadius: 6,
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: 6,
}

const btnExcel: CSSProperties = {
  background: '#166534',
  color: '#fff',
  padding: '8px 14px',
  borderRadius: 6,
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: 6,
}

const btnDark: CSSProperties = {
  background: '#0b1a3a',
  color: '#fff',
  padding: '8px 14px',
  borderRadius: 6,
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: 6,
}

const btnDarkIcon: CSSProperties = {
  background: '#0b1a3a',
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  padding: 6,
}

const btnCancel: CSSProperties = {
  background: '#e5e7eb',
  padding: '8px 14px',
  borderRadius: 6,
  border: 'none',
}

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

const overlay: CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.4)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}

const modal: CSSProperties = {
  background: '#fff',
  borderRadius: 12,
  width: 420,
  padding: 24,
}

const input: CSSProperties = {
  padding: '10px 12px',
  borderRadius: 6,
  border: '1px solid #d1d5db',
  width: '100%',
}

const modalFooter: CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 10,
  marginTop: 20,
}
