import fs from 'fs'
import React, { useRef, useState } from 'react'
import chokidar from 'chokidar'

export default path => {
  const [ currentContent, setCurrentContent ] = useState()
  const currentPath = useRef('')

  const watcher = useRef()

  if (path === '') {
    return
  }

  // Initial file read
  fs.readFile(path, 'utf8', (err, content) => setCurrentContent(content))

  if (!watcher.current || currentPath.current !== path) {
    currentPath.current = path

    watcher.current = chokidar.watch(path)

    watcher.current.on('change', path => {
      fs.readFile(path, 'utf8', (err, content) => setCurrentContent(content))
    })
  }

  return currentContent
}

