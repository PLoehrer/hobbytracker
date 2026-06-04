import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Box, Axe, Book, Dumbbell, Music, Paintbrush, MapPin, Gamepad2, Tv, Clapperboard, Plus } from 'lucide-react'
import type { Hobby } from '../../types/Hobby'
import type { Entry } from '../../types/Entry'
import EntryCard from '../../components/EntryCard'
import AddEntryModal from '../../components/AddEntryModal'
import EditEntryModal from '../../components/EditEntryModal'
import './HobbyDetailPage.css'

const iconMap = {
  box: Box,
  paintbrush: Paintbrush,
  music: Music,
  book: Book,
  axe: Axe,
  dumbbell: Dumbbell,
  mapPin: MapPin,
  gamepad2: Gamepad2,
  tv: Tv,
  clapperboard: Clapperboard,
}

function HobbyDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [hobby, setHobby] = useState<Hobby | null>(null)
  const [entries, setEntries] = useState<Entry[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const API_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    fetch(`${API_URL}/hobbies/${id}`)
      .then(res => res.json())
      .then(data => setHobby(data))
      .catch(err => console.error('Error fetching hobby:', err))
  }, [id])

  useEffect(() => {
    fetch(`${API_URL}/hobbies/${id}/entries`)
      .then(res => res.json())
      .then(data => setEntries(data))
      .catch(err => console.error('Error fetching entries:', err))
  }, [id, refreshKey])

  const handleEntryAdded = () => {
    setShowAddModal(false)
    setRefreshKey(k => k + 1)
  }

  const sortedEntries = [...entries].sort((a, b) => {
    if (!a.startDate && !b.startDate) return 0
    if (!a.startDate) return 1
    if (!b.startDate) return -1
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  })

  if (!hobby) return <div className="main-content">Loading...</div>

  const Icon = iconMap[hobby.iconName ?? 'box']

  return (
    <main className="main-content hobby-detail">
      <button className="hobby-detail__back" onClick={() => navigate('/')}>
        <ArrowLeft size={14} />
        All Hobbies
      </button>

      <div className="hobby-detail__header">
        <div className="hobby-detail__icon">
          {Icon && <Icon size={40} />}
        </div>
        <div className="hobby-detail__meta">
          <h1 className="hobby-detail__name">{hobby.name}</h1>
          {hobby.description && (
            <p className="hobby-detail__description">{hobby.description}</p>
          )}
          <div className="hobby-detail__stats">
            <div className="hobby-detail__stat">
              <span className="hobby-detail__stat-value">{hobby.totalEntries}</span>
              <span className="hobby-detail__stat-label">Total</span>
            </div>
            <div className="hobby-detail__stat">
              <span className="hobby-detail__stat-value">{hobby.inProgressEntries}</span>
              <span className="hobby-detail__stat-label">In Progress</span>
            </div>
            <div className="hobby-detail__stat">
              <span className="hobby-detail__stat-value">{hobby.completedEntries}</span>
              <span className="hobby-detail__stat-label">Completed</span>
            </div>
          </div>
        </div>
      </div>

      <div className="hobby-detail__entries-section">
        <div className="hobby-detail__entries-header">
          <h2 className="section-label">Entries</h2>
          <button className="hobby-detail__add-btn" onClick={() => setShowAddModal(true)}>
            <Plus size={14} />
            Add Entry
          </button>
        </div>
        {sortedEntries.length === 0 ? (
          <p className="hobby-detail__empty">No entries yet.</p>
        ) : (
          <div className="entry-scroll">
            {sortedEntries.map(entry => (
              <EntryCard key={entry.id} entry={entry} onClick={() => setEditingEntry(entry)} />
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <AddEntryModal
          hobbyId={hobby.id}
          onClose={() => setShowAddModal(false)}
          onSuccess={handleEntryAdded}
        />
      )}

      {editingEntry && (
        <EditEntryModal
          entry={editingEntry}
          onClose={() => setEditingEntry(null)}
          onSuccess={() => { setEditingEntry(null); setRefreshKey(k => k + 1) }}
        />
      )}
    </main>
  )
}

export default HobbyDetailPage
