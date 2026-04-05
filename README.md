# FinVault — Personal Finance Dashboard

A clean, interactive personal finance dashboard built with **React 18 + Vite**. Track income, expenses, and spending patterns with an intuitive dark-themed UI.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev

# 3. Open in browser
# → http://localhost:5173
```

To create a production build:

```bash
npm run build
npm run preview   # preview the build locally
```

---

## 📁 Project Structure

```
finvault/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx                  # React root entry point
    ├── App.jsx                   # Root component — routing, role & transaction state
    ├── index.css                 # Global styles, animations, responsive breakpoints
    │
    ├── components/
    │   ├── Ic.jsx                # SVG icon renderer (no external icon lib)
    │   ├── SummaryCard.jsx       # Metric card — Balance / Income / Expenses
    │   ├── Modal.jsx             # Reusable overlay modal
    │   ├── Charts.jsx            # BalanceTrendChart, SpendingDonut, MonthlyBarChart
    │   ├── SeesawChart.jsx       # Animated seesaw — Income vs Expenses visualisation
    │   ├── OverviewTab.jsx       # Dashboard overview tab
    │   ├── TransactionsTab.jsx   # Transaction table with CRUD, filter, search, export
    │   └── InsightsTab.jsx       # Analytics — category breakdown, MoM, observations
    │
    ├── hooks/
    │   └── useChart.js           # Custom hook — Chart.js lifecycle management
    │
    ├── utils/
    │   ├── theme.js              # Color palette, CAT_COLORS, chart tooltip config
    │   └── format.js             # fmt() currency formatter, pct() percentage helper
    │
    └── data/
        └── transactions.js       # Mock transaction data + 6-month trend data
```

---

## ✨ Features

### 1 · Dashboard Overview
- **Summary cards** — Total Balance, Income, and Expenses with live trend indicators
- **Balance Trend** — 6-month area chart showing net worth growth over time
- **Spending Donut** — Category breakdown with proportional bars
- **Seesaw Chart** — Animated visual comparing Income (left) vs Expenses (right) with the beam tilting based on which side is heavier. Click any month tab to see it animate.

### 2 · Transactions
- Full table with Date, Description, Category, Type, and Amount columns
- **Search** across description and category fields
- **Filter** by transaction type (Income / Expense) and by category
- **Sort** by date or amount (click column headers to toggle asc/desc)
- **Net total** of the current filtered view shown in the footer
- **CSV export** of the current filtered dataset
- **Admin-only:** Add, edit, and delete transactions via a modal form

### 3 · Role-Based UI
Toggle between **Viewer** and **Admin** using the badge in the top-right corner of the header.

| Action | Viewer | Admin |
|---|:---:|:---:|
| View all data | ✅ | ✅ |
| Add transaction | ❌ | ✅ |
| Edit transaction | ❌ | ✅ |
| Delete transaction | ❌ | ✅ |

No backend or auth required — role is toggled via a button for demonstration purposes.

### 4 · Insights
- Top spending category with percentage share of total expenses
- Category-by-category proportional bar breakdown
- Month-over-month comparison (February vs March) for income and expenses
- Savings rate for the current month with contextual feedback (Excellent / Good / Needs work)
- 4 auto-generated key observations derived from the transaction data

### 5 · Data Persistence
All transactions are saved to **localStorage** automatically. Your changes (add, edit, delete) survive page refreshes and browser restarts.

---

## 🏗 Tech Stack

| Concern | Choice |
|---|---|
| Framework | React 18 |
| Build tool | Vite 5 |
| Charts | Chart.js 4 (`chart.js/auto`) |
| Icons | Custom inline SVG paths — zero icon library dependencies |
| Fonts | Google Fonts — *Playfair Display* + *IBM Plex Mono* + *IBM Plex Sans* |
| Styling | Inline style objects + global CSS (`index.css`) |
| State | React `useState` + `useMemo` — no Redux, no Zustand |
| Persistence | `localStorage` with try/catch guard |

---

## 🧩 Component Reference

### `App.jsx`
Root component. Owns three pieces of state:
- `tab` — which tab is active (`overview` | `transactions` | `insights`)
- `role` — current role (`viewer` | `admin`)
- `transactions` — the source-of-truth array, synced to localStorage

Passes `transactions` and `setTransactions` down to child tabs as props.

### `components/Ic.jsx`
Lightweight SVG icon renderer. Takes `name`, `size`, and `color` props. All icon paths are stored as a plain object — no external library needed.

```jsx
<Ic name="arrowUp" size={16} color="#10b981" />
```

### `components/SummaryCard.jsx`
Reusable metric card used on the Overview tab. Props: `title`, `value`, `sub`, `upTrend`, `color`, `icon`.

### `components/Modal.jsx`
Generic overlay modal. Closes on backdrop click or the × button. Used by `TransactionsTab` for add/edit forms.

### `components/Charts.jsx`
Exports three Chart.js-powered components:
- `BalanceTrendChart` — line/area chart, takes `data` (array of `{ month, balance }`)
- `SpendingDonut` — doughnut chart, takes `catData` (array of `{ name, value }`)
- `MonthlyBarChart` — grouped bar chart, takes `data` (array of `{ month, income, expenses }`)

### `components/SeesawChart.jsx`
Custom SVG seesaw visualisation. No Chart.js — pure SVG with CSS transitions. The beam rotation angle is calculated from the income/expense ratio and animated with a spring easing (`cubic-bezier(0.34, 1.4, 0.64, 1)`). Includes month selector tabs and a bottom stats row showing savings rate.

### `components/OverviewTab.jsx`
Renders summary cards + all charts. Derives `catData` and totals from the `transactions` prop using `useMemo`.

### `components/TransactionsTab.jsx`
Owns all local UI state: search query, filters, sort config, modal visibility, and form values. CRUD operations call `setTransactions` lifted from `App`. CSV export uses a data-URI anchor click — no library needed.

### `components/InsightsTab.jsx`
Purely derived from `transactions` prop. No local state. All analytics (category totals, MoM figures, savings rate) are computed with `useMemo`.

### `hooks/useChart.js`
```js
useChart(ref, factory, deps)
```
Mounts a Chart.js instance on `ref.current` using `factory(canvas)`, and destroys it on unmount or when `deps` change. Prevents the double-mount memory leak common with Chart.js in React.

### `utils/theme.js`
Single source of truth for all colors (`C`), category color map (`CAT_COLORS`), full category list (`ALL_CATEGORIES`), and Chart.js tooltip defaults (`CHART_TOOLTIP`).

### `utils/format.js`
- `fmt(n)` — formats a number as Indian Rupee: `fmt(85000)` → `₹85,000`
- `pct(a, b)` — percentage change from `b` to `a`: `pct(110, 100)` → `'10.0'`

### `data/transactions.js`
Exports `INIT_TRANSACTIONS` (23 mock transactions across Feb–Mar 2026) and `TREND_DATA` (6-month summary used by the trend and bar charts).

---

## 🗂 State Architecture

```
App
├── tab            (string)   active tab
├── role           (string)   'viewer' | 'admin'
└── transactions   (array)    source of truth → localStorage

    ├── OverviewTab       reads transactions, derives totals + catData via useMemo
    ├── TransactionsTab   reads + mutates transactions via setTransactions
    │   ├── search        (local)
    │   ├── filterType    (local)
    │   ├── filterCat     (local)
    │   ├── sortBy        (local)
    │   ├── sortAsc       (local)
    │   ├── showModal     (local)
    │   ├── editTx        (local)
    │   └── form          (local)
    └── InsightsTab       reads transactions, all derived — no local state
```

---

## 🎨 Design Decisions

**Dark luxury theme** — deep navy (`#080c14`) background with gold (`#d4a843`) accents and IBM Plex Mono for financial figures gives the dashboard a premium, data-focused feel.

**Single source of truth** — `transactions` lives in `App` and flows down as props. Child components either read it (Overview, Insights) or mutate it via `setTransactions` (Transactions tab). No global store needed at this scale.

**No icon library** — `Ic.jsx` stores SVG path strings in a plain object. Zero bundle cost, fully customisable, no version conflicts.

**Chart.js via `chart.js/auto`** — auto-registers all chart types so no manual `Chart.register(...)` calls are needed.

**`useMemo` over derived state** — computed values (filtered lists, category totals, monthly aggregates) are memoised at the component level rather than stored in state, keeping the data flow simple and avoiding stale value bugs.

---

## ⚙️ Optional Enhancements Already Included

- [x] localStorage data persistence
- [x] CSV export of filtered transactions
- [x] Animated seesaw chart (custom SVG)
- [x] Smooth fade-in / slide-up animations
- [x] Responsive layout — collapses to single column on mobile, header nav switches to bottom tab bar
- [x] Empty state handling (no results, no data)
- [x] Role-based UI (Viewer / Admin toggle)

---

## 📦 Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "chart.js": "^4.4.1"
}
```

Dev dependencies: `vite`, `@vitejs/plugin-react`

No CSS framework. No UI component library. No state management library.
