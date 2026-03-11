'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Topbar from '@/components/Topbar';
import { fetchDashboardSummary, type DashboardSummary, type User } from '@/lib/api';
import { getCurrentUser } from '@/lib/auth';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) { router.push('/login'); return; }
    setUser(u);
    fetchDashboardSummary().then(setSummary);
  }, [router]);

  if (!user || !summary) return null;

  const gainLossSign = summary.totalGainLoss >= 0 ? '+' : '-';
  const utilPercent = Math.round(
    (summary.creditSummary.totalBalance / summary.creditSummary.totalLimit) * 100,
  );

  return (
    <>
      <Topbar />
      <main className="container">
        <section className="welcome card">
          <h2>Welcome back, {user.name}!</h2>
          <p className="friendly">Here&apos;s how your money is doing 💖</p>
        </section>

        <section className="grid summary-grid">
          <div className="summary-card card">
            <h4>Total portfolio</h4>
            <div className="stock-ticker">
              ${summary.portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <div className="muted-small">Value of your investments</div>
          </div>
          <div className="summary-card card">
            <h4>Total gain / loss</h4>
            <div className="stock-ticker">
              {gainLossSign}${Math.abs(summary.totalGainLoss).toFixed(2)}
            </div>
            <div className="muted-small">Since you started tracking</div>
          </div>
          <div className="summary-card card">
            <h4>Credit summary</h4>
            <div className="stock-ticker">${summary.creditSummary.totalBalance.toFixed(2)}</div>
            <div className="muted-small">
              Limit: ${summary.creditSummary.totalLimit} • Utilization: {utilPercent}%
            </div>
          </div>
        </section>

        <section className="card full-width">
          <h3>Quick actions</h3>
          <div className="actions">
            <Link className="btn primary pill" href="/portfolio">View Portfolio</Link>
            <Link className="btn ghost pill" href="/credit-cards">Manage Cards</Link>
          </div>
        </section>
      </main>
    </>
  );
}
