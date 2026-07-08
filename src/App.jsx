import { useEffect, useState } from 'react'
import './App.css'
import { useHabits } from './hooks/useHabits.js'
import HabitCard from './components/HabitCard.jsx'
import HabitForm from './components/HabitForm.jsx'
import EmptyState from './components/EmptyState.jsx'

// Roughly one week-column per 16px of available width, clamped to a sensible range.
function weeksForWidth(width) {
  const usable = Math.min(width, 900) - 120
  return Math.max(14, Math.min(53, Math.floor(usable / 16)))
}

function useHeatmapWeeks() {
  const [weeks, setWeeks] = useState(() => weeksForWidth(window.innerWidth))
  useEffect(() => {
    const onResize = () => setWeeks(weeksForWidth(window.innerWidth))
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return weeks
}

export default function App() {
  const { habits, addHabit, updateHabit, deleteHabit, logDate, logToday, undoToday } = useHabits()
  const weeks = useHeatmapWeeks()
  // null = closed; 'new' = create; otherwise the habit object being edited.
  const [form, setForm] = useState(null)

  const handleSave = (data) => {
    if (form && form !== 'new') updateHabit(form.id, data)
    else addHabit(data)
    setForm(null)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>
          <span className="app-mark" aria-hidden="true">◈</span> Habits
        </h1>
        {habits.length > 0 && (
          <button type="button" className="btn primary" onClick={() => setForm('new')}>
            + New habit
          </button>
        )}
      </header>

      <main className="app-main">
        {habits.length === 0 ? (
          <EmptyState onAdd={() => setForm('new')} />
        ) : (
          <div className="habit-list">
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                weeks={weeks}
                onLogToday={() => logToday(habit.id)}
                onUndoToday={() => undoToday(habit.id)}
                onLogDate={(key, delta) => logDate(habit.id, key, delta)}
                onEdit={() => setForm(habit)}
                onDelete={() => {
                  if (confirm(`Delete "${habit.name}"? This can't be undone.`)) {
                    deleteHabit(habit.id)
                  }
                }}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>All data is stored locally in your browser. No account, no server.</p>
      </footer>

      {form && (
        <HabitForm
          habit={form === 'new' ? null : form}
          onSave={handleSave}
          onClose={() => setForm(null)}
        />
      )}
    </div>
  )
}
