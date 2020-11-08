import { last } from 'lodash'
import React, { Fragment, useContext } from 'react'
import styled from 'styled-components'

import StoreContext from './store'
import AccumulationGraph from './AccumulationGraph'
import Calendar from './Calendar'
import CalendarDate from './CalendarDate'
import Hotkey from './Hotkey'
import MainLayout from './MainLayout'
import Panel from './Panel'
import WeekSummary from './WeekSummary'
import { Block, Time, Duration } from './generic'
import { selectByDate, selectByWeek, groupByDate, groupByPath, tasksTotal } from '../selectors'

const DATE_FORMAT = 'YYYY-MM-DD'
const LONG_DATE = 'ddd, MMMM D, YYYY'

const tasksTotalTime = tasks => tasks.reduce((total, task) => total + task.total, 0)

const Main = styled(Block)`
  display: grid;
  grid: auto 1fr / auto 1fr auto;
  grid-gap: 8px;
  overflow: hidden;
  width: 100%;
  height: 100%;
`

const SectionName = styled.div`
  font-weight: 600;
`

const Table = styled(Block)`
  display: table;
`

const ActualTime = styled.span`
  font-weight: 600;
`

const ExpectedTime = styled.span`
  font-size: 14px;
`
const Cell = styled(Block)`
  padding: 8px;
  vertical-align: middle;
`

const NumberCell = styled(Cell)`
  display: table-cell;
`

const TimeDifference = styled(({ value, ...props }) => ((value < 0)
  ? <Block {...props} style={{color: 'var(--normal-red)'}}>-<Duration value={-value} /></Block>
  : <Block {...props} style={{color: 'var(--normal-green)'}}><Duration value={value} /></Block>
))`
  font-weight: 600;
`

const SectionElement = styled(({ name, expectedTime, tasks, total, ...props }) => {
  const sectionTotal = tasksTotalTime(tasks)

  return (
    <Block {...props}>
      <Cell><SectionName>{name}</SectionName></Cell>
      <NumberCell><Duration value={sectionTotal} /> <span style={{color: 'var(--normal-white)'}}>/ <Duration value={expectedTime} /></span></NumberCell>
      <NumberCell><TimeDifference value={expectedTime && sectionTotal - expectedTime} /></NumberCell>
      <NumberCell><TimeDifference value={total} /></NumberCell>
    </Block>
  )
})`
  display: table-row;
  font-size: 12px;
`

const expectedTimeDifferenceTotal = sections => sections.reduce((difference, section) => {
  if (section.expectedTime !== null) {
    return difference + (tasksTotalTime(section.tasks) - section.expectedTime)
  }

  return difference
}, 0)

const Hello = () => {
  const [ state, dispatch ] = useContext(StoreContext)
  const { data: { sections, tasks } } = state

  const sectionList = Object.values(sections)

  const accumulation = sectionList.reduce((acc, current) => {
    const total = last(acc) || 0

    const diff = (current.expectedTime)
      ? tasksTotalTime(current.tasks) - current.expectedTime
      : 0

    return [...acc, total + diff]
  }, [])

  const sectionItems = sectionList.map((section, index) => (
    <SectionElement key={section.name} {...section} total={accumulation[index]} />
  ))

  const currentDifference = expectedTimeDifferenceTotal(sectionList)
  const lastSectionDifference = expectedTimeDifferenceTotal(sectionList.slice(0, -1))

  return (
    <Fragment>
      <AccumulationGraph data={accumulation.map(value => value / 60)} />

      <Table>
        {Array.from(sectionItems).reverse()}
      </Table>
    </Fragment>
  )
}

export default () => {
  const [ state, dispatch ] = useContext(StoreContext)
  const { data: { tasks, sections }, date } = state

  const tasksOfDay = selectByDate(tasks, date.format(DATE_FORMAT))

  const moveDate = amount => dispatch({type: 'SET_DATE', date: date.add(amount, 'day')})

  const sectionList = Object.values(sections)

  const accumulation = sectionList.reduce((acc, current) => {
    const total = last(acc) || 0

    const diff = (current.expectedTime)
      ? tasksTotalTime(current.tasks) - current.expectedTime
      : 0

    return [...acc, total + diff]
  }, [])

  const sectionItems = sectionList.map((section, index) => (
    <SectionElement key={section.name} {...section} total={accumulation[index]} />
  ))

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

        <Panel style={{gridColumn: '1 / 4', overflowY: 'auto'}}>
          <Table>
            {Array.from(sectionItems).reverse()}
          </Table>
        </Panel>
      </Main>

      <Hotkey keys={'h'} onKeyDown={() => moveDate(-1)} />
      <Hotkey keys={'j'} onKeyDown={() => moveDate(7)} />
      <Hotkey keys={'k'} onKeyDown={() => moveDate(-7)} />
      <Hotkey keys={'l'} onKeyDown={() => moveDate(1)} />
    </MainLayout>
  )
}
