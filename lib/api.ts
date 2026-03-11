// lib/api.ts — Mock API layer (replace each function body with a real fetch call)

function wait(ms = 400): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}

// ---- Types ----

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface DashboardSummary {
  portfolioValue: number;
  totalGainLoss: number;
  creditSummary: {
    totalBalance: number;
    totalLimit: number;
  };
}

export interface Stock {
  ticker: string;
  name: string;
  shares: number;
  currentValue: number;
  status: 'buy' | 'hold' | 'sell';
}

export interface CreditCard {
  id: string;
  name: string;
  balance: number;
  limit: number;
}

// ---- Auth ----

export async function mockLogin(
  username: string,
  _password: string,
): Promise<{ user: User; token: string }> {
  await wait(600);
  if (!username) throw new Error('Missing username');
  return {
    user: {
      id: 'user_123',
      name: username.replace(/\W+/g, ' ').trim() || 'Friend',
      email: `${username.toLowerCase()}@example.com`,
    },
    token: 'fake-jwt-token',
  };
}

// ---- Data fetches ----

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  await wait(300);
  return {
    portfolioValue: 12842.37,
    totalGainLoss: 842.37,
    creditSummary: { totalBalance: 1325.21, totalLimit: 6000 },
  };
}

export async function fetchUserPortfolio(): Promise<Stock[]> {
  await wait(350);
  return [
    { ticker: 'AAPL', name: 'Apple Inc.', shares: 8, currentValue: 164.2, status: 'hold' },
    { ticker: 'TSLA', name: 'Tesla, Inc.', shares: 2, currentValue: 201.9, status: 'sell' },
    { ticker: 'VTI', name: 'Vanguard Total Stock Market', shares: 15, currentValue: 210.12, status: 'buy' },
  ];
}

export async function fetchUserCreditCards(): Promise<CreditCard[]> {
  await wait(300);
  return [
    { id: 'card_1', name: 'Blush Rewards', balance: 420.12, limit: 2000 },
    { id: 'card_2', name: 'Everyday Card', balance: 120.45, limit: 1500 },
  ];
}
