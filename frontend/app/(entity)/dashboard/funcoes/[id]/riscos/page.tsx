'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Plus, Trash2, ArrowLeft } from 'lucide-react'

import CrudLayout from '../../../../components/CrudLayout'
import CrudTable from '../../../../components/CrudTable'

import { api } from '@/lib/api'

type Risco = {
  func_fator_id: number
  fator_risco: string
  severidade: number
  possiveis_consequencias: string
}

const severidades = [
  { value: 1, label: '1 - Leve' },
  { value: 2, label: '2 - Menor' },
  { value: 3, label: '3 - Moderada' },
  { value: 4, label: '4 - Maior' },
  { value: 5, label: '5 - Extrema' },
]

export default function FuncaoRiscosPage() {
  const params = useParams()
  const router = useRouter()

  const id = params.id as string

  const [dados, setDados] = useState<Risco[]>([])
  const [funcaoNome, setFuncaoNome] = useState('')
  const [open, setOpen] = useState(false)
  const [confirmar, setConfirmar] = useState<Risco | null>(null)

  const [form, setForm] = useState({
    fator_risco: '',
    severidade: 1,
    possiveis_consequencias: '',
  })

  async function carregar() {
    const res = await api.get(`/entity/funcao-fator/${id}`)
    setDados(res)
  }

  async function carregarFuncao() {
    const res = await api.get(`/entity/funcao?page=1&limit=100`)
    const f = res.data.find((x: any) => x.func_id == id)
    if (f) setFuncaoNome(f.nome)
  }

  useEffect(() => {
    carregar()
    carregarFuncao()
  }, [])

  async function salvar() {
    await api.post('/entity/funcao-fator', {
      ...form,
      func_id: Number(id),
    })

    setOpen(false)

    setForm({
      fator_risco: '',
      severidade: 1,
      possiveis_consequencias: '',
    })

    carregar()
  }

  async function excluir() {
    if (!confirmar) return

    await api.put(`/entity/funcao-fator/${confirmar.func_fator_id}/excluir`, {})

    setConfirmar(null)
    carregar()
  }

  function labelSeveridade(valor: number) {
    const s = severidades.find(x => x.value === valor)
    return s ? s.label : valor
  }

  return (
    <CrudLayout
      title="Fatores de risco da função"
      subtitle={`Função: ${funcaoNome}`}
      actions={
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={btnSecondary} onClick={() => router.push('/dashboard/funcoes')}>
            <ArrowLeft size={16} /> Voltar
          </button>

          <button style={btnPrimary} onClick={() => setOpen(true)}>
            <Plus size={16} /> Novo risco
          </button>
        </div>
      }
    >

      {/* AVISO NR1 */}
      <div style={infoBox}>
        <strong>Obs.</strong> Conforme a NR-1 e metodologias de gestão de risco,
        a severidade deve considerar sempre o <strong>valor máximo de risco identificado</strong>.
      </div>

      <CrudTable
        columns={[
          { key: 'fator_risco', label: 'Fator' },
          {
            key: 'severidade',
            label: 'Severidade',
            render: r => labelSeveridade(r.severidade),
          },
          {
            key: 'possiveis_consequencias',
            label: 'Consequências',
          },
          {
            key: 'actions',
            label: 'Ações',
            render: r => (
              <button
                style={btnDelete}
                onClick={() => setConfirmar(r)}
              >
                <Trash2 size={14} />
              </button>
            ),
          },
        ]}
        data={dados}
      />

      {confirmar && (
        <div style={overlay}>
          <div style={modal}>
            <h3>Confirmar exclusão</h3>

            <p>
              Deseja realmente excluir o fator de risco:
              <br />
              <strong>{confirmar.fator_risco}</strong>?
            </p>

            <div style={footer}>
              <button style={btnCancel} onClick={() => setConfirmar(null)}>
                Cancelar
              </button>

              <button style={btnDelete} onClick={excluir}>
                Confirmar exclusão
              </button>
            </div>
          </div>
        </div>
      )}

      {open && (
        <div style={overlay}>
          <div style={modal}>
            <h3>Novo risco</h3>

            <input
              placeholder="Fator de risco"
              value={form.fator_risco}
              onChange={e =>
                setForm({ ...form, fator_risco: e.target.value })
              }
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
              {severidades.map(s => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>

            <textarea
              placeholder="Possíveis consequências"
              value={form.possiveis_consequencias}
              onChange={e =>
                setForm({
                  ...form,
                  possiveis_consequencias: e.target.value,
                })
              }
              style={textarea}
            />

            <div style={footer}>
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

const infoBox = {
  background: '#f1f5f9',
  borderLeft: '4px solid #0b1a3a',
  padding: '10px 14px',
  borderRadius: 6,
  fontSize: 13,
  marginBottom: 16,
  color: '#1f2937',
}

const btnPrimary = {
  background: '#16a34a',
  color: '#fff',
  padding: '8px 14px',
  borderRadius: 6,
  border: 'none',
}

const btnSecondary = {
  background: '#e5e7eb',
  padding: '8px 14px',
  borderRadius: 6,
  border: 'none',
}

const btnDelete = {
  background: '#dc2626',
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  padding: '6px 10px',
}

const btnCancel = {
  background: '#e5e7eb',
  padding: '8px 14px',
  borderRadius: 6,
  border: 'none',
}

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
  width: 420,
  padding: 24,
}

const input = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 6,
  border: '1px solid #d1d5db',
  marginTop: 10,
}

const textarea = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 6,
  border: '1px solid #d1d5db',
  marginTop: 10,
  minHeight: 80,
}

const footer = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 10,
  marginTop: 20,
}