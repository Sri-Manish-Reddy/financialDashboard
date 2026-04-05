export const fmt = (n) => '₹' + Math.round(n).toLocaleString('en-IN')

export const pct = (a, b) =>
  b ? ((a - b) / Math.abs(b) * 100).toFixed(1) : '0.0'
