export interface Note {
  id: number
  habit_id: number
  user_id: number
  title: string
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

export interface HabitOptions {
  id: number
  name: string
}

export interface CreateNoteForm {
  id?: number
  title: string
  habit_id: number
  content: string
}
