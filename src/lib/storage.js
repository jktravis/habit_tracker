// Persistence layer. All app state lives in a single localStorage key as JSON.
// No backend, no network — everything is local to the browser.

const STORAGE_KEY = 'habit-tracker/v1'
const VERSION = 1

const emptyState = () => ({ version: VERSION, habits: [] })

/** Load state from localStorage, falling back to an empty state on any error. */
export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyState()
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.habits)) {
      return emptyState()
    }
    // Future migrations would branch on parsed.version here.
    return { version: VERSION, habits: parsed.habits }
  } catch {
    return emptyState()
  }
}

/** Persist state to localStorage. Silently ignores quota/serialization errors. */
export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Nothing actionable in-app; data simply isn't saved this write.
  }
}
