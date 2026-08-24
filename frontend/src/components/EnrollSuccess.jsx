export default function EnrollSuccess({ result, onReset }) {
  return (
    <main className="upload-page">
      <div className="upload-shell">
        <div className="success-card">
          <span className="badge badge-success">Enrolled</span>
          <h1 className="success-title">{result.name} is in the system.</h1>
          <p className="success-body">
            {result.enrolled_count} photo{result.enrolled_count === 1 ? '' : 's'} indexed for person #{result.person_id}.
          </p>
          {result.skipped_files.length > 0 && (
            <div className="skip-notice">
              <span className="badge badge-warning">Skipped {result.skipped_files.length}</span>
              <p>{result.skipped_files.join(', ')} couldn&apos;t be processed and were left out.</p>
            </div>
          )}
          <button type="button" className="btn-primary" onClick={onReset}>
            Enroll another person
          </button>
        </div>
      </div>
    </main>
  )
}
