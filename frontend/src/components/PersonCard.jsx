import { Link } from 'react-router-dom'

function formatMeta(person) {
  return [person.gender, person.race, person.birthday].filter(Boolean).join(' · ')
}

export default function PersonCard({ person }) {
  const meta = formatMeta(person)

  return (
    <Link to={`/people/${person.id}`} className="person-card">
      <div className="person-card-photo">
        {person.image_link ? (
          <img src={person.image_link} alt="" />
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
            <path d="M4 20c0-4 3.5-6 8-6s8 2 8 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )}
      </div>
      <div className="person-card-body">
        <span className="person-card-name">{person.name}</span>
        {person.profession && <span className="person-card-profession">{person.profession}</span>}
        {meta && <span className="person-card-meta">{meta}</span>}
      </div>
    </Link>
  )
}
