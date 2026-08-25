import { usePeople } from '../../hooks/usePeople'
import NavBar from '../../components/NavBar'
import PeopleGrid from '../../components/PeopleGrid'
import PeopleEmptyState from '../../components/PeopleEmptyState'
import './PeopleListPage.css'

export default function PeopleListPage() {
  const { people, filteredPeople, loading, error, searchTerm, setSearchTerm } = usePeople()

  return (
    <>
      <NavBar />
      <main className="people-page">
        <div className="people-shell">
          {loading && <p className="people-status">Loading…</p>}

          {!loading && error && <div className="error-banner">{error}</div>}

          {!loading && !error && people.length === 0 && <PeopleEmptyState />}

          {!loading && !error && people.length > 0 && (
            <PeopleGrid
              people={filteredPeople}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              totalCount={people.length}
            />
          )}
        </div>
      </main>
    </>
  )
}
