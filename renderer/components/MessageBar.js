import React, { Component, Fragment } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const Container = styled.div`
  display: flex;
  margin: 10px;
`

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid black;
`

const Button = styled.button`
  padding: 15px;
  background-color: black;
  color: white;
  min-width: 60px;
`

export default class MessageBar extends Component {
  static propTypes = {
    onSend: PropTypes.func.isRequired
  }

  state = {value: ''}

  send() {
    const { value } = this.state
    const { onSend } = this.props
    onSend && onSend({
      type: 'message',
      content: value,
      date: Date.now(),
      origin: 'sent'
    })
  }

  keyHandle(event) {
    if (event.key === 'Enter') {
      this.send()
    }
  }

  valueChange(event) {
    this.setState({value: event.target.value})
  }

  render() {
    return (
      <Container>
        <Input type={'text'} onKeyDown={::this.keyHandle} onChange={::this.valueChange} />
        <Button onClick={::this.send}>Send</Button>
      </Container>
    )
  }
}

