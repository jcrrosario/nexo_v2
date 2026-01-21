'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function EntityHeader() {
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  const [entityName, setEntityName] = useState('')
  const [userName, setUserName] = useState('')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const e = localStorage.getItem('entity_nome')
    const u = localStorage.getItem('user_nome')

    if (e) setEntityName(e)
    if (u) setUserName(u)
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () =>
      document.removeEventListener('mousedown', handleClickOutside)
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
        height: 88,
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(180deg, #050b1e, #0b1a3a)',
        color: '#fff',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* EMPRESA */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: 14, opacity: 0.7 }}>Empresa</span>
        <strong style={{ fontSize: 22, fontWeight: 700 }}>
          {entityName}
        </strong>
      </div>

      {/* USUÁRIO / DROPDOWN */}
      <div
        ref={dropdownRef}
        style={{ position: 'relative', cursor: 'pointer' }}
      >
        <div
          onClick={() => setOpen(prev => !prev)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 18,
            }}
          >
            {userName.charAt(0).toUpperCase()}
          </div>

          <span style={{ fontSize: 16 }}>
            {userName}
          </span>

          <span style={{ opacity: 0.7 }}>
            ▾
          </span>
        </div>

        {open && (
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 58,
              width: 200,
              background: '#0b1a3a',
              borderRadius: 12,
              boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '14px 16px',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 600 }}>
                {userName}
              </div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>
                Usuário ativo
              </div>
            </div>

            <div
              onClick={handleLogout}
              style={{
                padding: '12px 16px',
                fontSize: 14,
                cursor: 'pointer',
                color: '#ffb4b4',
              }}
            >
              Sair do sistema
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
