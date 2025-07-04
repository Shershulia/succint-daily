'use client'

import { create } from 'zustand'

export type Task = {
  id: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  taskType: 'once' | 'repeat'
  isRequired: boolean
  isDoneToday: boolean
  createdAt: string
}

type State = {
  tasks: Task[]
  addTask: (task: Task) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
}

const STORAGE_KEY = 'daily-tasks'

export const useTaskStore = create<State>((set, get) => ({
  tasks: [],
  addTask: (task) => {
    const updated = [...get().tasks, task]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    set({ tasks: updated })
  },
  updateTask: (id, updates) => {
    const updated = get().tasks.map((t) =>
      t.id === id ? { ...t, ...updates } : t
    )
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    set({ tasks: updated })
  },
  deleteTask: (id) => {
    const updated = get().tasks.filter((t) => t.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    set({ tasks: updated })
  },
}))

// Hydration effect (for page refresh)
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      useTaskStore.setState({ tasks: JSON.parse(stored) })
    } catch {
      console.error('Invalid data in localStorage')
    }
  }
}
