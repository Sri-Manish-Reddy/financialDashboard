import { useState, useEffect } from 'react'
import Ic from './components/Ic'
import OverviewTab from './components/OverviewTab'
import TransactionsTab from './components/TransactionsTab'
import InsightsTab from './components/InsightsTab'
import { C } from './utils/theme'
import { INIT_TRANSACTIONS } from './data/transactions'

const TABS = [
  { id: 'overview',     label: 'Overview',     icon: 'dashboard' },
  { id: 'transactions', label: 'Transactions', icon: 'list'      },
  { id: 'insights',     label: 'Insights',     icon: 'lightbulb' },
]

export default function App() {
  const [tab,          setTab]          = useState('overview')
  const [role,         setRole]         = useState('viewer')
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('finvault_txs')
      return saved ? JSON.parse(saved) : INIT_TRANSACTIONS
    } catch {
      return INIT_TRANSACTIONS
    }
  })

  useEffect(() => {
    try { localStorage.setItem('finvault_txs', JSON.stringify(transactions)) } catch {}
  }, [transactions])

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'IBM Plex Sans',system-ui,sans-serif" }}>

      {/* ── HEADER ── */}
      <header style={{ background: C.header, borderBottom: `1px solid ${C.border}`, position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>

          {/* Logo + Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div>
              <div style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 20, color: C.gold, lineHeight: 1 }}>FinVault</div>
              <div style={{ fontSize: 10, color: C.textDim, letterSpacing: 3, textTransform: 'uppercase', marginTop: 1 }}>Personal Finance</div>
            </div>
            <div style={{ width: 1, height: 28, background: C.border }} />
            <nav className="header-nav" style={{ display: 'flex', gap: 2 }}>
              {TABS.map((t) => (
                <button
                  key={t.id}
                  className="nav-link"
                  onClick={() => setTab(t.id)}
                  style={{
                    background:   tab === t.id ? '#111d2e' : 'transparent',
                    border:       tab === t.id ? `1px solid ${C.border}` : '1px solid transparent',
                    color:        tab === t.id ? C.gold : C.textMuted,
                    borderRadius: 8, padding: '7px 14px', cursor: 'pointer', fontSize: 13,
                    display: 'flex', alignItems: 'center', gap: 6,
                    fontWeight: tab === t.id ? 600 : 400,
                  }}
                >
                  <Ic name={t.icon} size={14} color={tab === t.id ? C.gold : C.textDim} />
                  {t.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Role toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 12, color: C.textDim }}>Role:</span>
            <button
              onClick={() => setRole((r) => r === 'viewer' ? 'admin' : 'viewer')}
              style={{
                background:   role === 'admin' ? '#1a1a2e' : '#0f2027',
                border:       `1px solid ${role === 'admin' ? '#7c3aed50' : '#0e749050'}`,
                color:        role === 'admin' ? '#a78bfa' : '#22d3ee',
                borderRadius: 20, padding: '6px 14px', fontSize: 12, fontWeight: 700,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7,
                letterSpacing: 1, transition: 'all 0.2s',
              }}
            >
              <Ic name={role === 'admin' ? 'shield' : 'eye'} size={12} color={role === 'admin' ? '#a78bfa' : '#22d3ee'} />
              {role.toUpperCase()}
            </button>
          </div>
        </div>

        {/* Mobile bottom-nav strip */}
        <div className="mobile-nav" style={{ display: 'none', gap: 2, padding: '6px 16px 8px', borderTop: `1px solid ${C.border}` }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                flex: 1, background: tab === t.id ? '#111d2e' : 'transparent', border: 'none',
                color: tab === t.id ? C.gold : C.textDim, padding: '7px', cursor: 'pointer',
                fontSize: 11, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, borderRadius: 8,
              }}
            >
              <Ic name={t.icon} size={16} color={tab === t.id ? C.gold : C.textDim} />
              {t.label}
            </button>
          ))}
        </div>
      </header>

      {/* ── MAIN ── */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 20px' }}>
        {tab === 'overview'     && <OverviewTab     transactions={transactions} />}
        {tab === 'transactions' && <TransactionsTab transactions={transactions} setTransactions={setTransactions} role={role} />}
        {tab === 'insights'     && <InsightsTab     transactions={transactions} />}
      </main>
    </div>
  )
}
