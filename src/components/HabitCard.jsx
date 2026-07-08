import { useEffect, useRef, useState } from 'react'
import Heatmap from './Heatmap.jsx'
import { currentStreak, todayKey } from '../lib/date.js'

/**
 * A single habit: header (emoji, name, today's count, streak), log controls,
 * and the contribution heatmap.
 */
export default function HabitCard({ habit, weeks, onLogToday, onUndoToday, onLogDate, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  const todayCount = habit.log[todayKey()] || 0
  const streak = currentStreak(habit.log, habit.target && habit.target > 0 ? habit.target : 1)

  useEffect(() => {
    if (!menuOpen) return
    const onDoc = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('pointerdown', onDoc)
    return () => document.removeEventListener('pointerdown', onDoc)
  }, [menuOpen])

  return (
    <section className="card" style={{ '--habit-color': habit.color }}>
      <header className="card-head">
        <span className="card-emoji" aria-hidden="true">{habit.emoji}</span>
        <div className="card-title">
          <h2>{habit.name}</h2>
          <p className="card-meta">
            {habit.target ? `Goal: ${habit.target}/day` : 'No daily goal'}
            {streak > 0 && <span className="streak"> · 🔥 {streak} day{streak === 1 ? '' : 's'}</span>}
          </p>
        </div>
        <div className="card-menu" ref={menuRef}>
          <button
            type="button"
            className="icon-btn"
            aria-label="Habit options"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            ⋯
          </button>
          {menuOpen && (
            <div className="menu" role="menu">
              <button type="button" role="menuitem" onClick={() => { setMenuOpen(false); onEdit() }}>
                Edit
              </button>
              <button type="button" role="menuitem" className="danger" onClick={() => { setMenuOpen(false); onDelete() }}>
                Delete
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="card-log">
        <button type="button" className="log-btn" onClick={onLogToday}>
          <span className="log-plus">+</span> Log today
        </button>
        <div className="today-count" aria-live="polite">
          <strong>{todayCount}</strong>
          <span> today</span>
        </div>
        <button
          type="button"
          className="icon-btn undo"
          aria-label="Undo one log for today"
          onClick={onUndoToday}
          disabled={todayCount === 0}
        >
          −
        </button>
      </div>

      <Heatmap
        log={habit.log}
        color={habit.color}
        target={habit.target}
        weeks={weeks}
        onCellTap={(key) => onLogDate(key, 1)}
      />
    </section>
  )
}
