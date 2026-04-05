import { useState } from 'react'
import { C } from '../utils/theme'
import { fmt } from '../utils/format'
import { TREND_DATA } from '../data/transactions'
 
export default function SeesawChart() {
  const [monthIdx, setMonthIdx] = useState(TREND_DATA.length - 1)
  const d        = TREND_DATA[monthIdx]
  const income   = d.income
  const expenses = d.expenses
  const balance  = d.income - d.expenses
  const maxVal   = Math.max(income, expenses)
 
  // tilt: income heavier → left goes DOWN → beam tilts CCW → negative degrees
  const maxAngle = 18
  const angle    = -((income - expenses) / maxVal) * maxAngle
 
  // SVG layout constants
  const W        = 560
  const H        = 280
  const pivotX   = W / 2        // 280
  const pivotY   = 175
  const beamHalf = 210
  const platW    = 118
  const platH    = 76
 
  const isBalanced  = Math.abs(income - expenses) < maxVal * 0.05
  const incomeWins  = income > expenses
  const tiltLabel   = isBalanced ? '⚖ Balanced' : incomeWins ? '↙ Saving more' : '↘ Spending more'
  const tiltColor   = isBalanced ? C.gold : incomeWins ? C.green : C.red
 
  return (
    <div>
      {/* Month tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
        {TREND_DATA.map((m, i) => (
          <button key={m.month} onClick={() => setMonthIdx(i)} style={{
            background:   i === monthIdx ? C.gold : '#111d2e',
            color:        i === monthIdx ? '#080c14' : C.textMuted,
            border:       `1px solid ${i === monthIdx ? C.gold : C.border}`,
            borderRadius: 6, padding: '5px 14px', fontSize: 12,
            fontWeight:   i === monthIdx ? 700 : 400, cursor: 'pointer',
            transition:   'all 0.2s',
          }}>
            {m.month}
          </button>
        ))}
      </div>
 
      {/* Tilt status */}
      <div style={{ textAlign: 'center', marginBottom: 4, fontSize: 12, color: tiltColor, fontWeight: 600, letterSpacing: 1 }}>
        {tiltLabel}
      </div>
 
      {/* SVG Seesaw */}
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', overflow: 'visible' }}>
 
        {/* ── Rotating beam + platforms ── */}
        <g style={{
          transform:       `rotate(${angle}deg)`,
          transformOrigin: `${pivotX}px ${pivotY}px`,
          transition:      'transform 0.75s cubic-bezier(0.34, 1.4, 0.64, 1)',
        }}>
 
          {/* Beam */}
          <rect
            x={pivotX - beamHalf} y={pivotY - 5}
            width={beamHalf * 2} height={10} rx={5}
            fill="#162236" stroke="#243560" strokeWidth={1}
          />
 
          {/* Pivot circle on beam */}
          <circle cx={pivotX} cy={pivotY} r={8} fill={C.gold} />
 
          {/* ── LEFT: Income ── */}
          <line
            x1={pivotX - beamHalf} y1={pivotY - 5}
            x2={pivotX - beamHalf} y2={pivotY - platH - 4}
            stroke="#243560" strokeWidth={2}
          />
          <rect
            x={pivotX - beamHalf - platW / 2} y={pivotY - platH - platH / 2 - 4}
            width={platW} height={platH} rx={10}
            fill="rgba(16,185,129,0.1)" stroke={C.green} strokeWidth={1.5}
          />
          <text x={pivotX - beamHalf} y={pivotY - platH - platH / 2 + 14} textAnchor="middle"
            style={{ fill: C.green, fontSize: '9px', fontWeight: 700, letterSpacing: '2.5px', fontFamily: 'IBM Plex Sans, sans-serif' }}>
            INCOME
          </text>
          <text x={pivotX - beamHalf} y={pivotY - platH - platH / 2 + 36} textAnchor="middle"
            style={{ fill: C.text, fontSize: '15px', fontWeight: 600, fontFamily: 'IBM Plex Mono, monospace' }}>
            {fmt(income)}
          </text>
          <text x={pivotX - beamHalf} y={pivotY - platH - platH / 2 + 54} textAnchor="middle"
            style={{ fill: incomeWins ? C.green : C.textDim, fontSize: '10px', fontFamily: 'IBM Plex Sans, sans-serif' }}>
            {incomeWins ? '▲ heavier' : '▼ lighter'}
          </text>
 
          {/* ── RIGHT: Expenses ── */}
          <line
            x1={pivotX + beamHalf} y1={pivotY - 5}
            x2={pivotX + beamHalf} y2={pivotY - platH - 4}
            stroke="#243560" strokeWidth={2}
          />
          <rect
            x={pivotX + beamHalf - platW / 2} y={pivotY - platH - platH / 2 - 4}
            width={platW} height={platH} rx={10}
            fill="rgba(239,68,68,0.1)" stroke={C.red} strokeWidth={1.5}
          />
          <text x={pivotX + beamHalf} y={pivotY - platH - platH / 2 + 14} textAnchor="middle"
            style={{ fill: C.red, fontSize: '9px', fontWeight: 700, letterSpacing: '2.5px', fontFamily: 'IBM Plex Sans, sans-serif' }}>
            EXPENSES
          </text>
          <text x={pivotX + beamHalf} y={pivotY - platH - platH / 2 + 36} textAnchor="middle"
            style={{ fill: C.text, fontSize: '15px', fontWeight: 600, fontFamily: 'IBM Plex Mono, monospace' }}>
            {fmt(expenses)}
          </text>
          <text x={pivotX + beamHalf} y={pivotY - platH - platH / 2 + 54} textAnchor="middle"
            style={{ fill: !incomeWins ? C.red : C.textDim, fontSize: '10px', fontFamily: 'IBM Plex Sans, sans-serif' }}>
            {!incomeWins ? '▲ heavier' : '▼ lighter'}
          </text>
        </g>
 
        {/* ── Fulcrum (does NOT rotate) ── */}
        {/* Triangle */}
        <polygon
          points={`${pivotX},${pivotY + 4} ${pivotX - 24},${pivotY + 52} ${pivotX + 24},${pivotY + 52}`}
          fill={C.gold} opacity={0.9}
        />
        {/* Base */}
        <rect x={pivotX - 38} y={pivotY + 52} width={76} height={8} rx={4} fill={C.gold} opacity={0.7} />
 
        {/* ── Balance label at center (does NOT rotate) ── */}
        <text x={pivotX} y={pivotY - 18} textAnchor="middle"
          style={{ fill: C.textDim, fontSize: '9px', letterSpacing: '2.5px', fontFamily: 'IBM Plex Sans, sans-serif' }}>
          NET BALANCE
        </text>
        <text x={pivotX} y={pivotY - 1} textAnchor="middle"
          style={{ fill: C.gold, fontSize: '17px', fontWeight: 700, fontFamily: 'IBM Plex Mono, monospace' }}>
          {fmt(balance)}
        </text>
      </svg>
 
      {/* Bottom stat row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 12, marginTop: 8, alignItems: 'center' }}>
        <div style={{ background: 'rgba(16,185,129,0.08)', border: `1px solid ${C.green}22`, borderRadius: 8, padding: '10px 14px' }}>
          <div style={{ fontSize: 10, color: C.green, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 4 }}>Income</div>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 14, color: C.text, fontWeight: 600 }}>{fmt(income)}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 9, color: C.textDim, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>Saved</div>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 13, color: C.gold, fontWeight: 700 }}>
            {income > 0 ? ((balance / income) * 100).toFixed(1) : 0}%
          </div>
        </div>
        <div style={{ background: 'rgba(239,68,68,0.08)', border: `1px solid ${C.red}22`, borderRadius: 8, padding: '10px 14px', textAlign: 'right' }}>
          <div style={{ fontSize: 10, color: C.red, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 4 }}>Expenses</div>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 14, color: C.text, fontWeight: 600 }}>{fmt(expenses)}</div>
        </div>
      </div>
    </div>
  )
}