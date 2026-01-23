const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

async function request(
  path: string,
  options: RequestInit = {},
) {
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('entity_token')
      : null

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })

  const contentType = res.headers.get('content-type')

  // 👇 proteção contra HTML
  if (!contentType || !contentType.includes('application/json')) {
    const text = await res.text()
    throw new Error('Resposta inválida do servidor')
  }

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Erro na requisição')
  }

  return res.json()
}

export const api = {
  get: (path: string) => request(path),
  post: (path: string, body: any) =>
    request(path, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  put: (path: string, body: any) =>
    request(path, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  delete: (path: string) =>
    request(path, {
      method: 'DELETE',
    }),
}
