import { connect } from 'net'
import { useRef } from 'react'

export const useSocket = (path, callbacks) => {
  const pathRef = useRef(null)
  const connectionRef = useRef(null)

  // Exit if the path is not valid
  if (!path || pathRef.current === path) {
    return
  }

  const createConnection = () => {
    const connection = connect(path)

    connection.on('connect', () => {
      callbacks.connect(connection, path)
      connectionRef.current = connection
    })

    connection.on('error', () => {
      callbacks.fail(connection, path)
    })

    connection.on('end', () => {
      callbacks.disconnect(connection, path)
    })

    connection.on('data', data => {
      callbacks.onMessage(data.toString())
    })
  }

  pathRef.current = path

  console.log(`%cConnection to %c${path}`, 'color: dodgerBlue', 'color: darkOrange')

  if (connectionRef.current) {
    // Close the current connection if it is not destroyed already
    if (connectionRef.current.destroyed) {
      connectionRef.current.removeAllListeners()
      createConnection()
    } else {
      connectionRef.current.once('end', () => {
        connectionRef.current.removeAllListeners()
        createConnection()
      })
      connectionRef.current.end()
    }
  } else {
    // Create a new connection
    createConnection()
  }
}
