import { useRef } from 'react'

export default function PhotoDropSlot({ label, photo, isDragging, setIsDragging, onDrop, onFileChange, onClear }) {
  const fileInputRef = useRef(null)

  if (photo) {
    return (
      <div className="drop-slot drop-slot-filled">
        <img src={photo.preview} alt="" />
        <button
          type="button"
          className="thumb-remove"
          onClick={(e) => {
            e.stopPropagation()
            onClear()
          }}
          aria-label={`Remove ${label}`}
        >
          ×
        </button>
      </div>
    )
  }

  return (
    <div
      className={`drop-slot dropzone${isDragging ? ' dropzone-active' : ''}`}
      onClick={() => fileInputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
    >
      <p className="dropzone-title">{label}</p>
      <p className="dropzone-hint">Tap to browse, or drag</p>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files[0]
          if (file) onFileChange(file)
          e.target.value = ''
        }}
      />
    </div>
  )
}
