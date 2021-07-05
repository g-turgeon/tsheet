import React, { Fragment, useCallback, useContext, useState } from 'react'
import styled from 'styled-components'
import { clipboard } from 'electron'

import StoreContext from './store'
import Hotkey from './Hotkey'
import { Block, Time, Duration } from './generic'
import MainLayout from './MainLayout'
import Panel from './Panel'
import Calendar from './Calendar'
import CalendarDate from './CalendarDate'
import WeekSummary from './WeekSummary'
import { selectByDate, selectByWeek, groupByDate, groupByPath, tasksTotal } from '../selectors'
import { describeDay } from './EverhourLog'

const DATE_FORMAT = 'YYYY-MM-DD'
const LONG_DATE = 'ddd, MMMM D, YYYY'

const Main = styled(Block)`
  display: grid;
  grid: auto 1fr / auto 1fr auto;
  grid-gap: 8px;
  overflow: hidden;
  width: 100%;
  height: 100%;
`

const DayTitle = styled(Block)`
  font-size: 16px;
  margin-bottom: 4px;
`

const TaskListWrapper = styled(Panel)`
  overflow-y: auto;
  grid-column: 1 / 4;
`

const Big = styled(Block)`
  padding: 2px 10px;
`

const TaskDescription = styled(Big)`
  cursor: default;

  :hover {
    background: var(--normal-white);
    color: var(--normal-black);
  }
`

const Small = styled(Block)`
  padding: 2px 8px;
  font-size: 10px;
`

const Path = styled(Small)`
  font-weight: bold;
  background: var(--accent);
  color: var(--normal-black);
`

const TimeBlock = styled(Block)`
  text-align: right;
`

const TaskTimeInterval = styled(Small)`
  color: var(--normal-white);
`

const CopyClick = ({ content, children }) => {
  const onClick = useCallback((event) => {
    clipboard.writeText(content)
  }, [content])

  return <div onClick={onClick}>{children}</div>
}

const Task = styled(({ start, end, total, path, description, ...props }) => {
  return (
    <Block {...props}>
      <TimeBlock>
        <Big><strong><Duration value={total} /></strong></Big>
        <TaskTimeInterval><Time value={start} /> - <Time value={end} /></TaskTimeInterval>
      </TimeBlock>
      <Block>
        <Path children={path} />
        <CopyClick content={description}><TaskDescription children={description} /></CopyClick>
      </Block>
    </Block>
  )
})`
  display: flex;
  padding: 8px 0;
`

export default () => {
  const [ state, dispatch ] = useContext(StoreContext)
  const { data: { tasks, sections }, date } = state

  const tasksOfDay = selectByDate(tasks, date.format(DATE_FORMAT))

  const moveDate = amount =>
    dispatch({type: 'SET_DATE', date: date.add(amount, 'day')})
  return (
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

        <TaskListWrapper children={
          tasksOfDay.length
          ? tasksOfDay.map((task, i) => <Task key={i} {...task} />)
          : 'No task on this day'
        } />
      </Main>

      <Hotkey keys={'h'} onKeyDown={() => moveDate(-1)} />
      <Hotkey keys={'j'} onKeyDown={() => moveDate(7)} />
      <Hotkey keys={'k'} onKeyDown={() => moveDate(-7)} />
      <Hotkey keys={'l'} onKeyDown={() => moveDate(1)} />
    </MainLayout>
  )
}
