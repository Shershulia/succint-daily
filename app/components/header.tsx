'use client'

import Link from 'next/link'
import { TaskDialog } from './task-modal'
import { TaskShareButton } from './task-share-button'
export function Header() {
  return (
    <header className="w-full border-b" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold flex items-center gap-2"
          style={{ color: 'var(--color-primary)' }}
        >
          <img src="/logoandtext.webp" alt="Succinct logo" className="h-8" />
          <p className="text-[33px] font-medium text-[var(--color-primary)] font-[var(--font-ivory)] animate-subtle-pulse">
            Daily
          </p>
        </Link>
        <div className="flex items-center gap-2">
          <TaskShareButton />
          <TaskDialog />
        </div>
      </div>
    </header>
  )
}
