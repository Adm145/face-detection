import { useRef } from 'react'

export default function SearchForm({
  photo,
  isDragging,
  setIsDragging,
  status,
  errorMessage,
  addFiles,
  clearPhoto,
  handleDrop,
  handleSubmit,
}) {
  const fileInputRef = useRef(null)

  return (
    <>
      <header className="search-header">
        <span className="badge">Find a match</span>
        <h1>Search enrolled faces.</h1>
        <p className="search-subtitle">Upload a photo and we'll rank the closest matches already in the system.</p>
      </header>

      <form className="search-card" onSubmit={handleSubmit}>
        {status === 'error' && <div className="error-banner">{errorMessage}</div>}

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
          <p className="dropzone-title">Drag a photo here, or click to browse</p>
          <p className="dropzone-hint">JPG or PNG · one clear, front-facing photo</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              addFiles(e.target.files)
              e.target.value = ''
            }}
          />
        </div>

        {photo && (
          <div className="thumb-grid">
            <div className="thumb">
              <img src={photo.preview} alt="" />
              <button
                type="button"
                className="thumb-remove"
                onClick={(e) => {
                  e.stopPropagation()
                  clearPhoto()
                }}
                aria-label="Remove photo"
              >
                ×
              </button>
            </div>
          </div>
        )}

        <button type="submit" className="btn-primary btn-block" disabled={!photo || status === 'searching'}>
          {status === 'searching' ? 'Searching…' : 'Search'}
        </button>
      </form>
    </>
  )
}
