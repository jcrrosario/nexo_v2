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
        <button style={btnDark} onClick={() => router.back()}>
          Voltar
        </button>
      </div>

      <div style={card}>
        <h3>Nova Pergunta</h3>

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

      {categorias.map(categoria => (
        <div key={categoria.categ_id} style={grupo}>
          <h3 style={grupoTitulo}>{categoria.nome}</h3>

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
  )
}

/* ===== styles ===== */

const container: CSSProperties = {
  padding: 32,
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
  background: '#f3f4f6',
  padding: 20,
  borderRadius: 10,
  marginBottom: 30,
}

const textarea: CSSProperties = {
  width: '100%',
  padding: 10,
  borderRadius: 6,
  border: '1px solid #ccc',
  marginBottom: 12,
}

const row: CSSProperties = {
  display: 'flex',
  gap: 10,
}

const select: CSSProperties = {
  flex: 1,
  padding: 10,
  borderRadius: 6,
  border: '1px solid #ccc',
}

const grupo: CSSProperties = {
  marginBottom: 30,
}

const grupoTitulo: CSSProperties = {
  fontSize: 18,
  fontWeight: 600,
  marginBottom: 10,
}

const pergunta: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  background: '#eef2f7',
  padding: 10,
  borderRadius: 6,
  marginBottom: 6,
}

const vazio: CSSProperties = {
  color: '#6b7280',
  fontSize: 14,
}

const btnPrimary: CSSProperties = {
  background: '#16a34a',
  color: '#fff',
  border: 'none',
  padding: '8px 14px',
  borderRadius: 6,
  display: 'flex',
  alignItems: 'center',
  gap: 6,
}

const btnDark: CSSProperties = {
  background: '#0b1a3a',
  color: '#fff',
  border: 'none',
  padding: '8px 14px',
  borderRadius: 6,
}

const btnDelete: CSSProperties = {
  background: '#dc2626',
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  padding: '4px 8px',
}
