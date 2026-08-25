import DeleteConfirm from "./DeleteConfirm";
import PersonPhotoUpload from "./PersonPhotoUpload";

export default function PersonDetailForm({
  person,
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
  isAuthenticated,
  repositioning,
  setRepositioning,
  handlePositionSave,
}) {
  const { name, gender, race, birthday, profession } = formFields;

  return (
    <form className="person-detail-card" onSubmit={handleSave}>
      <div className="person-detail-photo-col">
        <PersonPhotoUpload
          imageLink={person.image_link}
          positionX={person.photo_position_x}
          positionY={person.photo_position_y}
          status={photoStatus}
          error={photoError}
          onUpload={handlePhotoUpload}
          isAuthenticated={isAuthenticated}
          repositioning={repositioning}
          setRepositioning={setRepositioning}
          onSavePosition={handlePositionSave}
        />

        {isAuthenticated && (
          <DeleteConfirm
            personName={person.name}
            confirming={confirmingDelete}
            setConfirming={setConfirmingDelete}
            status={deleteStatus}
            error={deleteError}
            onDelete={handleDelete}
          />
        )}
      </div>

      <div className="person-detail-fields">
        {saveStatus === "error" && (
          <div className="error-banner">{saveError}</div>
        )}

        {!isAuthenticated && (
          <p className="person-detail-readonly-note">Log in as admin to edit this person.</p>
        )}

        <fieldset className="person-detail-fieldset" disabled={!isAuthenticated}>
        <div className="field field-full">
          <span className="field-label">Name *</span>
          <input
            className="text-input"
            type="text"
            value={name}
            onChange={(e) =>
              setFormFields((prev) => ({ ...prev, name: e.target.value }))
            }
            required
          />
        </div>

        <div className="field-grid">
          <label className="field">
            <span className="field-label">Gender</span>
            <select
              className="text-input"
              value={gender}
              onChange={(e) =>
                setFormFields((prev) => ({ ...prev, gender: e.target.value }))
              }
            >
              <option value="">—</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
            </select>
          </label>

          <label className="field">
            <span className="field-label">Birthday</span>
            <input
              className="text-input"
              type="date"
              value={birthday}
              onChange={(e) =>
                setFormFields((prev) => ({ ...prev, birthday: e.target.value }))
              }
            />
          </label>

          <label className="field">
            <span className="field-label">Race</span>
            <select
              className="text-input"
              value={race}
              onChange={(e) =>
                setFormFields((prev) => ({ ...prev, race: e.target.value }))
              }
            >
              <option value="">—</option>
              <option value="White">White</option>
              <option value="Black">Black</option>
              <option value="Asian">Asian</option>
              <option value="Indian">Indian</option>
              <option value="Other">Other</option>
            </select>
          </label>
          <label className="field">
            <span className="field-label">Profession</span>
            <input
              className="text-input"
              type="text"
              value={profession}
              onChange={(e) =>
                setFormFields((prev) => ({
                  ...prev,
                  profession: e.target.value,
                }))
              }
            />
          </label>
        </div>

        <div className="person-detail-actions">
          {saveStatus === "success" && (
            <span className="save-confirmation">Saved</span>
          )}
          <button
            type="submit"
            className="btn-primary"
            disabled={!name.trim() || saveStatus === "saving"}
          >
            {saveStatus === "saving" ? "Saving…" : "Save changes"}
          </button>
        </div>
        </fieldset>
      </div>
    </form>
  );
}
