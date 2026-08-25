import { Link } from 'react-router-dom'
import PersonAvatar from './PersonAvatar'

function formatMeta(person) {
  return [person.gender, person.race, person.birthday].filter(Boolean).join(' · ')
}

export default function PersonCard({ person }) {
  const meta = formatMeta(person)

  return (
    <Link to={`/people/${person.id}`} className="person-card">
      <div className="person-card-photo">
        <PersonAvatar imageLink={person.image_link} iconSize={28} />
      </div>
      <div className="person-card-body">
        <span className="person-card-name">{person.name}</span>
        {person.profession && <span className="person-card-profession">{person.profession}</span>}
        {meta && <span className="person-card-meta">{meta}</span>}
      </div>
    </Link>
  )
}
