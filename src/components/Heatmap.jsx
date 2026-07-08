import { useMemo } from 'react'
import { buildWeeksGrid, todayKey, WEEKDAY_LABELS } from '../lib/date.js'

// Opacity ramp for intensity levels 1..4 (level 0 renders as an empty cell).
const LEVEL_OPACITY = [0, 0.28, 0.52, 0.76, 1]

/** Map a day's count to an intensity level 0..4, scaled toward target if set. */
function levelFor(count, target) {
  if (!count) return 0
  if (target && target > 0) {
    return Math.min(4, Math.ceil((count / target) * 4))
  }
  // No target: raw-count buckets 1,2,3,4+.
  return Math.min(4, count)
}

/**
 * GitHub-style contribution grid for one habit. Tapping a cell increments that
 * day's count (delegated to `onCellTap`).
 */
export default function Heatmap({ log, color, target, weeks, onCellTap }) {
  const { columns, monthLabels } = useMemo(
    () => buildWeeksGrid(weeks),
    [weeks],
  )
  const tKey = todayKey()

  return (
    <div className="heatmap">
      <div className="heatmap-grid-wrap">
        <div className="heatmap-months" style={{ gridTemplateColumns: `repeat(${weeks}, 1fr)` }}>
          {monthLabels.map((m) => (
            <span key={`${m.index}-${m.label}`} className="heatmap-month" style={{ gridColumnStart: m.index + 1 }}>
              {m.label}
            </span>
          ))}
        </div>
        <div className="heatmap-body">
          <div className="heatmap-weekdays" aria-hidden="true">
            {WEEKDAY_LABELS.map((label, i) => (
              <span key={label} className="heatmap-weekday">
                {i % 2 === 1 ? label : ''}
              </span>
            ))}
          </div>
          <div className="heatmap-columns">
            {columns.map((col, ci) => (
              <div key={ci} className="heatmap-col">
                {col.map((cell) => {
                  const count = log[cell.key] || 0
                  const level = levelFor(count, target)
                  const isToday = cell.key === tKey
                  if (cell.outOfRange) {
                    return <span key={cell.key} className="heatmap-cell out" aria-hidden="true" />
                  }
                  return (
                    <button
                      key={cell.key}
                      type="button"
                      className={`heatmap-cell${isToday ? ' today' : ''}`}
                      style={
                        level > 0
                          ? { backgroundColor: color, opacity: LEVEL_OPACITY[level] }
                          : undefined
                      }
                      title={`${cell.key} — ${count} log${count === 1 ? '' : 's'}`}
                      aria-label={`${cell.key}, ${count} logs. Tap to add one.`}
                      onClick={() => onCellTap(cell.key)}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="heatmap-legend">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((lvl) => (
          <span
            key={lvl}
            className="heatmap-cell legend"
            style={lvl > 0 ? { backgroundColor: color, opacity: LEVEL_OPACITY[lvl] } : undefined}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  )
}
