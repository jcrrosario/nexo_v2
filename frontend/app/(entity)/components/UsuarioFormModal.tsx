'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { api } from '@/lib/api'

type Props = {
  onClose: () => void
  onSuccess: () => void
}

export default function UsuarioFormModal({ onClose, onSuccess }: Props) {
  const [userId, setUserId] = useState('')
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [perfil, setPerfil] = useState<'Administrador' | 'Usuario'>('Usuario')
  const [ativo, setAtivo] = useState<'Sim' | 'Não'>('Sim')
  const [foto, setFoto] = useState<File | null>(null)

  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  async function salvar() {
    setLoading(true)
    setErro(null)

    try {
      // 🔹 multipart para permitir foto
      const formData = new FormData()
      formData.append('user_id', userId)
      formData.append('nome', nome)
      formData.append('email', email)
      formData.append('senha', senha)
      formData.append('perfil', perfil)
      formData.append('ativo', ativo)

      if (foto) {
        formData.append('foto', foto)
      }

      await api.post('/entity/usuarios', formData)

      onSuccess()
      onClose()
    } catch (e: any) {
      setErro(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={overlay}>
      <div style={modal}>
        <div style={header}>
          <strong>Novo usuário</strong>
          <X size={18} onClick={onClose} style={{ cursor: 'pointer' }} />
        </div>

        <div style={body}>
          <input
            placeholder="User ID"
            value={userId}
            onChange={e => setUserId(e.target.value)}
            style={input}
          />

          <input
            placeholder="Nome"
            value={nome}
            onChange={e => setNome(e.target.value)}
            style={input}
          />

          <input
            placeholder="E-mail"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={input}
          />

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            style={input}
          />

          <select
            value={perfil}
            onChange={e => setPerfil(e.target.value as any)}
            style={input}
          >
            <option value="Usuario">Usuário</option>
            <option value="Administrador">Administrador</option>
          </select>

          <select
            value={ativo}
            onChange={e => setAtivo(e.target.value as any)}
            style={input}
          >
            <option value="Sim">Ativo</option>
            <option value="Não">Inativo</option>
          </select>

          <input
            type="file"
            accept="image/*"
            onChange={e => setFoto(e.target.files?.[0] || null)}
            style={input}
          />

          {erro && <span style={error}>{erro}</span>}
        </div>

        <div style={footer}>
          <button onClick={onClose} style={btnCancel}>
            Cancelar
          </button>
          <button onClick={salvar} style={btnSave} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ===== styles ===== */

const overlay = {
  position: 'fixed' as const,
  inset: 0,
  background: 'rgba(0,0,0,0.4)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 50,
}

const modal = {
  background: '#fff',
  borderRadius: 10,
  width: 440,
  boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
}

const header = {
  padding: 16,
  borderBottom: '1px solid #e5e7eb',
  display: 'flex',
  justifyContent: 'space-between',
}

const body = {
  padding: 16,
  display: 'flex',
  flexDirection: 'column' as const,
  gap: 10,
}

const footer = {
  padding: 16,
  borderTop: '1px solid #e5e7eb',
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 10,
}

const input = {
  padding: '8px 10px',
  borderRadius: 6,
  border: '1px solid #d1d5db',
}

const btnSave = {
  background: '#16a34a',
  color: '#fff',
  padding: '8px 14px',
  borderRadius: 6,
  border: 'none',
  cursor: 'pointer',
}

const btnCancel = {
  background: '#e5e7eb',
  padding: '8px 14px',
  borderRadius: 6,
  border: 'none',
  cursor: 'pointer',
}

const error = {
  color: '#dc2626',
  fontSize: 13,
}
