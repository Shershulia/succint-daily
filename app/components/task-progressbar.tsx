'use client'

import { useTaskStore } from '@/lib/useTaskStore'
import { useEffect, useState } from 'react'

export function TaskProgressBar() {
  const { tasks } = useTaskStore()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const requiredCount = 5
    const optionalCount = tasks.filter((t) => !t.isRequired).length
    const total = requiredCount + optionalCount
    const done = tasks.filter((t) => t.isDoneToday).length

    const percent = total > 0 ? Math.min((done / total) * 100, 100) : 0
    setProgress(percent)
  }, [tasks])

  return (
    <div className="fixed top-0 left-0 w-full h-2 bg-gray-200 z-50">
      <div
        className="h-full bg-pink-500 transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}