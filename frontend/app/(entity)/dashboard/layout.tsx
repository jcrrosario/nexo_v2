// app/(entity)/dashboard/layout.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Folder,
  Users,
  Building2,
  Briefcase,
  AlertTriangle,
  Flame,
  Factory,
  ShieldAlert,
  Wrench,
  HardHat,
  ClipboardList,
  Search,
  FileText,
  Archive,
  Shield,
  Target,
  BarChart3,
  ChevronDown,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import EntityHeader from '../components/EntityHeader'

export default function EntityLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  const [openMenu, setOpenMenu] = useState<string | null>('cadastros')
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('entity_token')
    if (!token) router.replace('/login')
  }, [router])

  function toggle(menu: string) {
    setOpenMenu(prev => (prev === menu ? null : menu))
  }

  function isActive(path: string) {
    return pathname.startsWith(path)
  }

  function breadcrumb() {
    const parts = pathname.split('/').filter(Boolean).slice(1)
    return parts.join(' / ')
  }

  return (
    <div style={layout}>
      <aside style={{ ...sidebar, width: collapsed ? 90 : 300 }}>
        {/* LOGO */}
        <div style={brand}>
          <img
            src="/logo-nexo.png"
            alt="NEXO"
            style={{
              height: collapsed ? 36 : 60,
              transition: 'all 150ms ease',
            }}
          />
        </div>

        {/* COLLAPSE */}
        <div
          onClick={() => setCollapsed(p => !p)}
          style={collapseBtn}
        >
          {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
        </div>

        {/* MENU */}
        <nav style={menu}>
          <div
            style={{
              ...menuItem,
              ...(isActive('/dashboard') ? menuActive : {}),
            }}
          >
            {isActive('/dashboard') && <span style={activeBar} />}
            <LayoutDashboard size={18} />
            {!collapsed && <span>Dashboard</span>}
          </div>

          {/* CADASTROS */}
          <div>
            <div style={menuGroupHeader} onClick={() => toggle('cadastros')}>
              <div style={menuLabel}>
                <Folder size={18} />
                {!collapsed && <span>Cadastros</span>}
              </div>
              {!collapsed &&
                (openMenu === 'cadastros' ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                ))}
            </div>

            {!collapsed && openMenu === 'cadastros' && (
              <div style={submenu}>
                <div style={submenuItem}><Users size={16} /> Usuários</div>
                <div style={submenuItem}><Building2 size={16} /> Departamentos</div>
                <div style={submenuItem}><Briefcase size={16} /> Função</div>
                <div style={submenuItem}><AlertTriangle size={16} /> Categoria de risco</div>
                <div style={submenuItem}><Flame size={16} /> Fator de risco</div>
                <div style={submenuItem}><Factory size={16} /> Fonte geradora</div>
                <div style={submenuItem}><ShieldAlert size={16} /> Danos</div>
                <div style={submenuItem}><Wrench size={16} /> Medidas adm / técnicas</div>
                <div style={submenuItem}><HardHat size={16} /> EPC</div>
                <div style={submenuItem}><HardHat size={16} /> EPI</div>
                <div style={submenuItem}><Search size={16} /> Layout de pesquisa</div>
              </div>
            )}
          </div>

          {/* COLETA */}
          <div>
            <div style={menuGroupHeader} onClick={() => toggle('coleta')}>
              <div style={menuLabel}>
                <ClipboardList size={18} />
                {!collapsed && <span>Coleta</span>}
              </div>
              {!collapsed &&
                (openMenu === 'coleta' ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                ))}
            </div>

            {!collapsed && openMenu === 'coleta' && (
              <div style={submenu}>
                <div style={submenuItem}><FileText size={16} /> Pesquisa de usuário</div>
              </div>
            )}
          </div>

          {/* INVENTÁRIO */}
          <div>
            <div style={menuGroupHeader} onClick={() => toggle('inventario')}>
              <div style={menuLabel}>
                <Archive size={18} />
                {!collapsed && <span>Inventário</span>}
              </div>
              {!collapsed &&
                (openMenu === 'inventario' ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                ))}
            </div>

            {!collapsed && openMenu === 'inventario' && (
              <div style={submenu}>
                <div style={submenuItem}><Shield size={16} /> Risco ocupacional</div>
              </div>
            )}
          </div>

          {/* PLANO */}
          <div>
            <div style={menuGroupHeader} onClick={() => toggle('plano')}>
              <div style={menuLabel}>
                <Target size={18} />
                {!collapsed && <span>Plano de ação</span>}
              </div>
              {!collapsed &&
                (openMenu === 'plano' ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                ))}
            </div>

            {!collapsed && openMenu === 'plano' && (
              <div style={submenu}>
                <div style={submenuItem}><Target size={16} /> Programa de gerenciamento de risco</div>
              </div>
            )}
          </div>

          {/* RELATÓRIOS */}
          <div>
            <div style={menuGroupHeader} onClick={() => toggle('relatorios')}>
              <div style={menuLabel}>
                <BarChart3 size={18} />
                {!collapsed && <span>Relatórios</span>}
              </div>
              {!collapsed &&
                (openMenu === 'relatorios' ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                ))}
            </div>

            {!collapsed && openMenu === 'relatorios' && (
              <div style={submenu}>
                <div style={submenuItem}><BarChart3 size={16} /> Gerencial</div>
              </div>
            )}
          </div>
        </nav>
      </aside>

      <div style={content}>
        <EntityHeader />

        <div style={contentHeader}>
          <div style={breadcrumbStyle}>{breadcrumb()}</div>
          <h1 style={contentTitle}>Dashboard</h1>
          <p style={contentSubtitle}>Bem-vindo ao sistema</p>
        </div>

        <main style={main}>{children}</main>
      </div>
    </div>
  )
}

/* ===== STYLES ===== */

const layout = {
  minHeight: '100vh',
  display: 'flex',
  background: '#f4f6f9',
}

const sidebar = {
  background: 'linear-gradient(180deg, #050b1e, #0b1a3a)',
  color: '#fff',
  padding: '32px 18px',
  transition: 'width 150ms ease',
}

const brand = {
  display: 'flex',
  justifyContent: 'center',
  marginBottom: 20,
}

const collapseBtn = {
  display: 'flex',
  justifyContent: 'center',
  marginBottom: 18,
  opacity: 0.7,
  cursor: 'pointer',
}

const menu = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
}

const menuItem = {
  position: 'relative',
  padding: '12px 14px',
  borderRadius: 10,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: 10,
}

const menuActive = {
  background: 'rgba(255,255,255,0.15)',
  boxShadow: '0 0 14px rgba(120,160,255,0.35)',
  fontWeight: 600,
}

const activeBar = {
  position: 'absolute',
  left: 0,
  top: 8,
  bottom: 8,
  width: 3,
  borderRadius: 3,
  background: 'linear-gradient(180deg,#7fa6ff,#4f6fdc)',
}

const menuGroupHeader = {
  padding: '12px 14px',
  borderRadius: 10,
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: 14,
  opacity: 0.95,
}

const menuLabel = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
}

const submenu = {
  paddingLeft: 22,
}

const submenuItem = {
  padding: '8px 14px',
  fontSize: 13,
  cursor: 'pointer',
  opacity: 0.9,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
}

const content = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
}

const contentHeader = {
  padding: '28px 32px 18px',
  background: '#fff',
  boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
}

const breadcrumbStyle = {
  fontSize: 12,
  color: '#7a8ca5',
  marginBottom: 6,
}

const contentTitle = {
  fontSize: 32,
  fontWeight: 700,
}

const contentSubtitle = {
  fontSize: 15,
  color: '#5b6b82',
}

const main = {
  padding: 32,
}
