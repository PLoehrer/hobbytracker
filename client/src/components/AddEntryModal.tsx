import { useState, useEffect } from 'react'
import type { EntryStatus } from '../types/EntryStatus'
import './AddEntryModal.css'

interface AddEntryModalProps {
  hobbyId: number
  onClose: () => void
  onSuccess: () => void
}

function AddEntryModal({ hobbyId, onClose, onSuccess }: AddEntryModalProps) {
  const API_URL = import.meta.env.VITE_API_URL
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [entryStatusId, setEntryStatusId] = useState(0)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [statuses, setStatuses] = useState<EntryStatus[]>([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch(`${API_URL}/entry-statuses`)
      .then(res => res.json())
      .then((data: EntryStatus[]) => {
        setStatuses(data)
        if (data.length > 0) setEntryStatusId(data[0].id)
      })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || entryStatusId === 0) return
    setSubmitting(true)
    try {
      await fetch(`${API_URL}/entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hobbyId,
          title: title.trim(),
          description: description.trim() || null,
          entryStatusId,
          entryTypeId: null,
          startDate: startDate || null,
          endDate: endDate || null,
        }),
      })
      onSuccess()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2 className="modal__title">New Entry</h2>
        <form className="modal__form" onSubmit={handleSubmit}>
          <div className="modal__field">
            <label className="modal__label">Title</label>
            <input
              className="modal__input"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Entry title"
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
          <div className="modal__field">
            <label className="modal__label">Status</label>
            <select
              className="modal__input modal__select"
              value={entryStatusId}
              onChange={e => setEntryStatusId(Number(e.target.value))}
            >
              {statuses.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="modal__row">
            <div className="modal__field">
              <label className="modal__label">Start Date</label>
              <input
                className="modal__input"
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
              />
            </div>
            <div className="modal__field">
              <label className="modal__label">End Date</label>
              <input
                className="modal__input"
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
              />
            </div>
          </div>
          <div className="modal__actions">
            <button type="button" className="modal__btn modal__btn--cancel" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="modal__btn modal__btn--submit"
              disabled={submitting || !title.trim()}
            >
              {submitting ? 'Saving...' : 'Add Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddEntryModal
