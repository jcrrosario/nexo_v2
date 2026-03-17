'use client'

import { useEffect, useState } from 'react'
import {
  ChevronDown,
  ChevronRight,
  Users,
  Briefcase,
  Building2,
} from 'lucide-react'

function moeda(valor: number) {
  return (valor || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export default function VinculacaoOrganizacionalPage() {
  const [hierarquia, setHierarquia] = useState<any[]>([])
  const [openDptos, setOpenDptos] = useState<number[]>([])
  const [openFuncoes, setOpenFuncoes] = useState<number[]>([])

  useEffect(() => {
    carregarHierarquia()
  }, [])

  async function carregarHierarquia() {
    const token = localStorage.getItem('entity_token')

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/entity/vinculacao`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    const json = await res.json()
    setHierarquia(json || [])
  }

  function toggle(list: number[], id: number, setter: any) {
    setter(list.includes(id) ? list.filter(i => i !== id) : [...list, id])
  }

  return (
    <div>
      <div style={topHeader}>
        <h1 style={title}>Estrutura Organizacional</h1>
      </div>

      {hierarquia.map(d => (
        <div key={d.dpto_id} style={cardDepartamento}>
          <div
            style={dptoHeader}
            onClick={() => toggle(openDptos, d.dpto_id, setOpenDptos)}
          >
            <div style={headerLeft}>
              {openDptos.includes(d.dpto_id)
                ? <ChevronDown size={18} />
                : <ChevronRight size={18} />}
              <Building2 size={18} />
              <span>{d.nome}</span>
            </div>

            <div style={totaisHeader}>
              <span style={badgeInfo}>{d.total_funcionarios} funcionário(s)</span>
              <span style={totalBadge}>Custo total: {moeda(d.total_custo)}</span>
            </div>
          </div>

          {openDptos.includes(d.dpto_id) &&
            d.funcoes.map((f: any) => (
              <div key={f.func_id} style={funcaoBlock}>
                <div
                  style={funcaoHeader}
                  onClick={() => toggle(openFuncoes, f.func_id, setOpenFuncoes)}
                >
                  <div style={headerLeft}>
                    {openFuncoes.includes(f.func_id)
                      ? <ChevronDown size={14} />
                      : <ChevronRight size={14} />}
                    <Briefcase size={14} />
                    <span>{f.nome}</span>
                  </div>

                  <div style={totaisHeader}>
                    <span style={badgeInfo}>
                      {f.total_funcionarios} funcionário(s)
                    </span>
                    <span style={subTotal}>
                      Custo total: {moeda(f.total_custo)}
                    </span>
                  </div>
                </div>

                {openFuncoes.includes(f.func_id) && (
                  <div style={usuariosWrapper}>
                    <div style={gridHeader}>
                      <div></div>
                      <div>Funcionário</div>
                      <div style={headerNumber}>Salário bruto</div>
                      <div style={headerNumber}>Total encargos</div>
                      <div style={headerNumber}>Total provisões</div>
                      <div style={headerNumber}>Total benefícios</div>
                      <div style={headerNumber}>Custo total</div>
                    </div>

                    {f.usuarios.map((u: any) => (
                      <div key={u.funcionario_id} style={usuarioRow}>
                        <Users size={14} />
                        <span style={nome}>{u.nome}</span>
                        <span style={valor}>{moeda(u.salario_bruto)}</span>
                        <span style={valor}>{moeda(u.encargos)}</span>
                        <span style={valor}>{moeda(u.provisoes)}</span>
                        <span style={valor}>{moeda(u.beneficios)}</span>
                        <span style={valorTotal}>{moeda(u.custo_total)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
        </div>
      ))}
    </div>
  )
}

const topHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 24,
}

const title = {
  fontSize: 26,
  fontWeight: 700,
}

const cardDepartamento = {
  background: '#fff',
  borderRadius: 12,
  padding: 16,
  marginBottom: 18,
  borderLeft: '4px solid #2563eb',
  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
}

const dptoHeader = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  fontSize: 18,
  fontWeight: 600,
  cursor: 'pointer',
  flexWrap: 'wrap' as const,
}

const headerLeft = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
}

const totaisHeader = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  flexWrap: 'wrap' as const,
}

const badgeInfo = {
  background: '#f3f4f6',
  color: '#374151',
  padding: '4px 10px',
  borderRadius: 14,
  fontSize: 12,
  fontWeight: 700,
}

const totalBadge = {
  background: '#ecfeff',
  color: '#155e75',
  padding: '4px 10px',
  borderRadius: 14,
  fontSize: 13,
  fontWeight: 700,
}

const funcaoBlock = {
  marginLeft: 20,
  marginTop: 14,
}

const funcaoHeader = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  fontSize: 15,
  fontWeight: 500,
  cursor: 'pointer',
  flexWrap: 'wrap' as const,
}

const subTotal = {
  background: '#f0fdf4',
  color: '#166534',
  padding: '3px 8px',
  borderRadius: 12,
  fontSize: 12,
  fontWeight: 600,
}

const usuariosWrapper = {
  marginLeft: 34,
  marginTop: 10,
  overflowX: 'auto' as const,
}

const gridHeader = {
  display: 'grid',
  gridTemplateColumns: '30px minmax(220px, 1fr) 140px 140px 140px 140px 150px',
  alignItems: 'center',
  gap: 8,
  padding: '8px 0',
  borderBottom: '1px solid #e5e7eb',
  fontSize: 12,
  fontWeight: 700,
  color: '#6b7280',
  minWidth: 980,
}

const headerNumber = {
  textAlign: 'right' as const,
}

const usuarioRow = {
  display: 'grid',
  gridTemplateColumns: '30px minmax(220px, 1fr) 140px 140px 140px 140px 150px',
  alignItems: 'center',
  gap: 8,
  padding: '10px 0',
  borderBottom: '1px solid #f3f4f6',
  fontSize: 14,
  minWidth: 980,
}

const nome = {
  whiteSpace: 'nowrap' as const,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}

const valor = {
  textAlign: 'right' as const,
  fontWeight: 600,
  color: '#065f46',
}

const valorTotal = {
  textAlign: 'right' as const,
  fontWeight: 700,
  color: '#1d4ed8',
}