/** Shown when there are no habits yet. */
export default function EmptyState({ onAdd }) {
  return (
    <div className="empty">
      <div className="empty-emoji" aria-hidden="true">🌱</div>
      <h2>Start your first habit</h2>
      <p>Track anything — daily or many times a day. Everything stays in your browser.</p>
      <button type="button" className="btn primary" onClick={onAdd}>Add a habit</button>
    </div>
  )
}
