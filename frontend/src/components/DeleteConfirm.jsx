export default function DeleteConfirm({ personName, confirming, setConfirming, status, error, onDelete }) {
  if (!confirming) {
    return (
      <button type="button" className="delete-trigger" onClick={() => setConfirming(true)}>
        Delete person
      </button>
    )
  }

  return (
    <div className="delete-confirm">
      <p>Delete {personName}? This can't be undone.</p>
      {status === 'error' && <p className="delete-confirm-error">{error}</p>}
      <div className="delete-confirm-actions">
        <button
          type="button"
          className="delete-cancel"
          onClick={() => setConfirming(false)}
          disabled={status === 'deleting'}
        >
          Cancel
        </button>
        <button type="button" className="delete-confirm-btn" onClick={onDelete} disabled={status === 'deleting'}>
          {status === 'deleting' ? 'Deleting…' : 'Confirm'}
        </button>
      </div>
    </div>
  )
}
