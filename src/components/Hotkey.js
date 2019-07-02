import React, {Component} from 'react'
import keyboardJS from 'keyboardjs'

/**
 * Wraps the Keyboard JS module into a React Component
 */
export default class KeyHandler extends Component {
  onKeyDown(event) {
    const {disabled = false, enabled = true, onKeyDown, preventDefault = false} = this.props

    if (!disabled && enabled && onKeyDown) {
      if (preventDefault) {
        event.preventDefault()
      }
      onKeyDown(event)
    }
  }

  onKeyUp(event) {
    const {disabled = false, enabled = true, onKeyUp, preventDefault = false} = this.props

    if (!disabled && enabled && onKeyUp) {
      if (preventDefault) {
        event.preventDefault()
      }
      onKeyUp(event)
    }
  }

  componentDidMount() {
    const {keys} = this.props

    this.onKeyDown = ::this.onKeyDown
    this.onKeyUp = ::this.onKeyUp

    keyboardJS.on(keys, this.onKeyDown, this.onKeyUp)
  }

  componentWillUnmount() {
    const {keys, onKeyDown, onKeyUp} = this.props
    keyboardJS.off(keys, this.onKeyDown, this.onKeyUp)
  }

  render() {
    return null
  }
}
