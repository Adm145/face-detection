import DeleteConfirm from './DeleteConfirm'

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
}) {
  const { name, gender, race, birthday, profession } = formFields

  return (
    <form className="person-detail-card" onSubmit={handleSave}>
      <div className="person-detail-photo-col">
        <div className="person-detail-photo">
          {person.image_link ? (
            <img src={person.image_link} alt="" />
          ) : (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
              <path d="M4 20c0-4 3.5-6 8-6s8 2 8 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
        </div>

        <DeleteConfirm
          personName={person.name}
          confirming={confirmingDelete}
          setConfirming={setConfirmingDelete}
          status={deleteStatus}
          error={deleteError}
          onDelete={handleDelete}
        />
      </div>

      <div className="person-detail-fields">
        {saveStatus === 'error' && <div className="error-banner">{saveError}</div>}

        <div className="field field-full">
          <span className="field-label">Name *</span>
          <input
            className="text-input"
            type="text"
            value={name}
            onChange={(e) => setFormFields((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>

        <div className="field-grid">
          <label className="field">
            <span className="field-label">Gender</span>
            <select
              className="text-input"
              value={gender}
              onChange={(e) => setFormFields((prev) => ({ ...prev, gender: e.target.value }))}
            >
              <option value="">—</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
          </label>

          <label className="field">
            <span className="field-label">Birthday</span>
            <input
              className="text-input"
              type="date"
              value={birthday}
              onChange={(e) => setFormFields((prev) => ({ ...prev, birthday: e.target.value }))}
            />
          </label>

          <label className="field">
            <span className="field-label">Race</span>
            <select
              className="text-input"
              value={race}
              onChange={(e) => setFormFields((prev) => ({ ...prev, race: e.target.value }))}
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
              onChange={(e) => setFormFields((prev) => ({ ...prev, profession: e.target.value }))}
            />
          </label>
        </div>

        <div className="person-detail-actions">
          {saveStatus === 'success' && <span className="save-confirmation">Saved</span>}
          <button type="submit" className="btn-primary" disabled={!name.trim() || saveStatus === 'saving'}>
            {saveStatus === 'saving' ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </form>
  )
}
