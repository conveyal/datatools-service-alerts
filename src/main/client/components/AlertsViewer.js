import React from 'react'

import { Grid, Row, Col, Button } from 'react-bootstrap'

import CreateAlert from '../containers/CreateAlert'
import VisibleAlertsList from '../containers/VisibleAlertsList'

import GlobalGtfsFilter from '../containers/GlobalGtfsFilter'
import GtfsMapSearch from '../gtfs/gtfsmapsearch'

export default class AlertsViewer extends React.Component {

  constructor (props) {
    super(props)
    console.log("AV activeFeeds", this.props.activeFeeds);
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
              <GlobalGtfsFilter />
              <GtfsMapSearch
                feeds={this.props.activeFeeds}
                onStopClick={this.props.onStopClick}
                onRouteClick={this.props.onRouteClick}
                popupAction='Create Alert for'
              />
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}
