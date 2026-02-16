'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { api } from '@/lib/api'
import jsPDF from 'jspdf'

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
      const nomeEmpresa = res?.nome || ''
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

  function gerarPDF() {
    const doc = new jsPDF()
    let y = 20
    const pageWidth = doc.internal.pageSize.getWidth()
    const marginLeft = 14
    const marginRight = 14
    const usableWidth = pageWidth - marginLeft - marginRight

    doc.setFontSize(18)
    doc.text(nomeFormulario, pageWidth / 2, y, { align: 'center' })
    y += 8

    doc.setFontSize(12)
    doc.text(
      'Pesquisa de Percepção de Riscos',
      pageWidth / 2,
      y,
      { align: 'center' },
    )
    y += 12

    doc.setFontSize(11)
    doc.text(`Empresa: ${empresa}`, marginLeft, y)
    y += 6
    doc.text(
      'Data de preenchimento: ____ / ____ / ______',
      marginLeft,
      y,
    )
    y += 6
    doc.text(
      'Departamento: ____________________________',
      marginLeft,
      y,
    )
    y += 6
    doc.text(
      'Função: _________________________________',
      marginLeft,
      y,
    )
    y += 12

    categorias.forEach(categoria => {
      if (y > 260) {
        doc.addPage()
        y = 20
      }

      doc.setFontSize(13)
      doc.text(categoria.nome, marginLeft, y)
      y += 8

      categoria.perguntas.forEach((p, index) => {
        if (y > 260) {
          doc.addPage()
          y = 20
        }

        const blocoAlturaBase = 22

        if (index % 2 === 0) {
          doc.setFillColor(203, 213, 225)
          doc.rect(
            marginLeft - 4,
            y - 6,
            usableWidth + 8,
            blocoAlturaBase,
            'F',
          )
        }

        doc.setFontSize(11)

        const linhasPergunta = doc.splitTextToSize(
          `${index + 1}. ${p.texto}`,
          usableWidth,
        )

        doc.text(linhasPergunta, marginLeft, y)
        y += linhasPergunta.length * 5 + 4

        const spacing = usableWidth / opcoes.length

        opcoes.forEach((opcao, i) => {
          const x = marginLeft + i * spacing

          doc.circle(x, y, 2)
          doc.text(opcao, x + 5, y + 1)
        })

        y += 12
      })
    })

    doc.save('pesquisa.pdf')
  }

  return (
    <div style={page}>
      <div style={topBar}>
        <button style={btnPrint} onClick={gerarPDF}>
          Gerar PDF
        </button>
      </div>

      <div style={a4}>
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
            <strong>Data de preenchimento:</strong> ____ /
            ____ / ______
          </div>
          <div style={infoRow}>
            <strong>Departamento:</strong>{' '}
            ____________________________
          </div>
          <div style={infoRow}>
            <strong>Função:</strong>{' '}
            _________________________________
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
      </div>
    </div>
  )
}

/* ================= ESTILOS ================= */

const page: React.CSSProperties = {
  background: '#f1f5f9',
  padding: 40,
  minHeight: '100vh',
}

const topBar: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  marginBottom: 20,
}

const a4: React.CSSProperties = {
  width: '210mm',
  minHeight: '297mm',
  background: '#ffffff',
  margin: '0 auto',
  padding: '25mm',
  boxShadow: '0 0 20px rgba(0,0,0,0.1)',
  boxSizing: 'border-box',
  fontFamily: 'Arial, sans-serif',
}

const header: React.CSSProperties = {
  textAlign: 'center',
  marginBottom: 30,
}

const titulo: React.CSSProperties = {
  fontSize: 26,
  fontWeight: 700,
  marginBottom: 6,
}

const subtitulo: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 500,
  color: '#555',
}

const infoBox: React.CSSProperties = {
  border: '1px solid #d1d5db',
  padding: 18,
  borderRadius: 6,
  marginBottom: 30,
}

const infoRow: React.CSSProperties = {
  marginBottom: 8,
  fontSize: 14,
}

const grupo: React.CSSProperties = {
  marginBottom: 30,
}

const grupoHeader: React.CSSProperties = {
  background: '#e5e7eb',
  padding: 10,
  fontWeight: 600,
  borderRadius: 4,
  marginBottom: 12,
}

const perguntaCard: React.CSSProperties = {
  padding: 14,
  borderRadius: 6,
  border: '1px solid #e5e7eb',
  marginBottom: 14,
}

const perguntaTexto: React.CSSProperties = {
  marginBottom: 10,
  fontSize: 14,
}

const escala: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(5, 1fr)',
  gap: 8,
}

const opcaoBox: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 6,
  fontSize: 12,
}

const checkbox: React.CSSProperties = {
  width: 18,
  height: 18,
  border: '2px solid #111827',
  borderRadius: 4,
}

const btnPrint: React.CSSProperties = {
  background: '#0b1a3a',
  color: '#fff',
  border: 'none',
  padding: '10px 20px',
  borderRadius: 6,
  cursor: 'pointer',
}
