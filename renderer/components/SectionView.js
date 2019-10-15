import { last } from 'lodash'
import React, { Fragment, useContext } from 'react'
import styled from 'styled-components'
import StoreContext from './store'
import { Block, Time } from './generic'
import AccumulationGraph from './AccumulationGraph'

const Duration = ({ value }) => {
  const hours = Math.floor(value / 60)
  const minutes = value % 60
  return `${hours && `${hours}h\u00a0` || ''}${minutes && `${minutes}m` || ''}`
}

const tasksTotalTime = tasks => tasks.reduce((total, task) => total + task.total, 0)

const SectionName = styled(Block)`
  font-weight: 600;
  font-size: 16px;
`
const Panel = styled(Block)`
  margin: 10px;
`

const Table = styled(Block)`
  display: table;
  min-width: 512px;
`

const ActualTime = styled(Block)`
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 4px;
`

const ExpectedTime = styled(Block)`
  font-size: 14px;
`

const TimeDifference = styled(({ value, ...props }) => ((value < 0)
  ? <Block {...props} style={{color: 'tomato'}}>-<Duration value={-value} /></Block>
  : <Block {...props} style={{color: 'MediumSeaGreen'}}><Duration value={value} /></Block>
))`
  font-size: 16px;
  font-weight: 600;
`

const SectionElement = styled(({ name, expectedTime, tasks, total, ...props }) => {
  const sectionTotal = tasksTotalTime(tasks)

  return (
    <Block {...props}>
      <SectionName children={name} />
      <Block>
        <ActualTime><Duration value={sectionTotal} /></ActualTime>
        <ExpectedTime><Duration value={expectedTime} /></ExpectedTime>
      </Block>
      <Block><TimeDifference value={expectedTime && sectionTotal - expectedTime} /></Block>
      <Block><TimeDifference value={total} /></Block>
    </Block>
  )
})`
  display: table-row;

  > div {
    display: table-cell;
    padding: 16px;
    vertical-align: middle;
    border-top: 2px solid #eee;
  }
`

const expectedTimeDifferenceTotal = sections => sections.reduce((difference, section) => {
  if (section.expectedTime !== null) {
    return difference + (tasksTotalTime(section.tasks) - section.expectedTime)
  }

  return difference
}, 0)

export default () => {
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

