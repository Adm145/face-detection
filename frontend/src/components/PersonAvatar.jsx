export default function PersonAvatar({ imageLink, iconSize = 24, positionX = 50, positionY = 50 }) {
  if (imageLink) {
    return <img src={imageLink} alt="" style={{ objectPosition: `${positionX}% ${positionY}%` }} />
  }

  return (
    <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 20c0-4 3.5-6 8-6s8 2 8 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
