import React from 'react'
import moment from 'moment'

import { Panel, Grid, Row, Col, ButtonGroup, Button, Glyphicon, Label } from 'react-bootstrap'

export default class AlertPreview extends React.Component {

  constructor (props) {
    super(props)
  }

  render () {
    return (
      <Panel collapsible header={
        <Row>
          <Col xs={8}>
            <strong>{this.props.alert.title}</strong>
          </Col>
          <Col xs={4}>
            <ButtonGroup className='pull-right'>
              <Button onClick={() => this.props.onEditClick(this.props.alert)}>
                <Glyphicon glyph="pencil" />
              </Button>
              <Button onClick={() => this.props.onZoomClick(this.props.alert)}>
                <Glyphicon glyph="search" />
              </Button>
              <Button onClick={() => this.props.onDeleteClick(this.props.alert)}>
                <Glyphicon glyph="remove" />
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
      }>
        <p>
          <i>{moment(this.props.alert.start).format('MMM Do YYYY, h:mm:ssa')} to {moment(this.props.alert.end).format('MMM Do YYYY, h:mm:ssa')} </i>
          {this.props.alert.published
            ? <Label className='pull-right'>published</Label>
            : <Label className='pull-right'>unpublished</Label>}
        </p>
        <p>{this.props.alert.description}</p>
        <p>URL: <a href={this.props.alert.url} target="_blank">{this.props.alert.url}</a></p>
      </Panel>
    )
  }
}
