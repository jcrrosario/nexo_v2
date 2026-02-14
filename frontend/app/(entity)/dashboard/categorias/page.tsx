'use client'

import { useEffect, useState, CSSProperties } from 'react'
import {
  FileText,
  FileSpreadsheet,
  Plus,
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

type Categoria = {
  categ_id: number
  nome: string
  created_at: string
  updated_at: string
  user_id_log: string
}

export default function CategoriaPage() {
  const [dados, setDados] = useState<Categoria[]>([])
  const [busca, setBusca] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const [open, setOpen] = useState(false)
  const [editando, setEditando] = useState(false)
  const [confirmar, setConfirmar] = useState<Categoria | null>(null)
  const [log, setLog] = useState<Categoria | null>(null)

  const [form, setForm] = useState<any>({
    nome: '',
  })

  const pageSize = 5

  async function carregar() {
    const res = await api.get(
      `/entity/categoria?page=${page}&limit=${pageSize}&search=${busca}`,
    )

    setDados(res.data)
    setTotal(res.total)
  }

  useEffect(() => {
    carregar()
  }, [page, busca])

  async function abrirLog(categoria: Categoria) {
    const res = await api.get(
      `/entity/categoria/${categoria.categ_id}/log`,
    )
    setLog(res)
  }

  function novo() {
    setForm({ nome: '' })
    setEditando(false)
    setOpen(true)
  }

  function editar(categoria: Categoria) {
    setForm(categoria)
    setEditando(true)
    setOpen(true)
  }

  async function salvar() {
    if (editando) {
      await api.put(`/entity/categoria/${form.categ_id}`, form)
    } else {
      await api.post('/entity/categoria', form)
    }
    setOpen(false)
    carregar()
  }

  async function excluir() {
    if (!confirmar) return
    await api.put(`/entity/categoria/${confirmar.categ_id}/excluir`, {})
    setConfirmar(null)
    carregar()
  }

  function gerarPDF() {
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.text('Relatório de Categorias de Risco', 14, 20)
    doc.setFontSize(11)
    doc.text(`Gerado em: ${new Date().toLocaleString()}`, 14, 28)

    autoTable(doc, {
      startY: 36,
      head: [['Categoria']],
      body: dados.map(d => [d.nome]),
    })

    doc.save('categorias_risco.pdf')
  }

  function gerarExcel() {
    const worksheetData = dados.map(d => ({
      Categoria: d.nome,
      'Criado em': new Date(d.created_at).toLocaleString(),
      'Atualizado em': d.updated_at
        ? new Date(d.updated_at).toLocaleString()
        : '',
      'Alterado por': d.user_id_log || '',
    }))

    const ws = XLSX.utils.json_to_sheet(worksheetData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Categorias')
    XLSX.writeFile(wb, 'categorias_risco.xlsx')
  }

  return (
    <CrudLayout
      title="Categoria do Risco"
      subtitle="Cadastro de categorias de risco"
      actions={
        <div style={actions}>
          <button style={btnDark} onClick={gerarPDF}>
            <FileText size={16} /> PDF
          </button>
          <button style={btnExcel} onClick={gerarExcel}>
            <FileSpreadsheet size={16} /> Excel
          </button>
          <button style={btnPrimary} onClick={novo}>
            <Plus size={16} /> Nova Categoria
          </button>
        </div>
      }
    >
      <input
        placeholder="Buscar categoria..."
        value={busca}
        onChange={e => {
          setBusca(e.target.value)
          setPage(1)
        }}
        style={search}
      />

      <CrudTable
        columns={[
          { key: 'nome', label: 'Categoria' },
          {
            key: 'actions',
            label: 'Ações',
            render: c => (
              <div style={{ display: 'flex', gap: 6 }}>
                <button style={btnIcon} onClick={() => editar(c)}>
                  <Pencil size={14} />
                </button>
                <button style={btnInfo} onClick={() => abrirLog(c)}>
                  <Clock size={14} />
                </button>
                <button
                  style={btnDelete}
                  onClick={() => setConfirmar(c)}
                >
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
            <p>
              Criado em:{' '}
              {new Date(log.created_at).toLocaleString()}
            </p>
            <p>
              Atualizado em:{' '}
              {log.updated_at
                ? new Date(log.updated_at).toLocaleString()
                : '-'}
            </p>
            <p>Alterado por: {log.user_id_log || '-'}</p>

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

      {confirmar && (
        <div style={overlay}>
          <div style={modal}>
            <h3>Confirmar exclusão</h3>
            <p>
              Deseja excluir a categoria{' '}
              <strong>{confirmar.nome}</strong>?
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
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {open && (
        <div style={overlay}>
          <div style={modal}>
            <h3>{editando ? 'Editar' : 'Nova'} Categoria</h3>

            <input
              placeholder="Nome"
              value={form.nome}
              onChange={e => setForm({ ...form, nome: e.target.value })}
              style={input}
            />

            <div style={modalFooter}>
              <button
                style={btnCancel}
                onClick={() => setOpen(false)}
              >
                Cancelar
              </button>
              <button
                style={btnPrimary}
                onClick={salvar}
              >
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
