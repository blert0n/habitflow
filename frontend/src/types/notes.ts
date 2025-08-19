export interface Note {
  id: number
  habit_id: number
  user_id: number
  content: any
  created_at: string
  updated_at: string
}

export interface PaginatedNotesResponse {
  data: Array<Note>
  page: number
  limit: number
  totalCount: number
  totalPages: number
}
