'use client'

import { useEffect, useState, CSSProperties } from 'react'
import { useRouter } from 'next/navigation'
import {
  Plus,
  Trash2,
  ClipboardList,
} from 'lucide-react'
import CrudLayout from '../../components/CrudLayout'
import CrudTable from '../../components/CrudTable'
import CrudPagination from '../../components/CrudPagination'
import { api } from '@/lib/api'

type Pesquisa = {
  pesq_id: number
  data_inicial: string
  data_final: string
  observacoes: string
}

type Formulario = {
  form_id: number
  nome: string
}

export default function PesquisasPage() {
  const router = useRouter()

  const [dados, setDados] = useState<Pesquisa[]>([])
  const [formularios, setFormularios] = useState<Formulario[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [open, setOpen] = useState(false)
  const [confirmar, setConfirmar] = useState<Pesquisa | null>(null)

  const [form, setForm] = useState<any>({
    form_id: '',
    data_inicial: '',
    data_final: '',
    observacoes: '',
  })

  const pageSize = 5

  async function carregar() {
    const res = await api.get(
      `/entity/pesquisas?page=${page}&limit=${pageSize}`,
    )

    setDados(res?.data ?? [])
    setTotal(res?.total ?? 0)
  }

  async function carregarFormularios() {
    const res = await api.get(
      `/entity/formularios?page=1&limit=1000`,
    )
    setFormularios(res?.data ?? [])
  }

  useEffect(() => {
    carregar()
    carregarFormularios()
  }, [page])

  async function salvar() {
    if (!form.form_id) {
      alert('Selecione um formulário')
      return
    }

    await api.post('/entity/pesquisas', form)
    setOpen(false)
    carregar()
  }

  async function excluir() {
    if (!confirmar) return
    await api.put(`/entity/pesquisas/${confirmar.pesq_id}/excluir`, {})
    setConfirmar(null)
    carregar()
  }

  return (
    <CrudLayout
      title="Pesquisas"
      subtitle="Cadastro de pesquisas"
      actions={
        <button style={btnPrimary} onClick={() => setOpen(true)}>
          <Plus size={16} /> Nova Pesquisa
        </button>
      }
    >
      <CrudTable
        columns={[
          { key: 'pesq_id', label: 'ID' },
          { key: 'data_inicial', label: 'Início' },
          { key: 'data_final', label: 'Fim' },
          {
            key: 'actions',
            label: 'Ações',
            render: p => (
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  style={btnDark}
                  onClick={() =>
                    router.push(
                      `/dashboard/pesquisas/${p.pesq_id}`,
                    )
                  }
                >
                  <ClipboardList size={14} />
                </button>

                <button
                  style={btnDelete}
                  onClick={() => setConfirmar(p)}
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

      {open && (
        <div style={overlay}>
          <div style={modal}>
            <h3>Nova Pesquisa</h3>

            {/* SELECT FORMULÁRIO */}
            <select
              value={form.form_id}
              onChange={e =>
                setForm({ ...form, form_id: e.target.value })
              }
              style={input}
            >
              <option value="">Selecione o Formulário</option>
              {formularios.map(f => (
                <option key={f.form_id} value={f.form_id}>
                  {f.nome}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={form.data_inicial}
              onChange={e =>
                setForm({ ...form, data_inicial: e.target.value })
              }
              style={{ ...input, marginTop: 12 }}
            />

            <input
              type="date"
              value={form.data_final}
              onChange={e =>
                setForm({ ...form, data_final: e.target.value })
              }
              style={{ ...input, marginTop: 12 }}
            />

            <textarea
              placeholder="Observações"
              value={form.observacoes}
              onChange={e =>
                setForm({ ...form, observacoes: e.target.value })
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
    </CrudLayout>
  )
}

const btnPrimary: CSSProperties = {
  background: '#16a34a',
  color: '#fff',
  padding: '8px 14px',
  borderRadius: 6,
  border: 'none',
}

const btnDark: CSSProperties = {
  background: '#0b1a3a',
  color: '#fff',
  borderRadius: 6,
  border: 'none',
  padding: 6,
}

const btnDelete: CSSProperties = {
  background: '#dc2626',
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  padding: 6,
}

const btnCancel: CSSProperties = {
  background: '#e5e7eb',
  border: 'none',
  borderRadius: 6,
  padding: '8px 14px',
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
