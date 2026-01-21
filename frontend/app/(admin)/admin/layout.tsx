'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    async function validate() {
      const token = localStorage.getItem('admin_token')

      if (!token) {
        router.replace('/admin-login')
        return
      }

      const res = await fetch('http://localhost:3001/admin/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) {
        localStorage.removeItem('admin_token')
        router.replace('/admin-login')
      }
    }

    validate()
  }, [router])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#f4f6f8' }}>
      <aside
        style={{
          width: 240,
          background: '#06122E',
          color: '#fff',
          padding: 20,
        }}
      >
        <div style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 40 }}>
          NEXO
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <a href="/admin" style={linkStyle}>Dashboard</a>
          <a href="/admin/users" style={linkStyle}>Usuários NEXO</a>
          <a href="/admin/entities" style={linkStyle}>Entidades</a>
        </nav>
      </aside>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header
          style={{
            height: 64,
            background: '#06122E',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
          }}
        >
          <span>Administrativo</span>

          <button
            onClick={() => {
              localStorage.removeItem('admin_token')
              router.replace('/admin-login')
            }}
            style={{
              background: 'transparent',
              color: '#fff',
              border: '1px solid #fff',
              padding: '6px 12px',
              cursor: 'pointer',
            }}
          >
            Sair
          </button>
        </header>

        <main style={{ padding: 24 }}>
          {children}
        </main>
      </div>
    </div>
  )
}

const linkStyle: React.CSSProperties = {
  color: '#fff',
  textDecoration: 'none',
  fontSize: 14,
}
