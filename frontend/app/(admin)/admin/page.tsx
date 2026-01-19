'use client';

import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [me, setMe] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');

    fetch('http://localhost:3001/admin/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setMe);
  }, []);

  if (!me) return <p>Carregando...</p>;

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Usuário: {me.usernexo_id}</p>
      <p>Email: {me.email}</p>
    </div>
  );
}
