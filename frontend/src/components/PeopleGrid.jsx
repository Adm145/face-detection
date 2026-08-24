import PersonCard from './PersonCard'

export default function PeopleGrid({ people, searchTerm, setSearchTerm, totalCount }) {
  return (
    <>
      <div className="people-toolbar">
        <div className="people-heading">
          <h1>People</h1>
          <p>{totalCount} people enrolled</p>
        </div>
        <div className="search-field">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M14 14l-2.5-2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            className="text-input"
            placeholder="Search by name…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {people.length === 0 ? (
        <p className="people-no-matches">No people match "{searchTerm}".</p>
      ) : (
        <div className="people-grid">
          {people.map((person) => (
            <PersonCard key={person.id} person={person} />
          ))}
        </div>
      )}
    </>
  )
}
