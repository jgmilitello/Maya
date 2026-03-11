'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Topbar from '@/components/Topbar';
import { fetchUserPortfolio, type Stock } from '@/lib/api';
import { getCurrentUser } from '@/lib/auth';

export default function PortfolioPage() {
  const router = useRouter();
  const [stocks, setStocks] = useState<Stock[]>([]);

  useEffect(() => {
    if (!getCurrentUser()) { router.push('/login'); return; }
    fetchUserPortfolio().then(setStocks);
  }, [router]);

  return (
    <>
      <Topbar />
      <main className="container">
        <section className="card">
          <div className="row between">
            <h2>Your Stocks</h2>
            <button
              className="btn primary pill"
              onClick={() => alert('Add Stock — future feature (POST /api/portfolio)')}
            >
              Add Stock
            </button>
          </div>
          <div className="list">
            {stocks.map((s) => (
              <div key={s.ticker} className="card">
                <div className="row between">
                  <div>
                    <div className="stock-ticker">{s.ticker} — {s.shares} shares</div>
                    <div className="stock-company">{s.name}</div>
                  </div>
                  <div className="center">
                    <div className="stock-ticker">${(s.currentValue * s.shares).toFixed(2)}</div>
                    <div style={{ marginTop: 8 }}>
                      <span className={`status ${s.status}`}>{s.status.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
