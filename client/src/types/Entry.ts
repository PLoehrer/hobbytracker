export interface Entry {
  id: number
  hobbyId: number
  title: string
  description?: string
  entryStatusId: number
  entryStatusName: string
  entryTypeId?: number
  entryTypeName?: string
  startDate?: string
  endDate?: string
  displayOrder: number
}
