import dayjs from 'dayjs'
import React, { Fragment, useContext, useState } from 'react'
import styled from 'styled-components'
import { StoreContext } from 'components/store'
import Hotkey from 'components/Hotkey'
import { Block, Time } from 'components/generic'
import Calendar from 'components/Calendar'
import { selectByDate, selectByWeek, tasksTotal } from 'selectors'

const DATE_FORMAT = 'YYYY-MM-DD'
const LONG_DATE = 'dddd, MMMM D, YYYY'

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

export default () => {
  const [ state, dispatch ] = useContext(StoreContext)
  const { data: { tasks }, date } = state

  const moveDate = amount =>
    dispatch({type: 'SET_DATE', date: date.add(amount, 'day')})

  const tasksOfDay = selectByDate(tasks, date.format(DATE_FORMAT))
  const tasksOfWeek = selectByWeek(tasks, date.format(DATE_FORMAT))

  return (
    <Layout>
      <Header>
        <Calendar date={date} />
      </Header>

      <Main>
        <Header>
          <DayTitle children={date.format(LONG_DATE)} />
          <Block>
            <Time value={tasksTotal(tasksOfDay)} /> / <Time value={tasksTotal(tasksOfWeek)} />
          </Block>
        </Header>

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
