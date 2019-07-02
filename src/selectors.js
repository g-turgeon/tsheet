import { groupBy } from 'lodash'
import dayjs from 'dayjs'

export const selectByDate = (tasks, date) => tasks.filter(task => task.date === date)

export const selectByWeek = (tasks, date) => {
  const startOfWeek = dayjs(date).startOf('week')
  return tasks.filter(task => startOfWeek.isSame(dayjs(task.date).startOf('week')))
}

export const groupByProject = (tasks) => groupBy(tasks, task => {
  const [ project ] = task.path.split(/(:|\/)/)
  return project
})

export const tasksTotal = tasks => tasks.reduce((total, task) => total + task.total, 0)
