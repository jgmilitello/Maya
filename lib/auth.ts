// lib/auth.ts — Client-side session helpers
// The real auth token lives in an httpOnly cookie (set by /api/auth/login).
// localStorage only stores display info (name, email) — never the token.
import type { User } from './api';

const STORAGE_KEY = 'maya_user';

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as User) : null;
}

export function setCurrentUser(user: User): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export async function logoutUser(): Promise<void> {
  await fetch('/api/auth/logout', { method: 'POST' });
  localStorage.removeItem(STORAGE_KEY);
  window.location.href = '/login';
}
