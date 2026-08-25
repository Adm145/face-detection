import { useRef } from 'react'
import PersonAvatar from './PersonAvatar'
import PhotoPositionEditor from './PhotoPositionEditor'

export default function PersonPhotoUpload({
  imageLink,
  positionX,
  positionY,
  status,
  error,
  onUpload,
  isAuthenticated,
  repositioning,
  setRepositioning,
  onSavePosition,
}) {
  const fileInputRef = useRef(null)

  const openPicker = () => fileInputRef.current?.click()

  if (!isAuthenticated) {
    return (
      <div className="person-detail-photo">
        <PersonAvatar imageLink={imageLink} iconSize={48} positionX={positionX} positionY={positionY} />
      </div>
    )
  }

  if (repositioning && imageLink) {
    return (
      <PhotoPositionEditor
        imageLink={imageLink}
        initialX={positionX}
        initialY={positionY}
        onCancel={() => setRepositioning(false)}
        onSave={(x, y) => {
          onSavePosition(x, y)
          setRepositioning(false)
        }}
      />
    )
  }

  return (
    <>
      <div className="person-detail-photo" onClick={openPicker} role="button" tabIndex={0}>
        <PersonAvatar imageLink={imageLink} iconSize={48} positionX={positionX} positionY={positionY} />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files[0]
          if (file) onUpload(file)
          e.target.value = ''
        }}
      />

      <button type="button" className="photo-upload-trigger" onClick={openPicker} disabled={status === 'uploading'}>
        {status === 'uploading' ? 'Uploading…' : imageLink ? 'Change photo' : 'Add photo'}
      </button>

      {imageLink && (
        <button type="button" className="photo-upload-trigger" onClick={() => setRepositioning(true)}>
          Reposition
        </button>
      )}

      {status === 'error' && <p className="photo-upload-error">{error}</p>}
    </>
  )
}
