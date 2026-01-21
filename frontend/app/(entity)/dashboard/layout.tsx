'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import EntityHeader from '../components/EntityHeader'

export default function EntityLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  const [openMenu, setOpenMenu] = useState<string | null>('cadastros')

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

  function toggle(menu: string) {
    setOpenMenu(prev => (prev === menu ? null : menu))
  }

  return (
    <div style={layout}>
      <aside style={sidebar}>
        <div style={brand}>
          <div style={logoBox}>N</div>
          <span style={brandName}>NEXO</span>
        </div>

        <nav style={menu}>
          <div style={menuItemActive}>📊 Dashboard</div>

          {/* CADASTROS */}
          <div>
            <div style={menuGroupHeader} onClick={() => toggle('cadastros')}>
              📁 Cadastros
              <span>{openMenu === 'cadastros' ? '▾' : '▸'}</span>
            </div>

            {openMenu === 'cadastros' && (
              <div style={submenu}>
                <div style={submenuItem}>👤 Usuários</div>
                <div style={submenuItem}>🏢 Departamentos</div>
                <div style={submenuItem}>🧩 Função</div>
                <div style={submenuItem}>⚠️ Categoria de risco</div>
                <div style={submenuItem}>🔥 Fator de risco</div>
                <div style={submenuItem}>🏭 Fonte geradora</div>
                <div style={submenuItem}>💥 Danos</div>
                <div style={submenuItem}>🛠️ Medidas adm / técnicas</div>
                <div style={submenuItem}>🧱 EPC</div>
                <div style={submenuItem}>🦺 EPI</div>
                <div style={submenuItem}>🔍 Layout de pesquisa</div>
              </div>
            )}
          </div>

          {/* COLETA */}
          <div>
            <div style={menuGroupHeader} onClick={() => toggle('coleta')}>
              📝 Coleta
              <span>{openMenu === 'coleta' ? '▾' : '▸'}</span>
            </div>

            {openMenu === 'coleta' && (
              <div style={submenu}>
                <div style={submenuItem}>📋 Pesquisa de usuário</div>
              </div>
            )}
          </div>

          {/* INVENTÁRIO */}
          <div>
            <div style={menuGroupHeader} onClick={() => toggle('inventario')}>
              📦 Inventário
              <span>{openMenu === 'inventario' ? '▾' : '▸'}</span>
            </div>

            {openMenu === 'inventario' && (
              <div style={submenu}>
                <div style={submenuItem}>⚠️ Risco ocupacional</div>
              </div>
            )}
          </div>

          {/* PLANO */}
          <div>
            <div style={menuGroupHeader} onClick={() => toggle('plano')}>
              🧭 Plano de ação
              <span>{openMenu === 'plano' ? '▾' : '▸'}</span>
            </div>

            {openMenu === 'plano' && (
              <div style={submenu}>
                <div style={submenuItem}>
                  📌 Programa de gerenciamento de risco
                </div>
              </div>
            )}
          </div>

          {/* RELATÓRIOS */}
          <div>
            <div style={menuGroupHeader} onClick={() => toggle('relatorios')}>
              📊 Relatórios
              <span>{openMenu === 'relatorios' ? '▾' : '▸'}</span>
            </div>

            {openMenu === 'relatorios' && (
              <div style={submenu}>
                <div style={submenuItem}>📈 Gerencial</div>
              </div>
            )}
          </div>
        </nav>
      </aside>

      <div style={content}>
        <EntityHeader />
        <main style={main}>{children}</main>
      </div>
    </div>
  )
}

/* ===== LAYOUT ===== */

const layout: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  background: '#f4f6f9',
}

/* ===== SIDEBAR ===== */

const sidebar: React.CSSProperties = {
  width: 270,
  background: 'linear-gradient(180deg, #050b1e, #0b1a3a)',
  color: '#fff',
  padding: '24px 20px',
}

/* BRAND */

const brand: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  marginBottom: 28,
}

const logoBox: React.CSSProperties = {
  width: 38,
  height: 38,
  borderRadius: 10,
  background: 'rgba(255,255,255,0.15)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 800,
}

const brandName: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 700,
}

/* MENU */

const menu: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
}

const menuItemActive: React.CSSProperties = {
  padding: '10px 14px',
  borderRadius: 10,
  background: 'rgba(255,255,255,0.18)',
  fontWeight: 600,
  cursor: 'pointer',
}

/* GROUP */

const menuGroupHeader: React.CSSProperties = {
  padding: '10px 14px',
  borderRadius: 10,
  display: 'flex',
  justifyContent: 'space-between',
  cursor: 'pointer',
  fontSize: 14,
  opacity: 0.95,
}

/* SUBMENU */

const submenu: React.CSSProperties = {
  marginTop: 6,
  marginBottom: 6,
  paddingLeft: 12,
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
}

const submenuItem: React.CSSProperties = {
  padding: '8px 14px',
  borderRadius: 8,
  fontSize: 13,
  cursor: 'pointer',
  opacity: 0.9,
}

/* CONTENT */

const content: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
}

const main: React.CSSProperties = {
  padding: 32,
}
