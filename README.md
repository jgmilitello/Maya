# Maya — Personal Finance (frontend-only demo)

This repository contains a beginner-friendly frontend skeleton for a personal finance app called Maya. It's designed to be backend-ready later: all data is currently provided by mock functions in `app.js` and stored in `localStorage` for a simulated authentication flow.

Files added:

- `login.html` — Cute login screen (stores a fake user in localStorage).
- `dashboard.html` — Main homepage with summary cards.
- `portfolio.html` — Portfolio list (stocks from mock API).
- `credit-cards.html` — Credit card overview (mock data).
- `styles.css` — Shared stylesheet for the whole site.
- `app.js` — Shared JavaScript containing mock API functions and page initializers.

How to open:

1. Run a static file server from the project root (recommended). For example:

```bash
# Python 3
python3 -m http.server 8000

# or Node (if installed):
npx serve .
```

2. Open `http://localhost:8000/login.html` in your browser.

Notes for future backend work:
- Replace `mockLogin`, `fetchUserPortfolio`, `fetchUserCreditCards`, and `fetchDashboardSummary` with real fetch calls to your API.
- Store auth tokens securely and use them in headers for API requests.
- Move routing to a proper client-side router if needed.
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
