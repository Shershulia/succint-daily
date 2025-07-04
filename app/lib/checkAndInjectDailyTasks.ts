import { useTaskStore } from '@/lib/useTaskStore'
import { DAILY_TASKS } from '@/data/tasksData'
import { v4 as uuidv4 } from 'uuid'

function getLocalDateOnly(date: Date | string) {
  const d = new Date(date)
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
}

export function checkAndInjectDailyTasks() {
  const { tasks, addTask, deleteTask } = useTaskStore.getState()
  const today = getLocalDateOnly(new Date())

  tasks.forEach((task) => {
    const createdDate = getLocalDateOnly(task.createdAt)
    const isNotToday = createdDate !== today

    // ❌ Удаляем любые обязательные задачи, созданные не сегодня
    if (task.isRequired && isNotToday) {
      deleteTask(task.id)
      return
    }

    // ❌ Удаляем необязательные, однократные, выполненные, не сегодняшние
    if (!task.isRequired && task.taskType === 'once' && task.isDoneToday && isNotToday) {
      deleteTask(task.id)
    }
  })

  // ✅ Считаем оставшиеся обязательные задачи на сегодня
  const requiredToday = tasks.filter((task) => {
    const taskDate = getLocalDateOnly(task.createdAt)
    return task.isRequired && task.priority === 'high' && taskDate === today
  })

  if (requiredToday.length >= 5) return

  const tasksToAdd = DAILY_TASKS.sort(() => 0.5 - Math.random()).slice(0, 5)

  tasksToAdd.forEach(({ title, description }) => {
    const newTask = {
      id: uuidv4(),
      title,
      description,
      priority: 'high' as const,
      taskType: 'once' as const,
      isRequired: true,
      isDoneToday: false,
      createdAt: new Date().toISOString(),
    }
    addTask(newTask)
  })
}
