export interface Hobby {
    id: number
    name: string
    imageUrl?: string
    description?: string
    iconName?: IconName
    displayOrder: number
    totalEntries: number
    completedEntries: number
    inProgressEntries: number
}

// painting, photography, music, reading, gaming, coding, fitness, cooking, travel, gardening, woodworking, DIY, cycling, automotive, aviation, boating

type IconName = 'box' | 'paintbrush' | 'music' | 'book' | 'axe' | 'dumbbell' | 'mapPin' | 'gamepad2' | 'tv' | 'clapperboard'

// type IconName = 'paintbrush' | 'camera' | 'music' | 'book' | 'gamepad' | 'code' | 'fitness' 
// | 'cooking' | 'travel' | 'gardening' | 'axe' | 'dumbbell' | 'palette' | 'pencil' | 'scissors' 
// | 'wrench' | 'hammer' | 'bicycle' | 'car' | 'plane' | 'ship'