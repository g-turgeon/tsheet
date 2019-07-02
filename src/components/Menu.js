import React, { Component, Fragment } from 'react'
import styled from 'styled-components'
import Hotkey from 'components/Hotkey'
import { boxShadow } from 'style-utils'

const Backdrop = styled.div`
  position: fixed;
  z-index: 999;
  width: 100vw
  height: 100vh;
`

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 999;
  width: 100vw
  height: 100vh;
`

const MenuElement = styled.ul`
  padding: 10px;
  background: white;
  list-style: none;
  width: 140px;
  border-radius: 3px;
  ${boxShadow('#00000020')};
`

const ItemElement = styled.li`
  display: flex;
  padding: 6px;

  span:first-child {
    margin-right: 20px;
    font-weight: bold;
  }
`

const Item = ({ content, action, keys = null }) => (
  <Fragment>
    <ItemElement onClick={action}><span>{keys}</span> <span>{content}</span></ItemElement>
    <Hotkey keys={keys} onKeyDown={action} />
  </Fragment>
)

export default class Menu extends Component {
  close() {

  }

  render() {
    const { items } = this.props

    const itemElements = items.map(({ content, action, keys }, i) => (
      <Item key={i} content={content} action={action} keys={keys} />
    ))

    return (
      <Fragment>
        <Backdrop onClick={::this.close} />

        <Container>
          <MenuElement>{itemElements}</MenuElement>
        </Container>
      </Fragment>
    )
  }
}
