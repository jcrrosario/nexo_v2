'use client'

import { useEffect, useState, CSSProperties } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Plus, Trash2, ArrowLeft, Pencil } from 'lucide-react'

import CrudLayout from '../../../../components/CrudLayout'
import CrudTable from '../../../../components/CrudTable'

import { api } from '@/lib/api'

type Cat = {
  func_cat_id: number
  funcionario_id: number
  numero_controle: string
  data_abertura: string
  hora_abertura: string
  emitente: number
  tipo_cat: number
  data_ocorrido: string
  hora_ocorrido: string
  apos_quantas_horas_trabalho: string
  tipo_ocorrido: number
  houve_afastamento: string
  ultimo_dia_trabalhado: string
  local_ocorrido: string
  especificacao_local: string
  municipio_ocorrido: string
  uf_ocorrido: string
  parte_corpo_atingida: string
  agente_causador: string
  descricao_situacao: string
  data_hora_atestado: string
  codigo_cid: string
  nome_medico: string
  crm: string
  tempo_estimado_afastamento_dias: number
}

const emitentes = [
  { value: 1, label: '1 - Empregador' },
  { value: 2, label: '2 - Sindicato' },
  { value: 3, label: '3 - Médico' },
  { value: 4, label: '4 - Segurado ou dependente' },
  { value: 5, label: '5 - Autoridade Pública' },
]

const tiposCat = [
  { value: 1, label: '1 - Inicial' },
  { value: 2, label: '2 - Reabertura' },
  { value: 3, label: '3 - Comunicação de óbito' },
]

const tiposOcorrido = [
  { value: 1, label: '1 - Típico' },
  { value: 2, label: '2 - Doença' },
  { value: 3, label: '3 - Trajeto' },
]

const ufs = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
]

function getDataAtual() {
  const agora = new Date()
  const ano = agora.getFullYear()
  const mes = String(agora.getMonth() + 1).padStart(2, '0')
  const dia = String(agora.getDate()).padStart(2, '0')
  return `${ano}-${mes}-${dia}`
}

function getHoraAtual() {
  const agora = new Date()
  const hora = String(agora.getHours()).padStart(2, '0')
  const minuto = String(agora.getMinutes()).padStart(2, '0')
  return `${hora}:${minuto}`
}

function formatDateTimeLocal(value: string | null | undefined) {
  if (!value) return ''
  const data = new Date(value)
  if (Number.isNaN(data.getTime())) return ''
  const ano = data.getFullYear()
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const dia = String(data.getDate()).padStart(2, '0')
  const hora = String(data.getHours()).padStart(2, '0')
  const minuto = String(data.getMinutes()).padStart(2, '0')
  return `${ano}-${mes}-${dia}T${hora}:${minuto}`
}

export default function FuncionarioCatPage() {
  const params = useParams()
  const router = useRouter()

  const id = params.id as string

  const [dados, setDados] = useState<Cat[]>([])
  const [funcionarioNome, setFuncionarioNome] = useState('')
  const [open, setOpen] = useState(false)
  const [confirmar, setConfirmar] = useState<Cat | null>(null)
  const [editando, setEditando] = useState<Cat | null>(null)

  const [form, setForm] = useState({
    numero_controle: '',
    data_abertura: getDataAtual(),
    hora_abertura: getHoraAtual(),
    emitente: 1,
    tipo_cat: 1,

    data_ocorrido: '',
    hora_ocorrido: '',
    apos_quantas_horas_trabalho: '',
    tipo_ocorrido: 1,
    houve_afastamento: 'Nao',
    ultimo_dia_trabalhado: '',

    local_ocorrido: '',
    especificacao_local: '',
    municipio_ocorrido: '',
    uf_ocorrido: '',

    parte_corpo_atingida: '',
    agente_causador: '',
    descricao_situacao: '',

    data_hora_atestado: '',
    codigo_cid: '',
    nome_medico: '',
    crm: '',
    tempo_estimado_afastamento_dias: '',
  })

  async function carregar() {
    const res = await api.get(`/entity/funcionario-cat/${id}`)
    setDados(res)
  }

  async function carregarFuncionario() {
    const res = await api.get(`/entity/funcionarios?page=1&limit=1000&search=`)
    const lista = res.data || []

    const funcionario = lista.find(
      (x: any) => String(x.funcionario_id) === String(id),
    )

    if (funcionario) {
      setFuncionarioNome(funcionario.nome_completo || '')
    }
  }

  useEffect(() => {
    carregar()
    carregarFuncionario()
  }, [])

  function limparForm() {
    setForm({
      numero_controle: '',
      data_abertura: getDataAtual(),
      hora_abertura: getHoraAtual(),
      emitente: 1,
      tipo_cat: 1,

      data_ocorrido: '',
      hora_ocorrido: '',
      apos_quantas_horas_trabalho: '',
      tipo_ocorrido: 1,
      houve_afastamento: 'Nao',
      ultimo_dia_trabalhado: '',

      local_ocorrido: '',
      especificacao_local: '',
      municipio_ocorrido: '',
      uf_ocorrido: '',

      parte_corpo_atingida: '',
      agente_causador: '',
      descricao_situacao: '',

      data_hora_atestado: '',
      codigo_cid: '',
      nome_medico: '',
      crm: '',
      tempo_estimado_afastamento_dias: '',
    })
  }

  function abrirNovo() {
    setEditando(null)
    limparForm()
    setOpen(true)
  }

  function abrirEdicao(cat: Cat) {
    setEditando(cat)
    setForm({
      numero_controle: cat.numero_controle || '',
      data_abertura: cat.data_abertura || '',
      hora_abertura: cat.hora_abertura || '',
      emitente: cat.emitente || 1,
      tipo_cat: cat.tipo_cat || 1,

      data_ocorrido: cat.data_ocorrido || '',
      hora_ocorrido: cat.hora_ocorrido || '',
      apos_quantas_horas_trabalho: cat.apos_quantas_horas_trabalho || '',
      tipo_ocorrido: cat.tipo_ocorrido || 1,
      houve_afastamento: cat.houve_afastamento || 'Nao',
      ultimo_dia_trabalhado: cat.ultimo_dia_trabalhado || '',

      local_ocorrido: cat.local_ocorrido || '',
      especificacao_local: cat.especificacao_local || '',
      municipio_ocorrido: cat.municipio_ocorrido || '',
      uf_ocorrido: cat.uf_ocorrido || '',

      parte_corpo_atingida: cat.parte_corpo_atingida || '',
      agente_causador: cat.agente_causador || '',
      descricao_situacao: cat.descricao_situacao || '',

      data_hora_atestado: formatDateTimeLocal(cat.data_hora_atestado),
      codigo_cid: cat.codigo_cid || '',
      nome_medico: cat.nome_medico || '',
      crm: cat.crm || '',
      tempo_estimado_afastamento_dias:
        cat.tempo_estimado_afastamento_dias?.toString() || '',
    })
    setOpen(true)
  }

  function fecharModal() {
    setOpen(false)
    setEditando(null)
    limparForm()
  }

  async function salvar() {
    const payload = {
      funcionario_id: Number(id),
      numero_controle: form.numero_controle,
      data_abertura: form.data_abertura,
      hora_abertura: form.hora_abertura,
      emitente: Number(form.emitente),
      tipo_cat: Number(form.tipo_cat),

      data_ocorrido: form.data_ocorrido,
      hora_ocorrido: form.hora_ocorrido,
      apos_quantas_horas_trabalho: form.apos_quantas_horas_trabalho || null,
      tipo_ocorrido: Number(form.tipo_ocorrido),
      houve_afastamento: form.houve_afastamento,
      ultimo_dia_trabalhado: form.ultimo_dia_trabalhado || null,

      local_ocorrido: form.local_ocorrido || null,
      especificacao_local: form.especificacao_local || null,
      municipio_ocorrido: form.municipio_ocorrido || null,
      uf_ocorrido: form.uf_ocorrido || null,

      parte_corpo_atingida: form.parte_corpo_atingida || null,
      agente_causador: form.agente_causador || null,
      descricao_situacao: form.descricao_situacao || null,

      data_hora_atestado: form.data_hora_atestado || null,
      codigo_cid: form.codigo_cid || null,
      nome_medico: form.nome_medico || null,
      crm: form.crm || null,
      tempo_estimado_afastamento_dias: form.tempo_estimado_afastamento_dias
        ? Number(form.tempo_estimado_afastamento_dias)
        : null,
    }

    if (editando) {
      await api.put(`/entity/funcionario-cat/${editando.func_cat_id}`, payload)
    } else {
      await api.post('/entity/funcionario-cat', payload)
    }

    fecharModal()
    carregar()
  }

  async function excluir() {
    if (!confirmar) return

    await api.put(`/entity/funcionario-cat/${confirmar.func_cat_id}/excluir`, {})

    setConfirmar(null)
    carregar()
  }

  function labelEmitente(valor: number) {
    const item = emitentes.find(x => x.value === valor)
    return item ? item.label : valor
  }

  function labelTipoCat(valor: number) {
    const item = tiposCat.find(x => x.value === valor)
    return item ? item.label : valor
  }

  function labelTipoOcorrido(valor: number) {
    const item = tiposOcorrido.find(x => x.value === valor)
    return item ? item.label : valor
  }

  return (
    <CrudLayout
      title="CAT do funcionário"
      subtitle={funcionarioNome ? `Funcionário: ${funcionarioNome}` : `Funcionário ID: ${id}`}
      actions={
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            style={btnSecondary}
            onClick={() => router.push('/dashboard/funcionarios')}
          >
            <ArrowLeft size={16} /> Voltar
          </button>

          <button style={btnPrimary} onClick={abrirNovo}>
            <Plus size={16} /> Nova CAT
          </button>
        </div>
      }
    >
      <CrudTable
        columns={[
          { key: 'numero_controle', label: 'Número de controle' },
          { key: 'data_abertura', label: 'Data abertura' },
          { key: 'hora_abertura', label: 'Hora abertura' },
          {
            key: 'emitente',
            label: 'Emitente',
            render: r => labelEmitente(r.emitente),
          },
          {
            key: 'tipo_cat',
            label: 'Tipo CAT',
            render: r => labelTipoCat(r.tipo_cat),
          },
          {
            key: 'tipo_ocorrido',
            label: 'Tipo ocorrência',
            render: r => labelTipoOcorrido(r.tipo_ocorrido),
          },
          {
            key: 'houve_afastamento',
            label: 'Afastamento',
          },
          {
            key: 'actions',
            label: 'Ações',
            render: r => (
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={btnEdit} onClick={() => abrirEdicao(r)} title="Editar">
                  <Pencil size={14} />
                </button>

                <button
                  style={btnDelete}
                  onClick={() => setConfirmar(r)}
                  title="Excluir"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ),
          },
        ]}
        data={dados}
      />

      {confirmar && (
        <div style={overlay}>
          <div style={modalLarge}>
            <h3>Confirmar exclusão</h3>

            <p>
              Deseja realmente excluir a CAT:
              <br />
              <strong>{confirmar.numero_controle}</strong>?
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
          <div style={modalLarge}>
            <h3>{editando ? 'Editar CAT' : 'Nova CAT'}</h3>

            <div style={sectionTitle}>1. Registro da CAT</div>

            <div style={fieldGroup}>
              <label style={label}>Número de controle</label>
              <input
                placeholder="Digite o número de controle"
                value={form.numero_controle}
                onChange={e => setForm({ ...form, numero_controle: e.target.value })}
                style={input}
              />
            </div>

            <div style={grid2}>
              <div style={fieldGroup}>
                <label style={label}>Data de abertura</label>
                <input
                  type="date"
                  value={form.data_abertura}
                  onChange={e => setForm({ ...form, data_abertura: e.target.value })}
                  style={input}
                />
              </div>

              <div style={fieldGroup}>
                <label style={label}>Hora de abertura</label>
                <input
                  type="time"
                  value={form.hora_abertura}
                  onChange={e => setForm({ ...form, hora_abertura: e.target.value })}
                  style={input}
                />
              </div>
            </div>

            <div style={grid2}>
              <div style={fieldGroup}>
                <label style={label}>Emitente</label>
                <select
                  value={form.emitente}
                  onChange={e =>
                    setForm({ ...form, emitente: Number(e.target.value) })
                  }
                  style={input}
                >
                  {emitentes.map(item => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div style={fieldGroup}>
                <label style={label}>Tipo da CAT</label>
                <select
                  value={form.tipo_cat}
                  onChange={e =>
                    setForm({ ...form, tipo_cat: Number(e.target.value) })
                  }
                  style={input}
                >
                  {tiposCat.map(item => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={sectionTitle}>2. Detalhes da ocorrência</div>

            <div style={grid2}>
              <div style={fieldGroup}>
                <label style={label}>Data do ocorrido</label>
                <input
                  type="date"
                  value={form.data_ocorrido}
                  onChange={e => setForm({ ...form, data_ocorrido: e.target.value })}
                  style={input}
                />
              </div>

              <div style={fieldGroup}>
                <label style={label}>Hora do ocorrido</label>
                <input
                  type="time"
                  value={form.hora_ocorrido}
                  onChange={e => setForm({ ...form, hora_ocorrido: e.target.value })}
                  style={input}
                />
              </div>
            </div>

            <div style={fieldGroup}>
              <label style={label}>Após quantas horas de trabalho</label>
              <input
                placeholder="Ex.: 4 horas trabalhadas"
                value={form.apos_quantas_horas_trabalho}
                onChange={e =>
                  setForm({ ...form, apos_quantas_horas_trabalho: e.target.value })
                }
                style={input}
              />
            </div>

            <div style={grid2}>
              <div style={fieldGroup}>
                <label style={label}>Tipo do ocorrido</label>
                <select
                  value={form.tipo_ocorrido}
                  onChange={e =>
                    setForm({ ...form, tipo_ocorrido: Number(e.target.value) })
                  }
                  style={input}
                >
                  {tiposOcorrido.map(item => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div style={fieldGroup}>
                <label style={label}>Houve afastamento</label>
                <select
                  value={form.houve_afastamento}
                  onChange={e =>
                    setForm({ ...form, houve_afastamento: e.target.value })
                  }
                  style={input}
                >
                  <option value="Nao">Não</option>
                  <option value="Sim">Sim</option>
                </select>
              </div>
            </div>

            <div style={fieldGroup}>
              <label style={label}>Último dia trabalhado</label>
              <input
                type="date"
                value={form.ultimo_dia_trabalhado}
                onChange={e =>
                  setForm({ ...form, ultimo_dia_trabalhado: e.target.value })
                }
                style={input}
              />
            </div>

            <div style={fieldGroup}>
              <label style={label}>Local do ocorrido</label>
              <input
                placeholder="Digite o local do ocorrido"
                value={form.local_ocorrido}
                onChange={e => setForm({ ...form, local_ocorrido: e.target.value })}
                style={input}
              />
            </div>

            <div style={fieldGroup}>
              <label style={label}>Especificação do local</label>
              <input
                placeholder="Detalhe melhor o local"
                value={form.especificacao_local}
                onChange={e =>
                  setForm({ ...form, especificacao_local: e.target.value })
                }
                style={input}
              />
            </div>

            <div style={grid2}>
              <div style={fieldGroup}>
                <label style={label}>Município do ocorrido</label>
                <input
                  placeholder="Digite o município"
                  value={form.municipio_ocorrido}
                  onChange={e =>
                    setForm({ ...form, municipio_ocorrido: e.target.value })
                  }
                  style={input}
                />
              </div>

              <div style={fieldGroup}>
                <label style={label}>UF do ocorrido</label>
                <select
                  value={form.uf_ocorrido}
                  onChange={e => setForm({ ...form, uf_ocorrido: e.target.value })}
                  style={input}
                >
                  <option value="">Selecione a UF</option>
                  {ufs.map(uf => (
                    <option key={uf} value={uf}>
                      {uf}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={fieldGroup}>
              <label style={label}>Parte do corpo atingida</label>
              <input
                placeholder="Digite a parte do corpo atingida"
                value={form.parte_corpo_atingida}
                onChange={e =>
                  setForm({ ...form, parte_corpo_atingida: e.target.value })
                }
                style={input}
              />
            </div>

            <div style={fieldGroup}>
              <label style={label}>Agente causador</label>
              <input
                placeholder="Digite o agente causador"
                value={form.agente_causador}
                onChange={e =>
                  setForm({ ...form, agente_causador: e.target.value })
                }
                style={input}
              />
            </div>

            <div style={fieldGroup}>
              <label style={label}>Descrição da situação do ocorrido</label>
              <textarea
                placeholder="Descreva a situação do ocorrido"
                value={form.descricao_situacao}
                onChange={e =>
                  setForm({ ...form, descricao_situacao: e.target.value })
                }
                style={textarea}
              />
            </div>

            <div style={sectionTitle}>3. Informações médicas</div>

            <div style={fieldGroup}>
              <label style={label}>Data e hora do atestado médico</label>
              <input
                type="datetime-local"
                value={form.data_hora_atestado}
                onChange={e =>
                  setForm({ ...form, data_hora_atestado: e.target.value })
                }
                style={input}
              />
            </div>

            <div style={grid2}>
              <div style={fieldGroup}>
                <label style={label}>Código do CID</label>
                <input
                  placeholder="Digite o código CID"
                  value={form.codigo_cid}
                  onChange={e => setForm({ ...form, codigo_cid: e.target.value })}
                  style={input}
                />
              </div>

              <div style={fieldGroup}>
                <label style={label}>CRM</label>
                <input
                  placeholder="Digite o CRM"
                  value={form.crm}
                  onChange={e => setForm({ ...form, crm: e.target.value })}
                  style={input}
                />
              </div>
            </div>

            <div style={fieldGroup}>
              <label style={label}>Nome do médico</label>
              <input
                placeholder="Digite o nome do médico"
                value={form.nome_medico}
                onChange={e => setForm({ ...form, nome_medico: e.target.value })}
                style={input}
              />
            </div>

            <div style={fieldGroup}>
              <label style={label}>Tempo estimado de afastamento em dias</label>
              <input
                type="number"
                placeholder="Digite a quantidade de dias"
                value={form.tempo_estimado_afastamento_dias}
                onChange={e =>
                  setForm({
                    ...form,
                    tempo_estimado_afastamento_dias: e.target.value,
                  })
                }
                style={input}
              />
            </div>

            <div style={footer}>
              <button style={btnCancel} onClick={fecharModal}>
                Cancelar
              </button>

              <button style={btnPrimary} onClick={salvar}>
                {editando ? 'Salvar alterações' : 'Salvar'}
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

const btnSecondary: CSSProperties = {
  background: '#e5e7eb',
  padding: '8px 14px',
  borderRadius: 6,
  border: 'none',
}

const btnEdit: CSSProperties = {
  background: '#2563eb',
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  padding: '6px 10px',
}

const btnDelete: CSSProperties = {
  background: '#dc2626',
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  padding: '6px 10px',
}

const btnCancel: CSSProperties = {
  background: '#e5e7eb',
  padding: '8px 14px',
  borderRadius: 6,
  border: 'none',
}

const overlay: CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.4)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999,
}

const modalLarge: CSSProperties = {
  background: '#fff',
  borderRadius: 12,
  width: 900,
  maxHeight: '90vh',
  overflowY: 'auto',
  padding: 24,
}

const fieldGroup: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  marginTop: 10,
}

const label: CSSProperties = {
  fontSize: 12,
  marginBottom: 4,
  display: 'block',
  color: '#374151',
  fontWeight: 600,
}

const input: CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 6,
  border: '1px solid #d1d5db',
}

const textarea: CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 6,
  border: '1px solid #d1d5db',
  minHeight: 100,
}

const footer: CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 10,
  marginTop: 20,
}

const sectionTitle: CSSProperties = {
  marginTop: 20,
  marginBottom: 8,
  fontWeight: 700,
  fontSize: 15,
  color: '#111827',
}

const grid2: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 12,
}