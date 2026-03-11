'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockLogin } from '@/lib/api';
import { setCurrentUser } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const username = (form.elements.namedItem('username') as HTMLInputElement).value.trim();
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    try {
      const res = await mockLogin(username, password);
      setCurrentUser(res.user);
      router.push('/dashboard');
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <main className="centered-layout">
      <section className="card login-card">
        <h1 className="brand">Maya</h1>
        <p className="subtitle">A friendly place to learn your money 💖</p>

        <form className="form" onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input id="username" name="username" type="text" placeholder="Choose a nickname" required />

          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" placeholder="At least 6 characters" required />

          {error && <p className="muted" style={{ color: '#c0392b' }}>{error}</p>}

          <button className="btn primary pill" type="submit">Log in</button>
        </form>

        <p className="muted">No real account needed — this is a demo using mock data.</p>
      </section>
    </main>
  );
}
