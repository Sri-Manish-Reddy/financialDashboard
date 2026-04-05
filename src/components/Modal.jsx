import Ic from './Ic'
import { C } from '../utils/theme'

export default function Modal({ show, onClose, title, children }) {
  if (!show) return null

  return (
    <div
      className="fade-in"
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(4,8,18,0.88)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        className="slide-up"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#0c1525',
          border: `1px solid ${C.border}`,
          borderRadius: 16,
          padding: 28,
          width: '100%', maxWidth: 440,
          margin: '0 16px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <span style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 18, color: C.gold }}>
            {title}
          </span>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: C.textDim, cursor: 'pointer', lineHeight: 0 }}
          >
            <Ic name="x" size={18} color={C.textDim} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
