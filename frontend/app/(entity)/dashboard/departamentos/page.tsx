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
import * as XLSX from 'xlsx'
import CrudLayout from '../../components/CrudLayout'
import CrudTable from '../../components/CrudTable'
import CrudPagination from '../../components/CrudPagination'
import { api } from '@/lib/api'

type Departamento = {
  dpto_id: number
  nome: string
  responsavel: string
  created_at: string
  updated_at: string
  user_id_log: string
}

type Usuario = {
  user_id: string
  nome: string
}

export default function DepartamentosPage() {
  const [dados, setDados] = useState<Departamento[]>([])
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [busca, setBusca] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const [open, setOpen] = useState(false)
  const [editando, setEditando] = useState(false)
  const [confirmar, setConfirmar] = useState<Departamento | null>(null)
  const [log, setLog] = useState<Departamento | null>(null)

  const [form, setForm] = useState<any>({
    nome: '',
    responsavel: '',
  })

  const pageSize = 5

  async function carregar() {
    const res = await api.get(
      `/entity/departamentos?page=${page}&limit=${pageSize}&search=${busca}`,
    )
    const users = await api.get('/entity/usuarios')

    setDados(res.data)
    setTotal(res.total)
    setUsuarios(users.data)
  }

  useEffect(() => {
    carregar()
  }, [page, busca])

  function novo() {
    setForm({ nome: '', responsavel: '' })
    setEditando(false)
    setOpen(true)
  }

  function editar(dep: Departamento) {
    setForm(dep)
    setEditando(true)
    setOpen(true)
  }

  async function salvar() {
    if (editando) {
      await api.put(`/entity/departamentos/${form.dpto_id}`, form)
    } else {
      await api.post('/entity/departamentos', form)
    }
    setOpen(false)
    carregar()
  }

  async function excluir() {
    if (!confirmar) return
    await api.put(`/entity/departamentos/${confirmar.dpto_id}/excluir`, {})
    setConfirmar(null)
    carregar()
  }

  function gerarPDF() {
    const doc = new jsPDF()

    doc.setFontSize(18)
    doc.text('Relatório de Departamentos', 14, 20)

    doc.setFontSize(11)
    doc.setTextColor(100)
    doc.text(
      `Gerado em: ${new Date().toLocaleString()}`,
      14,
      28,
    )

    autoTable(doc, {
      startY: 36,
      head: [['Nome', 'Responsável']],
      body: dados.map(d => [
        d.nome,
        d.responsavel,
      ]),
      styles: {
        fontSize: 10,
        cellPadding: 6,
      },
      headStyles: {
        fillColor: [11, 26, 58],
        textColor: 255,
        fontStyle: 'bold',
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

    doc.save('departamentos.pdf')
  }

  function gerarExcel() {
    const worksheetData = dados.map(d => ({
      Nome: d.nome,
      Responsável: d.responsavel,
      'Criado em': new Date(d.created_at).toLocaleString(),
      'Última atualização': new Date(d.updated_at).toLocaleString(),
      'Alterado por': d.user_id_log || '',
    }))

    const ws = XLSX.utils.json_to_sheet(worksheetData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Departamentos')
    XLSX.writeFile(wb, 'departamentos.xlsx')
  }

  return (
    <CrudLayout
      title="Departamentos"
      subtitle="Cadastro de departamentos da empresa"
      actions={
        <div style={actions}>
          <button style={btnDark} onClick={gerarPDF}>
            <FileText size={16} /> PDF
          </button>
          <button style={btnExcel} onClick={gerarExcel}>
            <FileSpreadsheet size={16} /> Excel
          </button>
          <button style={btnPrimary} onClick={novo}>
            <Plus size={16} /> Novo Dpto.
          </button>
        </div>
      }
    >
      <input
        placeholder="Buscar departamento..."
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
          { key: 'responsavel', label: 'Responsável' },
          {
            key: 'actions',
            label: 'Ações',
            render: d => (
              <div style={{ display: 'flex', gap: 6 }}>
                <button style={btnIcon} onClick={() => editar(d)}>
                  <Pencil size={14} />
                </button>
                <button style={btnInfo} onClick={() => setLog(d)}>
                  <Clock size={14} />
                </button>
                <button style={btnDelete} onClick={() => setConfirmar(d)}>
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

      {log && (
        <div style={overlay}>
          <div style={modal}>
            <h3>Log do registro</h3>
            <p>Criado em: {new Date(log.created_at).toLocaleString()}</p>
            <p>Atualizado em: {new Date(log.updated_at).toLocaleString()}</p>
            <p>Alterado por: {log.user_id_log || '-'}</p>
            <div style={modalFooter}>
              <button style={btnPrimary} onClick={() => setLog(null)}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmar && (
        <div style={overlay}>
          <div style={modal}>
            <h3>Confirmar exclusão</h3>
            <p>
              Deseja excluir o departamento{' '}
              <strong>{confirmar.nome}</strong>?
            </p>
            <div style={modalFooter}>
              <button style={btnCancel} onClick={() => setConfirmar(null)}>
                Cancelar
              </button>
              <button style={btnDelete} onClick={excluir}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {open && (
        <div style={overlay}>
          <div style={modal}>
            <h3>{editando ? 'Editar' : 'Novo'} Departamento</h3>

            <input
              placeholder="Nome"
              value={form.nome}
              onChange={e => setForm({ ...form, nome: e.target.value })}
              style={input}
            />

            <select
              value={form.responsavel}
              onChange={e =>
                setForm({ ...form, responsavel: e.target.value })
              }
              style={input}
            >
              <option value="">Selecione o responsável</option>
              {usuarios.map(u => (
                <option key={u.user_id} value={u.nome}>
                  {u.nome}
                </option>
              ))}
            </select>

            <div style={modalFooter}>
              <button style={btnCancel} onClick={() => setOpen(false)}>
                Cancelar
              </button>
              <button style={btnPrimary} onClick={salvar}>
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
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

const btnPrimary: CSSProperties = {
  background: '#16a34a',
  color: '#fff',
  padding: '8px 14px',
  borderRadius: 6,
  border: 'none',
}

const btnExcel: CSSProperties = {
  background: '#166534',
  color: '#fff',
  padding: '8px 14px',
  borderRadius: 6,
  border: 'none',
}

const btnDark: CSSProperties = {
  background: '#0b1a3a',
  color: '#fff',
  padding: '8px 14px',
  borderRadius: 6,
  border: 'none',
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
}

const modalFooter: CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 10,
  marginTop: 20,
}
