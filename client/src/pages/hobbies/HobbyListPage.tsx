import { useState, useEffect } from 'react'
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import HobbyCard from '../../components/HobbyCard'
import type { Hobby } from '../../types/Hobby'

interface SortableHobbyCardProps {
  hobby: Hobby
}

function SortableHobbyCard({ hobby }: SortableHobbyCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: hobby.id })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 1 : undefined,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <HobbyCard hobby={hobby} />
    </div>
  )
}

function HobbyListPage() {
  const [hobbies, setHobbies] = useState<Hobby[]>([])
  const API_URL = import.meta.env.VITE_API_URL

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
  )

  useEffect(() => {
    fetch(`${API_URL}/hobbies`)
      .then(res => res.json())
      .then(data => setHobbies(data))
      .catch(err => console.error('Error fetching hobbies:', err))
  }, [])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    setHobbies(prev => {
      const oldIndex = prev.findIndex(h => h.id === active.id)
      const newIndex = prev.findIndex(h => h.id === over.id)
      const reordered = arrayMove(prev, oldIndex, newIndex)

      fetch(`${API_URL}/hobbies/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: reordered.map(h => h.id) }),
      }).catch(err => console.error('Error saving order:', err))

      return reordered
    })
  }

  return (
    <main className="main-content">
      <h1 className="section-label">My Hobbies</h1>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={hobbies.map(h => h.id)} strategy={rectSortingStrategy}>
          <div className="hobby-grid">
            {hobbies.map(hobby => (
              <SortableHobbyCard key={hobby.id} hobby={hobby} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </main>
  )
}

export default HobbyListPage
