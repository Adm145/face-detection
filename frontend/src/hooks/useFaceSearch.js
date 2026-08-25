import { useEffect, useRef, useState } from 'react'
import { API_URL } from '../config'

export const useFaceSearch = () => {
  const [photo, setPhoto] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  const [status, setStatus] = useState('idle') // idle | searching | success | error
  const [errorMessage, setErrorMessage] = useState('')
  const [matches, setMatches] = useState(null)

  const photoRef = useRef(photo)
  useEffect(() => {
    photoRef.current = photo
  }, [photo])

  useEffect(() => {
    return () => {
      if (photoRef.current) URL.revokeObjectURL(photoRef.current.preview)
    }
  }, [])

  const setPhotoFile = (file) => {
    setPhoto((prev) => {
      if (prev) URL.revokeObjectURL(prev.preview)
      return { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, file, preview: URL.createObjectURL(file) }
    })
    setStatus('idle')
    setErrorMessage('')
    setMatches(null)
  }

  const addFiles = (fileList) => {
    const imageFile = Array.from(fileList).find((file) => file.type.startsWith('image/'))
    if (imageFile) setPhotoFile(imageFile)
  }

  const clearPhoto = () => {
    setPhoto((prev) => {
      if (prev) URL.revokeObjectURL(prev.preview)
      return null
    })
    setStatus('idle')
    setErrorMessage('')
    setMatches(null)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setIsDragging(false)
    addFiles(event.dataTransfer.files)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!photo || status === 'searching') return

    setStatus('searching')
    setErrorMessage('')

    const formData = new FormData()
    formData.append('file', photo.file)

    try {
      const response = await fetch(`${API_URL}/search`, { method: 'POST', body: formData })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Search failed')
      }

      setMatches(data.matches)
      setStatus('success')
    } catch (err) {
      setErrorMessage(err.message || 'Something went wrong')
      setStatus('error')
    }
  }

  const resetSearch = () => {
    clearPhoto()
  }

  return {
    photo,
    isDragging,
    setIsDragging,
    status,
    errorMessage,
    matches,
    addFiles,
    clearPhoto,
    handleDrop,
    handleSubmit,
    resetSearch,
  }
}
