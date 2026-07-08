import { useEffect, useRef, useState } from 'react'
import { PALETTE } from '../hooks/useHabits.js'

const EMOJI_SUGGESTIONS = ['✅', '💧', '🏃', '📚', '🧘', '💪', '🥗', '😴', '🎯', '🧹', '💊', '✍️']

/**
 * Modal form to create or edit a habit. `habit` is null when creating.
 */
export default function HabitForm({ habit, onSave, onClose }) {
  const editing = Boolean(habit)
  const [name, setName] = useState(habit?.name ?? '')
  const [emoji, setEmoji] = useState(habit?.emoji ?? '✅')
  const [color, setColor] = useState(habit?.color ?? PALETTE[0])
  const [target, setTarget] = useState(habit?.target ? String(habit.target) : '')
  const nameRef = useRef(null)

  useEffect(() => {
    nameRef.current?.focus()
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const submit = (e) => {
    e.preventDefault()
    if (!name.trim()) { nameRef.current?.focus(); return }
    const parsed = parseInt(target, 10)
    onSave({
      name: name.trim(),
      emoji: emoji || '✅',
      color,
      target: Number.isFinite(parsed) && parsed > 0 ? parsed : null,
    })
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={editing ? 'Edit habit' : 'New habit'} onClick={(e) => e.stopPropagation()}>
        <form onSubmit={submit}>
          <h2>{editing ? 'Edit habit' : 'New habit'}</h2>

          <label className="field">
            <span>Name</span>
            <input
              ref={nameRef}
              type="text"
              value={name}
              maxLength={60}
              placeholder="e.g. Drink water"
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <label className="field">
            <span>Emoji</span>
            <input
              type="text"
              className="emoji-input"
              value={emoji}
              maxLength={4}
              onChange={(e) => setEmoji(e.target.value)}
            />
          </label>
          <div className="emoji-row">
            {EMOJI_SUGGESTIONS.map((e) => (
              <button
                key={e}
                type="button"
                className={`emoji-chip${emoji === e ? ' active' : ''}`}
                onClick={() => setEmoji(e)}
                aria-label={`Use ${e}`}
              >
                {e}
              </button>
            ))}
          </div>

          <div className="field">
            <span>Color</span>
            <div className="swatches">
              {PALETTE.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`swatch${color === c ? ' active' : ''}`}
                  style={{ backgroundColor: c }}
                  aria-label={`Color ${c}`}
                  aria-pressed={color === c}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>

          <label className="field">
            <span>Daily goal <em>(optional)</em></span>
            <input
              type="number"
              inputMode="numeric"
              min="1"
              value={target}
              placeholder="e.g. 3"
              onChange={(e) => setTarget(e.target.value)}
            />
          </label>

          <div className="modal-actions">
            <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn primary">{editing ? 'Save' : 'Add habit'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
