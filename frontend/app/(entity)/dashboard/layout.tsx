'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Folder,
  Users,
  Building2,
  Briefcase,
  Network,
  AlertTriangle,
  Flame,
  Factory,
  ShieldAlert,
  Wrench,
  HardHat,
  ClipboardList,
  Search,
  FileText,
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
    return pathname === path || pathname.startsWith(path + '/')
  }

  return (
    <div style={layout}>
      <aside style={{ ...sidebar, width: collapsed ? 90 : 300 }}>
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

        <div onClick={() => setCollapsed(p => !p)} style={collapseBtn}>
          {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
        </div>

        <nav style={menu}>
          <div
            style={{
              ...menuItem,
              ...(pathname === '/dashboard' ? menuActive : {}),
            }}
            onClick={() => router.push('/dashboard')}
          >
            {pathname === '/dashboard' && <span style={activeBar} />}
            <LayoutDashboard size={18} />
            {!collapsed && <span>Dashboard</span>}
          </div>

          <div>
            <div style={menuGroupHeader} onClick={() => toggle('cadastros')}>
              <div style={menuLabel}>
                <Folder size={18} />
                {!collapsed && <span>Cadastros</span>}
              </div>
              {!collapsed &&
                (openMenu === 'cadastros'
                  ? <ChevronDown size={16} />
                  : <ChevronRight size={16} />)}
            </div>

            {!collapsed && openMenu === 'cadastros' && (
              <div style={submenu}>
                <div
                  style={{
                    ...submenuItem,
                    ...(isActive('/dashboard/usuarios')
                      ? submenuActive
                      : {}),
                  }}
                  onClick={() => router.push('/dashboard/usuarios')}
                >
                  <Users size={16} /> Funcionários/Usuários
                </div>

                <div
                  style={{
                    ...submenuItem,
                    ...(isActive('/dashboard/departamentos')
                      ? submenuActive
                      : {}),
                  }}
                  onClick={() => router.push('/dashboard/departamentos')}
                >
                  <Building2 size={16} /> Departamentos
                </div>

                <div
                  style={{
                    ...submenuItem,
                    ...(isActive('/dashboard/funcoes')
                      ? submenuActive
                      : {}),
                  }}
                  onClick={() => router.push('/dashboard/funcoes')}
                >
                  <Briefcase size={16} /> Funções
                </div>

                <div
                  style={{
                    ...submenuItem,
                    ...(isActive('/dashboard/vinculacao-organizacional')
                      ? submenuActive
                      : {}),
                  }}
                  onClick={() =>
                    router.push('/dashboard/vinculacao-organizacional')
                  }
                >
                  <Network size={16} /> Vinculação Organizacional
                </div>

                {/* AJUSTE AQUI */}
                <div
                  style={{
                    ...submenuItem,
                    ...(isActive('/dashboard/categorias')
                      ? submenuActive
                      : {}),
                  }}
                  onClick={() => router.push('/dashboard/categorias')}
                >
                  <AlertTriangle size={16} /> Categoria do Risco
                </div>

                <div style={submenuItem}>
                  <Flame size={16} /> Fator de risco
                </div>
                <div style={submenuItem}>
                  <Factory size={16} /> Fonte geradora
                </div>
                <div style={submenuItem}>
                  <ShieldAlert size={16} /> Danos
                </div>
                <div style={submenuItem}>
                  <Wrench size={16} /> Medidas adm / técnicas
                </div>
                <div style={submenuItem}>
                  <HardHat size={16} /> EPC
                </div>
                <div style={submenuItem}>
                  <HardHat size={16} /> EPI
                </div>
                <div style={submenuItem}>
                  <Search size={16} /> Layout de pesquisa
                </div>
              </div>
            )}
          </div>

          <div>
            <div style={menuGroupHeader} onClick={() => toggle('coleta')}>
              <div style={menuLabel}>
                <ClipboardList size={18} />
                {!collapsed && <span>Coleta</span>}
              </div>
              {!collapsed &&
                (openMenu === 'coleta'
                  ? <ChevronDown size={16} />
                  : <ChevronRight size={16} />)}
            </div>

            {!collapsed && openMenu === 'coleta' && (
              <div style={submenu}>
                <div style={submenuItem}>
                  <FileText size={16} /> Pesquisa
                </div>
              </div>
            )}
          </div>

          <div>
            <div style={menuGroupHeader} onClick={() => toggle('relatorios')}>
              <div style={menuLabel}>
                <BarChart3 size={18} />
                {!collapsed && <span>Relatórios</span>}
              </div>
              {!collapsed &&
                (openMenu === 'relatorios'
                  ? <ChevronDown size={16} />
                  : <ChevronRight size={16} />)}
            </div>
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

const submenuActive = {
  background: 'rgba(255,255,255,0.12)',
  borderRadius: 8,
}

const content = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
}

const main = {
  padding: 32,
}
