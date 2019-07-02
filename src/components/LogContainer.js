import dayjs from 'dayjs'
import React, { Component, Fragment, createContext } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const ScrollContainer = styled.div`
  flex: 1;
  overflow-y: scroll;
`

const Container = styled.div`
  margin: 10px;
`

const MessageItem = styled.div`
  display: flex;
  margin: 2px;
  padding: 6px;
  background: #fafafa;
  justify-content: space-between;

  span:nth-child(2) {
    opacity: 0.5;
  }

  ${({ sent }) => sent && `color: dodgerblue;`}
`

const EventItem = styled(MessageItem)`
  padding: 0;
  background: transparent;
  color: ${({ color }) => color};

  span:nth-child(1),
  span:nth-child(3) {
    flex: 1;
    border-bottom: 1px solid ${({ color }) => color};
    height: 7px;
  }

  span:nth-child(2) {
    padding: 0 1em;
    opacity: 1;
  }
`

const events = {
  start: {content: 'Server start', color: '#6a39fa'},
  connection: {content: 'New connection', color: '#00c26e'},
  disconnection: {content: 'Disconnection', color: '#f02200'},
}

const Message = ({ content, date, origin }) => {
  return (
    <MessageItem sent={origin === 'sent'}>
      <span>{content} { origin }</span>
      <span>{dayjs(date).format('HH:mm:ss')}</span>
    </MessageItem>
  )
}

const Event = ({ event, date, ...info }) => {
  return (
    <EventItem color={events[event].color}>
      <span /><span>{events[event].content} ({dayjs(date).format('HH:mm:ss')})</span><span />
    </EventItem>
  )
}

export default class LogContainer extends Component {
  render() {
    const { messages } = this.props

    const messageElements = messages.map((message, index) => {
      const Element = message.type === 'message' ? Message : Event
      return <Element key={index} {...message} />
    })

    return (
      <ScrollContainer>
        <Container>{messageElements}</Container>
      </ScrollContainer>
    )
  }
}
