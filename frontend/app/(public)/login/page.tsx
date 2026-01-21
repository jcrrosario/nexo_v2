'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function EntityLoginPage() {
  const router = useRouter()
  const [user_id, setUserId] = useState('')
  const [empresa, setEmpresa] = useState('')
  const [senha, setSenha] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()

    const res = await fetch('http://localhost:3001/entity/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id,
        idtb_empresas: Number(empresa),
        senha,
      }),
    })

    if (!res.ok) {
      alert('Login inválido')
      return
    }

    const data = await res.json()
    localStorage.setItem('entity_token', data.access_token)
    router.replace('/dashboard')
  }

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>

      <input
        placeholder="Usuário"
        value={user_id}
        onChange={e => setUserId(e.target.value)}
      />

      <input
        placeholder="Empresa"
        value={empresa}
        onChange={e => setEmpresa(e.target.value)}
      />

      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={e => setSenha(e.target.value)}
      />

      <button>Entrar</button>
    </form>
  )
}
