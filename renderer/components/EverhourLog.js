import dayjs from 'dayjs'
import uniqid from 'uniqid'
import { uniq } from 'lodash'
import { clipboard } from 'electron'
import React, { Fragment, createContext, useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Block, Time } from './generic'
import Hotkey from './Hotkey'
import StoreContext from './store'
import Calendar from './Calendar'
import { selectByDate, tasksTotal, groupByProject } from '../selectors'
import { timeFormat } from '../utils'

const ClipboardContext = createContext()

const ClipboardProvider = ({ children }) => {
  const [ clipboard, setClipboard ] = useState('')
  return <ClipboardContext.Provider value={[clipboard, setClipboard]} children={children} />
}

const multiLine = description => `- ${description}`
const singleLine = description => `${description}`

const describeDay = tasks => {
  const descriptions = uniq(tasks.map(({ description }) => description))
  const format = descriptions.length > 1 ? multiLine : singleLine

  return descriptions.map(format).join('\n')
}

const Panel = styled(Block)`
  padding: 20px;
`

const CopyElement = styled(Block)`
  margin: 4px;
  background-color: #efefef;
  padding: 10px;

  :hover {
    background-color: #ccc;
  }

  ${({ active }) => active && `
    &, :hover {
      background-color: dodgerBlue;
      color: white;
    }
  `}
`

const CopyBlock = ({ children, content }) => {
  const id = useRef()
  const [ clipboardContent, setClipboard ] = useContext(ClipboardContext)

  useEffect(() => {
    id.current = uniqid()
  }, [])

  return (
    <CopyElement active={clipboardContent === id.current} children={children} onClick={() => {
      setClipboard(id.current)
      clipboard.writeText(content)
    }} />
  )
}

const Project = styled(({ name, description, total, ...props }) => (
  <Block {...props}>
    <p>{name}</p>
    <CopyBlock content={timeFormat(total)} children={timeFormat(total)} />

    <CopyBlock content={description}>
      <pre>{description}</pre>
    </CopyBlock>
  </Block>
))`
  padding: 10px;
`

export default () => {
  const [ state, dispatch ] = useContext(StoreContext)
  const { date, data: { tasks } } = state

  const tasksOfDay = selectByDate(tasks, date.format('YYYY-MM-DD'))

  const moveDate = amount =>
    dispatch({type: 'SET_DATE', date: date.add(amount, 'day')})

  const items = Object.entries(groupByProject(tasksOfDay)).map(([ name, tasks ]) => ({
    name,
    total: tasksTotal(tasks),
    description: describeDay(tasks)
  }))

  return (
    <ClipboardProvider>
      <Block>
        <Hotkey keys={'h'} onKeyDown={() => moveDate(-1)} />
        <Hotkey keys={'j'} onKeyDown={() => moveDate(7)} />
        <Hotkey keys={'k'} onKeyDown={() => moveDate(-7)} />
        <Hotkey keys={'l'} onKeyDown={() => moveDate(1)} />

        <Panel>
          <Calendar date={date} />
        </Panel>

        <Panel>
          <p>{date.format('dddd, MMMM D, YYYY')}</p>
          {items.map(project => <Project key={project.name} {...project} />)}
        </Panel>
      </Block>
    </ClipboardProvider>
  )
}
