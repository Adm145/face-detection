import { useRef, useState } from 'react'
import { useAddPhotos } from '../hooks/useAddPhotos'

export default function AddPhotosPanel({ personId }) {
  const [open, setOpen] = useState(false)
  const fileInputRef = useRef(null)
  const {
    photos,
    isDragging,
    setIsDragging,
    status,
    errorMessage,
    result,
    addFiles,
    removePhoto,
    handleDrop,
    handleSubmit,
    resetPanel,
  } = useAddPhotos(personId)

  const close = () => {
    resetPanel()
    setOpen(false)
  }

  if (!open) {
    return (
      <div className="add-photos-panel">
        <button type="button" className="photo-upload-trigger" onClick={() => setOpen(true)}>
          Add more photos to database
        </button>
      </div>
    )
  }

  return (
    <div className="add-photos-panel add-photos-panel-open">
      <div className="add-photos-header">
        <h2>Add more photos</h2>
        <p>These photos strengthen future search matches for this person. They won't change the profile picture.</p>
      </div>

      {status === 'error' && <div className="error-banner">{errorMessage}</div>}

      {status === 'success' && result && (
        <div className="add-photos-result">
          <span className="badge badge-success">
            {result.added_count} photo{result.added_count === 1 ? '' : 's'} added
          </span>
          {result.skipped_files.length > 0 && (
            <div className="skip-notice">
              <span className="badge badge-warning">Skipped {result.skipped_files.length}</span>
              <p>{result.skipped_files.join(', ')} couldn&apos;t be matched to this person and were left out.</p>
            </div>
          )}
        </div>
      )}

      <div
        className={`dropzone${isDragging ? ' dropzone-active' : ''}`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <p className="dropzone-title">Drag photos here, or click to browse</p>
        <p className="dropzone-hint">JPG or PNG · clear, front-facing faces work best</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => {
            addFiles(e.target.files)
            e.target.value = ''
          }}
        />
      </div>

      {photos.length > 0 && (
        <div className="thumb-grid">
          {photos.map((photo) => (
            <div className="thumb" key={photo.id}>
              <img src={photo.preview} alt="" />
              <button
                type="button"
                className="thumb-remove"
                onClick={(e) => {
                  e.stopPropagation()
                  removePhoto(photo.id)
                }}
                aria-label="Remove photo"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="add-photos-actions">
        <button type="button" className="btn-secondary" onClick={close}>
          Cancel
        </button>
        <button
          type="button"
          className="btn-primary"
          onClick={handleSubmit}
          disabled={photos.length === 0 || status === 'submitting'}
        >
          {status === 'submitting' ? 'Adding…' : 'Add to database'}
        </button>
      </div>
    </div>
  )
}
