'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logoutUser } from '@/lib/auth';

export default function Topbar() {
  const pathname = usePathname();
  return (
    <header className="topbar">
      <div className="brand small">Maya</div>
      <nav className="nav">
        <Link href="/dashboard" className={pathname === '/dashboard' ? 'active' : ''}>Dashboard</Link>
        <Link href="/portfolio" className={pathname === '/portfolio' ? 'active' : ''}>Portfolio</Link>
        <Link href="/credit-cards" className={pathname === '/credit-cards' ? 'active' : ''}>Credit Cards</Link>
        <button className="btn ghost pill" onClick={() => void logoutUser()}>Logout</button>
      </nav>
    </header>
  );
}
