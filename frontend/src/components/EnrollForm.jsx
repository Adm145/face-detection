import { useRef } from 'react'

export default function EnrollForm({
  MIN_PHOTOS,
  enrollFields,
  setEnrollFields,
  photos,
  isDragging,
  setIsDragging,
  status,
  errorMessage,
  photoCountOk,
  addFiles,
  removePhoto,
  handleDrop,
  handleSubmit,
}) {
  const fileInputRef = useRef(null)
  const { name, gender, race, birthday, profession } = enrollFields

  return (
    <main className="upload-page">
      <div className="upload-shell">
        <header className="upload-header">
          <span className="badge">New enrollment</span>
          <h1>Enroll a new person.</h1>
          <p className="upload-subtitle">
            Add a name and at least {MIN_PHOTOS} clear photos to teach the system this face.
          </p>
        </header>

        <form className="upload-card" onSubmit={handleSubmit}>
          {status === 'error' && <div className="error-banner">{errorMessage}</div>}

          <div className="field-grid">
            <label className="field field-full">
              <span className="field-label">Name *</span>
              <input
                className="text-input"
                type="text"
                value={name}
                onChange={(e) => setEnrollFields((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Jane Doe"
                required
              />
            </label>

            <label className="field">
              <span className="field-label">Gender</span>
              <select
                className="text-input"
                value={gender}
                onChange={(e) => setEnrollFields((prev) => ({ ...prev, gender: e.target.value }))}
              >
                <option value="">—</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </label>

            <label className="field">
              <span className="field-label">Birthday</span>
              <input
                className="text-input"
                type="date"
                value={birthday}
                onChange={(e) => setEnrollFields((prev) => ({ ...prev, birthday: e.target.value }))}
              />
            </label>

            <label className="field">
              <span className="field-label">Race</span>
              <input
                className="text-input"
                type="text"
                value={race}
                onChange={(e) => setEnrollFields((prev) => ({ ...prev, race: e.target.value }))}
                placeholder="Optional"
              />
            </label>

            <label className="field">
              <span className="field-label">Profession</span>
              <input
                className="text-input"
                type="text"
                value={profession}
                onChange={(e) => setEnrollFields((prev) => ({ ...prev, profession: e.target.value }))}
                placeholder="Optional"
              />
            </label>
          </div>

          <div className="field field-full">
            <span className="field-label">
              Photos <span className={photoCountOk ? 'count-ok' : 'count-pending'}>
                {photos.length} / {MIN_PHOTOS} minimum
              </span>
            </span>

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
          </div>

          <button
            type="submit"
            className="btn-primary btn-block"
            disabled={!name.trim() || !photoCountOk || status === 'submitting'}
          >
            {status === 'submitting' ? 'Enrolling…' : 'Enroll person'}
          </button>
        </form>
      </div>
    </main>
  )
}
