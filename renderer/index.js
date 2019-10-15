import fs from 'fs'
import { ipcRenderer } from 'electron'
import chokidar from 'chokidar'
import React, { Fragment, useContext, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import styled, { css, createGlobalStyle } from 'styled-components'
import timesheetParse from './timesheet-parser'
import Hotkey from './components/Hotkey'
import StoreContext, { StoreProvider } from './components/store'
import SectionView from './components/SectionView'
import TaskView from './components/TaskView'
import EverhourLog from './components/EverhourLog'
import Projects from './components/Projects'

const useIPCEvent = (event, callback) => {
  const callbackRef = useRef()

  callbackRef.current = callback

  useEffect(() => {
    console.log('Run')

    const handler = (event, data) => { callbackRef.current(data) }
    ipcRenderer.on(event, handler)
    return () => ipcRenderer.off(event, handler)
  }, [event])
}

// TODO Change filename

const actions = {
  setData: data  => ({type: 'SET_DATA', data})
}

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    border: none;
    outline: none;
    background: transparent;
    color: inherit;
    font-family: inherit;
    font-size: inherit;
  }

  body {
    font-size: 12px;
    font-family: Cantarell, sans-serif;
    color: #333;
  }
`
const useFileWatch = path => {
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


const Main = ({ filename }) => {
  const [ state, dispatch ] = useContext(StoreContext)
  const [ sections, setSections ] = useState({})
  const [ tasks, setTasks ] = useState([])
  const [ page, setPage ] = useState('tasks')

  const content = useFileWatch(filename)

  useEffect(() => {
    if (content) {
      const data = timesheetParse(content)
      dispatch(actions.setData(data))
    }
  }, [content])

  return (
    <Fragment>
      {page === 'sections' && <SectionView />}
      {page === 'tasks' && <TaskView />}
      {page === 'everhour' && <EverhourLog />}
      {page === 'projects' && <Projects />}

      <Hotkey keys={'s'} onKeyDown={() => setPage('sections')} />
      <Hotkey keys={'t'} onKeyDown={() => setPage('tasks')} />
      <Hotkey keys={'e'} onKeyDown={() => setPage('everhour')} />
      <Hotkey keys={'p'} onKeyDown={() => setPage('projects')} />
    </Fragment>
  )
}

const Layout = ({ filename }) => {
  return (
    <Fragment>
      <GlobalStyle />
      <StoreProvider children={<Main filename={filename} />} />
    </Fragment>
  )
}

const container = document.createElement('div')
document.body.appendChild(container)

ipcRenderer.once('file-load', (event, data) => {
  ReactDOM.render(<Layout filename={data} />, container)
})

