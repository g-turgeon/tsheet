import dayjs from 'dayjs'
import chalk from 'chalk'
import { groupBy } from 'lodash/fp'

const isEmpty = line => line === ''
const isVacationLine = line => line.startsWith('~~~')

const isCommentLine = line => line.startsWith('#')
const isDate = line => line.startsWith('--')
const isSection = line => line.startsWith('===')

const timeValue = (hours, minutes) => hours * 60 + minutes

const parseTime = str => {
  const [ hours, minutes ] = str.split(':')
  return Number.parseInt(hours) * 60 + Number.parseInt(minutes)
}

const groupByDate = groupBy('date')

const expressions = {
  date: /^--\s?(?<date>\d{2,4}\-\d{2}\-\d{2})/,
  task: /^(?<start>\d\d:\d\d)\s?-\s?(?<end>\d\d:\d\d)\s?(?:->|\|)?\s?(?:\[(?<path>.+)\])?\s?(?<description>.+)?/,
  section: {
    default: /^===\s?(?<name>.+)===$/,
    withExpectedTime: /^===\s?(?<name>.+)\s\((?<expected>\d+:\d{1,2})\)\s?===$/
  }
}

// Parse section
const parseSection = ({ content, number }) => {
  if (expressions.section.withExpectedTime.test(content)) {
    const [ full, name, expectedTime ] = expressions.section.withExpectedTime.exec(content)
    const value = name.trim()
    return {
      type: 'section',
      value: {
        name: name.trim(),
        expectedTime: parseTime(expectedTime)
      }
    }
  } else if (expressions.section.default.test(content)) {
    const [ full, name ] = expressions.section.default.exec(content)
    const value = name.trim()
    return {type: 'section', value: {
      name: name.trim(),
      expectedTime: null
    }}
  }
}

const parseDate = ({ content, number }) => {
  const [ full, date ] = expressions.date.exec(content)

  if (date) {
    return {type: 'date', value: dayjs(date).format('YYYY-MM-DD')}
  }
}

const parseTask = ({ content }) => {
  const [ full, start, end, path, description ] = expressions.task.exec(content)

  const startTime = parseTime(start)
  const endTime = parseTime(end)

  const total = endTime - startTime

  if (total < 0) {
    console.error(`Negative time error on line ${number}`)
  }

  return {type: 'task', value: {
    start: startTime,
    end: endTime,
    total,
    path,
    description
  }}
}

export default content => {
  const lines = content.split('\n')
    .map((line, n) => ({number: n, content: line}))
    .filter(line => !isVacationLine(line.content) && !isCommentLine(line.content) && !isEmpty(line.content))
    .map(line => {
      if (isSection(line.content)) {
        return parseSection(line)
      } else if (isDate(line.content)) {
        return parseDate(line)
      } else {
        return parseTask(line)
      }
    })

  const sections = {}
  const dates = {}

  let currentSection
  let currentDate

  lines.forEach(line => {
    if (line.type === 'section') {
      currentSection = line.value.name

      // Check if the section has already been defined. In which case an error should be thrown
      if (sections[currentSection]) {
        console.warn(`Session ${currentSection} has already been defined`)
      } else {
        sections[currentSection] = {...line.value, tasks: []}
      }
    }

    if (line.type === 'date') {
      currentDate = line.value

      if (dates[currentDate]) {
        console.warn(`Date ${currentDate} has already been defined`)
      }

      dates[currentDate] = line.value
    }

    if (line.type === 'task') {
      line.value.date = currentDate
      line.value.section = currentSection
      sections[currentSection].tasks.push(line.value)
    }
  })

  for (const [ name, section ] of Object.entries(sections)) {
    const dates = groupByDate(section.tasks)

    for (const [ date, tasks ] of Object.entries(dates)) {
      let lastEnd = 0

      for (const task of tasks) {
        if (task.end < lastEnd || task.start < lastEnd) {
          console.error(`Overlapping time task in section ${section.name} on ${date}: ${task.description}`)
        }

        lastEnd = task.end
      }
    }
  }

  const tasks = lines.filter(line => line.type === 'task').map(line => line.value)

  return {tasks, sections}
}
