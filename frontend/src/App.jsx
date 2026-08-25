import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import UploadPage from "./pages/UploadPage/UploadPage";
import PeopleListPage from "./pages/PeopleListPage/PeopleListPage";
import PersonDetailPage from "./pages/PersonDetailPage/PersonDetailPage";
import SearchPage from "./pages/SearchPage/SearchPage";
import ComparePage from "./pages/ComparePage/ComparePage";

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/people" element={<PeopleListPage />} />
        <Route path="/people/:id" element={<PersonDetailPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/compare" element={<ComparePage />} />
      </Routes>
    </>
  );
}

export default App;
