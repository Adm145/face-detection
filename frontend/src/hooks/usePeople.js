import { useEffect, useMemo, useState } from 'react'
import { API_URL } from '../config'

export const usePeople = () => {
  const [people, setPeople] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    let cancelled = false

    fetch(`${API_URL}/people`)
      .then((response) => {
        if (!response.ok) throw new Error('Failed to load people')
        return response.json()
      })
      .then((data) => {
        if (!cancelled) setPeople(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Something went wrong')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const filteredPeople = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return people
    return people.filter((person) => person.name.toLowerCase().includes(term))
  }, [people, searchTerm])

  return {
    people,
    filteredPeople,
    loading,
    error,
    searchTerm,
    setSearchTerm,
  }
}
