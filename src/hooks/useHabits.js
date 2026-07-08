import { useCallback, useEffect, useState } from 'react'
import { loadState, saveState } from '../lib/storage.js'
import { todayKey } from '../lib/date.js'

// Default color palette offered in the habit form and auto-assigned to new habits.
export const PALETTE = [
  '#39d353', // green (GitHub-ish)
  '#e3b341', // amber
  '#58a6ff', // blue
  '#ff7b72', // red
  '#bc8cff', // purple
  '#ff9bce', // pink
  '#f0883e', // orange
  '#56d4dd', // teal
]

/**
 * Central habit state with localStorage persistence. State is loaded once on
 * mount and written back on every change.
 */
export function useHabits() {
  const [habits, setHabits] = useState(() => loadState().habits)

  useEffect(() => {
    saveState({ version: 1, habits })
  }, [habits])

  const addHabit = useCallback(({ name, emoji, color, target }) => {
    setHabits((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: name.trim() || 'Untitled',
        emoji: emoji || '✅',
        color: color || PALETTE[prev.length % PALETTE.length],
        target: target || null,
        createdAt: Date.now(),
        log: {},
      },
    ])
  }, [])

  const updateHabit = useCallback((id, patch) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, ...patch } : h)),
    )
  }, [])

  const deleteHabit = useCallback((id) => {
    setHabits((prev) => prev.filter((h) => h.id !== id))
  }, [])

  /** Adjust the count for a specific date by `delta`, flooring at 0. */
  const logDate = useCallback((id, key, delta) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h
        const next = Math.max(0, (h.log[key] || 0) + delta)
        const log = { ...h.log }
        if (next === 0) delete log[key]
        else log[key] = next
        return { ...h, log }
      }),
    )
  }, [])

  const logToday = useCallback((id) => logDate(id, todayKey(), 1), [logDate])
  const undoToday = useCallback((id) => logDate(id, todayKey(), -1), [logDate])

  return {
    habits,
    addHabit,
    updateHabit,
    deleteHabit,
    logDate,
    logToday,
    undoToday,
  }
}
