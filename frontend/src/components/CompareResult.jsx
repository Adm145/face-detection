export default function CompareResult({ result }) {
  const scorePct = Math.max(0, Math.round(result.similarity * 100))

  return (
    <div className="compare-result">
      <span className="compare-score-label">similarity score</span>
      <span className="compare-score">{scorePct}%</span>

      {result.match ? (
        <span className="compare-match-badge">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Match
        </span>
      ) : (
        <span className="compare-nomatch-badge">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          No match
        </span>
      )}
    </div>
  )
}
