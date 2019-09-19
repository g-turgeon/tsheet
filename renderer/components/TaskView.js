import dayjs from 'dayjs'
import React, { Fragment, useContext, useState } from 'react'
import styled from 'styled-components'
import Hotkey from './Hotkey'
import StoreContext from './store'
import { Block, Time } from './generic'
import Calendar from './Calendar'
import { selectByDate, selectByWeek, groupByDate, tasksTotal } from '../selectors'

const DATE_FORMAT = 'YYYY-MM-DD'
const LONG_DATE = 'ddd, MMMM D, YYYY'

const Layout = styled(Block)`
  display: grid;
  width: 100vw;
  height: 100vh;
  grid: auto / 0fr 1fr;
  overflow: hidden;
`

const Header = styled(Block)`
  padding: 20px;
`

const Main = styled(Block)`
  display: grid;
  grid: 0fr 1fr / auto;
  height: 100vh;
`

const DayTitle = styled(Block)`
  font-size: 16px;
  margin-bottom: 4px;
`

const TaskListWrapper = styled(Block)`
  background: #efefef;
  padding: 20px;
  overflow-y: scroll;
`

const Big = styled(Block)`
  padding: 2px 10px;
`

const Small = styled(Block)`
  padding: 2px 10px;
  font-size: 10px;
`
const Path = styled(Small)`
  background: #efefef;
`

const TimeBlock = styled(Block)`
  text-align: right;
`

const Task = styled(({ start, end, total, path, description, ...props }) => {
  return (
    <Block {...props}>
      <TimeBlock>
        <Small><Time value={start} /> - <Time value={end} /></Small>
        <Big><Time value={total} /></Big>
      </TimeBlock>
      <Block>
        <Path children={path} />
        <Big>{description}</Big>
      </Block>
    </Block>
  )
})`
  display: flex;
  margin: 1px 0;
  border-radius: 2px;
  padding: 10px;
  background-color: #fff;
  border-left: 3px solid red;
`
// -------------------------------------
const Board = styled(Block)`
  position: relative;
  height: 288px;
  width: 100px;
  background: #eee;
  margin: 2px;

  ${({ active }) => active && `
    background: #ddd;
  `}
`

const Container = styled(Block)`
  display: flex;
`

const BoardBlock = styled(({ start, duration, className }) => {
  const style = {
    top: Math.round(start / 5) + 'px',
    height: Math.round(duration / 5) + 'px'
  }

  return <div className={className} style={style} />
})`
  position: absolute;
  background: dodgerblue;
  width: 100%;
`

const DetailedDay = ({ date, tasks = [], active = false }) => {
  const blocks = tasks.map((task, id) => (<BoardBlock key={id} start={task.start} duration={task.total} />))

  return (
    <div>
      <header style={{textAlign: 'center'}}>
        <p>{date.format('ddd')}</p>
        <p>{date.format('MMM D')}</p>
      </header>
      <Board active={active}>{blocks}</Board>
    </div>
  )
}



const WeekSchedule = ({ date, tasks }) => {
  const startOfWeek = date.startOf('week')

  const detailedDays = [...Array(7)].map((v, i) => {
    const current = startOfWeek.add(i, 'day')
    return <DetailedDay date={current} key={i} active={current.format(DATE_FORMAT) === date.format(DATE_FORMAT)} tasks={tasks[current.format(DATE_FORMAT)]} />
  })

  return (<Container>{detailedDays}</Container>)
}

export default () => {
  const [ state, dispatch ] = useContext(StoreContext)
  const { data: { tasks, sections }, date } = state

  const tasksOfDay = selectByDate(tasks, date.format(DATE_FORMAT))
  const tasksOfWeek = selectByWeek(tasks, date.format(DATE_FORMAT))
  const groupedTasksOfWeek = groupByDate(tasksOfWeek)


  const moveDate = amount =>
    dispatch({type: 'SET_DATE', date: date.add(amount, 'day')})


  return (
    <Layout>
      <Header>
        <Calendar date={date} />
      </Header>

      <Main>
        <Header>
          <DayTitle children={date.format(LONG_DATE)} />
          <Block>
            <Block><Time value={tasksTotal(tasksOfDay)} /> / <Time value={tasksTotal(tasksOfWeek)} /></Block>
          </Block>
        </Header>

        <div>
          <WeekSchedule date={date} tasks={groupedTasksOfWeek} />
        </div>

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
    </Layout>
  )
}
