import React, { Component, Fragment } from 'react'
import styled, { css, createGlobalStyle } from 'styled-components'
import Hotkey from 'components/Hotkey'

const Input = styled.input`
  display: block;
  height: 24px;
  padding: 0 8px;
  background: white;
  box-shadow: inset 0 0 3px #00000020;

  ${({ stretch }) => stretch && `
    width: 100%;
  `}
`

export default class extends Component {
  state = {value: ''}

  complete() {
    const { onChangeComplete } = this.props
    const value = this.state.value

    onChangeComplete && onChangeComplete(value)
  }

  componentDidMount() {
    this.setState({value: this.props.value})
  }

  onChange(event) {
    const { onChange } = this.props
    const value = event.target.value
    this.setState({value})
    onChange && onChange(value)
  }

  render() {
    const { value, stretch = false } = this.props

    return (
      <Fragment>
        <Hotkey keys={'enter'} onKeyDown={::this.complete} />
        <Input ref={'input'} stretch={stretch} defaultValue={value} onChange={::this.onChange} onBlur={::this.complete} />
      </Fragment>
    )
  }
}
