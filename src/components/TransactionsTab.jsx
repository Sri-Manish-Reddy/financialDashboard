import { useState, useMemo } from 'react'
import Ic from './Ic'
import Modal from './Modal'
import { C, CAT_COLORS, ALL_CATEGORIES } from '../utils/theme'
import { fmt } from '../utils/format'

const inputSt = {
  width: '100%',
  background: '#080c14',
  border: `1px solid #1a2744`,
  borderRadius: 8,
  padding: '10px 14px',
  color: '#e2e8f0',
  fontSize: 13,
  outline: 'none',
}

function LabeledField({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 11, color: '#4a6080', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6, fontWeight: 600 }}>
        {label}
      </label>
      {children}
    </div>
  )
}

function SortArrow({ col, sortBy, sortAsc }) {
  return <Ic name={sortBy === col ? (sortAsc ? 'chevUp' : 'chevDown') : 'chevDown'} size={11} color={sortBy === col ? C.gold : C.textDim} />
}

export default function TransactionsTab({ transactions, setTransactions, role }) {
  const [search,     setSearch]     = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterCat,  setFilterCat]  = useState('all')
  const [sortBy,     setSortBy]     = useState('date')
  const [sortAsc,    setSortAsc]    = useState(false)
  const [showModal,  setShowModal]  = useState(false)
  const [editTx,     setEditTx]     = useState(null)
  const [form,       setForm]       = useState({ desc: '', amount: '', category: 'Food', type: 'expense', date: '' })

  const filtered = useMemo(() => {
    let res = transactions
    if (search)             res = res.filter((t) => t.desc.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase()))
    if (filterType !== 'all') res = res.filter((t) => t.type === filterType)
    if (filterCat  !== 'all') res = res.filter((t) => t.category === filterCat)
    return [...res].sort((a, b) =>
      sortBy === 'date'
        ? (sortAsc ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date))
        : (sortAsc ? a.amount - b.amount : b.amount - a.amount)
    )
  }, [transactions, search, filterType, filterCat, sortBy, sortAsc])

  const netFiltered = filtered.reduce((s, t) => t.type === 'income' ? s + t.amount : s - t.amount, 0)

  const openAdd  = () => { setEditTx(null); setForm({ desc: '', amount: '', category: 'Food', type: 'expense', date: new Date().toISOString().split('T')[0] }); setShowModal(true) }
  const openEdit = (tx) => { setEditTx(tx); setForm({ desc: tx.desc, amount: tx.amount, category: tx.category, type: tx.type, date: tx.date }); setShowModal(true) }
  const saveTx   = () => {
    if (!form.desc || !form.amount || !form.date) return
    const tx = { ...form, amount: parseFloat(form.amount), id: editTx ? editTx.id : Date.now() }
    setTransactions((t) => editTx ? t.map((x) => x.id === editTx.id ? tx : x) : [tx, ...t])
    setShowModal(false)
  }
  const deleteTx = (id) => { if (window.confirm('Delete this transaction?')) setTransactions((t) => t.filter((x) => x.id !== id)) }
  const toggleSort = (col) => { if (sortBy === col) setSortAsc(!sortAsc); else { setSortBy(col); setSortAsc(false) } }

  const exportCSV = () => {
    const rows = [['Date', 'Description', 'Category', 'Type', 'Amount'], ...filtered.map((t) => [t.date, t.desc, t.category, t.type, t.amount])]
    const a = document.createElement('a')
    a.href = 'data:text/csv,' + encodeURIComponent(rows.map((r) => r.join(',')).join('\n'))
    a.download = 'transactions.csv'
    a.click()
  }

  const selSt = { ...inputSt, width: 'auto' }
  const isFormValid = form.desc && form.amount && form.date

  return (
    <div className="fade-in">
      {/* Controls */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
          <div style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', lineHeight: 0 }}>
            <Ic name="search" size={14} color={C.textDim} />
          </div>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search transactions…" style={{ ...inputSt, paddingLeft: 34 }} />
        </div>

        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={selSt}>
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} style={selSt}>
          <option value="all">All Categories</option>
          {ALL_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <button onClick={exportCSV} style={{ background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 14px', color: C.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
          <Ic name="download" size={14} color={C.textMuted} /> CSV
        </button>

        {role === 'admin' && (
          <button className="btn-gold" onClick={openAdd} style={{ background: C.gold, color: '#080c14', border: 'none', borderRadius: 8, padding: '10px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Ic name="plus" size={14} color="#080c14" /> Add Transaction
          </button>
        )}
      </div>

      {/* Table */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
            <thead>
              <tr style={{ background: C.cardAlt, borderBottom: `1px solid ${C.border}` }}>
                {[
                  { k: 'date',   l: 'Date',        sort: true  },
                  { k: 'desc',   l: 'Description', sort: false },
                  { k: 'cat',    l: 'Category',    sort: false },
                  { k: 'type',   l: 'Type',        sort: false },
                  { k: 'amount', l: 'Amount',      sort: true  },
                ].map((col) => (
                  <th
                    key={col.k}
                    onClick={col.sort ? () => toggleSort(col.k === 'date' ? 'date' : 'amount') : null}
                    style={{ padding: '11px 18px', textAlign: 'left', fontSize: 11, color: C.textDim, textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 600, cursor: col.sort ? 'pointer' : 'default', whiteSpace: 'nowrap', userSelect: 'none' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      {col.l}
                      {col.sort && <SortArrow col={col.k === 'date' ? 'date' : 'amount'} sortBy={sortBy} sortAsc={sortAsc} />}
                    </div>
                  </th>
                ))}
                {role === 'admin' && (
                  <th style={{ padding: '11px 18px', fontSize: 11, color: C.textDim, textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 600 }}>
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={role === 'admin' ? 6 : 5} style={{ padding: 56, textAlign: 'center', color: C.textDim }}>
                    <div style={{ fontSize: 32, marginBottom: 10 }}>🔍</div>
                    No transactions match your filters
                  </td>
                </tr>
              )}
              {filtered.map((tx) => (
                <tr key={tx.id} className="tx-row" style={{ borderBottom: '1px solid #111d2e' }}>
                  <td style={{ padding: '12px 18px', fontSize: 12, color: C.textMuted, fontFamily: "'IBM Plex Mono',monospace", whiteSpace: 'nowrap' }}>{tx.date}</td>
                  <td style={{ padding: '12px 18px', fontSize: 13, color: C.text, maxWidth: 220 }}>{tx.desc}</td>
                  <td style={{ padding: '12px 18px' }}>
                    <span style={{ background: `${CAT_COLORS[tx.category] || '#666'}22`, color: CAT_COLORS[tx.category] || '#aaa', borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700, letterSpacing: 0.5, whiteSpace: 'nowrap' }}>
                      {tx.category}
                    </span>
                  </td>
                  <td style={{ padding: '12px 18px' }}>
                    <span style={{ color: tx.type === 'income' ? C.green : C.red, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                      {tx.type}
                    </span>
                  </td>
                  <td style={{ padding: '12px 18px', fontFamily: "'IBM Plex Mono',monospace", fontSize: 14, fontWeight: 600, color: tx.type === 'income' ? C.green : C.red, whiteSpace: 'nowrap' }}>
                    {tx.type === 'income' ? '+' : '−'}{fmt(tx.amount)}
                  </td>
                  {role === 'admin' && (
                    <td style={{ padding: '12px 18px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="icon-btn" onClick={() => openEdit(tx)} style={{ background: '#1a2744', border: 'none', borderRadius: 6, padding: '6px 8px', cursor: 'pointer', lineHeight: 0 }}>
                          <Ic name="edit" size={13} color={C.gold} />
                        </button>
                        <button className="icon-btn" onClick={() => deleteTx(tx.id)} style={{ background: '#1a1020', border: 'none', borderRadius: 6, padding: '6px 8px', cursor: 'pointer', lineHeight: 0 }}>
                          <Ic name="trash" size={13} color={C.red} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '10px 18px', borderTop: '1px solid #111d2e', fontSize: 12, color: C.textDim, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <span>Showing {filtered.length} of {transactions.length} transactions</span>
          <span>Net: <span style={{ fontFamily: "'IBM Plex Mono',monospace", color: netFiltered >= 0 ? C.green : C.red, fontWeight: 600 }}>{netFiltered >= 0 ? '+' : ''}{fmt(netFiltered)}</span></span>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)} title={editTx ? 'Edit Transaction' : 'New Transaction'}>
        <LabeledField label="Description">
          <input type="text" value={form.desc} onChange={(e) => setForm((x) => ({ ...x, desc: e.target.value }))} placeholder="e.g. Monthly Salary" style={inputSt} />
        </LabeledField>
        <LabeledField label="Amount (₹)">
          <input type="number" value={form.amount} onChange={(e) => setForm((x) => ({ ...x, amount: e.target.value }))} placeholder="0" style={inputSt} />
        </LabeledField>
        <LabeledField label="Date">
          <input type="date" value={form.date} onChange={(e) => setForm((x) => ({ ...x, date: e.target.value }))} style={inputSt} />
        </LabeledField>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
          <div>
            <label style={{ display: 'block', fontSize: 11, color: C.textDim, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6, fontWeight: 600 }}>Type</label>
            <select value={form.type} onChange={(e) => setForm((x) => ({ ...x, type: e.target.value }))} style={inputSt}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, color: C.textDim, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6, fontWeight: 600 }}>Category</label>
            <select value={form.category} onChange={(e) => setForm((x) => ({ ...x, category: e.target.value }))} style={inputSt}>
              {ALL_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <button
          onClick={saveTx}
          disabled={!isFormValid}
          style={{ width: '100%', background: isFormValid ? C.gold : '#1a2744', color: isFormValid ? '#080c14' : C.textDim, border: 'none', borderRadius: 8, padding: 12, fontSize: 14, fontWeight: 700, cursor: isFormValid ? 'pointer' : 'not-allowed', transition: 'background 0.2s' }}
        >
          {editTx ? 'Save Changes' : 'Add Transaction'}
        </button>
      </Modal>
    </div>
  )
}
