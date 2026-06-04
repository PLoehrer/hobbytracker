import { Box, Axe, Book, Dumbbell, Music, Paintbrush, MapPin, Gamepad2, Tv, Clapperboard } from 'lucide-react'
import type { Hobby } from '../types/Hobby'
import './HobbyCard.css'
import { useNavigate } from 'react-router-dom'

interface HobbyCardProps {
    hobby: Hobby
}

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
        clapperboard: Clapperboard
    }

function HobbyCard({ hobby }: HobbyCardProps) {
    const Icon = iconMap[hobby.iconName ?? "box"]
    const navigate = useNavigate()

    return (
        <div className="hobby-card" onClick={() => navigate(`/hobbies/${hobby.id}`)}>
            {hobby.imageUrl && (
                <img className="hobby-card__image" src={hobby.imageUrl} alt={hobby.name} />
            )}
            {!hobby.imageUrl && (
                <div className="hobby-card__placeholder">
                    <span className="hobby-card__placeholder-icon">
                        {Icon && <Icon size={48} color="currentColor" />}
                    </span>
                </div>
            )}
            <div className="hobby-card__body">
                <h2 className="hobby-card__name">{hobby.name}</h2>
                <p className="hobby-card__description">{hobby.description}</p>
                <div className="hobby-card__stats">
                    <div className="hobby-card__stat">
                        <span className="hobby-card__stat-value">{hobby.totalEntries}</span>
                        <span className="hobby-card__stat-label">Total Entries</span>
                    </div>
                    <div className="hobby-card__stat">
                        <span className="hobby-card__stat-value">{hobby.completedEntries}</span>
                        <span className="hobby-card__stat-label">Completed</span>
                    </div>
                    <div className="hobby-card__stat">
                        <span className="hobby-card__stat-value">{hobby.inProgressEntries}</span>
                        <span className="hobby-card__stat-label">In Progress</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HobbyCard