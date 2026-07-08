import { THEMES } from '../hooks/useTheme.js'

const ICONS = {
  light: (
    // Sun
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <circle cx="12" cy="12" r="4.5" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="12" y1="1.5" x2="12" y2="4" />
        <line x1="12" y1="20" x2="12" y2="22.5" />
        <line x1="1.5" y1="12" x2="4" y2="12" />
        <line x1="20" y1="12" x2="22.5" y2="12" />
        <line x1="4.2" y1="4.2" x2="6" y2="6" />
        <line x1="18" y1="18" x2="19.8" y2="19.8" />
        <line x1="19.8" y1="4.2" x2="18" y2="6" />
        <line x1="6" y1="18" x2="4.2" y2="19.8" />
      </g>
    </svg>
  ),
  system: (
    // Monitor
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.5" y="4" width="19" height="12.5" rx="2" />
      <line x1="8.5" y1="20.5" x2="15.5" y2="20.5" />
      <line x1="12" y1="16.5" x2="12" y2="20.5" />
    </svg>
  ),
  dark: (
    // Moon
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path d="M20 14.5A8 8 0 0 1 9.5 4a7 7 0 1 0 10.5 10.5z" fill="currentColor" />
    </svg>
  ),
}

const LABELS = { light: 'Light', system: 'System', dark: 'Dark' }

/** Segmented light / system / dark theme picker. */
export default function ThemeToggle({ theme, onChange }) {
  return (
    <div className="theme-toggle" role="radiogroup" aria-label="Color theme">
      {THEMES.map((t) => (
        <button
          key={t}
          type="button"
          role="radio"
          aria-checked={theme === t}
          aria-label={LABELS[t]}
          title={LABELS[t]}
          className={`theme-seg${theme === t ? ' active' : ''}`}
          onClick={() => onChange(t)}
        >
          {ICONS[t]}
        </button>
      ))}
    </div>
  )
}
