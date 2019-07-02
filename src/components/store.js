import dayjs from 'dayjs'
import React, { useReducer, createContext } from 'react'

const initialState = {
  date: dayjs(),
  data: {
    sections: {},
    tasks: []
  }
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_DATA': {
      const { data } = action
      return {...state, data}
    }

    case 'SET_DATE': {
      const { date } = action
      return {...state, date}
    }
  }

  return state
}

export const StoreContext = createContext()

export const StoreProvider = ({ children }) => {
  const [ state, dispatch ] = useReducer(reducer, initialState)
  return <StoreContext.Provider value={[state, dispatch]} children={children} />
}
