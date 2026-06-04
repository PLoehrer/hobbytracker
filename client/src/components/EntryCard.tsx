import type { Entry } from '../types/Entry'
import './EntryCard.css'

interface EntryCardProps {
  entry: Entry
  onClick?: () => void
}

const statusClassMap: Record<string, string> = {
  'Not Started': 'status--not-started',
  'In Progress': 'status--in-progress',
  'Completed': 'status--completed',
  'Abandoned': 'status--abandoned',
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function EntryCard({ entry, onClick }: EntryCardProps) {
  const statusClass = statusClassMap[entry.entryStatusName] ?? 'status--not-started'

  return (
    <div className="entry-card" onClick={onClick} style={onClick ? { cursor: 'pointer' } : undefined}>
      <div className="entry-card__header">
        <span className={`entry-card__status ${statusClass}`}>{entry.entryStatusName}</span>
        {entry.entryTypeName && (
          <span className="entry-card__type">{entry.entryTypeName}</span>
        )}
      </div>
      <h3 className="entry-card__title">{entry.title}</h3>
      {entry.description && (
        <p className="entry-card__desc">{entry.description}</p>
      )}
      <div className="entry-card__dates">
        {entry.startDate && <span>{formatDate(entry.startDate)}</span>}
        {entry.startDate && entry.endDate && <span className="entry-card__date-sep">→</span>}
        {entry.endDate && <span>{formatDate(entry.endDate)}</span>}
      </div>
    </div>
  )
}

export default EntryCard
