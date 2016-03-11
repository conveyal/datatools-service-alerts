import React from 'react'

import { Grid, Row, Col, Button } from 'react-bootstrap'

import CreateAlert from '../containers/CreateAlert'
import VisibleAlertsList from '../containers/VisibleAlertsList'

import GtfsMap from '../gtfs/gtfsmap'

export default class AlertsViewer extends React.Component {

  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div>
        <Grid>
          <Row>
            <Col xs={12}>
              <CreateAlert />
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <VisibleAlertsList />
            </Col>
            <Col xs={6}>
              <GtfsMap
                feeds = {this.props.editableFeeds}
                onStopClick = {this.props.onStopClick}
              />
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}
