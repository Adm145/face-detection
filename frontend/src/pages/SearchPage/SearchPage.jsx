import { useFaceSearch } from '../../hooks/useFaceSearch'
import NavBar from '../../components/NavBar'
import SearchForm from '../../components/SearchForm'
import SearchResults from '../../components/SearchResults'
import './SearchPage.css'

export default function SearchPage() {
  const {
    photo,
    isDragging,
    setIsDragging,
    status,
    errorMessage,
    matches,
    addFiles,
    clearPhoto,
    handleDrop,
    handleSubmit,
  } = useFaceSearch()

  return (
    <>
      <NavBar />
      <main className="search-page">
        <div className="search-shell">
          <SearchForm
            photo={photo}
            isDragging={isDragging}
            setIsDragging={setIsDragging}
            status={status}
            errorMessage={errorMessage}
            addFiles={addFiles}
            clearPhoto={clearPhoto}
            handleDrop={handleDrop}
            handleSubmit={handleSubmit}
          />

          {status === 'success' && matches && <SearchResults matches={matches} />}
        </div>
      </main>
    </>
  )
}
