'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [agency, setAgency] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const res = await fetch('https://your-backend.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agency, password })
      });

      if (res.ok) {
        localStorage.setItem('agency', agency);
        router.push('/');
      } else {
        const data = await res.json();
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Network error');
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-zinc-950 text-white">
      <h1 className="text-3xl font-bold mb-6">Login to OF Dashboard</h1>

      <input
        type="text"
        placeholder="Agency Name"
        value={agency}
        onChange={(e) => setAgency(e.target.value)}
        className="mb-3 px-4 py-2 w-80 border rounded bg-zinc-800 border-zinc-700"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-4 px-4 py-2 w-80 border rounded bg-zinc-800 border-zinc-700"
      />

      <button
        onClick={handleLogin}
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded"
      >
        Login
      </button>

      {error && <p className="text-red-400 mt-3">{error}</p>}
    </div>
  );
}
