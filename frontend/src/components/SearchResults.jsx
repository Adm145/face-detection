import { Link } from 'react-router-dom'
import PersonAvatar from './PersonAvatar'

export default function SearchResults({ matches }) {
  if (matches.length === 0) {
    return (
      <div className="match-empty">
        <p>No matches found. Try a different photo, or enroll this person first.</p>
      </div>
    )
  }

  return (
    <div className="match-results">
      <span className="match-count">
        {matches.length} match{matches.length === 1 ? '' : 'es'} found
      </span>
      <div className="match-list">
        {matches.map((match, index) => {
          const scorePct = Math.round(match.score * 100)
          return (
            <Link key={`${match.person_id}-${index}`} to={`/people/${match.person_id}`} className="match-row">
              <div className="match-avatar">
                <PersonAvatar
                  imageLink={match.image_link}
                  iconSize={24}
                  positionX={match.photo_position_x}
                  positionY={match.photo_position_y}
                />
              </div>
              <div className="match-info">
                <span className="match-name">{match.name}</span>
                {match.profession && <span className="match-profession">{match.profession}</span>}
              </div>
              {index === 0 ? (
                <span className="match-badge-best">Best match · {scorePct}%</span>
              ) : (
                <span className="match-score">{scorePct}%</span>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
