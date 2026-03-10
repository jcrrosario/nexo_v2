import { usePermissionContext } from '@/providers/PermissionProvider'

export function usePermission() {

  const { permissions, isAdmin } = usePermissionContext()

  function find(routine: string) {
    return permissions?.find(p => p.routine === routine)
  }

  function canView(routine: string) {

    if (isAdmin) return true

    if (!permissions || permissions.length === 0) return true

    return !!find(routine)
  }

  function canCreate(routine: string) {

    if (isAdmin) return true

    const p = find(routine)

    return p?.canCreate === true
  }

  function canEdit(routine: string) {

    if (isAdmin) return true

    const p = find(routine)

    return p?.canEdit === true
  }

  function canDelete(routine: string) {

    if (isAdmin) return true

    const p = find(routine)

    return p?.canDelete === true
  }

  return {
    canView,
    canCreate,
    canEdit,
    canDelete
  }
}