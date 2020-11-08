import React, { useEffect } from 'react'
import { fromEvent, merge } from 'rxjs'
import { filter, tap } from 'rxjs/operators'

const HotKey = ({ keys, disabled = false, preventDefault = false, onKeyDown, onKeyUp }) => {
  useEffect(() => {
    const keydown$ = fromEvent(window, 'keydown', event => {
      preventDefault && event.preventDefault()
      return event
    }).pipe(
      filter(event => event.key === keys),
      tap(onKeyDown)
    )

    const keyup$ = fromEvent(window, 'keyup', event => {
      preventDefault && event.preventDefault()
      return event
    }).pipe(
      filter(event => event.key === keys),
      tap(onKeyUp)
    )

    const subscription = merge(keydown$, keyup$).subscribe()

    return () => subscription.unsubscribe()
  })

  return null
}

export default HotKey
