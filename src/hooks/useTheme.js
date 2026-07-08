import { useEffect, useState } from 'react'

const STORAGE_KEY = 'habit-tracker/theme'
export const THEMES = ['light', 'system', 'dark']

// Browser-chrome color per effective (resolved) theme, matching --bg.
const THEME_COLOR = { light: '#ffffff', dark: '#16171d' }

/**
 * Theme preference with persistence. Returns [theme, setTheme] where theme is
 * one of 'light' | 'system' | 'dark'. The choice is written to the root
 * `data-theme` attribute (consumed by index.css) and to localStorage.
 */
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return THEMES.includes(saved) ? saved : 'system'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // Ignore quota/availability errors; the attribute is still applied.
    }
  }, [theme])

  // Keep the <meta name="theme-color"> in sync with the effective theme,
  // re-resolving when the OS preference changes while on 'system'.
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => {
      const dark = theme === 'dark' || (theme === 'system' && media.matches)
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute('content', dark ? THEME_COLOR.dark : THEME_COLOR.light)
    }
    apply()
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [theme])

  return [theme, setTheme]
}
