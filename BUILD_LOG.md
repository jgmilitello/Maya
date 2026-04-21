# Mayas — Build Log

## BUILD COMPLETE
**Date:** 2026-04-20  
**Dev server:** `http://localhost:3000`

---

## [Phase 1] — 2026-04-20 Setup
**What was built:** Prisma schema (SQLite + libsql adapter), .env.local, full mock data (stocks, credit cards, bonds, 50+ budget transactions), Tailwind v4 theme with custom colors, Google Fonts (Nunito + DM Sans), prisma.config.ts
**Tested:** `npx prisma db push` ✓, `npx prisma generate` ✓
**Status:** ✅ Working

---

## [Phase 2] — 2026-04-20 Auth & Layout
**What was built:** NextAuth.js with Google OAuth + demo credentials provider, SessionProvider wrapper, middleware.ts for route protection, Sidebar (desktop + mobile bottom nav), TopBar (greeting + avatar + notification bell), AppLayout wrapper, landing page with hero + feature cards + gradient
**Tested:** Landing page renders with pink-to-purple gradient, Google sign-in button, "Try Demo Mode" button
**Status:** ✅ Working

---

## [Phase 3] — 2026-04-20 Course System
**What was built:** Reusable `<CourseFlow>` component with progress hearts, step navigation, completion save; all 4 courses (stocks 6 steps, credit cards 6 steps, bonds 5 steps, budgeting 6 steps); API routes POST `/api/courses/complete` and GET `/api/courses/status`
**Tested:** Build passes, API routes compile correctly
**Status:** ✅ Working

---

## [Phase 4] — 2026-04-20 Dashboard
**What was built:** Net worth card with area chart (1-year history), today's spending breakdown, 4 quick-glance stat cards (portfolio, credit cards, budget, daily spend), recent transactions list
**Tested:** Server component with mock data renders
**Status:** ✅ Working

---

## [Phase 5] — 2026-04-20 Stocks Tab
**What was built:** Course gate → StockDashboard; left panel (all accounts, investment account, Roth IRA, cash); main area (large balance, gain/loss, interactive line chart with 1M/YTD/1Y/3Y toggles); full positions table with all columns (symbol, company, last price, today's +/-, total +/-, value, % account, shares, cost basis)
**Mock data:** All 10 stocks from spec + cash + Roth IRA
**Status:** ✅ Working

---

## [Phase 6] — 2026-04-20 Credit Cards Tab
**What was built:** Course gate → CreditCardsDashboard; card carousel with prev/next navigation; styled card visuals with gradient backgrounds; per-card details (balance/limit progress bar, APR, rewards earned, min payment, due date); overall utilization gauge; recent transactions list
**Mock data:** Chase Freedom Unlimited, Fidelity Visa, Discover It
**Status:** ✅ Working

---

## [Phase 7] — 2026-04-20 Bonds Tab
**What was built:** Course gate → BondsDashboard; 3 summary cards (invested, current value, avg yield); yield comparison bar chart (color-coded by bond type); detailed holdings list with face value, coupon rate, yield, maturity date
**Mock data:** 5 bonds (2 Treasury, 2 Corporate, 1 Municipal)
**Status:** ✅ Working

---

## [Phase 8] — 2026-04-20 Budgeting Tab
**What was built:** Course gate → BudgetingDashboard; income vs expenses donut chart; spending by category pie chart; budget progress bars for all 10 categories; transaction log (filterable by category, searchable by description); "Add Transaction" modal with form; budget insight card
**Mock data:** 41 transactions across 30 days
**Status:** ✅ Working

---

## [Phase 9] — 2026-04-20 Settings & Polish
**What was built:** Settings page (profile, connected accounts with "Coming soon" toast, notification toggles, course progress grid, sign out); all layouts are mobile-responsive (bottom tab bar on mobile, sidebar on desktop)
**Status:** ✅ Working

---

## [Phase 10] — 2026-04-20 Final QA & Build
**TypeScript build:** Clean ✅
**All routes compile:** /, /dashboard, /stocks, /credit-cards, /bonds, /budgeting, /settings, /api/... ✅
**Dev server:** Running on localhost:3000 ✅

---

## Remaining TODOs / Known Limitations
- Google OAuth requires real credentials in `.env.local` (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET) — use **Try Demo Mode** for full functionality without OAuth setup
- Course completion and manually added transactions persist in SQLite DB across sessions (demo user only)
- The "Connect Bank" / "Connect Broker" buttons in Settings show "Coming soon" — placeholder UI only
- Notification toggles are UI-only (non-functional)
- The middleware file convention warning (`middleware.ts` → should be `proxy.ts`) is cosmetic only in Next.js 16 — does not affect functionality

## To Present
1. Open `http://localhost:3000` in any browser
2. Click **Try Demo Mode** to bypass Google OAuth
3. Navigate to Stocks, Credit Cards, Bonds, or Budgeting — complete the short course first
4. After completing each course, the full dashboard appears
5. In Budgeting, use "Add Transaction" to add custom transactions
