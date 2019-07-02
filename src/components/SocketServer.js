import net from 'net'
import fs from 'fs'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class extends Component {
  static propTypes = {
    path: PropTypes.string,
    onMessage: PropTypes.func,
  }

  componentDidMount() {
    const { path } = this.props

    const server = net.createServer()

    fs.unlinkSync(path)

    server.listen(path, () => {
      this.props.onMessage({
        type: 'event',
        event: 'start',
        date: Date.now()
      })
    })

    server.on('connection', connection => {
      this.props.onMessage({
        type: 'event',
        event: 'connection',
        date: Date.now(),
        connection
      })

      connection.on('data', data => {
        this.props.onMessage({
          type: 'message',
          content: data.toString(),
          date: Date.now(),
          connection,
          origin: 'received'
        })
      })

      connection.on('close', () => {
        this.props.onMessage({
          type: 'event',
          event: 'disconnection',
          date: Date.now(),
          connection
        })
      })
    })
  }

  render() {
    return null
  }
}
