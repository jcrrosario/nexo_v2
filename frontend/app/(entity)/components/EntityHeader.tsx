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
    <header className="flex items-center justify-between h-14 px-6 bg-[#06122E] text-white">
      <div className="text-sm font-semibold">
        {entityName}
      </div>

      <div className="flex items-center gap-3">
        {userName && (
          <>
            <div className="w-8 h-8 rounded-full bg-[#FFD500] text-[#06122E] flex items-center justify-center font-semibold text-sm">
              {userName.charAt(0).toUpperCase()}
            </div>

            <span className="text-sm">
              {userName}
            </span>
          </>
        )}

        <button
          onClick={handleLogout}
          className="ml-3 px-3 py-1 text-sm border border-white rounded"
        >
          Sair
        </button>
      </div>
    </header>
  )
}
