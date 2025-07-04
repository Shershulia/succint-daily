// ✅ /components/TaskShareButton.tsx
'use client'

import { useTaskStore } from '@/lib/useTaskStore'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export function TaskShareButton() {
  const { tasks } = useTaskStore()

  const handleClick = () => {
    const required = tasks.filter((t) => t.isRequired)
    const done = required.filter((t) => t.isDoneToday)

    const completedCount = done.length
    const totalRequired = 5

    const taskDescriptions = done
      .slice(0, 5)
      .map((t, i) => `${i + 1}. ${t.description}`)
      .join('\n')

    const tweetText = `
    I completed ${completedCount}/${totalRequired} daily tasks by @MrS1rsh for @SuccinctLabs on SuccinctDaily.

    ${completedCount > 0 ? 'My tasks were:\n' + taskDescriptions + '\n\n' : ''}

    Go check new tasks now!
    https://succint-daily.vercel.app/
    #ProveWithUs  
    `

    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`
    window.open(url, '_blank')
  }

  return (
    <Button
      onClick={handleClick}
      className="flex items-center gap-2 bg-[var(--color-secondary)] hover:opacity-90 text-white"
    >
      Share Progress on X
    </Button>
  )
}