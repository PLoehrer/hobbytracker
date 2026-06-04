import { useState } from 'react'
import type { Hobby } from '../types/Hobby'
import './AddEntryModal.css'

interface EditHobbyModalProps {
  hobby: Hobby
  onClose: () => void
  onSuccess: (updated: Hobby) => void
  onDeleted: () => void
}

function EditHobbyModal({ hobby, onClose, onSuccess, onDeleted }: EditHobbyModalProps) {
  const API_URL = import.meta.env.VITE_API_URL
  const [name, setName] = useState(hobby.name)
  const [description, setDescription] = useState(hobby.description ?? '')
  const [submitting, setSubmitting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setSubmitting(true)
    try {
      await fetch(`${API_URL}/hobbies/${hobby.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), description: description.trim() || null }),
      })
      onSuccess({ ...hobby, name: name.trim(), description: description.trim() || undefined })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await fetch(`${API_URL}/hobbies/${hobby.id}`, { method: 'DELETE' })
      onDeleted()
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2 className="modal__title">Edit Hobby</h2>
        <form className="modal__form" onSubmit={handleSubmit}>
          <div className="modal__field">
            <label className="modal__label">Name</label>
            <input
              className="modal__input"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              autoFocus
            />
          </div>
          <div className="modal__field">
            <label className="modal__label">Description</label>
            <textarea
              className="modal__input modal__textarea"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Optional description"
              rows={3}
            />
          </div>
          <div className="modal__actions">
            <button type="button" className="modal__btn modal__btn--cancel" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="modal__btn modal__btn--submit"
              disabled={submitting || !name.trim()}
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          <hr className="modal__divider" />

          <div className="modal__delete-zone">
            {!confirmDelete ? (
              <button
                type="button"
                className="modal__btn modal__btn--danger"
                onClick={() => setConfirmDelete(true)}
              >
                Delete Hobby
              </button>
            ) : (
              <>
                <span className="modal__confirm-text">
                  Are you sure? This will delete the hobby and cannot be undone.
                </span>
                <div className="modal__confirm-actions">
                  <button
                    type="button"
                    className="modal__btn modal__btn--cancel"
                    onClick={() => setConfirmDelete(false)}
                  >
                    No, Cancel
                  </button>
                  <button
                    type="button"
                    className="modal__btn modal__btn--danger"
                    onClick={handleDelete}
                    disabled={deleting}
                  >
                    {deleting ? 'Deleting...' : 'Yes, Delete'}
                  </button>
                </div>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditHobbyModal
