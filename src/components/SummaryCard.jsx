import Ic from './Ic'
import { C } from '../utils/theme'

export default function SummaryCard({ title, value, sub, upTrend, color, icon }) {
  return (
    <div
      className="card-hover"
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        padding: '20px 22px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <span style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', letterSpacing: 2, fontWeight: 600 }}>
          {title}
        </span>
        <div style={{ background: `${color}20`, border: `1px solid ${color}30`, borderRadius: 8, padding: 8, lineHeight: 0 }}>
          <Ic name={icon} size={15} color={color} />
        </div>
      </div>

      <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 26, fontWeight: 600, color: C.text, letterSpacing: '-0.5px', marginBottom: 8 }}>
        {value}
      </div>

      <div style={{ fontSize: 12, color: upTrend ? C.green : C.red, display: 'flex', alignItems: 'center', gap: 5 }}>
        <Ic name={upTrend ? 'trendUp' : 'trendDown'} size={12} color={upTrend ? C.green : C.red} />
        {sub}
      </div>
    </div>
  )
}
