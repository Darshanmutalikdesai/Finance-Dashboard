# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh




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

## How to use

In your `main.jsx` / `index.jsx`:

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./fintrack/App";

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
```

## State actions (dispatch reference)

| Action type          | Payload / notes                          |
|----------------------|------------------------------------------|
| ADD_TRANSACTION      | `{ ...txn, id, amount (parsed float) }`  |
| DELETE_TRANSACTION   | `id`                                     |
| SET_ROLE             | `"viewer"` or `"admin"`                  |
| TOGGLE_DARK          | —                                        |
| SET_TAB              | `"dashboard"` / `"transactions"` / `"insights"` |
| SET_SEARCH           | string                                   |
| SET_FTYPE            | `"all"` / `"income"` / `"expense"`       |
| SET_FCAT             | `"all"` or any category string           |
| SET_SORT             | `"date-desc"` / `"date-asc"` / `"amount-desc"` / `"amount-asc"` |
| SET_ADD_OPEN         | boolean                                  |
| SET_LOGIN_OPEN       | boolean                                  |
| SET_NEW_TX           | partial newTx object                     |
| RESET_NEW_TX         | — (clears form + closes modal)           |
| TOGGLE_SIDEBAR       | —                                        |
| CLOSE_SIDEBAR        | —                                        |