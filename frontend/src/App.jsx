import { Routes, Route } from 'react-router-dom'
import UploadPage from './pages/UploadPage/UploadPage'
import PeopleListPage from './pages/PeopleListPage/PeopleListPage'
import PersonDetailPage from './pages/PersonDetailPage/PersonDetailPage'
import SearchPage from './pages/SearchPage/SearchPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<UploadPage />} />
      <Route path="/people" element={<PeopleListPage />} />
      <Route path="/people/:id" element={<PersonDetailPage />} />
      <Route path="/search" element={<SearchPage />} />
    </Routes>
  )
}

export default App
