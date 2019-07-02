import React, { Component, Fragment } from 'react'
import styled from 'styled-components'
import Input from 'components/Input'
import Hotkey from 'components/Hotkey'
import { boxShadow } from 'style-utils'

const FullScreen = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  z-index: 999;
`

const Backdrop = styled(FullScreen)`
  // background: #00000020;
`

const Wrapper = styled(FullScreen)`
  display: flex;
  justify-content: center;
  align-items: center;
`

const Container = styled.div`
  width: 300px;
  padding: 10px;
  border-radius: 3px;
  background: white;
  ${boxShadow('#00000020')};
`

const Field = styled.div`
  margin: 20px 20px;
`

const Label = styled.label`
  display: block;
  margin-bottom: 4px;
  font-weight: bold;
`

export default class extends Component {
  state = {}

  updateProp(key, value) {
    this.setState({[key]: value})
  }

  complete() {
    const { onComplete } = this.props
    onComplete && onComplete(this.state)
  }

  componentDidMount() {
    const { title = '', artist = '', album = '', year = '' } = this.props.data.tags || {}
    this.setState({title, artist, album, year})
  }

  render() {
    const { title, artist, album, year } = this.state
    const { filename } = this.props

    return (
      <Fragment>
        <Backdrop />
        <Wrapper>
          <Container>
            <Field>
              <Label>Filename</Label>
              <div>{filename}</div>
            </Field>

            <Field>
              <Label>Title</Label>
              <Input value={title} stretch onChange={value => this.updateProp('title', value)} />
            </Field>

            <Field>
              <Label>Artist</Label>
              <Input value={artist} stretch onChange={value => this.updateProp('artist', value)} />
            </Field>

            <Field>
              <Label>Album</Label>
              <Input value={album} stretch onChange={value => this.updateProp('album', value)} />
            </Field>

            <Field>
              <Label>Year</Label>
              <Input value={year} stretch onChange={value => this.updateProp('year', value)} />
            </Field>
          </Container>
        </Wrapper>

        <Hotkey keys={'enter'} onKeyDown={::this.complete} />
      </Fragment>
    )
  }
}
