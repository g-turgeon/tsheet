import React from 'react'
import styled from 'styled-components'

import { Block, Time, Duration } from './generic'

const Container = styled(Block)`
  width: 96px;
  height: 96px;
  text-align: center;
  line-height: 1;
`

const MonthLabel = styled(Block)`
  font-size: 12px;
  color: var(--light-red);
  font-weight: 600;
  text-transform: uppercase
`

const MonthDate = styled(Block)`
  font-size: 42px;
  margin: 4px 0 4px;
`

const WeekDayLabel = styled(Block)`
  color: var(--normal-white);
  font-size: 14px;
`

export default ({ date }) => {
  return (
    <Container>
      <MonthLabel children={date.format('MMMM')} />
      <MonthDate children={date.format('D')} />
      <WeekDayLabel children={date.format('YYYY')} />
    </Container>
  )
}
