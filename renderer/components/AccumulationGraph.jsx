import React, { Fragment } from 'react'
import styled from 'styled-components'

const SVG = styled.svg`
  background: #333344;
  transform: scaleY(-1);
  padding: 20px 0;
`

const Bar = styled.rect.attrs(({ value, index, width }) => ({
  x: index * width,
  y: value < 1 ? value : 0,
  height: Math.abs(value)
}))`
  fill: ${({ value }) => value > 0 ? 'mediumseagreen' : 'tomato'};
`

export default ({ data }) => {
  const minValue = Math.min(...data)
  const maxValue = Math.max(...data)
  const range = maxValue - minValue

  const bars = data.map((value, index) => (
    <Bar key={index} value={value} index={index} width={1} />
  ))

  return (
    <Fragment>
      <SVG preserveAspectRatio={'none'} height={128} width={'100%'} viewBox={`${0} ${minValue} ${data.length} ${range}`}>
        {bars}
      </SVG>
    </Fragment>
  )
}
