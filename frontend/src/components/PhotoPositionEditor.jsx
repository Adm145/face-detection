import { useRef, useState } from 'react'

const clamp = (value) => Math.min(100, Math.max(0, value))

export default function PhotoPositionEditor({ imageLink, initialX, initialY, onSave, onCancel }) {
  const frameRef = useRef(null)
  const [position, setPosition] = useState({ x: initialX, y: initialY })
  const draggingRef = useRef(false)

  const updateFromPoint = (clientX, clientY) => {
    const rect = frameRef.current.getBoundingClientRect()
    const x = clamp(((clientX - rect.left) / rect.width) * 100)
    const y = clamp(((clientY - rect.top) / rect.height) * 100)
    setPosition({ x, y })
  }

  const handleMouseDown = (e) => {
    draggingRef.current = true
    updateFromPoint(e.clientX, e.clientY)
  }

  const handleMouseMove = (e) => {
    if (draggingRef.current) updateFromPoint(e.clientX, e.clientY)
  }

  const stopDragging = () => {
    draggingRef.current = false
  }

  const handleTouchStart = (e) => {
    draggingRef.current = true
    const touch = e.touches[0]
    updateFromPoint(touch.clientX, touch.clientY)
  }

  const handleTouchMove = (e) => {
    if (!draggingRef.current) return
    const touch = e.touches[0]
    updateFromPoint(touch.clientX, touch.clientY)
  }

  return (
    <div className="photo-position-editor">
      <div
        ref={frameRef}
        className="photo-position-frame"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={stopDragging}
      >
        <img
          src={imageLink}
          alt=""
          draggable={false}
          style={{ objectPosition: `${position.x}% ${position.y}%` }}
        />
      </div>
      <p className="photo-position-hint">Click or drag to choose what shows</p>
      <div className="photo-position-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="button" className="btn-primary" onClick={() => onSave(position.x, position.y)}>
          Save
        </button>
      </div>
    </div>
  )
}
