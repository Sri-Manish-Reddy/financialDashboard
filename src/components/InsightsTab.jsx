import { useMemo } from 'react'
import Ic from './Ic'
import { C, CAT_COLORS } from '../utils/theme'
import { fmt, pct } from '../utils/format'

function MomRow({ label, feb, mar, positiveIsGood }) {
  const isUp   = mar > feb
  const isGood = positiveIsGood ? isUp : !isUp
  const diff   = Math.abs(parseFloat(pct(mar, feb)))

  return (
    <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: `1px solid ${C.border}` }}>
      <div style={{ fontSize: 12, color: C.textDim, marginBottom: 10 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: C.textDim, marginBottom: 3 }}>February</div>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 16, color: positiveIsGood ? C.green : C.red, fontWeight: 600 }}>{fmt(feb)}</div>
        </div>
        <div style={{ color: C.textDim }}>→</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: C.textDim, marginBottom: 3 }}>March</div>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 16, color: positiveIsGood ? C.green : C.red, fontWeight: 600 }}>{fmt(mar)}</div>
        </div>
        <div style={{ background: isGood ? '#0d2e1e' : '#2e0d0d', borderRadius: 8, padding: '6px 10px', color: isGood ? C.green : C.red, fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
          <Ic name={isUp ? 'trendUp' : 'trendDown'} size={12} color={isGood ? C.green : C.red} />
          {diff}%
        </div>
      </div>
    </div>
  )
}

export default function InsightsTab({ transactions }) {
  const catData = useMemo(() => {
    const map = {}
    transactions.filter((t) => t.type === 'expense').forEach((t) => { map[t.category] = (map[t.category] || 0) + t.amount })
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)
  }, [transactions])

  const totalExp   = catData.reduce((s, c) => s + c.value, 0)
  const marInc     = transactions.filter((t) => t.type === 'income'  && t.date.startsWith('2026-03')).reduce((s, t) => s + t.amount, 0)
  const febInc     = transactions.filter((t) => t.type === 'income'  && t.date.startsWith('2026-02')).reduce((s, t) => s + t.amount, 0)
  const marExp     = transactions.filter((t) => t.type === 'expense' && t.date.startsWith('2026-03')).reduce((s, t) => s + t.amount, 0)
  const febExp     = transactions.filter((t) => t.type === 'expense' && t.date.startsWith('2026-02')).reduce((s, t) => s + t.amount, 0)
  const savingsRate = marInc > 0 ? ((marInc - marExp) / marInc * 100) : 0
  const incomeSrcs  = new Set(transactions.filter((t) => t.type === 'income').map((t) => t.category)).size
  const billsTotal  = catData.find((c) => c.name === 'Bills')?.value || 0

  const observations = [
    { icon: '📊', title: 'Top Spending Category',  body: `${catData[0]?.name || '—'} leads at ${fmt(catData[0]?.value || 0)}, representing ${catData[0] ? ((catData[0].value / totalExp) * 100).toFixed(1) : 0}% of all expenses.` },
    { icon: '📈', title: 'Portfolio Growth',        body: `Balance grew from ₹1.42L to ₹2.48L over 6 months — a ${(((248430 - 142000) / 142000) * 100).toFixed(1)}% increase. Excellent savings discipline.` },
    { icon: '🔀', title: 'Income Diversification', body: `${incomeSrcs} distinct income ${incomeSrcs === 1 ? 'source' : 'sources'} detected. Diversified income reduces financial vulnerability.` },
    { icon: '💡', title: 'Bill Optimisation',      body: `Recurring bills total ${fmt(billsTotal)}. An audit of subscriptions could free up meaningful monthly cash.` },
  ]

  return (
    <div className="fade-in">
      <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 16, marginBottom: 16 }}>

        {/* Category Breakdown */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '20px 22px' }}>
          <div style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', letterSpacing: 2, fontWeight: 600, marginBottom: 16 }}>Category Breakdown</div>
          {catData.length === 0
            ? <div style={{ color: C.textDim, textAlign: 'center', padding: 48 }}>No data</div>
            : (
              <>
                <div style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 28, color: CAT_COLORS[catData[0]?.name] || C.text, marginBottom: 4 }}>{catData[0]?.name}</div>
                <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 20, color: C.text, marginBottom: 2 }}>{fmt(catData[0]?.value || 0)}</div>
                <div style={{ fontSize: 12, color: C.textDim, marginBottom: 20 }}>{((catData[0]?.value || 0) / totalExp * 100).toFixed(1)}% of total expenses</div>
                {catData.slice(0, 5).map((c) => (
                  <div key={c.name} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 12 }}>
                      <span style={{ color: C.textMuted, display: 'flex', alignItems: 'center', gap: 7 }}>
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: CAT_COLORS[c.name] || '#666', display: 'inline-block' }} />
                        {c.name}
                      </span>
                      <span style={{ color: CAT_COLORS[c.name] || C.text, fontFamily: "'IBM Plex Mono',monospace" }}>{fmt(c.value)}</span>
                    </div>
                    <div style={{ background: '#1a2744', borderRadius: 4, height: 4 }}>
                      <div style={{ background: CAT_COLORS[c.name] || '#666', height: 4, borderRadius: 4, width: `${(c.value / catData[0].value) * 100}%`, transition: 'width 0.6s ease' }} />
                    </div>
                  </div>
                ))}
              </>
            )}
        </div>

        {/* Month-over-Month */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '20px 22px' }}>
          <div style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', letterSpacing: 2, fontWeight: 600, marginBottom: 16 }}>Month-over-Month</div>
          <MomRow label="Income"   feb={febInc} mar={marInc} positiveIsGood={true} />
          <MomRow label="Expenses" feb={febExp} mar={marExp} positiveIsGood={false} />
          <div style={{ background: C.cardAlt, borderRadius: 10, padding: '14px 16px', border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 }}>March Savings Rate</div>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 24, color: C.gold, fontWeight: 600 }}>{savingsRate.toFixed(1)}%</div>
            <div style={{ fontSize: 12, color: C.textDim, marginTop: 4 }}>
              {savingsRate > 30 ? '✓ Excellent — above the 30% benchmark' : savingsRate > 20 ? '↑ Good — aim for 30%+' : '↓ Consider reducing discretionary spending'}
            </div>
          </div>
        </div>
      </div>

      {/* Key Observations */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '20px 22px' }}>
        <div style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', letterSpacing: 2, fontWeight: 600, marginBottom: 16 }}>Key Observations</div>
        <div className="insight-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 12 }}>
          {observations.map((obs, i) => (
            <div key={i} style={{ background: C.cardAlt, borderRadius: 10, padding: 16, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 22, marginBottom: 10 }}>{obs.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 6 }}>{obs.title}</div>
              <div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.65 }}>{obs.body}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
