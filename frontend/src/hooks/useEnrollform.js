import { useEffect, useRef, useState } from 'react'
import { API_URL } from '../config'
import { useAuth } from '../context/AuthContext'
import { toDDMMYYYY } from '../utils/date'

const MIN_PHOTOS = 5

export const useEnrollForm = () => {
    const { token } = useAuth()

    const [enrollFields, setEnrollFields] = useState({
        name: '',
        gender: '',
        race: '',
        birthday: '',
        profession: '',
    })

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

    const newId = () => {
        return `${Date.now()}-${Math.random().toString(36).slice(2)}`
    }

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
        const { name, gender, race, birthday, profession } = enrollFields
        if (!name.trim() || photos.length < MIN_PHOTOS || status === 'submitting') return

        setStatus('submitting')
        setErrorMessage('')

        const formData = new FormData()
        formData.append('name', name.trim())
        if (gender) formData.append('gender', gender)
        if (race) formData.append('race', race)
        if (birthday) formData.append('birthday', toDDMMYYYY(birthday))
        if (profession) formData.append('profession', profession)
        photos.forEach(({ file }) => formData.append('files', file))

        try {
            const response = await fetch(`${API_URL}/enroll`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            })
            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.detail || 'Enrollment failed')
            }

            setResult(data)
            setStatus('success')
        } catch (err) {
            setErrorMessage(err.message || 'Something went wrong')
            setStatus('error')
        }
    }

    const resetForm = () => {
        photos.forEach((p) => URL.revokeObjectURL(p.preview))
        setEnrollFields({
            name: '',
            gender: '',
            race: '',
            birthday: '',
            profession: '',
        })
        setPhotos([])
        setResult(null)
        setStatus('idle')
        setErrorMessage('')
    }

    const photoCountOk = photos.length >= MIN_PHOTOS

    return {
        MIN_PHOTOS,
        enrollFields,
        setEnrollFields,
        photos,
        setPhotos,
        isDragging,
        setIsDragging,
        status,
        errorMessage,
        result,
        photoCountOk,
        addFiles,
        removePhoto,
        handleDrop,
        handleSubmit,
        resetForm,
    }

}
