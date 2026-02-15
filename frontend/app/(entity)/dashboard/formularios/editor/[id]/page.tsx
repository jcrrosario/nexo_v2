'use client'

import { useEffect, useState, CSSProperties } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Plus, Trash2 } from 'lucide-react'
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

export default function EditorFormularioPage() {
  const params = useParams()
  const router = useRouter()
  const formId = Number(params.id)

  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [texto, setTexto] = useState('')
  const [categId, setCategId] = useState<number | ''>('')

  async function carregar() {
    const res = await api.get(
      `/entity/formularios/${formId}/perguntas`,
    )
    setCategorias(res ?? [])
  }

  useEffect(() => {
    carregar()
  }, [])

  async function adicionar() {
    if (!texto || !categId) return

    await api.post(
      `/entity/formularios/${formId}/perguntas`,
      {
        texto,
        categ_id: categId,
        tipo_resposta: 'TEXTO',
        obrigatoria: 'NAO',
        ordem: 0,
      },
    )

    setTexto('')
    setCategId('')
    carregar()
  }

  async function excluir(perguntaId: number) {
    await api.put(
      `/entity/formularios/perguntas/${perguntaId}/excluir`,
      {},
    )

    carregar()
  }

  return (
    <div style={container}>
      <div style={header}>
        <h2 style={title}>Editor de Perguntas</h2>

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            style={btnSecondary}
            onClick={() =>
              router.push(
                `/dashboard/formularios/imprimir/${formId}`,
              )
            }
          >
            Relatório
          </button>

          <button style={btnDark} onClick={() => router.back()}>
            Voltar
          </button>
        </div>
      </div>

      {/* CARD 1 - ADICIONAR PERGUNTA */}
      <div style={card}>
        <h3 style={cardTitle}>Adicionar Pergunta</h3>

        <textarea
          placeholder="Digite a pergunta..."
          value={texto}
          onChange={e => setTexto(e.target.value)}
          style={textarea}
        />

        <div style={row}>
          <select
            value={categId}
            onChange={e =>
              setCategId(
                e.target.value ? Number(e.target.value) : '',
              )
            }
            style={select}
          >
            <option value="">Selecione a categoria</option>
            {categorias.map(c => (
              <option key={c.categ_id} value={c.categ_id}>
                {c.nome}
              </option>
            ))}
          </select>

          <button style={btnPrimary} onClick={adicionar}>
            <Plus size={16} /> Adicionar
          </button>
        </div>
      </div>

      {/* CARD 2 - FORMULÁRIO MONTADO */}
      <div style={card}>
        <h3 style={cardTitle}>Formulário Montado</h3>

        {categorias.map(categoria => (
          <div key={categoria.categ_id} style={grupo}>
            <h4 style={grupoTitulo}>{categoria.nome}</h4>

            {categoria.perguntas.length === 0 && (
              <p style={vazio}>Nenhuma pergunta cadastrada</p>
            )}

            {categoria.perguntas.map(p => (
              <div key={p.pergunta_id} style={pergunta}>
                <span>{p.texto}</span>
                <button
                  style={btnDelete}
                  onClick={() => excluir(p.pergunta_id)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ===== styles ===== */

const container: CSSProperties = {
  padding: 32,
  maxWidth: 1000,
  margin: '0 auto',
}

const header: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: 24,
}

const title: CSSProperties = {
  fontSize: 22,
  fontWeight: 600,
}

const card: CSSProperties = {
  background: '#ffffff',
  padding: 24,
  borderRadius: 12,
  marginBottom: 32,
  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
}

const cardTitle: CSSProperties = {
  fontSize: 22,
  fontWeight: 700,
  marginBottom: 20,
  color: '#0f172a',
}

const textarea: CSSProperties = {
  width: '100%',
  padding: 12,
  borderRadius: 8,
  border: '1px solid #ddd',
  marginBottom: 14,
}

const row: CSSProperties = {
  display: 'flex',
  gap: 12,
}

const select: CSSProperties = {
  flex: 1,
  padding: 12,
  borderRadius: 8,
  border: '1px solid #ddd',
}

const grupo: CSSProperties = {
  marginBottom: 24,
}

const grupoTitulo: CSSProperties = {
  fontSize: 16,
  fontWeight: 600,
  marginBottom: 10,
}

const pergunta: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  background: '#f3f4f6',
  padding: 12,
  borderRadius: 8,
  marginBottom: 8,
}

const vazio: CSSProperties = {
  color: '#6b7280',
  fontSize: 14,
}

const btnPrimary: CSSProperties = {
  background: '#16a34a',
  color: '#fff',
  border: 'none',
  padding: '10px 16px',
  borderRadius: 8,
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  cursor: 'pointer',
}

const btnDark: CSSProperties = {
  background: '#0b1a3a',
  color: '#fff',
  border: 'none',
  padding: '10px 20px',
  borderRadius: 8,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
  minWidth: 120,
  cursor: 'pointer',
}

const btnSecondary: CSSProperties = {
  background: '#475569',
  color: '#fff',
  border: 'none',
  padding: '10px 20px',
  borderRadius: 8,
  minWidth: 120,
  cursor: 'pointer',
}

const btnDelete: CSSProperties = {
  background: '#dc2626',
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  padding: '4px 8px',
  cursor: 'pointer',
}
