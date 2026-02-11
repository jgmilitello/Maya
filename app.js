// app.js — Shared JS and mock API layer
// All user-visible data must come from these functions (simulated API).

// Simple mock delay helper to simulate network
function wait(ms = 400) {
  return new Promise((res) => setTimeout(res, ms));
}

/* ------------------ Mock API functions (replace with real backend calls) ------------------ */
async function mockLogin(username, password) {
  await wait(600);
  // Very simple mock authentication — in real app this would be an API call.
  if (!username) throw new Error('Missing username');
  const fakeUser = {
    id: 'user_123',
    name: username.replace(/\W+/g, ' ').trim() || 'Friend',
    email: `${username.toLowerCase()}@example.com`,
  };
  return { user: fakeUser, token: 'fake-jwt-token' };
}

function getCurrentUser() {
  const raw = localStorage.getItem('maya_user');
  return raw ? JSON.parse(raw) : null;
}

function setCurrentUser(obj) {
  localStorage.setItem('maya_user', JSON.stringify(obj));
}

function logoutUser() {
  localStorage.removeItem('maya_user');
  // Redirect to login page
  window.location.href = '/login.html';
}

async function fetchDashboardSummary() {
  await wait(300);
  // Mock response that resembles what a backend might return
  return {
    portfolioValue: 12842.37,
    totalGainLoss: 842.37,
    creditSummary: {
      totalBalance: 1325.21,
      totalLimit: 6000,
    },
  };
}

async function fetchUserPortfolio() {
  await wait(350);
  return [
    { ticker: 'AAPL', name: 'Apple Inc.', shares: 8, currentValue: 164.2, status: 'hold' },
    { ticker: 'TSLA', name: 'Tesla, Inc.', shares: 2, currentValue: 201.9, status: 'sell' },
    { ticker: 'VTI', name: 'Vanguard Total Stock Market', shares: 15, currentValue: 210.12, status: 'buy' },
  ];
}

async function fetchUserCreditCards() {
  await wait(300);
  return [
    { id: 'card_1', name: 'Blush Rewards', balance: 420.12, limit: 2000 },
    { id: 'card_2', name: 'Everyday Card', balance: 120.45, limit: 1500 },
  ];
}

/* ------------------ Page initializers ------------------ */
document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  // Attach common listeners
  const logout = document.getElementById('logoutBtn');
  if (logout) logout.addEventListener('click', () => logoutUser());

  if (page === 'login') initLoginPage();
  if (page === 'dashboard') initDashboardPage();
  if (page === 'portfolio') initPortfolioPage();
  if (page === 'credit-cards') initCreditCardsPage();
});

/* ------------------ Login page ------------------ */
function initLoginPage() {
  const form = document.getElementById('loginForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    try {
      const res = await mockLogin(username, password);
      setCurrentUser(res.user);
      // In future we'll store tokens here too
      window.location.href = '/dashboard.html';
    } catch (err) {
      alert('Login failed: ' + err.message);
    }
  });
}

/* ------------------ Auth guard ------------------ */
function requireAuth(redirect = '/login.html') {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = redirect;
    return null;
  }
  return user;
}

/* ------------------ Dashboard ------------------ */
async function initDashboardPage() {
  const user = requireAuth();
  if (!user) return;
  document.getElementById('welcomeMsg').textContent = `Welcome back, ${user.name}!`;

  const summary = await fetchDashboardSummary();
  document.getElementById('cardPortfolio').innerHTML = `
    <h4>Total portfolio</h4>
    <div class="stock-ticker">$${summary.portfolioValue.toLocaleString(undefined,{minimumFractionDigits:2})}</div>
    <div class="muted-small">Value of your investments</div>
  `;

  const gainLossSign = summary.totalGainLoss >= 0 ? '+' : '-';
  document.getElementById('cardGainLoss').innerHTML = `
    <h4>Total gain / loss</h4>
    <div class="stock-ticker">${gainLossSign}$${Math.abs(summary.totalGainLoss).toFixed(2)}</div>
    <div class="muted-small">Since you started tracking</div>
  `;

  const utilPercent = Math.round((summary.creditSummary.totalBalance / summary.creditSummary.totalLimit) * 100);
  document.getElementById('cardCreditSummary').innerHTML = `
    <h4>Credit summary</h4>
    <div class="stock-ticker">$${summary.creditSummary.totalBalance.toFixed(2)}</div>
    <div class="muted-small">Limit: $${summary.creditSummary.totalLimit} • Utilization: ${utilPercent}%</div>
  `;
}

/* ------------------ Portfolio page ------------------ */
async function initPortfolioPage() {
  const user = requireAuth();
  if (!user) return;
  const list = document.getElementById('portfolioList');
  const stocks = await fetchUserPortfolio();
  list.innerHTML = '';
  stocks.forEach((s) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="row between">
        <div>
          <div class="stock-ticker">${s.ticker} — ${s.shares} shares</div>
          <div class="stock-company">${s.name}</div>
        </div>
        <div class="center">
          <div class="stock-ticker">$${(s.currentValue * s.shares).toFixed(2)}</div>
          <div style="margin-top:8px"><span class="status ${s.status}">${s.status.toUpperCase()}</span></div>
        </div>
      </div>
    `;
    list.appendChild(card);
  });

  const addBtn = document.getElementById('addStock');
  if (addBtn) addBtn.addEventListener('click', () => alert('Add Stock — UI only (future backend POST /api/portfolio)'));
}

/* ------------------ Credit cards page ------------------ */
async function initCreditCardsPage() {
  const user = requireAuth();
  if (!user) return;
  const list = document.getElementById('cardsList');
  const cards = await fetchUserCreditCards();
  list.innerHTML = '';
  cards.forEach((c) => {
    const util = Math.round((c.balance / c.limit) * 100);
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="row between">
        <div>
          <div class="stock-ticker">${c.name}</div>
          <div class="muted-small">Limit: $${c.limit}</div>
        </div>
        <div class="center">
          <div class="stock-ticker">$${c.balance.toFixed(2)}</div>
          <div class="muted-small">You're using ${util}% — ${util<=30? 'nice!':'keep an eye'}</div>
        </div>
      </div>
    `;
    list.appendChild(card);
  });
}

/* ------------------ Exports (for future unit tests or integration) ------------------ */
window.maya = {
  mockLogin,
  getCurrentUser,
  setCurrentUser,
  logoutUser,
  fetchDashboardSummary,
  fetchUserPortfolio,
  fetchUserCreditCards,
};
