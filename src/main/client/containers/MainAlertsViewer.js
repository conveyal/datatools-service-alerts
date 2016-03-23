import React from 'react'
import { connect } from 'react-redux'

import AlertsViewer from '../components/AlertsViewer'

import { createAlert } from '../actions/alerts'

const mapStateToProps = (state, ownProps) => {
  return {
    activeFeeds: state.gtfsFilter.activeFeeds,
    allFeeds: state.gtfsFilter.allFeeds
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onStopClick: (stop, agency) => dispatch(createAlert(stop, agency)),
    onRouteClick: (route, agency) => dispatch(createAlert(route, agency)),
  }
}

const MainAlertsViewer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AlertsViewer)

export default MainAlertsViewer
