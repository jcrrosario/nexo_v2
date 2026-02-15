'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { api } from '@/lib/api'

type Categoria = {
  categ_id: number
  nome: string
  perguntas: Pergunta[]
}

type Pergunta = {
  pergunta_id: number
  texto: string
}

export default function Page() {
  const params = useParams()
  const formId = Number(params.id)

  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [nomeFormulario, setNomeFormulario] = useState('')
  const [empresa, setEmpresa] = useState('')

  useEffect(() => {
    carregar()
    carregarEmpresa()
  }, [])

  async function carregarEmpresa() {
    try {
      const res = await api.get('/entity/auth/me')

      const nomeEmpresa =
        res?.entity_nome ||
        res?.entity_name ||
        res?.nome ||
        ''

      setEmpresa(nomeEmpresa)
    } catch (err) {
      console.error('Erro ao buscar empresa', err)
    }
  }

  async function carregar() {
    const form = await api.get(
      `/entity/formularios/${formId}`,
    )
    setNomeFormulario(form?.nome ?? '')

    const perguntas = await api.get(
      `/entity/formularios/${formId}/perguntas`,
    )

    setCategorias(perguntas ?? [])
  }

  const opcoes = [
    'Nunca',
    'Raramente',
    'Às vezes',
    'Frequentemente',
    'Sempre',
  ]

  return (
    <div style={container}>
      <div style={header}>
        <h1 style={titulo}>{nomeFormulario}</h1>
        <h3 style={subtitulo}>
          Pesquisa de Percepção de Riscos
        </h3>
      </div>

      <div style={infoBox}>
        <div style={infoRow}>
          <strong>Empresa:</strong>{' '}
          {empresa || '________________________________'}
        </div>
        <div style={infoRow}>
          <strong>Data de preenchimento:</strong> ____ / ____ / ______
        </div>
        <div style={infoRow}>
          <strong>Departamento:</strong> ____________________________
        </div>
        <div style={infoRow}>
          <strong>Função:</strong> _________________________________
        </div>
      </div>

      {categorias.map(categoria => (
        <div key={categoria.categ_id} style={grupo}>
          <div style={grupoHeader}>
            {categoria.nome}
          </div>

          {categoria.perguntas.map((p, index) => (
            <div key={p.pergunta_id} style={perguntaCard}>
              <div style={perguntaTexto}>
                {index + 1}. {p.texto}
              </div>

              <div style={escala}>
                {opcoes.map(opcao => (
                  <div key={opcao} style={opcaoBox}>
                    <div style={checkbox}></div>
                    <span>{opcao}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}

      <div style={{ marginTop: 40 }}>
        <button
          style={btnPrint}
          onClick={() => window.print()}
        >
          Imprimir
        </button>
      </div>
    </div>
  )
}

/* ================= ESTILOS ================= */

const container: React.CSSProperties = {
  maxWidth: 1000,
  margin: '0 auto',
  padding: 40,
  fontFamily: 'Arial, sans-serif',
}

const header: React.CSSProperties = {
  textAlign: 'center',
  marginBottom: 30,
}

const titulo: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 700,
  marginBottom: 8,
}

const subtitulo: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 500,
  color: '#555',
}

const infoBox: React.CSSProperties = {
  border: '1px solid #ddd',
  padding: 20,
  borderRadius: 8,
  marginBottom: 30,
  background: '#f9fafb',
}

const infoRow: React.CSSProperties = {
  marginBottom: 10,
  fontSize: 14,
}

const grupo: React.CSSProperties = {
  marginBottom: 35,
}

const grupoHeader: React.CSSProperties = {
  background: '#e5e7eb',
  padding: 10,
  fontWeight: 600,
  borderRadius: 6,
  marginBottom: 15,
}

const perguntaCard: React.CSSProperties = {
  padding: 18,
  borderRadius: 10,
  border: '1px solid #e5e7eb',
  marginBottom: 18,
  background: '#fff',
}

const perguntaTexto: React.CSSProperties = {
  marginBottom: 15,
  fontSize: 15,
  lineHeight: 1.5,
}

const escala: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: 20,
}

const opcaoBox: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  fontSize: 14,
}

const checkbox: React.CSSProperties = {
  width: 18,
  height: 18,
  border: '2px solid #0b1a3a',
  borderRadius: 4,
}

const btnPrint: React.CSSProperties = {
  background: '#0b1a3a',
  color: '#fff',
  border: 'none',
  padding: '12px 20px',
  borderRadius: 8,
  cursor: 'pointer',
}
