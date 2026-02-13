'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function EntityLoginPage() {
  const router = useRouter()
  const [userId, setUserId] = useState('')
  const [empresa, setEmpresa] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setErro('')

    const res = await fetch('http://localhost:3001/entity/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        idtb_empresas: Number(empresa),
        senha,
      }),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => null)

      if (data?.message?.includes('bloqueado')) {
        setErro('O acesso desta empresa está temporariamente bloqueado.')
      } else {
        setErro('Usuário, empresa ou senha inválidos.')
      }

      return
    }

    const data = await res.json()

    localStorage.setItem('entity_token', data.access_token)

    localStorage.setItem(
      'entity_nome',
      data.empresa?.nome_fantasia ||
        data.empresa_nome ||
        'Empresa'
    )

    localStorage.setItem(
      'user_nome',
      data.usuario?.nome ||
        data.user_nome ||
        userId
    )

    router.replace('/dashboard')
  }

  return (
    <div style={page}>
      <div style={card}>
        <div style={logoArea}>
          <div style={logo}>Vexor</div>
          <span style={subtitle}>Acesse sua conta</span>
        </div>

        <form onSubmit={handleLogin} style={form}>
          <input
            placeholder="Número da entidade"
            value={empresa}
            onChange={e => setEmpresa(e.target.value)}
            style={input}
          />

          <input
            placeholder="Usuário"
            value={userId}
            onChange={e => setUserId(e.target.value)}
            style={input}
          />

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            style={input}
          />

          {erro && (
            <div
              style={{
                background: '#fff4e5',
                color: '#8a5a00',
                padding: '12px 14px',
                borderRadius: 10,
                fontSize: 14,
                lineHeight: 1.4,
                textAlign: 'center',
                border: '1px solid #ffe0b2',
              }}
            >
              {erro}
            </div>
          )}

          <button style={button}>Acessar</button>
        </form>

        <div style={links}>
          <span style={link}>Trocar senha</span>
          <span style={link}>Esqueceu a senha?</span>
        </div>

        <div style={footer}>
          <span style={{ opacity: 0.7 }}>Serenyo</span>
        </div>
      </div>
    </div>
  )
}

const page: React.CSSProperties = {
  height: '100vh',
  background: 'linear-gradient(180deg, #eaf2ff, #f8fbff)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const card: React.CSSProperties = {
  width: 380,
  background: '#ffffff',
  borderRadius: 20,
  padding: '36px 32px',
  boxShadow: '0 20px 50px rgba(0,0,0,0.12)',
  display: 'flex',
  flexDirection: 'column',
}

const logoArea: React.CSSProperties = {
  textAlign: 'center',
  marginBottom: 24,
}

const logo: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 800,
  color: '#1f3a5f',
  marginBottom: 6,
}

const subtitle: React.CSSProperties = {
  fontSize: 16,
  color: '#5b6b82',
}

const form: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
  marginTop: 16,
}

const input: React.CSSProperties = {
  height: 46,
  borderRadius: 10,
  border: '1px solid #dbe3f0',
  padding: '0 14px',
  fontSize: 14,
  outline: 'none',
}

const button: React.CSSProperties = {
  marginTop: 10,
  height: 46,
  borderRadius: 23,
  border: 'none',
  background: 'linear-gradient(90deg, #4bb6c9, #3a8dd6)',
  color: '#fff',
  fontSize: 15,
  fontWeight: 600,
  cursor: 'pointer',
}

const links: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: 13,
  color: '#4c6ef5',
  marginTop: 16,
}

const link: React.CSSProperties = {
  cursor: 'pointer',
}

const footer: React.CSSProperties = {
  marginTop: 28,
  textAlign: 'center',
  fontSize: 13,
  color: '#7a8ca5',
}
