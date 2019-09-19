import React, { Fragment, useContext } from 'react'
import styled from 'styled-components'
import StoreContext from './store'
import { Block, Time } from './generic'

const tasksTotalTime = tasks => tasks.reduce((total, task) => ( total + task.total), 0)

const SectionName = styled.div`
  font-weight: bold;
`
const Panel = styled(Block)`
  margin: 10px;
`

const TimeDifference = ({ value }) => (value < 0)
  ? <span style={{color: 'red', fontWeight: 'bold'}}>-<Time value={value} /></span>
  : <span style={{color: 'MediumSeaGreen', fontWeight: 'bold'}}>+<Time value={value} /></span>

const SectionElement = styled(({ name, expectedTime, tasks, ...props }) => {
  const total = tasksTotalTime(tasks)

  return (
    <Block {...props}>
      <SectionName children={name} />
      <Block><Time value={total} /></Block>
      {expectedTime !== null && (<Block><TimeDifference value={total - expectedTime} /></Block>)}
    </Block>
  )
})`
  border: 1px solid #efefef;
  display: grid;
  max-width: 400px;
  grid: auto / 1fr 0fr 0fr;

  & + & {
    margin-top: -1px;
  }

  > div {
    padding: 10px;
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

  const sectionItems = sectionList.map(section => <SectionElement key={section.name} {...section} />)
  const currentDifference = expectedTimeDifferenceTotal(sectionList)
  const lastSectionDifference = expectedTimeDifferenceTotal(sectionList.slice(0, -1))

  return (
    <Fragment>
      <Panel>
        <p>Current difference: <TimeDifference value={currentDifference} /></p>
        <p>Last section difference: <TimeDifference value={lastSectionDifference} /></p>
      </Panel>
      <Panel>
        {Array.from(sectionItems).reverse()}
      </Panel>
    </Fragment>
  )
}

