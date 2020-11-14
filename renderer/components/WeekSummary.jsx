import React from 'react'
import styled from 'styled-components'

import { groupByDate, selectByWeek, tasksTotal } from '../selectors'
import { Block, Time, Duration } from './generic'

const DATE_FORMAT = 'YYYY-MM-DD'

const Container = styled(Block)`
  display: flex;
`

const BoardBlock = styled(({ start, duration, ...props }) => {
  const top = Math.round(start / 15)
  const height = Math.round(duration / 15)
  return <Block {...props} style={{top, height}} />
})`
  position: absolute;
  background: var(--light-black);
  width: 100%;
`

const Board = styled(Block)`
  position: relative;
  // height: 72px;
  height: 96px;
  width: 48px;
  background: var(--normal-black);

  ${({ active }) => active && `
    ${BoardBlock} {
      background: var(--accent);
    }
  `}
`

const WeekDay = styled(Block)`
  color: var(--normal-white);
`

const DateOfMonth = styled(Block)`
  font-weight: bold;
`

const DayLabelWrapper = styled(Block)`
  width: 48px;
  height: 48px;
  padding: 10px 0;
  margin: 0 auto;
  text-align: center;
  line-height: 1.2;
  color: var(--light-white);

  ${({ active }) => active && `
    background: var(--accent);

    ${DateOfMonth}, ${WeekDay} {
      color: var(--normal-black);
    }
  `}
`

const DayTotal = styled(Block)`
  color: var(--light-white);
  margin-top: 4px;
  font-size: 10px;
  text-align: center;

  ${({ active }) => active && `
    color: var(--accent);
  `}
`

const DaySchedule = styled(({ date, tasks = [], active = false, ...props }) => {
  const timeBlocks = tasks.map((task, id) => (<BoardBlock key={id} start={task.start} duration={task.total} />))
  const totalOfDay = tasksTotal(tasks)

  return (
    <Block {...props}>
      <DayLabelWrapper active={active}>
        <WeekDay children={date.format('ddd')} />
        <DateOfMonth children={date.format('D')} />
      </DayLabelWrapper>

      <Board active={active}>{timeBlocks}</Board>

      <DayTotal active={active}><Duration value={totalOfDay} /></DayTotal>
    </Block>
  )
})`
  margin: 0 2px;
`

export default ({ date, tasks = [] }) => {
  const tasksOfWeek = selectByWeek(tasks, date.format(DATE_FORMAT))
  const groupedTasksOfWeek = groupByDate(tasksOfWeek)
  const startOfWeek = date.startOf('week')

  const detailedDays = [...Array(7)].map((v, i) => {
    const current = startOfWeek.add(i, 'day')
    return (
      <DaySchedule
        key={i}
        date={current}
        active={current.format(DATE_FORMAT) === date.format(DATE_FORMAT)}
        tasks={groupedTasksOfWeek[current.format(DATE_FORMAT)]}
      />
    )
  })

  return (
    <Block>
      <Container>
        {detailedDays}
      </Container>

      <Block>
        <Duration value={tasksTotal(tasksOfWeek)} />
      </Block>
    </Block>
  )
}
