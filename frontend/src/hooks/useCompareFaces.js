import { useEffect, useRef, useState } from 'react'
import { API_URL } from '../config'

const newId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`

export const useCompareFaces = () => {
  const [photoA, setPhotoAState] = useState(null)
  const [photoB, setPhotoBState] = useState(null)
  const [draggingA, setDraggingA] = useState(false)
  const [draggingB, setDraggingB] = useState(false)

  const [status, setStatus] = useState('idle') // idle | comparing | success | error
  const [errorMessage, setErrorMessage] = useState('')
  const [result, setResult] = useState(null)

  const photoARef = useRef(photoA)
  const photoBRef = useRef(photoB)
  useEffect(() => {
    photoARef.current = photoA
  }, [photoA])
  useEffect(() => {
    photoBRef.current = photoB
  }, [photoB])

  useEffect(() => {
    return () => {
      if (photoARef.current) URL.revokeObjectURL(photoARef.current.preview)
      if (photoBRef.current) URL.revokeObjectURL(photoBRef.current.preview)
    }
  }, [])

  const resetOutcome = () => {
    setStatus('idle')
    setErrorMessage('')
    setResult(null)
  }

  const setPhotoA = (file) => {
    setPhotoAState((prev) => {
      if (prev) URL.revokeObjectURL(prev.preview)
      return { id: newId(), file, preview: URL.createObjectURL(file) }
    })
    resetOutcome()
  }

  const setPhotoB = (file) => {
    setPhotoBState((prev) => {
      if (prev) URL.revokeObjectURL(prev.preview)
      return { id: newId(), file, preview: URL.createObjectURL(file) }
    })
    resetOutcome()
  }

  const clearPhotoA = () => {
    setPhotoAState((prev) => {
      if (prev) URL.revokeObjectURL(prev.preview)
      return null
    })
    resetOutcome()
  }

  const clearPhotoB = () => {
    setPhotoBState((prev) => {
      if (prev) URL.revokeObjectURL(prev.preview)
      return null
    })
    resetOutcome()
  }

  const pickFirstImage = (fileList) => Array.from(fileList).find((file) => file.type.startsWith('image/'))

  const handleDropA = (event) => {
    event.preventDefault()
    setDraggingA(false)
    const file = pickFirstImage(event.dataTransfer.files)
    if (file) setPhotoA(file)
  }

  const handleDropB = (event) => {
    event.preventDefault()
    setDraggingB(false)
    const file = pickFirstImage(event.dataTransfer.files)
    if (file) setPhotoB(file)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!photoA || !photoB || status === 'comparing') return

    setStatus('comparing')
    setErrorMessage('')

    const formData = new FormData()
    formData.append('file_a', photoA.file)
    formData.append('file_b', photoB.file)

    try {
      const response = await fetch(`${API_URL}/compare`, { method: 'POST', body: formData })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Compare failed')
      }

      setResult(data)
      setStatus('success')
    } catch (err) {
      setErrorMessage(err.message || 'Something went wrong')
      setStatus('error')
    }
  }

  return {
    photoA,
    photoB,
    draggingA,
    draggingB,
    setDraggingA,
    setDraggingB,
    status,
    errorMessage,
    result,
    setPhotoA,
    setPhotoB,
    clearPhotoA,
    clearPhotoB,
    handleDropA,
    handleDropB,
    handleSubmit,
  }
}
