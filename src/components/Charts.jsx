import { useRef } from 'react'
import Chart from 'chart.js/auto'
import useChart from '../hooks/useChart'
import { C, CAT_COLORS, CHART_TOOLTIP } from '../utils/theme'
import { fmt } from '../utils/format'

/* ── Balance Trend (line/area) ─────────────────────────────────────────── */
export function BalanceTrendChart({ data }) {
  const ref = useRef()

  useChart(ref, (canvas) => new Chart(canvas, {
    type: 'line',
    data: {
      labels: data.map((d) => d.month),
      datasets: [{
        label: 'Balance',
        data: data.map((d) => d.balance),
        borderColor: C.gold,
        backgroundColor: 'rgba(212,168,67,0.12)',
        fill: true, tension: 0.4,
        pointBackgroundColor: C.gold,
        pointBorderColor: '#080c14',
        pointBorderWidth: 2,
        pointRadius: 4, pointHoverRadius: 6,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { ...CHART_TOOLTIP, callbacks: { label: (ctx) => ' ' + fmt(ctx.parsed.y) } },
      },
      scales: {
        x: { grid: { color: '#111d2e' }, ticks: { color: '#4a6080', font: { size: 11 } } },
        y: { grid: { color: '#111d2e' }, ticks: { color: '#4a6080', font: { size: 11 }, callback: (v) => '₹' + v / 1000 + 'k' } },
      },
    },
  }), [])

  return <div style={{ position: 'relative', height: 200 }}><canvas ref={ref} /></div>
}

/* ── Spending Donut ────────────────────────────────────────────────────── */
export function SpendingDonut({ catData }) {
  const ref = useRef()
  const top5 = catData.slice(0, 5)

  useChart(ref, (canvas) => new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: top5.map((c) => c.name),
      datasets: [{
        data: top5.map((c) => c.value),
        backgroundColor: top5.map((c) => CAT_COLORS[c.name] || '#666'),
        borderWidth: 2, borderColor: '#0c1525', hoverOffset: 6,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: '66%',
      plugins: {
        legend: { display: false },
        tooltip: { ...CHART_TOOLTIP, callbacks: { label: (ctx) => ' ' + fmt(ctx.parsed) } },
      },
    },
  }), [catData.length])

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <div style={{ position: 'relative', height: 160, width: 160, flexShrink: 0 }}>
        <canvas ref={ref} />
      </div>
      <div style={{ flex: 1 }}>
        {top5.map((c) => (
          <div key={c.name} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: CAT_COLORS[c.name] || '#666' }} />
                <span style={{ fontSize: 12, color: C.textMuted }}>{c.name}</span>
              </div>
              <span style={{ fontSize: 12, fontFamily: "'IBM Plex Mono',monospace", color: C.text }}>{fmt(c.value)}</span>
            </div>
            <div style={{ background: '#1a2744', borderRadius: 4, height: 3 }}>
              <div style={{
                background: CAT_COLORS[c.name] || '#666', height: 3, borderRadius: 4,
                width: `${(c.value / top5[0].value) * 100}%`, transition: 'width 0.6s ease',
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Monthly Bar Chart ─────────────────────────────────────────────────── */
export function MonthlyBarChart({ data }) {
  const ref = useRef()

  useChart(ref, (canvas) => new Chart(canvas, {
    type: 'bar',
    data: {
      labels: data.map((d) => d.month),
      datasets: [
        { label: 'Income',   data: data.map((d) => d.income),   backgroundColor: 'rgba(16,185,129,0.8)', borderRadius: 4, borderSkipped: false },
        { label: 'Expenses', data: data.map((d) => d.expenses), backgroundColor: 'rgba(239,68,68,0.8)',  borderRadius: 4, borderSkipped: false },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { ...CHART_TOOLTIP, callbacks: { label: (ctx) => ' ' + ctx.dataset.label + ': ' + fmt(ctx.parsed.y) } },
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#4a6080', font: { size: 11 } } },
        y: { grid: { color: '#111d2e' }, ticks: { color: '#4a6080', font: { size: 11 }, callback: (v) => '₹' + v / 1000 + 'k' } },
      },
    },
  }), [])

  return <div style={{ position: 'relative', height: 200 }}><canvas ref={ref} /></div>
}



