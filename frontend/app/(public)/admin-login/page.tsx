'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [user, setUser] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');

  async function handleLogin() {
    setError('');

    const res = await fetch('http://localhost:3001/admin/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, senha }),
    });

    if (!res.ok) {
      setError('Login inválido');
      return;
    }

    const data = await res.json();
    localStorage.setItem('admin_token', data.access_token);
    router.push('/admin');
  }

  return (
    <div style={{ maxWidth: 360, margin: '100px auto' }}>
      <h1>Login Administrativo</h1>

      <input
        placeholder="Usuário"
        value={user}
        onChange={(e) => setUser(e.target.value)}
      />

      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />

      <button onClick={handleLogin}>Entrar</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
