import { Link, useParams } from "react-router-dom";
import { usePersonDetail } from "../../hooks/usePersonDetail";
import { useAuth } from "../../context/AuthContext";
import PersonDetailForm from "../../components/PersonDetailForm";
import AddPhotosPanel from "../../components/AddPhotosPanel";
import "./PersonDetailPage.css";

export default function PersonDetailPage() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const {
    person,
    loading,
    loadError,
    formFields,
    setFormFields,
    saveStatus,
    saveError,
    handleSave,
    confirmingDelete,
    setConfirmingDelete,
    deleteStatus,
    deleteError,
    handleDelete,
    photoStatus,
    photoError,
    handlePhotoUpload,
    repositioning,
    setRepositioning,
    handlePositionSave,
  } = usePersonDetail(id);

  return (
    <main className="person-detail-page">
      <div className="person-detail-shell">
        {loading && <p className="people-status">Loading…</p>}

        {!loading && loadError && (
          <div className="person-detail-error">
            <p>{loadError}</p>
            <Link to="/people" className="btn-primary">
              Back to People
            </Link>
          </div>
        )}

        {!loading && !loadError && person && (
          <>
            <div className="person-detail-breadcrumb">
              <span>
                <Link to="/people">People</Link> / {person.name}
              </span>
              <h1>{person.name}</h1>
            </div>

            <PersonDetailForm
              person={person}
              formFields={formFields}
              setFormFields={setFormFields}
              saveStatus={saveStatus}
              saveError={saveError}
              handleSave={handleSave}
              confirmingDelete={confirmingDelete}
              setConfirmingDelete={setConfirmingDelete}
              deleteStatus={deleteStatus}
              deleteError={deleteError}
              handleDelete={handleDelete}
              photoStatus={photoStatus}
              photoError={photoError}
              handlePhotoUpload={handlePhotoUpload}
              isAuthenticated={isAuthenticated}
              repositioning={repositioning}
              setRepositioning={setRepositioning}
              handlePositionSave={handlePositionSave}
            />

            {isAuthenticated && <AddPhotosPanel personId={id} />}
          </>
        )}
      </div>
    </main>
  );
}
