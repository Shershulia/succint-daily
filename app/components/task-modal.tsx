'use client'

import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useTaskStore } from '@/lib/useTaskStore'
import { v4 as uuidv4 } from 'uuid'

export function TaskDialog() {
  const [open, setOpen] = React.useState(false)
  const { addTask } = useTaskStore()
  const [title, setTitle] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [priority, setPriority] = React.useState<'low' | 'medium' | 'high'>('medium')
  const [taskType, setTaskType] = React.useState<'once' | 'repeat'>('once')

  // Validation states
  const [errors, setErrors] = React.useState({
    title: false,
    description: false,
  })

  const isValid = title.trim() !== '' && description.trim() !== ''

  const validateField = (field: string, value: string) => {
    setErrors(prev => ({
      ...prev,
      [field]: value.trim() === ''
    }))
  }

  const handleSubmit = () => {
    if (!isValid) {
      setErrors({
        title: title.trim() === '',
        description: description.trim() === '',
      })
      return
    }
  
    const taskData = {
      id: uuidv4(),
      title: title.trim(),
      description: description.trim(),
      priority,
      taskType,
      isRequired: false,
      isDoneToday: false,
      createdAt: new Date().toISOString(),
    }
  
    addTask(taskData)
    setOpen(false)
  
    // Reset form
    setTitle('')
    setDescription('')
    setPriority('medium')
    setTaskType('once')
    setErrors({ title: false, description: false })
  }
  

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white">
          Create New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create a New Task</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <div className="flex flex-col gap-2">
            <Label>Title</Label>
            <Input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                validateField('title', e.target.value)
              }}
              placeholder="e.g. Buy groceries"
              className={errors.title ? 'border-red-500 focus:border-red-500' : ''}
            />
            {errors.title && <p className="text-red-500 text-sm">Title is required</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value)
                validateField('description', e.target.value)
              }}
              placeholder="Add more details..."
              className={errors.description ? 'border-red-500 focus:border-red-500' : ''}
            />
            {errors.description && <p className="text-red-500 text-sm">Description is required</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Priority</Label>
            <Select value={priority} onValueChange={(value) => setPriority(value as 'low' | 'medium' | 'high')}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Task Type</Label>
            <RadioGroup
              value={taskType}
              onValueChange={(value) => setTaskType(value as 'once' | 'repeat')}
              className="flex gap-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="once" id="once" />
                <Label htmlFor="once">One-time</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="repeat" id="repeat" />
                <Label htmlFor="repeat">Recurring</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSubmit}
              disabled={!isValid}
              className={`${
                isValid 
                  ? 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Create
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
