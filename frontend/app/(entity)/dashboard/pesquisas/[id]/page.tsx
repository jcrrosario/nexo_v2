'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { api } from '@/lib/api'

const DESCRICOES: any = {
  1: 'Nunca',
  2: 'Raramente',
  3: 'Às vezes',
  4: 'Frequentemente',
  5: 'Sempre',
}

export default function LancamentoPage() {

  const params = useParams()
  const id = params?.id as string

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

  const [modalAberto, setModalAberto] = useState(false)
  const [modalMensagem, setModalMensagem] = useState('')

  const [perguntaAtualIndex, setPerguntaAtualIndex] = useState(0)
  const [validacaoAtiva, setValidacaoAtiva] = useState(false)

  function abrirModal(msg: string) {
    setModalMensagem(msg)
    setModalAberto(true)
  }

  function fecharModal() {
    setModalAberto(false)
  }

  async function carregarLancamentos() {
    const lancRes = await api.get('/entity/pesquisas/' + id + '/lancamentos')
    setLancamentos(lancRes ?? [])
  }

  useEffect(() => {

    async function carregar() {

      const pesquisaRes = await api.get('/entity/pesquisas/' + id)

      if (!pesquisaRes) return

      setPesquisa(pesquisaRes)

      const perguntasRes = await api.get('/entity/formularios/' + pesquisaRes.form_id + '/perguntas')

      const listaPerguntas: any[] = []

      ;(perguntasRes ?? []).forEach((c: any) => {
        if (c.perguntas) {
          c.perguntas.forEach((p: any) => {
            listaPerguntas.push(p)
          })
        }
      })

      const dptoRes = await api.get('/entity/departamentos?page=1&limit=1000')
      const funcRes = await api.get('/entity/funcao?page=1&limit=1000')

      setPerguntas(listaPerguntas)
      setDepartamentos(dptoRes?.data ?? [])
      setFuncoes(funcRes?.data ?? [])

      await carregarLancamentos()

    }

    carregar()

  }, [id])

  function scrollParaPergunta(index:number){

    const el = document.getElementById('pergunta-'+index)

    if(el){
      el.scrollIntoView({
        behavior:'smooth',
        block:'center'
      })
    }

  }

  function novaResposta() {
    setIndiceAtual(null)
    setDptoId('')
    setFuncId('')
    setRespostas({})
    setPerguntaAtualIndex(0)
    setValidacaoAtiva(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

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

  function selecionarResposta(perguntaId: number, numero: number, index:number) {

    setRespostas((prev: any) => ({
      ...prev,
      [perguntaId]: numero,
    }))

    if(index < perguntas.length - 1){

      const prox = index + 1

      setPerguntaAtualIndex(prox)

      setTimeout(()=>{
        scrollParaPergunta(prox)
      },120)

    }

  }

  useEffect(() => {

  function handleKey(e: KeyboardEvent) {

    if (['1','2','3','4','5'].includes(e.key)) {

      const numero = Number(e.key)

      const pergunta = perguntas[perguntaAtualIndex]

      if (!pergunta) return

      selecionarResposta(pergunta.pergunta_id,numero,perguntaAtualIndex)

      return
    }

    if (e.key === 'Enter') {

      const totalPerguntas = perguntas.length
      const respondidas = Object.keys(respostas).length

      if (totalPerguntas > 0 && respondidas === totalPerguntas) {

        salvar()

      }

    }

  }

  window.addEventListener('keydown', handleKey)

  return () => window.removeEventListener('keydown', handleKey)

}, [perguntaAtualIndex, perguntas, respostas])

  

  async function salvar() {

    setValidacaoAtiva(true)

    if (!dptoId || !funcId) {
      abrirModal('Selecione departamento e função.')
      return
    }

    for (const pergunta of perguntas) {

      if (!respostas[pergunta.pergunta_id]) {

        const index = perguntas.findIndex(p=>p.pergunta_id === pergunta.pergunta_id)

        setPerguntaAtualIndex(index)

        scrollParaPergunta(index)

        abrirModal('Existem perguntas não respondidas.')

        return

      }

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

    await carregarLancamentos()

    setLoading(false)

    abrirModal('Respostas registradas com sucesso.')

    novaResposta()

  }

  const respondidas = Object.keys(respostas).length

  const progresso = perguntas.length
    ? Math.round((respondidas / perguntas.length) * 100)
    : 0

  return (

    <div>

      {modalAberto && (
        <div style={overlay}>
          <div style={modal}>
            <div style={{ marginBottom: 20 }}>
              {modalMensagem}
            </div>
            <button onClick={fecharModal} style={btnModal}>
              OK
            </button>
          </div>
        </div>
      )}

      <h1 style={titulo}>
        Lançamento da Pesquisa
      </h1>

      <div style={panel}>

        <div style={contadorPergunta}>
          Pergunta {perguntaAtualIndex + 1} de {perguntas.length}
        </div>

        <div style={barraContainer}>
          <div style={{ ...barraProgresso, width: progresso + '%' }} />
        </div>

        <div style={progressoTexto}>
          {respondidas} de {perguntas.length} respondidas
        </div>

      </div>

      <div style={panel}>

        <div style={navContainer}>

          {lancamentos.length > 0 && (
            <>
              <button onClick={() => carregarLancamento(0)} disabled={indiceAtual === 0} style={navBtn}>
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
                  ? (indiceAtual + 1) + ' de ' + lancamentos.length
                  : 'Novo'}
              </span>

              <button
                onClick={() =>
                  indiceAtual !== null &&
                  carregarLancamento(indiceAtual + 1)
                }
                disabled={
                  indiceAtual === null ||
                  indiceAtual >= lancamentos.length - 1
                }
                style={navBtn}
              >
                Próximo
              </button>

              <button
                onClick={() =>
                  carregarLancamento(lancamentos.length - 1)
                }
                disabled={
                  indiceAtual === lancamentos.length - 1
                }
                style={navBtn}
              >
                Último
              </button>
            </>
          )}

          <button
            onClick={novaResposta}
            style={btnNova}
          >
            Nova Resposta
          </button>

        </div>

      </div>

      <div style={panel}>

        <div style={selectContainer}>

          <select
            value={dptoId}
            onChange={e => setDptoId(e.target.value)}
            style={select}
          >
            <option value="">Selecione o Departamento</option>
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
            <option value="">Selecione a Função</option>
            {funcoes.map((f: any) => (
              <option key={f.func_id} value={f.func_id}>
                {f.nome}
              </option>
            ))}
          </select>

        </div>

      </div>

      <div style={panel}>

        <table style={tabela}>

          <thead style={theadSticky}>
            <tr>
              <th style={thPergunta}>Pergunta</th>
              {[1,2,3,4,5].map(n => (
                <th key={n} style={thNota}>
                  {n}
                  <div style={descricao}>{DESCRICOES[n]}</div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {perguntas.map((p: any, index: number) => {

              const naoRespondida = validacaoAtiva && !respostas[p.pergunta_id]

              return (

                <tr
                  id={'pergunta-'+index}
                  key={p.pergunta_id}
                  style={{
                    ...linha,
                    background:
                      index === perguntaAtualIndex
                        ? '#dbeafe'
                        : index % 2 === 0
                        ? '#ffffff'
                        : '#eef2f7',
                    border: naoRespondida ? '2px solid #ef4444' : 'none'
                  }}
                >
                  <td style={tdPergunta}>
                    {index + 1}. {p.texto}
                  </td>

                  {[1,2,3,4,5].map(n => (
                    <td key={n} style={tdNota}>
                      <input
                        type="radio"
                        name={'p' + p.pergunta_id}
                        checked={respostas[p.pergunta_id] === n}
                        onChange={() => selecionarResposta(p.pergunta_id, n,index)}
                      />
                    </td>
                  ))}

                </tr>

              )

            })}
          </tbody>

        </table>

      </div>

      <button onClick={salvar} disabled={loading} style={btnSalvar}>
        {loading ? 'Salvando...' : 'Salvar Respostas'}
      </button>

    </div>

  )

}

const titulo = {
  fontSize: 28,
  marginBottom: 20,
}

const contadorPergunta = {
  fontWeight:600,
  marginBottom:10
}

const panel = {
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: 10,
  padding: 20,
  marginBottom: 20,
}

const barraContainer = {
  width: '100%',
  height: 10,
  background: '#e5e7eb',
  borderRadius: 10,
  overflow: 'hidden',
  marginBottom: 8,
}

const barraProgresso = {
  height: '100%',
  background: '#16a34a',
}

const progressoTexto = {
  fontSize: 13,
  color: '#555',
}

const navContainer = {
  display: 'flex',
  gap: 10,
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

const btnNova = {
  marginLeft: 10,
  background: '#16a34a',
  color: '#fff',
  padding: '6px 12px',
  borderRadius: 6,
  border: 'none',
  cursor: 'pointer',
}

const overlay = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(0,0,0,0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
}

const modal = {
  background: '#fff',
  padding: 30,
  borderRadius: 12,
  minWidth: 300,
  textAlign: 'center',
}

const btnModal = {
  background: '#16a34a',
  color: '#fff',
  padding: '8px 16px',
  borderRadius: 8,
  border: 'none',
  cursor: 'pointer',
}

const selectContainer = {
  display: 'flex',
  gap: 20,
}

const select = {
  padding: '10px 12px',
  borderRadius: 8,
  border: '1px solid #ccc',
  minWidth: 250,
}

const tabela = {
  width: '100%',
  borderCollapse: 'collapse',
}

const theadSticky = {
  position: 'sticky',
  top: 0,
  background: '#fff',
  zIndex: 10,
}

const thPergunta = {
  textAlign: 'left',
  padding: 10,
  borderBottom: '2px solid #ddd',
}

const thNota = {
  textAlign: 'center',
  padding: 8,
  borderBottom: '2px solid #ddd',
}

const tdPergunta = {
  padding: 10,
  borderBottom: '1px solid #e5e7eb',
  fontSize: 14,
}

const tdNota = {
  textAlign: 'center',
  borderBottom: '1px solid #e5e7eb',
}

const linha = {
  transition: 'background 0.2s',
}

const descricao = {
  fontSize: 11,
  color: '#666',
}

const btnSalvar = {
  marginTop: 25,
  background: '#16a34a',
  color: '#fff',
  padding: '12px 20px',
  borderRadius: 8,
  border: 'none',
  cursor: 'pointer',
}