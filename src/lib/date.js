// Local-date helpers. All date keys are "YYYY-MM-DD" in the user's local
// timezone so that "today" matches the wall clock, not UTC.

const MS_PER_DAY = 24 * 60 * 60 * 1000

/** Format a Date as a local "YYYY-MM-DD" key. */
export function dateKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** Today's local date key. */
export function todayKey() {
  return dateKey(new Date())
}

/** Midnight (local) of the given date, as a new Date. */
function startOfDay(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

export const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
export const MONTH_LABELS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

/**
 * Build a GitHub-style grid of weeks covering the last `weeks` weeks up to
 * today. Returns an array of columns; each column is an array of 7 cells
 * (Sun..Sat). Cells before the range start or after today are marked
 * `outOfRange: true`.
 *
 * @param {number} weeks number of week-columns to render
 * @returns {{ columns: Array<Array<{date: Date, key: string, outOfRange: boolean}>>,
 *             monthLabels: Array<{index: number, label: string}> }}
 */
export function buildWeeksGrid(weeks) {
  const today = startOfDay(new Date())
  // The grid ends on the Saturday of the current week so the last column is full.
  const endOfWeek = new Date(today)
  endOfWeek.setDate(endOfWeek.getDate() + (6 - today.getDay()))
  // Start on the Sunday `weeks` columns back.
  const start = new Date(endOfWeek)
  start.setDate(start.getDate() - (weeks * 7 - 1))

  const columns = []
  const monthLabels = []
  let lastMonth = -1

  for (let w = 0; w < weeks; w++) {
    const col = []
    for (let day = 0; day < 7; day++) {
      const cellDate = new Date(start)
      cellDate.setDate(start.getDate() + w * 7 + day)
      const outOfRange = cellDate.getTime() > today.getTime()
      col.push({ date: cellDate, key: dateKey(cellDate), outOfRange })
    }
    // Label a column with a month name when its first (top) cell begins a new month.
    const topDate = col[0].date
    if (topDate.getMonth() !== lastMonth) {
      lastMonth = topDate.getMonth()
      monthLabels.push({ index: w, label: MONTH_LABELS[topDate.getMonth()] })
    }
    columns.push(col)
  }

  return { columns, monthLabels }
}

/**
 * Consecutive-day streak ending today (or yesterday, so a streak isn't broken
 * until a full day is missed). A day counts toward the streak when its logged
 * count meets `threshold` (default 1).
 */
export function currentStreak(log, threshold = 1) {
  let streak = 0
  const cursor = startOfDay(new Date())
  // Allow the streak to count from yesterday if today isn't logged yet.
  if ((log[dateKey(cursor)] || 0) < threshold) {
    cursor.setTime(cursor.getTime() - MS_PER_DAY)
  }
  while ((log[dateKey(cursor)] || 0) >= threshold) {
    streak++
    cursor.setTime(cursor.getTime() - MS_PER_DAY)
  }
  return streak
}
