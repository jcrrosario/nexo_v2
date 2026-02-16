'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { api } from '@/lib/api'

const DESCRICOES: any = {
  1: 'Nunca / Quase Nunca',
  2: 'Raramente',
  3: 'Às vezes',
  4: 'Frequentemente',
  5: 'Sempre',
}

export default function LancamentoPage() {
  const { id } = useParams()

  const [pesquisa, setPesquisa] = useState<any>(null)
  const [perguntas, setPerguntas] = useState<any[]>([])
  const [departamentos, setDepartamentos] = useState<any[]>([])
  const [funcoes, setFuncoes] = useState<any[]>([])
  const [lancamentos, setLancamentos] = useState<any[]>([])
  const [indiceAtual, setIndiceAtual] = useState<number | null>(null)

  const [dptoId, setDptoId] = useState('')
  const [funcId, setFuncId] = useState('')
  const [respostas, setRespostas] = useState<any>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function carregar() {
      const pesquisaRes = await api.get(
        `/entity/pesquisas/${id}`,
      )

      setPesquisa(pesquisaRes)

      const perguntasRes = await api.get(
        `/entity/formularios/${pesquisaRes.form_id}/perguntas`,
      )

      const dptoRes = await api.get(
        '/entity/departamentos?page=1&limit=1000',
      )

      const funcRes = await api.get(
        '/entity/funcao?page=1&limit=1000',
      )

      const lancRes = await api.get(
        `/entity/pesquisas/${id}/lancamentos`,
      )

      setPerguntas(perguntasRes ?? [])
      setDepartamentos(dptoRes?.data ?? [])
      setFuncoes(funcRes?.data ?? [])
      setLancamentos(lancRes ?? [])
    }

    carregar()
  }, [id])

  function carregarLancamento(index: number) {
    if (index < 0 || index >= lancamentos.length) return

    const lanc = lancamentos[index]

    setIndiceAtual(index)
    setDptoId(String(lanc.dpto_id))
    setFuncId(String(lanc.func_id))

    const obj: any = {}
    lanc.respostas.forEach((r: any) => {
      obj[r.pergunta_id] = r.resposta_numero
    })

    setRespostas(obj)

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function selecionarResposta(
    perguntaId: number,
    numero: number,
  ) {
    setRespostas((prev: any) => ({
      ...prev,
      [perguntaId]: numero,
    }))
  }

  async function salvar() {
    if (!dptoId || !funcId) {
      alert('Selecione departamento e função.')
      return
    }

    if (Object.keys(respostas).length !== perguntas.length) {
      alert('Responda todas as perguntas antes de salvar.')
      return
    }

    setLoading(true)

    await api.post('/entity/pesquisas/lancamento', {
      pesq_id: Number(id),
      dpto_id: Number(dptoId),
      func_id: Number(funcId),
      respostas: Object.entries(respostas).map(
        ([pergunta_id, resposta_numero]) => ({
          pergunta_id: Number(pergunta_id),
          resposta_numero,
        }),
      ),
    })

    setLoading(false)

    alert('Respostas registradas com sucesso.')

    setDptoId('')
    setFuncId('')
    setRespostas({})
    setIndiceAtual(null)

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div>

      {/* Cabeçalho */}
      <div style={headerContainer}>
        <h1>Lançamento da Pesquisa</h1>

        {lancamentos.length > 0 && (
          <div style={navContainer}>
            <button
              onClick={() => carregarLancamento(0)}
              disabled={indiceAtual === 0}
              style={navBtn}
            >
              Primeiro
            </button>

            <button
              onClick={() =>
                indiceAtual !== null &&
                carregarLancamento(indiceAtual - 1)
              }
              disabled={
                indiceAtual === null ||
                indiceAtual <= 0
              }
              style={navBtn}
            >
              Anterior
            </button>

            <span style={contador}>
              {indiceAtual !== null
                ? `${indiceAtual + 1} de ${lancamentos.length}`
                : `0 de ${lancamentos.length}`}
            </span>

            <button
              onClick={() =>
                indiceAtual !== null &&
                carregarLancamento(indiceAtual + 1)
              }
              disabled={
                indiceAtual === null ||
                indiceAtual >=
                  lancamentos.length - 1
              }
              style={navBtn}
            >
              Próximo
            </button>

            <button
              onClick={() =>
                carregarLancamento(
                  lancamentos.length - 1,
                )
              }
              disabled={
                indiceAtual ===
                lancamentos.length - 1
              }
              style={navBtn}
            >
              Último
            </button>
          </div>
        )}
      </div>

      {/* Seletores */}
      <div style={selectContainer}>
        <select
          value={dptoId}
          onChange={e => setDptoId(e.target.value)}
          style={select}
        >
          <option value="">
            Selecione o Departamento
          </option>
          {departamentos.map((d: any) => (
            <option key={d.dpto_id} value={d.dpto_id}>
              {d.nome}
            </option>
          ))}
        </select>

        <select
          value={funcId}
          onChange={e => setFuncId(e.target.value)}
          style={select}
        >
          <option value="">
            Selecione a Função
          </option>
          {funcoes.map((f: any) => (
            <option key={f.func_id} value={f.func_id}>
              {f.nome}
            </option>
          ))}
        </select>
      </div>

      {/* Perguntas */}
      {perguntas.map((p: any, index: number) => (
        <div key={p.pergunta_id} style={card}>
          <div style={perguntaHeader}>
            <strong>{index + 1}.</strong> {p.texto}
          </div>

          <div style={respostasContainer}>
            {[1, 2, 3, 4, 5].map(numero => (
              <button
                key={`${p.pergunta_id}-${numero}`}
                onClick={() =>
                  selecionarResposta(
                    p.pergunta_id,
                    numero,
                  )
                }
                style={{
                  ...respostaBtn,
                  ...(respostas[p.pergunta_id] ===
                  numero
                    ? respostaSelecionada
                    : {}),
                }}
              >
                <strong>{numero}</strong>
                <span style={descricaoResposta}>
                  {DESCRICOES[numero]}
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* BOTÃO SALVAR */}
      <button
        onClick={salvar}
        disabled={loading}
        style={btnSalvar}
      >
        {loading ? 'Salvando...' : 'Salvar Respostas'}
      </button>
    </div>
  )
}

/* =========================
   ESTILOS
=========================*/

const headerContainer = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 30,
}

const navContainer = {
  display: 'flex',
  gap: 8,
  alignItems: 'center',
}

const navBtn = {
  padding: '6px 12px',
  borderRadius: 6,
  border: '1px solid #ccc',
  cursor: 'pointer',
}

const contador = {
  fontWeight: 600,
  margin: '0 10px',
}

const selectContainer = {
  display: 'flex',
  gap: 20,
  marginBottom: 30,
}

const select = {
  padding: '10px 12px',
  borderRadius: 8,
  border: '1px solid #ccc',
  minWidth: 250,
}

const card = {
  background: '#f8fafc',
  padding: 20,
  borderRadius: 12,
  marginBottom: 20,
  border: '1px solid #e2e8f0',
}

const perguntaHeader = {
  marginBottom: 10,
}

const respostasContainer = {
  display: 'flex',
  gap: 10,
  flexWrap: 'wrap' as const,
}

const respostaBtn = {
  padding: 12,
  borderRadius: 8,
  border: '1px solid #ccc',
  cursor: 'pointer',
  minWidth: 120,
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
}

const respostaSelecionada = {
  background: '#16a34a',
  color: '#fff',
  border: '1px solid #16a34a',
}

const descricaoResposta = {
  fontSize: 11,
  marginTop: 4,
}

const btnSalvar = {
  marginTop: 30,
  background: '#16a34a',
  color: '#fff',
  padding: '12px 20px',
  borderRadius: 8,
  border: 'none',
  cursor: 'pointer',
}
