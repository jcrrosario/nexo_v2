'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function EntityLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    async function validate() {
      const token = localStorage.getItem('entity_token')

      if (!token) {
        router.replace('/login')
        return
      }

      const res = await fetch('http://localhost:3001/entity/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) {
        localStorage.removeItem('entity_token')
        router.replace('/login')
      }
    }

    validate()
  }, [router])

  return (
    <div style={layout}>
      <aside style={sidebar}>
        <div style={logo}>NEXO</div>

        <nav style={menu}>
          <span style={menuItem}>Dashboard</span>
          <span style={menuItem}>Usuários</span>
          <span style={menuItem}>Configurações</span>
        </nav>
      </aside>

      <div style={content}>
        <header style={header}>
          <span>Área da Entidade</span>

          <button
            onClick={() => {
              localStorage.removeItem('entity_token')
              router.replace('/login')
            }}
            style={logout}
          >
            Sair
          </button>
        </header>

        <main style={main}>{children}</main>
      </div>
    </div>
  )
}

const layout: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  background: '#f4f6f8',
}

const sidebar: React.CSSProperties = {
  width: 220,
  background: '#06122E',
  color: '#fff',
  padding: 20,
}

const logo: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 700,
  marginBottom: 40,
}

const menu: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
}

const menuItem: React.CSSProperties = {
  fontSize: 14,
  cursor: 'pointer',
  opacity: 0.9,
}

const content: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
}

const header: React.CSSProperties = {
  height: 64,
  background: '#06122E',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 24px',
}

const logout: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid #fff',
  color: '#fff',
  padding: '6px 12px',
  borderRadius: 6,
  cursor: 'pointer',
}

const main: React.CSSProperties = {
  padding: 24,
}
