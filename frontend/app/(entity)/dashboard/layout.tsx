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
    <div style={{ minHeight: '100vh', background: '#f4f6f8' }}>
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
        <span>Sistema</span>
        <button
          onClick={() => {
            localStorage.removeItem('entity_token')
            router.replace('/login')
          }}
        >
          Sair
        </button>
      </header>

      <main style={{ padding: 24 }}>
        {children}
      </main>
    </div>
  )
}
