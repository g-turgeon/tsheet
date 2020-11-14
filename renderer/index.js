import { ipcRenderer } from 'electron'
import React, { Fragment, useContext, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'

import Hotkey from './components/Hotkey'
import GlobalStyle from './components/GlobalStyle'
import timesheetParse from './timesheet-parser'
import StoreContext, { StoreProvider } from './components/store'
import SectionView from './components/SectionView'
import TaskView from './components/TaskView'
import EverhourLog from './components/EverhourLog'
import Projects from './components/Projects'
import useFileWatch from './hooks/file-watch'

const actions = {
  setData: data  => ({type: 'SET_DATA', data})
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

ipcRenderer.once('file-load', (event, filename) => {
  document.head.title = filename
  ReactDOM.render(<Layout filename={filename} />, container)
})
