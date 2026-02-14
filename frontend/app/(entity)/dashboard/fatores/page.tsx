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

type Fator = {
  fator_id: number
  nome: string
  severidade: number
  possiveis_consequencias: string
  created_at: string
  updated_at: string
  user_id_log: string
}

const severidadeMap: Record<number, string> = {
  1: 'Leve',
  2: 'Menor',
  3: 'Moderada',
  4: 'Maior',
  5: 'Extrema',
}

export default function FatorPage() {
  const [dados, setDados] = useState<Fator[]>([])
  const [busca, setBusca] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const [open, setOpen] = useState(false)
  const [editando, setEditando] = useState(false)
  const [confirmar, setConfirmar] = useState<Fator | null>(null)
  const [log, setLog] = useState<Fator | null>(null)

  const [form, setForm] = useState<any>({
    nome: '',
    severidade: 1,
    possiveis_consequencias: '',
  })

  const pageSize = 5

  async function carregar() {
    const res = await api.get(
      `/entity/fator?page=${page}&limit=${pageSize}&search=${busca}`,
    )
    setDados(res.data)
    setTotal(res.total)
  }

  useEffect(() => {
    carregar()
  }, [page, busca])

  async function abrirLog(fator: Fator) {
    const res = await api.get(
      `/entity/fator/${fator.fator_id}/log`,
    )
    setLog(res)
  }

  function novo() {
    setForm({
      nome: '',
      severidade: 1,
      possiveis_consequencias: '',
    })
    setEditando(false)
    setOpen(true)
  }

  function editar(fator: Fator) {
    setForm({
      ...fator,
      possiveis_consequencias:
        fator.possiveis_consequencias || '',
    })
    setEditando(true)
    setOpen(true)
  }

  async function salvar() {
    if (!form.severidade || form.severidade === 0) {
      alert('Selecione a severidade')
      return
    }

    if (editando) {
      await api.put(`/entity/fator/${form.fator_id}`, form)
    } else {
      await api.post('/entity/fator', form)
    }

    setOpen(false)
    carregar()
  }

  async function excluir() {
    if (!confirmar) return
    await api.put(`/entity/fator/${confirmar.fator_id}/excluir`, {})
    setConfirmar(null)
    carregar()
  }

  function gerarPDF() {
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.text('Relatório de Fatores de Risco', 14, 20)
    doc.setFontSize(11)
    doc.text(`Gerado em: ${new Date().toLocaleString()}`, 14, 28)

    autoTable(doc, {
      startY: 36,
      head: [['Fator', 'Severidade', 'Possíveis consequências']],
      body: dados.map(d => [
        d.nome,
        `${d.severidade} - ${severidadeMap[d.severidade]}`,
        d.possiveis_consequencias || '',
      ]),
    })

    doc.save('fatores_risco.pdf')
  }

  function gerarExcel() {
    const worksheetData = dados.map(d => ({
      Fator: d.nome,
      Severidade: `${d.severidade} - ${severidadeMap[d.severidade]}`,
      'Possíveis consequências': d.possiveis_consequencias || '',
      'Criado em': new Date(d.created_at).toLocaleString(),
      'Atualizado em': d.updated_at
        ? new Date(d.updated_at).toLocaleString()
        : '',
      'Alterado por': d.user_id_log || '',
    }))

    const ws = XLSX.utils.json_to_sheet(worksheetData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Fatores')
    XLSX.writeFile(wb, 'fatores_risco.xlsx')
  }

  return (
    <CrudLayout
      title="Fator de risco"
      subtitle="Cadastro de fatores de risco"
      actions={
        <div style={actions}>
          <button style={btnDark} onClick={gerarPDF}>
            <FileText size={16} /> PDF
          </button>
          <button style={btnExcel} onClick={gerarExcel}>
            <FileSpreadsheet size={16} /> Excel
          </button>
          <button style={btnPrimary} onClick={novo}>
            <Plus size={16} /> Novo Fator
          </button>
        </div>
      }
    >
      <input
        placeholder="Buscar fator..."
        value={busca}
        onChange={e => {
          setBusca(e.target.value)
          setPage(1)
        }}
        style={search}
      />

      <CrudTable
        columns={[
          { key: 'nome', label: 'Fator' },
          {
            key: 'severidade',
            label: 'Severidade',
            render: f =>
              `${f.severidade} - ${severidadeMap[f.severidade]}`,
          },
          {
            key: 'possiveis_consequencias',
            label: 'Possíveis consequências',
          },
          {
            key: 'actions',
            label: 'Ações',
            render: f => (
              <div style={{ display: 'flex', gap: 6 }}>
                <button style={btnIcon} onClick={() => editar(f)}>
                  <Pencil size={14} />
                </button>
                <button style={btnInfo} onClick={() => abrirLog(f)}>
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
        data={dados}
      />

      <div style={{ marginTop: 20 }}>
        <CrudPagination
          page={page}
          total={total}
          pageSize={pageSize}
          onPageChange={setPage}
        />
      </div>

      {open && (
        <div style={overlay}>
          <div style={modal}>
            <h3>{editando ? 'Editar' : 'Novo'} Fator</h3>

            <input
              placeholder="Nome"
              value={form.nome}
              onChange={e => setForm({ ...form, nome: e.target.value })}
              style={input}
            />

            <select
              value={form.severidade}
              onChange={e =>
                setForm({
                  ...form,
                  severidade: Number(e.target.value),
                })
              }
              style={input}
            >
              <option value={1}>1 - Leve</option>
              <option value={2}>2 - Menor</option>
              <option value={3}>3 - Moderada</option>
              <option value={4}>4 - Maior</option>
              <option value={5}>5 - Extrema</option>
            </select>

            <textarea
              placeholder="Possíveis consequências"
              value={form.possiveis_consequencias || ''}
              onChange={e =>
                setForm({
                  ...form,
                  possiveis_consequencias: e.target.value,
                })
              }
              style={{
                ...input,
                height: 100,
                resize: 'none',
              }}
              maxLength={400}
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
  width: '100%',
  marginBottom: 12,
}

const modalFooter: CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 10,
  marginTop: 20,
}
