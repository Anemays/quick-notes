import { defineStore } from 'pinia'
import axios from 'axios'

export interface Note {
  id: number
  title: string
  content: string
  fileUrl?: string | null
}

export const useNotesStore = defineStore('notes', {
  state: () => ({
    notes: [] as Note[],
    loading: false,
  }),
  actions: {
    async fetch() {
      try {
        this.loading = true
        const res = await axios.get<Note[]>('/api/notes')
        this.notes = res.data || []
      } finally {
        this.loading = false
      }
    },
    async add(title: string, content: string, f?: File) {
      if (!title.trim()) return
      if (f) {
        const form = new FormData()
        form.append('title', title)
        form.append('content', content)
        form.append('file', f)
        await axios.post('/api/notes/upload', form)
      } else {
        await axios.post('/api/notes', { title, content })
      }
      await this.fetch()
    },
    async update(id: number, data: Partial<Note>) {
      const res = await axios.patch<Note>(`/api/notes/${id}`, data)
      const idx = this.notes.findIndex(n => n.id === id)
      if (idx !== -1) this.notes[idx] = res.data
    },
    async remove(id: number) {
      await axios.delete(`/api/notes/${id}`)
      this.notes = this.notes.filter(n => n.id !== id)
    },
  },
})
