import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../config'
import { toDDMMYYYY, toISODate } from '../utils/date'

const emptyFields = {
  name: '',
  gender: '',
  race: '',
  birthday: '',
  profession: '',
}

export const usePersonDetail = (personId) => {
  const navigate = useNavigate()

  const [person, setPerson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const [formFields, setFormFields] = useState(emptyFields)

  const [saveStatus, setSaveStatus] = useState('idle') // idle | saving | success | error
  const [saveError, setSaveError] = useState('')

  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [deleteStatus, setDeleteStatus] = useState('idle') // idle | deleting | error
  const [deleteError, setDeleteError] = useState('')

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    setLoadError('')

    fetch(`${API_URL}/people/${personId}`)
      .then((response) => {
        if (response.status === 404) throw new Error('Person not found')
        if (!response.ok) throw new Error('Failed to load person')
        return response.json()
      })
      .then((data) => {
        if (cancelled) return
        setPerson(data)
        setFormFields({
          name: data.name ?? '',
          gender: data.gender ?? '',
          race: data.race ?? '',
          birthday: data.birthday ? toISODate(data.birthday) : '',
          profession: data.profession ?? '',
        })
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err.message || 'Something went wrong')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [personId])

  const handleSave = async (event) => {
    event.preventDefault()
    if (!formFields.name.trim() || saveStatus === 'saving') return

    setSaveStatus('saving')
    setSaveError('')

    // update_person treats a missing/None field as "leave unchanged" (it can't
    // clear a field to NULL), so only send fields that actually have a value.
    const payload = { name: formFields.name.trim() }
    if (formFields.gender) payload.gender = formFields.gender
    if (formFields.race) payload.race = formFields.race
    if (formFields.birthday) payload.birthday = toDDMMYYYY(formFields.birthday)
    if (formFields.profession) payload.profession = formFields.profession

    try {
      const response = await fetch(`${API_URL}/people/${personId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Update failed')
      }

      setPerson(data)
      setSaveStatus('success')
    } catch (err) {
      setSaveError(err.message || 'Something went wrong')
      setSaveStatus('error')
    }
  }

  const handleDelete = async () => {
    setDeleteStatus('deleting')
    setDeleteError('')

    try {
      const response = await fetch(`${API_URL}/people/${personId}`, { method: 'DELETE' })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail || 'Delete failed')
      }
      navigate('/people')
    } catch (err) {
      setDeleteError(err.message || 'Something went wrong')
      setDeleteStatus('error')
    }
  }

  const updateFormFields = (updater) => {
    setSaveStatus((prev) => (prev === 'success' ? 'idle' : prev))
    setFormFields(updater)
  }

  return {
    person,
    loading,
    loadError,
    formFields,
    setFormFields: updateFormFields,
    saveStatus,
    saveError,
    handleSave,
    confirmingDelete,
    setConfirmingDelete,
    deleteStatus,
    deleteError,
    handleDelete,
  }
}
