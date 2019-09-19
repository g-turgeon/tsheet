import dayjs from 'dayjs'
import uniqid from 'uniqid'
import { uniq } from 'lodash'
import { clipboard } from 'electron'
import React, { Fragment, createContext, useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Block, Time } from './generic'
import StoreContext from './store'
import { selectByDate, tasksTotal, groupByProject } from '../selectors'
import { timeFormat } from '../utils'

export default ({ data }) => {
  const [ state, dispatch ] = useContext(StoreContext)
  const { tasks } = state.data

  const tasksByProject = groupByProject(tasks)

  const totalsByProject = Object.entries(tasksByProject).map(([ projectName, tasks ]) => ({
    name: projectName,
    total: tasksTotal(tasks)
  }))

  return (
    <Fragment>
      <p>Projects</p>
      <ul>
        {totalsByProject.map(({name, total}) => <li key={name}>{name} <Time value={total} /></li>)}
      </ul>
    </Fragment>
  )
}
