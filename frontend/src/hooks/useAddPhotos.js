import { useEffect, useRef, useState } from 'react'
import { API_URL } from '../config'

export const useAddPhotos = (personId) => {
  const [photos, setPhotos] = useState([])
  const [isDragging, setIsDragging] = useState(false)

  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState('')
  const [result, setResult] = useState(null)

  const photosRef = useRef(photos)
  useEffect(() => {
    photosRef.current = photos
  }, [photos])

  useEffect(() => {
    return () => {
      photosRef.current.forEach((p) => URL.revokeObjectURL(p.preview))
    }
  }, [])

  const newId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`

  const addFiles = (fileList) => {
    const imageFiles = Array.from(fileList).filter((file) => file.type.startsWith('image/'))
    const next = imageFiles.map((file) => ({ id: newId(), file, preview: URL.createObjectURL(file) }))
    setPhotos((prev) => [...prev, ...next])
  }

  const removePhoto = (id) => {
    setPhotos((prev) => {
      const target = prev.find((p) => p.id === id)
      if (target) URL.revokeObjectURL(target.preview)
      return prev.filter((p) => p.id !== id)
    })
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setIsDragging(false)
    addFiles(event.dataTransfer.files)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (photos.length === 0 || status === 'submitting') return

    setStatus('submitting')
    setErrorMessage('')

    const formData = new FormData()
    photos.forEach(({ file }) => formData.append('files', file))

    try {
      const response = await fetch(`${API_URL}/people/${personId}/photos`, { method: 'POST', body: formData })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Upload failed')
      }

      setResult(data)
      setStatus('success')
    } catch (err) {
      setErrorMessage(err.message || 'Something went wrong')
      setStatus('error')
    }
  }

  const resetPanel = () => {
    photos.forEach((p) => URL.revokeObjectURL(p.preview))
    setPhotos([])
    setResult(null)
    setStatus('idle')
    setErrorMessage('')
  }

  return {
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
  }
}
