const PATHS = {
  dashboard:  'M3 3h7v9H3zm11 0h7v5h-7zm0 9h7v9h-7zM3 16h7v5H3z',
  list:       'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
  lightbulb:  'M9 18h6m-5 4h4M12 2a7 7 0 0 1 7 7c0 2.7-1.5 5-3.8 6.3L15 17H9l-.2-1.7C6.5 14 5 11.7 5 9a7 7 0 0 1 7-7z',
  wallet:     'M20 12V8H6a2 2 0 0 1 0-4h14v4m0 0v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4m16 8h-2a2 2 0 0 0 0 4h2',
  trendUp:    'M22 7l-8 8-4-4-7 7M22 7h-5m5 0v5',
  trendDown:  'M22 17l-8-8-4 4-7-7M22 17h-5m5 0v-5',
  arrowUp:    'M7 17l9.2-9.2M17 17V7H7',
  arrowDown:  'M7 7l9.2 9.2M17 7v10H7',
  search:     'M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z',
  plus:       'M12 5v14M5 12h14',
  edit:       'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7m-1.5-9.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
  trash:      'M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6',
  x:          'M18 6L6 18M6 6l12 12',
  eye:        'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  shield:     'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  download:   'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',
  chevDown:   'M6 9l6 6 6-6',
  chevUp:     'M18 15l-6-6-6 6',
}

export default function Ic({ name, size = 16, color = 'currentColor' }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke={color}
      strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"
      style={{ display: 'block' }}
    >
      <path d={PATHS[name]} />
    </svg>
  )
}
