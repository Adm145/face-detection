import { useRef } from 'react'
import PersonAvatar from './PersonAvatar'

export default function PersonPhotoUpload({ imageLink, status, error, onUpload }) {
  const fileInputRef = useRef(null)

  const openPicker = () => fileInputRef.current?.click()

  return (
    <>
      <div className="person-detail-photo" onClick={openPicker} role="button" tabIndex={0}>
        <PersonAvatar imageLink={imageLink} iconSize={48} />
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

      {status === 'error' && <p className="photo-upload-error">{error}</p>}
    </>
  )
}
