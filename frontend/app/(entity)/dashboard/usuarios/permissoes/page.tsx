'use client'

import { useEffect, useState, CSSProperties } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import CrudLayout from '../../../components/CrudLayout'
import { api } from '@/lib/api'

type Rotina = {
  rotina_id: string
  nome: string
  pode_incluir: boolean
  pode_alterar: boolean
  pode_excluir: boolean
  pode_relatorio: boolean
}

export default function PermissoesUsuarioPage() {

  const params = useSearchParams()
  const router = useRouter()
  const user_id = params.get('user_id')

  const [rotinas, setRotinas] = useState<Rotina[]>([])
  const [salvando, setSalvando] = useState(false)

  async function carregar() {

    const res = await api.get(`/entity/usuarios/${user_id}/permissoes`)

    setRotinas(res)

  }

  useEffect(() => {
    if (user_id) carregar()
  }, [user_id])

  function alterar(index: number, campo: keyof Rotina) {

    const copia = [...rotinas]

    // @ts-ignore
    copia[index][campo] = !copia[index][campo]

    setRotinas(copia)

  }

  async function salvar() {

    setSalvando(true)

    await api.post(`/entity/usuarios/${user_id}/permissoes`, rotinas)

    alert('Permissões atualizadas com sucesso.')

    setSalvando(false)

  }

  function voltar() {
  router.push('/dashboard/usuarios')
}

  return (
    <CrudLayout
      title="Permissões do usuário"
      subtitle="Configure o acesso às rotinas do sistema"
    >

      <table style={table}>

        <thead>
          <tr>
            <th style={th}>Rotina</th>
            <th style={th}>Incluir</th>
            <th style={th}>Alterar</th>
            <th style={th}>Excluir</th>
            <th style={th}>Relatório</th>
          </tr>
        </thead>

        <tbody>

          {rotinas.map((r, index) => (

            <tr key={r.rotina_id}>

              <td style={tdNome}>{r.nome}</td>

              <td style={td}>
                <input
                  type="checkbox"
                  checked={r.pode_incluir}
                  onChange={() => alterar(index,'pode_incluir')}
                />
              </td>

              <td style={td}>
                <input
                  type="checkbox"
                  checked={r.pode_alterar}
                  onChange={() => alterar(index,'pode_alterar')}
                />
              </td>

              <td style={td}>
                <input
                  type="checkbox"
                  checked={r.pode_excluir}
                  onChange={() => alterar(index,'pode_excluir')}
                />
              </td>

              <td style={td}>
                <input
                  type="checkbox"
                  checked={r.pode_relatorio}
                  onChange={() => alterar(index,'pode_relatorio')}
                />
              </td>

            </tr>

          ))}

        </tbody>

      </table>

      <div style={footer}>

        <button
          style={btnVoltar}
          onClick={voltar}
        >
          Voltar
        </button>

        <button
          style={btnSalvar}
          disabled={salvando}
          onClick={salvar}
        >
          Salvar permissões
        </button>

      </div>

    </CrudLayout>
  )

}

/* ===== STYLES ===== */

const table: CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  background: '#fff'
}

const th: CSSProperties = {
  textAlign: 'center',
  padding: '12px',
  background: '#0b1a3a',
  color: '#fff'
}

const td: CSSProperties = {
  textAlign: 'center',
  padding: '10px',
  borderBottom: '1px solid #e5e7eb'
}

const tdNome: CSSProperties = {
  padding: '10px',
  borderBottom: '1px solid #e5e7eb'
}

const footer: CSSProperties = {
  marginTop: 20,
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 10
}

const btnSalvar: CSSProperties = {
  background: '#16a34a',
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  padding: '10px 18px'
}

const btnVoltar: CSSProperties = {
  background: '#6b7280',
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  padding: '10px 18px'
}