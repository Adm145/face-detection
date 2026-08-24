import { Routes, Route } from 'react-router-dom'
import UploadPage from './pages/UploadPage'
import PeopleListPage from './pages/PeopleListPage'
import PersonDetailPage from './pages/PersonDetailPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<UploadPage />} />
      <Route path="/people" element={<PeopleListPage />} />
      <Route path="/people/:id" element={<PersonDetailPage />} />
    </Routes>
  )
}

export default App
