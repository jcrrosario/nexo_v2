export async function getAdminMe() {
  const token = localStorage.getItem('admin_token')

  if (!token) return null

  const res = await fetch('http://localhost:3001/admin/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) return null

  return res.json()
}
