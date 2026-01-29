'use client'

import { useEffect, useState } from 'react'
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Users,
  Briefcase,
  Pencil,
  X,
} from 'lucide-react'

function moeda(valor: number) {
  return (valor || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export default function VinculacaoOrganizacionalPage() {
  /* ========================
     ESTADOS
  ======================== */
  const [hierarquia, setHierarquia] = useState<any[]>([])

  // combos da modal
  const [departamentos, setDepartamentos] = useState<any[]>([])
  const [funcoes, setFuncoes] = useState<any[]>([])
  const [usuarios, setUsuarios] = useState<any[]>([])

  const [openDptos, setOpenDptos] = useState<number[]>([])
  const [openFuncoes, setOpenFuncoes] = useState<number[]>([])

  const [showModal, setShowModal] = useState(false)
  const [editando, setEditando] = useState<any | null>(null)

  const [form, setForm] = useState({
    vinculacao_id: null as number | null,
    dpto_id: '',
    func_id: '',
    user_id: '',
    percentual_alocacao: 100,
    custo_mensal: '',
  })

  /* ========================
     LOAD INICIAL
  ======================== */
  useEffect(() => {
    carregarHierarquia()
    carregarCombos()
  }, [])

  async function carregarHierarquia() {
    const token = localStorage.getItem('entity_token')
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/entity/vinculacao`,
      { headers: { Authorization: `Bearer ${token}` } },
    )
    setHierarquia(await res.json())
  }

  async function carregarCombos() {
    const token = localStorage.getItem('entity_token')
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/entity/vinculacao/combos`,
      { headers: { Authorization: `Bearer ${token}` } },
    )
    const json = await res.json()

    setDepartamentos(json.departamentos || [])
    setFuncoes(json.funcoes || [])
    setUsuarios(json.usuarios || [])
  }

  /* ========================
     HELPERS
  ======================== */
  function toggle(list: number[], id: number, setter: any) {
    setter(list.includes(id) ? list.filter(i => i !== id) : [...list, id])
  }

  function abrirNovo() {
    setEditando(null)
    setForm({
      vinculacao_id: null,
      dpto_id: '',
      func_id: '',
      user_id: '',
      percentual_alocacao: 100,
      custo_mensal: '',
    })
    setShowModal(true)
  }

  function abrirEdicao(d: any, f: any, u: any) {
    setEditando(u)
    setForm({
      vinculacao_id: u.vinculacao_id,
      dpto_id: d.dpto_id,
      func_id: f.func_id,
      user_id: u.user_id,
      percentual_alocacao: u.percentual_alocacao,
      custo_mensal: u.custo_mensal ?? '',
    })
    setShowModal(true)
  }

  async function salvar() {
    const token = localStorage.getItem('entity_token')

    const url = editando
      ? `${process.env.NEXT_PUBLIC_API_URL}/entity/vinculacao/${form.vinculacao_id}`
      : `${process.env.NEXT_PUBLIC_API_URL}/entity/vinculacao`

    await fetch(url, {
      method: editando ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    })

    setShowModal(false)
    carregarHierarquia()
  }

  /* ========================
     RENDER
  ======================== */
  return (
    <div>
      {/* HEADER */}
      <div style={header}>
        <h1 style={title}>Vinculação Organizacional</h1>
        <button style={btnNovo} onClick={abrirNovo}>
          <Plus size={14} /> Novo vínculo
        </button>
      </div>

      {/* LISTA */}
      {hierarquia.map(d => {
        const totalDepto = d.funcoes.reduce(
          (acc: number, f: any) =>
            acc +
            f.usuarios.reduce(
              (a: number, u: any) => a + (u.custo_mensal || 0),
              0,
            ),
          0,
        )

        return (
          <div key={d.dpto_id} style={cardDepartamento}>
            <div
              style={dptoHeader}
              onClick={() => toggle(openDptos, d.dpto_id, setOpenDptos)}
            >
              {openDptos.includes(d.dpto_id)
                ? <ChevronDown size={18} />
                : <ChevronRight size={18} />}
              <span>{d.nome}</span>
              <span style={totalBadge}>{moeda(totalDepto)}</span>
            </div>

            {openDptos.includes(d.dpto_id) &&
              d.funcoes.map(f => {
                const totalFuncao = f.usuarios.reduce(
                  (acc: number, u: any) => acc + (u.custo_mensal || 0),
                  0,
                )

                return (
                  <div key={f.func_id} style={funcaoBlock}>
                    <div
                      style={funcaoHeader}
                      onClick={() =>
                        toggle(openFuncoes, f.func_id, setOpenFuncoes)
                      }
                    >
                      {openFuncoes.includes(f.func_id)
                        ? <ChevronDown size={14} />
                        : <ChevronRight size={14} />}
                      <Briefcase size={14} />
                      <span>{f.nome}</span>
                      <span style={subTotal}>{moeda(totalFuncao)}</span>
                    </div>

                    {openFuncoes.includes(f.func_id) &&
                      f.usuarios.map((u: any) => (
                        <div key={u.user_id} style={usuarioRow}>
                          <Users size={14} />
                          <span style={nome}>{u.nome}</span>
                          <span style={percentual}>
                            {u.percentual_alocacao}%
                          </span>
                          <span style={valor}>
                            {moeda(u.custo_mensal)}
                          </span>
                          <button
                            style={btnEditar}
                            onClick={() => abrirEdicao(d, f, u)}
                          >
                            <Pencil size={14} />
                          </button>
                        </div>
                      ))}
                  </div>
                )
              })}
          </div>
        )
      })}

      {/* MODAL */}
      {showModal && (
        <div style={overlay}>
          <div style={modal}>
            <div style={modalHeader}>
              <h2>{editando ? 'Alterar vínculo' : 'Novo vínculo'}</h2>
              <X
                style={{ cursor: 'pointer' }}
                onClick={() => setShowModal(false)}
              />
            </div>

            <div style={modalBody}>
              <select
                style={input}
                value={form.dpto_id}
                disabled={!!editando}
                onChange={e =>
                  setForm({ ...form, dpto_id: e.target.value })
                }
              >
                <option value="">Departamento</option>
                {departamentos.map(d => (
                  <option key={d.dpto_id} value={d.dpto_id}>
                    {d.nome}
                  </option>
                ))}
              </select>

              <select
                style={input}
                value={form.func_id}
                disabled={!!editando}
                onChange={e =>
                  setForm({ ...form, func_id: e.target.value })
                }
              >
                <option value="">Função</option>
                {funcoes.map(f => (
                  <option key={f.func_id} value={f.func_id}>
                    {f.nome}
                  </option>
                ))}
              </select>

              <select
                style={input}
                value={form.user_id}
                disabled={!!editando}
                onChange={e =>
                  setForm({ ...form, user_id: e.target.value })
                }
              >
                <option value="">Usuário</option>
                {usuarios.map(u => (
                  <option key={u.user_id} value={u.user_id}>
                    {u.nome}
                  </option>
                ))}
              </select>

              <input
                style={input}
                type="number"
                min={0}
                max={100}
                value={form.percentual_alocacao}
                onChange={e =>
                  setForm({
                    ...form,
                    percentual_alocacao: Number(e.target.value),
                  })
                }
              />

              <input
                style={input}
                type="number"
                step="0.01"
                value={form.custo_mensal}
                onChange={e =>
                  setForm({
                    ...form,
                    custo_mensal: e.target.value,
                  })
                }
              />
            </div>

            <div style={modalFooter}>
              <button
                style={btnCancelar}
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
              <button style={btnSalvar} onClick={salvar}>
                {editando ? 'Atualizar' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ========================
   STYLES (inalterados)
======================== */

const header = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 24,
}

const title = {
  fontSize: 26,
  fontWeight: 700,
}

const btnNovo = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  height: 38,
  padding: '0 16px',
  background: '#16a34a',
  color: '#fff',
  borderRadius: 8,
  border: 'none',
  cursor: 'pointer',
  fontSize: 14,
  fontWeight: 600,
}

const cardDepartamento = {
  background: '#fff',
  borderRadius: 12,
  padding: 16,
  marginBottom: 18,
  borderLeft: '4px solid #2563eb',
}

const dptoHeader = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  fontSize: 18,
  fontWeight: 600,
  cursor: 'pointer',
}

const funcaoBlock = {
  marginLeft: 20,
  marginTop: 14,
}

const funcaoHeader = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  fontSize: 15,
  fontWeight: 500,
  cursor: 'pointer',
}

const usuarioRow = {
  display: 'grid',
  gridTemplateColumns: 'auto 1fr 80px 120px 36px',
  alignItems: 'center',
  gap: 8,
  marginLeft: 34,
  marginTop: 6,
  fontSize: 14,
}

const nome = {
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}

const percentual = {
  textAlign: 'center' as const,
  background: '#e0f2fe',
  color: '#0369a1',
  padding: '2px 6px',
  borderRadius: 12,
  fontSize: 12,
  fontWeight: 600,
}

const valor = {
  textAlign: 'right' as const,
  fontWeight: 600,
  color: '#065f46',
}

const btnEditar = {
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  color: '#2563eb',
}

const totalBadge = {
  marginLeft: 'auto',
  background: '#ecfeff',
  color: '#155e75',
  padding: '4px 10px',
  borderRadius: 14,
  fontSize: 13,
  fontWeight: 700,
}

const subTotal = {
  marginLeft: 'auto',
  background: '#f0fdf4',
  color: '#166534',
  padding: '3px 8px',
  borderRadius: 12,
  fontSize: 12,
  fontWeight: 600,
}

const overlay = {
  position: 'fixed' as const,
  inset: 0,
  background: 'rgba(0,0,0,0.4)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 50,
}

const modal = {
  background: '#fff',
  width: 440,
  borderRadius: 12,
  overflow: 'hidden',
}

const modalHeader = {
  padding: '16px 20px',
  borderBottom: '1px solid #e5e7eb',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}

const modalBody = {
  padding: 20,
  display: 'flex',
  flexDirection: 'column' as const,
  gap: 12,
}

const modalFooter = {
  padding: '12px 20px',
  borderTop: '1px solid #e5e7eb',
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 10,
}

const input = {
  padding: '10px 12px',
  borderRadius: 8,
  border: '1px solid #d1d5db',
}

const btnCancelar = {
  padding: '8px 14px',
  borderRadius: 8,
  border: 'none',
  background: '#e5e7eb',
  cursor: 'pointer',
}

const btnSalvar = {
  padding: '8px 14px',
  borderRadius: 8,
  border: 'none',
  background: '#16a34a',
  color: '#fff',
  cursor: 'pointer',
}
