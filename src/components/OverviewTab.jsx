import { useMemo } from 'react'
import SummaryCard from './SummaryCard'
import { BalanceTrendChart, SpendingDonut, MonthlyBarChart } from './Charts'
import { C } from '../utils/theme'
import { fmt } from '../utils/format'
import { TREND_DATA } from '../data/transactions'
import SeesawChart from './SeeSaw'
//check
export default function OverviewTab({ transactions }) {
  const totalIncome   = useMemo(() => transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0), [transactions])
  const totalExpenses = useMemo(() => transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0), [transactions])
  const balance       = totalIncome - totalExpenses

  const catData = useMemo(() => {
    const map = {}
    transactions.filter((t) => t.type === 'expense').forEach((t) => { map[t.category] = (map[t.category] || 0) + t.amount })
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)
  }, [transactions])

  return (
    <div className="fade-in">
      {/* Summary Cards */}
      <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16, marginBottom: 20 }}>
        <SummaryCard title="Total Balance"  value={fmt(balance)}        sub="+13.9% from last month"                                              upTrend={true}  color={C.gold}  icon="wallet"    />
        <SummaryCard title="Total Income"   value={fmt(totalIncome)}    sub={`${transactions.filter((t) => t.type === 'income').length} transactions`}  upTrend={true}  color={C.green} icon="arrowUp"   />
        <SummaryCard title="Total Expenses" value={fmt(totalExpenses)}  sub={`${transactions.filter((t) => t.type === 'expense').length} transactions`} upTrend={false} color={C.red}   icon="arrowDown" />
      </div>



<div style={{ float:'left', width: '75vh',background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '20px 22px' }}>
  <div style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', letterSpacing: 2, fontWeight: 600, marginBottom: 4 }}>
    Income vs Expenses Balance
  </div>
  <SeesawChart />
</div>
      {/* Charts row */}
      <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 16, marginBottom: 20 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '20px 22px' }}>
          <div style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', letterSpacing: 2, fontWeight: 600, marginBottom: 14 }}>
            Balance Trend · 6 Months
          </div>
          <BalanceTrendChart data={TREND_DATA} />
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '20px 22px' }}>
          <div style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', letterSpacing: 2, fontWeight: 600, marginBottom: 14 }}>
            Spending by Category
          </div>
          {catData.length > 0
            ? <SpendingDonut catData={catData} />
            : <div style={{ color: C.textDim, textAlign: 'center', padding: 48 }}>No expense data available</div>}
        </div>
      </div>

      {/* Monthly bar */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '20px 22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', letterSpacing: 2, fontWeight: 600 }}>
            Monthly Income vs Expenses
          </div>
          <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: C.textMuted }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(16,185,129,0.8)', display: 'inline-block' }} /> Income
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: C.textMuted }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(239,68,68,0.8)', display: 'inline-block' }} /> Expenses
            </span>
          </div>
        </div>
        <MonthlyBarChart data={TREND_DATA} />
      </div>
    </div>
  )
}
