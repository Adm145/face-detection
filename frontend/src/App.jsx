import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import UploadPage from "./pages/UploadPage/UploadPage";
import PeopleListPage from "./pages/PeopleListPage/PeopleListPage";
import PersonDetailPage from "./pages/PersonDetailPage/PersonDetailPage";
import SearchPage from "./pages/SearchPage/SearchPage";
import ComparePage from "./pages/ComparePage/ComparePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RequireAdmin from "./components/RequireAdmin";

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/people/:id" element={<PersonDetailPage />} />
        <Route element={<RequireAdmin />}>
          <Route path="/enroll" element={<UploadPage />} />
          <Route path="/people" element={<PeopleListPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
