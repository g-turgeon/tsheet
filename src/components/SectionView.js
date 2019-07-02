import React, { Fragment, useContext } from 'react'
import styled from 'styled-components'
import { StoreContext } from 'components/store'
import { Block, Time } from 'components/generic'

const tasksTotalTime = tasks => tasks.reduce((total, task) => ( total + task.total), 0)

const SectionName = styled.div`
  font-weight: bold;
`

const TimeDifference = ({ value }) => (value < 0)
  ? <span style={{color: 'red'}}><Time value={value} /></span>
  : <span style={{color: 'MediumSeaGreen'}}>+<Time value={value} /></span>

const SectionElement = styled(({ name, expectedTime, tasks, ...props }) => {
  const total = tasksTotalTime(tasks)

  return (
    <Block {...props}>
      <SectionName children={name} />
      {expectedTime !== null && (<Block><TimeDifference value={total - expectedTime} /></Block>)}
      <Block><Time value={total} /></Block>
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

  const sectionItems = Object.values(sections).map(section => <SectionElement key={section.name} {...section} />)
  const timeDifference = expectedTimeDifferenceTotal(Object.values(sections))

  return (
    <Fragment>
      {sectionItems}
      <TimeDifference value={timeDifference} />
    </Fragment>
  )
}

