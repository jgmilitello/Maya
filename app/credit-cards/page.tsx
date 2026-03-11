'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Topbar from '@/components/Topbar';
import { fetchUserCreditCards, type CreditCard } from '@/lib/api';
import { getCurrentUser } from '@/lib/auth';

export default function CreditCardsPage() {
  const router = useRouter();
  const [cards, setCards] = useState<CreditCard[]>([]);

  useEffect(() => {
    if (!getCurrentUser()) { router.push('/login'); return; }
    fetchUserCreditCards().then(setCards);
  }, [router]);

  return (
    <>
      <Topbar />
      <main className="container">
        <section className="card">
          <h2>Credit Cards</h2>
          <div className="list">
            {cards.map((c) => {
              const util = Math.round((c.balance / c.limit) * 100);
              return (
                <div key={c.id} className="card">
                  <div className="row between">
                    <div>
                      <div className="stock-ticker">{c.name}</div>
                      <div className="muted-small">Limit: ${c.limit}</div>
                    </div>
                    <div className="center">
                      <div className="stock-ticker">${c.balance.toFixed(2)}</div>
                      <div className="muted-small">
                        You&apos;re using {util}% — {util <= 30 ? 'nice!' : 'keep an eye'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
}
