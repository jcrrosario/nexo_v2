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

type Funcionario = {
  funcionario_id: number
  nome_completo: string
  cpf: string
  rg: string
  pis_pasep: string
  data_nascimento: string
  endereco: string
  cep: string
  bairro: string
  municipio: string
  sexo: string
  estado_civil: string
  grau_instrucao: string
  carteira_trabalho: string
  serie: string
  uf: string
  data_carteira_trabalho: string
  data_admissao: string
  data_demissao: string
  funcao_id: number | null
  dpto_id: number | null
  salario_bruto: number
  encargos: number
  provisoes: number
  beneficios: number
  funcao_nome?: string
  departamento_nome?: string
  created_at: string
  updated_at: string
  user_id_log: string
}

type Funcao = {
  func_id: number
  nome: string
}

type Departamento = {
  dpto_id: number
  nome: string
}

export default function FuncionariosPage() {
  const [dados, setDados] = useState<Funcionario[]>([])
  const [funcoes, setFuncoes] = useState<Funcao[]>([])
  const [departamentos, setDepartamentos] = useState<Departamento[]>([])
  const [busca, setBusca] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const [open, setOpen] = useState(false)
  const [editando, setEditando] = useState(false)
  const [confirmar, setConfirmar] = useState<Funcionario | null>(null)
  const [log, setLog] = useState<Funcionario | null>(null)

  const [form, setForm] = useState<any>({
    nome_completo: '',
    cpf: '',
    rg: '',
    pis_pasep: '',
    data_nascimento: '',
    endereco: '',
    cep: '',
    bairro: '',
    municipio: '',
    sexo: '',
    estado_civil: '',
    grau_instrucao: '',
    carteira_trabalho: '',
    serie: '',
    uf: '',
    data_carteira_trabalho: '',
    data_admissao: '',
    data_demissao: '',
    funcao_id: '',
    dpto_id: '',
    salario_bruto: 0,
    encargos: 0,
    provisoes: 0,
    beneficios: 0,
  })

  const pageSize = 5

  async function carregar() {
    const res = await api.get(
      `/entity/funcionarios?page=${page}&limit=${pageSize}&search=${busca}`,
    )

    const resFuncoes = await api.get(
      `/entity/funcao?page=1&limit=1000&search=`,
    )

    const resDepartamentos = await api.get(
      `/entity/departamentos?page=1&limit=1000&search=`,
    )

    setDados(res.data)
    setTotal(res.total)
    setFuncoes(resFuncoes.data)
    setDepartamentos(resDepartamentos.data)
  }

  useEffect(() => {
    carregar()
  }, [page, busca])

  function novo() {
    setForm({
      nome_completo: '',
      cpf: '',
      rg: '',
      pis_pasep: '',
      data_nascimento: '',
      endereco: '',
      cep: '',
      bairro: '',
      municipio: '',
      sexo: '',
      estado_civil: '',
      grau_instrucao: '',
      carteira_trabalho: '',
      serie: '',
      uf: '',
      data_carteira_trabalho: '',
      data_admissao: '',
      data_demissao: '',
      funcao_id: '',
      dpto_id: '',
      salario_bruto: 0,
      encargos: 0,
      provisoes: 0,
      beneficios: 0,
    })
    setEditando(false)
    setOpen(true)
  }

  function editar(item: Funcionario) {
    setForm({
      ...item,
      funcao_id: item.funcao_id || '',
      dpto_id: item.dpto_id || '',
      salario_bruto: item.salario_bruto || 0,
      encargos: item.encargos || 0,
      provisoes: item.provisoes || 0,
      beneficios: item.beneficios || 0,
      data_nascimento: formatDateInput(item.data_nascimento),
      data_carteira_trabalho: formatDateInput(item.data_carteira_trabalho),
      data_admissao: formatDateInput(item.data_admissao),
      data_demissao: formatDateInput(item.data_demissao),
    })
    setEditando(true)
    setOpen(true)
  }

  async function salvar() {
    const payload = {
      ...form,
      salario_bruto: Number(form.salario_bruto || 0),
      encargos: Number(form.encargos || 0),
      provisoes: Number(form.provisoes || 0),
      beneficios: Number(form.beneficios || 0),
    }

    if (editando) {
      await api.put(`/entity/funcionarios/${form.funcionario_id}`, payload)
    } else {
      await api.post('/entity/funcionarios', payload)
    }

    setOpen(false)
    carregar()
  }

  async function excluir() {
    if (!confirmar) return
    await api.put(`/entity/funcionarios/${confirmar.funcionario_id}/excluir`, {})
    setConfirmar(null)
    carregar()
  }

  function gerarPDF() {
    const doc = new jsPDF('l', 'mm', 'a4')

    doc.setFontSize(18)
    doc.text('Relatório de Funcionários', 14, 20)

    doc.setFontSize(11)
    doc.setTextColor(100)
    doc.text(`Gerado em: ${new Date().toLocaleString()}`, 14, 28)

    autoTable(doc, {
      startY: 36,
      head: [['Nome', 'CPF', 'Função', 'Setor', 'Admissão', 'Salário']],
      body: dados.map(d => [
        d.nome_completo || '',
        d.cpf || '',
        d.funcao_nome || '',
        d.departamento_nome || '',
        formatDateBR(d.data_admissao),
        formatMoney(d.salario_bruto),
      ]),
      styles: {
        fontSize: 9,
        cellPadding: 4,
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

    doc.save('funcionarios.pdf')
  }

  function gerarExcel() {
    const worksheetData = dados.map(d => ({
      'Nome Completo': d.nome_completo,
      CPF: d.cpf || '',
      RG: d.rg || '',
      'PIS/PASEP': d.pis_pasep || '',
      'Data Nascimento': formatDateBR(d.data_nascimento),
      Endereço: d.endereco || '',
      CEP: d.cep || '',
      Bairro: d.bairro || '',
      Município: d.municipio || '',
      Sexo: d.sexo || '',
      'Estado Civil': d.estado_civil || '',
      'Grau de Instrução': d.grau_instrucao || '',
      'Carteira de Trabalho': d.carteira_trabalho || '',
      Série: d.serie || '',
      UF: d.uf || '',
      'Data Carteira de Trabalho': formatDateBR(d.data_carteira_trabalho),
      'Data de Admissão': formatDateBR(d.data_admissao),
      'Data de Demissão': formatDateBR(d.data_demissao),
      Função: d.funcao_nome || '',
      Setor: d.departamento_nome || '',
      'Salário Bruto': d.salario_bruto || 0,
      Encargos: d.encargos || 0,
      Provisões: d.provisoes || 0,
      Benefícios: d.beneficios || 0,
      'Criado em': new Date(d.created_at).toLocaleString(),
      'Última atualização': new Date(d.updated_at).toLocaleString(),
      'Alterado por': d.user_id_log || '',
    }))

    const ws = XLSX.utils.json_to_sheet(worksheetData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Funcionários')
    XLSX.writeFile(wb, 'funcionarios.xlsx')
  }

  return (
    <CrudLayout
      title="Funcionários"
      subtitle="Cadastro de funcionários da empresa"
      actions={
        <div style={actions}>
          <button style={btnDark} onClick={gerarPDF}>
            <FileText size={16} /> PDF
          </button>
          <button style={btnExcel} onClick={gerarExcel}>
            <FileSpreadsheet size={16} /> Excel
          </button>
          <button style={btnPrimary} onClick={novo}>
            <Plus size={16} /> Novo Funcionário
          </button>
        </div>
      }
    >
      <input
        placeholder="Buscar funcionário..."
        value={busca}
        onChange={e => {
          setBusca(e.target.value)
          setPage(1)
        }}
        style={search}
      />

      <CrudTable
        columns={[
          { key: 'nome_completo', label: 'Nome' },
          { key: 'cpf', label: 'CPF' },
          { key: 'funcao_nome', label: 'Função' },
          { key: 'departamento_nome', label: 'Setor' },
          {
            key: 'salario_bruto',
            label: 'Salário',
            render: d => formatMoney(d.salario_bruto),
          },
          {
            key: 'actions',
            label: 'Ações',
            render: d => (
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
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
              Deseja excluir o funcionário{' '}
              <strong>{confirmar.nome_completo}</strong>?
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
          <div style={modalXL}>
            <h3>{editando ? 'Editar' : 'Novo'} Funcionário</h3>

            <div style={sectionTitle}>Identificação do Trabalhador</div>

            <div style={gridThree}>
              <div style={fullWidth}>
                <label style={label}>Nome Completo</label>
                <input
                  placeholder="Digite o nome completo"
                  value={form.nome_completo}
                  onChange={e =>
                    setForm({ ...form, nome_completo: e.target.value })
                  }
                  style={input}
                />
              </div>

              <div>
                <label style={label}>CPF</label>
                <input
                  placeholder="Digite o CPF"
                  value={form.cpf}
                  onChange={e => setForm({ ...form, cpf: e.target.value })}
                  style={input}
                />
              </div>

              <div>
                <label style={label}>RG</label>
                <input
                  placeholder="Digite o RG"
                  value={form.rg}
                  onChange={e => setForm({ ...form, rg: e.target.value })}
                  style={input}
                />
              </div>

              <div>
                <label style={label}>PIS/PASEP</label>
                <input
                  placeholder="Digite o PIS/PASEP"
                  value={form.pis_pasep}
                  onChange={e =>
                    setForm({ ...form, pis_pasep: e.target.value })
                  }
                  style={input}
                />
              </div>

              <div>
                <label style={label}>Data de Nascimento</label>
                <input
                  type="date"
                  value={form.data_nascimento}
                  onChange={e =>
                    setForm({ ...form, data_nascimento: e.target.value })
                  }
                  style={input}
                />
              </div>

              <div style={fullWidth}>
                <label style={label}>Endereço</label>
                <input
                  placeholder="Digite o endereço"
                  value={form.endereco}
                  onChange={e =>
                    setForm({ ...form, endereco: e.target.value })
                  }
                  style={input}
                />
              </div>

              <div>
                <label style={label}>CEP</label>
                <input
                  placeholder="Digite o CEP"
                  value={form.cep}
                  onChange={e => setForm({ ...form, cep: e.target.value })}
                  style={input}
                />
              </div>

              <div>
                <label style={label}>Bairro</label>
                <input
                  placeholder="Digite o bairro"
                  value={form.bairro}
                  onChange={e => setForm({ ...form, bairro: e.target.value })}
                  style={input}
                />
              </div>

              <div>
                <label style={label}>Município</label>
                <input
                  placeholder="Digite o município"
                  value={form.municipio}
                  onChange={e =>
                    setForm({ ...form, municipio: e.target.value })
                  }
                  style={input}
                />
              </div>

              <div>
                <label style={label}>Sexo</label>
                <select
                  value={form.sexo}
                  onChange={e => setForm({ ...form, sexo: e.target.value })}
                  style={input}
                >
                  <option value="">Selecione o sexo</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div>
                <label style={label}>Estado Civil</label>
                <select
                  value={form.estado_civil}
                  onChange={e =>
                    setForm({ ...form, estado_civil: e.target.value })
                  }
                  style={input}
                >
                  <option value="">Selecione o estado civil</option>
                  <option value="Solteiro(a)">Solteiro(a)</option>
                  <option value="Casado(a)">Casado(a)</option>
                  <option value="Divorciado(a)">Divorciado(a)</option>
                  <option value="Viúvo(a)">Viúvo(a)</option>
                  <option value="União estável">União estável</option>
                </select>
              </div>

              <div>
                <label style={label}>Grau de Instrução</label>
                <input
                  placeholder="Digite o grau de instrução"
                  value={form.grau_instrucao}
                  onChange={e =>
                    setForm({ ...form, grau_instrucao: e.target.value })
                  }
                  style={input}
                />
              </div>

              <div>
                <label style={label}>Carteira de Trabalho</label>
                <input
                  placeholder="Digite o número"
                  value={form.carteira_trabalho}
                  onChange={e =>
                    setForm({ ...form, carteira_trabalho: e.target.value })
                  }
                  style={input}
                />
              </div>

              <div>
                <label style={label}>Série</label>
                <input
                  placeholder="Digite a série"
                  value={form.serie}
                  onChange={e => setForm({ ...form, serie: e.target.value })}
                  style={input}
                />
              </div>

              <div>
                <label style={label}>UF</label>
                <input
                  placeholder="UF"
                  maxLength={2}
                  value={form.uf}
                  onChange={e => setForm({ ...form, uf: e.target.value })}
                  style={input}
                />
              </div>

              <div>
                <label style={label}>Data da Carteira de Trabalho</label>
                <input
                  type="date"
                  value={form.data_carteira_trabalho}
                  onChange={e =>
                    setForm({
                      ...form,
                      data_carteira_trabalho: e.target.value,
                    })
                  }
                  style={input}
                />
              </div>

              <div>
                <label style={label}>Data de Admissão</label>
                <input
                  type="date"
                  value={form.data_admissao}
                  onChange={e =>
                    setForm({ ...form, data_admissao: e.target.value })
                  }
                  style={input}
                />
              </div>

              <div>
                <label style={label}>Data de Demissão</label>
                <input
                  type="date"
                  value={form.data_demissao}
                  onChange={e =>
                    setForm({ ...form, data_demissao: e.target.value })
                  }
                  style={input}
                />
              </div>
            </div>

            <div style={sectionTitle}>Informações Ocupacionais</div>

            <div style={gridThree}>
              <div>
                <label style={label}>Função</label>
                <select
                  value={form.funcao_id}
                  onChange={e => setForm({ ...form, funcao_id: e.target.value })}
                  style={input}
                >
                  <option value="">Selecione a função</option>
                  {funcoes.map(f => (
                    <option key={f.func_id} value={f.func_id}>
                      {f.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={label}>Setor</label>
                <select
                  value={form.dpto_id}
                  onChange={e => setForm({ ...form, dpto_id: e.target.value })}
                  style={input}
                >
                  <option value="">Selecione o setor</option>
                  {departamentos.map(d => (
                    <option key={d.dpto_id} value={d.dpto_id}>
                      {d.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={sectionTitle}>Informações de Custos</div>

            <div style={gridFour}>
              <div>
                <label style={label}>Salário Bruto (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.salario_bruto}
                  onChange={e =>
                    setForm({ ...form, salario_bruto: e.target.value })
                  }
                  style={input}
                />
              </div>

              <div>
                <label style={label}>Encargos (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.encargos}
                  onChange={e => setForm({ ...form, encargos: e.target.value })}
                  style={input}
                />
              </div>

              <div>
                <label style={label}>Provisões (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.provisoes}
                  onChange={e =>
                    setForm({ ...form, provisoes: e.target.value })
                  }
                  style={input}
                />
              </div>

              <div>
                <label style={label}>Benefícios (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.beneficios}
                  onChange={e =>
                    setForm({ ...form, beneficios: e.target.value })
                  }
                  style={input}
                />
              </div>
            </div>

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

function formatDateInput(value?: string) {
  if (!value) return ''
  return value.slice(0, 10)
}

function formatDateBR(value?: string) {
  if (!value) return ''
  const data = new Date(value)
  if (isNaN(data.getTime())) return ''
  return data.toLocaleDateString('pt-BR')
}

function formatMoney(value?: number) {
  return Number(value || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

/* ===== styles ===== */

const search: CSSProperties = {
  width: 280,
  padding: '8px 12px',
  borderRadius: 6,
  border: '1px solid #d1d5db',
  marginBottom: 16,
}

const actions: CSSProperties = {
  display: 'flex',
  gap: 10,
}

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
  zIndex: 9999,
  padding: 20,
}

const modal: CSSProperties = {
  background: '#fff',
  borderRadius: 12,
  width: 420,
  padding: 24,
}

const modalXL: CSSProperties = {
  background: '#fff',
  borderRadius: 12,
  width: '96vw',
  maxWidth: 1500,
  maxHeight: '95vh',
  overflowY: 'auto',
  padding: 24,
  boxShadow: '0 20px 50px rgba(0,0,0,0.18)',
}

const input: CSSProperties = {
  padding: '10px 12px',
  borderRadius: 6,
  border: '1px solid #d1d5db',
  width: '100%',
}

const label: CSSProperties = {
  fontSize: 12,
  marginBottom: 4,
  display: 'block',
  color: '#374151',
  fontWeight: 600,
}

const modalFooter: CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 10,
  marginTop: 20,
}

const sectionTitle: CSSProperties = {
  marginTop: 18,
  marginBottom: 12,
  fontWeight: 700,
  color: '#0b1a3a',
  fontSize: 18,
}

const gridThree: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: 14,
  alignItems: 'end',
}

const gridFour: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  gap: 14,
  alignItems: 'end',
}

const fullWidth: CSSProperties = {
  gridColumn: '1 / -1',
}