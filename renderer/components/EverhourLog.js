import dayjs from 'dayjs'
import uniqid from 'uniqid'
import { uniq } from 'lodash'
import { clipboard } from 'electron'
import React, { Fragment, createContext, useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { Block, Time, Duration } from './generic'
import MainLayout from './MainLayout'
import Panel from './Panel'
import Hotkey from './Hotkey'
import StoreContext from './store'
import Calendar from './Calendar'
import CalendarDate from './CalendarDate'
import WeekSummary from './WeekSummary'
import { selectByDate, tasksTotal, groupByProject, groupByPath } from '../selectors'
import { timeFormat } from '../utils'

const Main = styled(Block)`
  display: grid;
  grid: auto 1fr / auto 1fr auto;
  grid-gap: 8px;
  overflow: hidden;
  width: 100%;
  height: 100%;
`

const ClipboardContext = createContext()

const ClipboardProvider = ({ children }) => {
  const [ clipboard, setClipboard ] = useState('')
  return <ClipboardContext.Provider value={[clipboard, setClipboard]} children={children} />
}

const multiLine = description => `- ${description}`
const singleLine = description => `${description}`

export const describeDay = tasks => {
  const descriptions = uniq(tasks.map(({ description }) => description))
  const format = descriptions.length > 1 ? multiLine : singleLine

  return descriptions.map(format).join('\n')
}

const CopyElement = styled(Block).attrs({
  tabIndex: 0
})`
  padding: 8px;
  height: 100%;
  cursor: pointer;

  :active, :focus {
    background-color: var(--normal-black);
    color: var(--accent);
  }
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

const Table = styled.table`
  border-collapse: collapse;
  margin: 16px 0;

  td {
    padding: 10px;
    border: 1px solid #efefef;
  }

  td:nth-child(2) {
    text-align: right;
  }
`

const Path = styled.div`
  padding: 2px 8px;
  font-size: 10px;
  font-weight: bold;
  background: var(--accent);
  color: var(--normal-black);
`

const GroupList = styled.div`
  display: grid;
  grid-gap: 8px;
`

const GroupBlock = styled.div`
  width: 100%;
  display: grid;
  grid-template: auto / 120px 1fr;
`

export default () => {
  const [ state, dispatch ] = useContext(StoreContext)
  const { date, data: { tasks } } = state

  const tasksOfDay = selectByDate(tasks, date.format('YYYY-MM-DD'))

  const moveDate = amount =>
    dispatch({type: 'SET_DATE', date: date.add(amount, 'day')})

  const groupTotals = Object.entries(groupByPath(tasksOfDay)).map(([ path, tasks ]) => (
    <div key={path}>
      <Path>{path}</Path>
      <GroupBlock>
        <strong><CopyBlock content={timeFormat(tasksTotal(tasks))}><Duration value={tasksTotal(tasks)} /></CopyBlock></strong>
        <CopyBlock content={describeDay(tasks)}><pre>{describeDay(tasks)}</pre></CopyBlock>
      </GroupBlock>
    </div>
  ))

  const items = Object.entries(groupByProject(tasksOfDay)).map(([ name, tasks ]) => ({
    name,
    total: tasksTotal(tasks),
    description: describeDay(tasks)
  }))

  return (
    <ClipboardProvider>
      <MainLayout>
        <Main>
          <Panel>
            <Calendar date={date} />
          </Panel>

          <Panel>
            <CalendarDate date={date} />
          </Panel>

          <Panel>
            <WeekSummary date={date} tasks={tasks} />
          </Panel>

          <Panel style={{gridColumn: '1 / 4'}}>
            <GroupList>{groupTotals}</GroupList>
          </Panel>
        </Main>

        <Hotkey keys={'h'} onKeyDown={() => moveDate(-1)} />
        <Hotkey keys={'j'} onKeyDown={() => moveDate(7)} />
        <Hotkey keys={'k'} onKeyDown={() => moveDate(-7)} />
        <Hotkey keys={'l'} onKeyDown={() => moveDate(1)} />
      </MainLayout>
    </ClipboardProvider>
  )
}
