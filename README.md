

# FinTrack — File Structure

```
fintrack/
│
├── App.jsx                        ← Root entry point, wires everything together
│
├── constants/
│   ├── index.js                   ← CAT_COLORS, CAT_LIST, fmt(), catColor(), catLight()
│   ├── mockData.js                ← All 50 mock transactions (MOCK array)
│   └── globalStyles.js            ← Full CSS string (G_CSS) — animations, layout, responsive
│
├── context/
│   └── AppContext.js              ← createContext, initialState, reducer, AppProvider, useApp(), useTheme()
│
├── components/
│   ├── Counter.jsx                ← Animated number counter (0 → value)
│   ├── Sidebar.jsx                ← Left nav sidebar + NAV config
│   ├── MobileNav.jsx              ← MobileHeader (hamburger) + BottomNav (tab bar)
│   ├── TopBar.jsx                 ← Desktop top bar (title, dark toggle, role switcher, add button)
│   ├── LoginModal.jsx             ← Admin login modal
│   └── AddModal.jsx               ← Add transaction modal
│
├── charts/
│   └── index.jsx                  ← MonthlyBarChart, SpendingDonut, BalanceLine, CategoryBar
│
└── pages/
    ├── DashboardPage.jsx          ← KPI cards, bar chart, donut, balance line, recent txns
    ├── TransactionsPage.jsx       ← Filter bar, sortable table, CSV export
    └── InsightsPage.jsx           ← Stat cards, category bar, balance line, observations
```

# FinTrack — Finance Dashboard

A personal finance dashboard built with React + Vite, featuring interactive charts, role-based access, and responsive design.

## Getting Started
```bash
git clone https://github.com/Darshanmutalikdesai/Finance-Dashboard.git
cd Finance-Dashboard
npm install
npm run dev
```

## Environment Variables

Create a `.env` file in the root of the project and add:
## Admin Login Credentials

| Field    | Value      |
|----------|------------|
| Username | admin      |
| Password | admin123   |

Admin access unlocks: Add Transaction, Delete transactions, and custom category input.

## State Management

All state is managed via `useReducer` inside `AppContext.js`. Use the `dispatch` function via the `useApp()` hook.

| Action Type        | Payload / Notes                                      |
|--------------------|------------------------------------------------------|
| ADD_TRANSACTION    | `{ ...txn, id: Date.now(), amount: parseFloat }`     |
| DELETE_TRANSACTION | `id`                                                 |
| SET_ROLE           | `"viewer"` or `"admin"`                              |
| TOGGLE_DARK        | —                                                    |
| SET_TAB            | `"dashboard"` / `"transactions"` / `"insights"`      |
| SET_SEARCH         | string                                               |
| SET_FTYPE          | `"all"` / `"income"` / `"expense"`                   |
| SET_FCAT           | `"all"` or any category string                       |
| SET_SORT           | `"date-desc"` / `"date-asc"` / `"amount-desc"` / `"amount-asc"` |
| SET_ADD_OPEN       | boolean                                              |
| SET_LOGIN_OPEN     | boolean                                              |
| SET_NEW_TX         | partial newTx object                                 |
| RESET_NEW_TX       | — (clears form and closes modal)                     |
| TOGGLE_SIDEBAR     | —                                                    |
| CLOSE_SIDEBAR      | —                                                    |

## Tech Stack

- **React 18 + Vite** — fast HMR development
- **react-chartjs-2 + Chart.js** — Bar, Doughnut, and Line charts
- **React Context + useReducer** — centralised state management
- **localStorage** — persists transactions and theme preference
- **CSS media queries** — responsive across desktop, tablet, and mobile
- **Sora + JetBrains Mono** — Google Fonts typography

