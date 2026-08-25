import PhotoDropSlot from './PhotoDropSlot'

export default function CompareForm({
  photoA,
  photoB,
  draggingA,
  draggingB,
  setDraggingA,
  setDraggingB,
  status,
  errorMessage,
  setPhotoA,
  setPhotoB,
  clearPhotoA,
  clearPhotoB,
  handleDropA,
  handleDropB,
  handleSubmit,
}) {
  return (
    <>
      <header className="compare-header">
        <span className="badge">Compare</span>
        <h1>Compare two faces.</h1>
        <p className="compare-subtitle">Upload two photos to check how closely they match.</p>
      </header>

      <form className="compare-card" onSubmit={handleSubmit}>
        {status === 'error' && <div className="error-banner">{errorMessage}</div>}

        <div className="compare-slots">
          <PhotoDropSlot
            label="Photo A"
            photo={photoA}
            isDragging={draggingA}
            setIsDragging={setDraggingA}
            onDrop={handleDropA}
            onFileChange={setPhotoA}
            onClear={clearPhotoA}
          />
          <PhotoDropSlot
            label="Photo B"
            photo={photoB}
            isDragging={draggingB}
            setIsDragging={setDraggingB}
            onDrop={handleDropB}
            onFileChange={setPhotoB}
            onClear={clearPhotoB}
          />
        </div>

        <button
          type="submit"
          className="btn-primary btn-block"
          disabled={!photoA || !photoB || status === 'comparing'}
        >
          {status === 'comparing' ? 'Comparing…' : 'Compare'}
        </button>
      </form>
    </>
  )
}
