  'use client'

  import { useEffect, useState } from 'react'
  import { useTaskStore } from '@/lib/useTaskStore'
  import { Button } from '@/components/ui/button'
  import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from '@/components/ui/dialog'
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
  import { Input } from '@/components/ui/input'
  import { checkAndInjectDailyTasks } from '@/lib/checkAndInjectDailyTasks'
  function TaskDetailModal({ task, open, onOpenChange }: { task: any, open: boolean, onOpenChange: (open: boolean) => void }) {
    if (!task) return null

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{task.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <p><strong>Description:</strong> {task.description}</p>
            <p><strong>Priority:</strong> {task.priority}</p>
            <p><strong>Type:</strong> {task.taskType}</p>
            <p><strong>Required:</strong> {task.isRequired ? 'Yes' : 'No'}</p>
            <p><strong>Done Today:</strong> {task.isDoneToday ? 'Yes' : 'No'}</p>
            <p><strong>Created At:</strong> {new Date(task.createdAt).toLocaleString()}</p>
            <div className="pt-4">
              <img src="/x_image.png" alt="Succinct logo" className="rounded-lg" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  function TaskItem({ task, onClick }: { task: any, onClick: () => void }) {
    const { updateTask, deleteTask } = useTaskStore()

    return (
      <div
        className="flex items-center justify-between border rounded-lg p-4 shadow-sm bg-white dark:bg-neutral-900 cursor-pointer"
        onClick={onClick}
      >
        <div className="flex items-start gap-4">
          <div className={`w-4 h-4 rounded-full mt-1 ${task.isDoneToday ? 'bg-green-500' : 'bg-red-500'}`} />
          <div>
            <h3 className="font-semibold text-base">{task.title}</h3>
            <p className="text-sm text-muted-foreground max-w-[300px] line-clamp-2">{task.description}</p>
          </div>
        </div>
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="outline"
            onClick={() => updateTask(task.id, { isDoneToday: !task.isDoneToday })}
            className="text-sm"
          >
            {task.isDoneToday ? 'Undo' : 'Done'}
          </Button>
          {!task.isRequired && (
            <Button
              variant="destructive"
              onClick={() => deleteTask(task.id)}
              className="text-sm"
            >
              Delete
            </Button>
          )}
        </div>
      </div>
    )
  }

  function TaskSection({ title, tasks, color, onTaskClick }: { title: string; tasks: any[]; color: string; onTaskClick: (task: any) => void }) {
    return (
      <section>
        <h2 className={`text-lg font-semibold mb-3 text-[${color}]`}>{title}</h2>
        <div className="flex flex-col gap-3">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} onClick={() => onTaskClick(task)} />
          ))}
        </div>
      </section>
    )
  }

  export function TaskList() {
    const { tasks } = useTaskStore()
    const [selectedTask, setSelectedTask] = useState<any>(null)
    const [modalOpen, setModalOpen] = useState(false)
  
    const [priorityFilter, setPriorityFilter] = useState<string>('all')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
    const [searchTerm, setSearchTerm] = useState<string>('')
  
    useEffect(() => {
      const stored = localStorage.getItem('daily-tasks')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          useTaskStore.setState({ tasks: parsed })
        } catch {
          console.error('Failed to load tasks')
        }
      }
    }, [])
  
    useEffect(() => {
      checkAndInjectDailyTasks()
    }, [])
  
    const priorityOrder: Record<'high' | 'medium' | 'low', number> = {
      high: 3,
      medium: 2,
      low: 1
    }
  
    const filterTasks = (taskList: any[]) => {
      let filtered = [...taskList]
  
      if (priorityFilter !== 'all') {
        filtered = filtered.filter((task) => task.priority === priorityFilter)
      }
  
      if (searchTerm.trim() !== '') {
        filtered = filtered.filter((task) =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }
  
      filtered.sort((a, b) => {
        return sortOrder === 'asc'
          ? priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder]
          : priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder]
      })
  
      return filtered
    }
  
    const requiredTasks = filterTasks(tasks.filter((t) => t.isRequired))
    const optionalTasks = filterTasks(tasks.filter((t) => !t.isRequired))
  
    const openModal = (task: any) => {
      setSelectedTask(task)
      setModalOpen(true)
    }
  
    return (
      <div className="flex flex-col gap-6 w-[80%] mx-auto mt-8 h-[80vh]">
    
        {/* 🔍 Filters pinned to top */}
        <div className="sticky top-0 z-10 bg-white dark:bg-neutral-900 py-2">
          <div className="flex flex-wrap gap-4 justify-between items-center mb-2">
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 min-w-[200px]"
            />
    
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
    
            <Button
              variant="outline"
              onClick={() =>
                setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
              }
            >
              Sort: {sortOrder === 'asc' ? 'Low → High' : 'High → Low'}
            </Button>
          </div>
        </div>
    
        {/* 📜 Scrollable task section */}
        <div className="flex flex-col gap-8 overflow-y-auto pr-2 flex-1">
          {requiredTasks.length > 0 && (
            <TaskSection
              title="Required Tasks"
              tasks={requiredTasks}
              color="var(--color-primary)"
              onTaskClick={openModal}
            />
          )}
          {optionalTasks.length > 0 && (
            <TaskSection
              title="Optional Tasks"
              tasks={optionalTasks}
              color="var(--color-secondary)"
              onTaskClick={openModal}
            />
          )}
          {requiredTasks.length === 0 && optionalTasks.length === 0 && (
            <p className="text-center text-muted-foreground mt-6">
              No tasks yet.
            </p>
          )}
        </div>
    
        <TaskDetailModal
          task={selectedTask}
          open={modalOpen}
          onOpenChange={setModalOpen}
        />
      </div>
    )
    
  }
