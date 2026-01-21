'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function EntityHeader() {
  const router = useRouter()

  const [entityName, setEntityName] = useState('')
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const e = localStorage.getItem('entity_nome')
    const u = localStorage.getItem('user_nome')

    if (e) setEntityName(e)
    if (u) setUserName(u)
  }, [])

  function handleLogout() {
    localStorage.removeItem('entity_token')
    localStorage.removeItem('entity_nome')
    localStorage.removeItem('user_nome')
    router.replace('/login')
  }

  return (
    <header
      style={{
        height: 64,
        padding: '0 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(180deg, #050b1e, #0b1a3a)',
        color: '#fff',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: 12, opacity: 0.7 }}>
          Empresa
        </span>
        <strong style={{ fontSize: 15 }}>
          {entityName}
        </strong>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {userName && (
          <>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.18)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
              }}
            >
              {userName.charAt(0).toUpperCase()}
            </div>

            <span style={{ fontSize: 14 }}>
              {userName}
            </span>
          </>
        )}

        <button
          onClick={handleLogout}
          style={{
            marginLeft: 8,
            padding: '6px 14px',
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.25)',
            background: 'transparent',
            color: '#fff',
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          Sair
        </button>
      </div>
    </header>
  )
}
