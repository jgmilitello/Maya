// lib/auth.ts — Session helpers (localStorage-based, client-side only)
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

export function logoutUser(): void {
  localStorage.removeItem(STORAGE_KEY);
  window.location.href = '/login';
}
