'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { api } from '@/lib/api'

type Permission = {
  routine: string
  canView: boolean
  canCreate: boolean
  canEdit: boolean
  canDelete: boolean
}

type PermissionContextType = {
  permissions: Permission[]
  isAdmin: boolean
  loaded: boolean
  hasPermission: (
    routine: string,
    action: 'view' | 'create' | 'edit' | 'delete'
  ) => boolean
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined)

export function PermissionProvider({ children }: { children: ReactNode }) {

  const [permissions, setPermissions] = useState<Permission[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {

    const stored = localStorage.getItem('usuario')
    const usuario = stored ? JSON.parse(stored) : null

    if (!usuario?.user_id) {
      setLoaded(true)
      return
    }

    if (usuario.perfil === 'Administrador') {
      setIsAdmin(true)
      setLoaded(true)
      return
    }

    async function carregarPermissoes() {

      try {

        const res = await api.get(`/entity/permissoes/${usuario.user_id}`)

        if (Array.isArray(res.data)) {
          setPermissions(res.data)
        } else {
          setPermissions([])
        }

      } catch (error) {

        console.error('Erro ao carregar permissões', error)
        setPermissions([])

      } finally {
        setLoaded(true)
      }

    }

    carregarPermissoes()

  }, [])

  function hasPermission(
    routine: string,
    action: 'view' | 'create' | 'edit' | 'delete'
  ) {

    if (isAdmin) return true

    const permission = permissions.find(p => p.routine === routine)

    if (!permission) return false

    if (action === 'view') return true
    if (action === 'create') return permission.canCreate
    if (action === 'edit') return permission.canEdit
    if (action === 'delete') return permission.canDelete

    return false
  }

  if (!loaded) {
    return null
  }

  return (
    <PermissionContext.Provider
      value={{
        permissions,
        isAdmin,
        loaded,
        hasPermission
      }}
    >
      {children}
    </PermissionContext.Provider>
  )
}

export function usePermissionContext() {

  const context = useContext(PermissionContext)

  if (!context) {
    throw new Error('usePermissionContext must be used within PermissionProvider')
  }

  return context
}