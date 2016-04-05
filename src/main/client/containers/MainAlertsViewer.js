import React from 'react'
import { connect } from 'react-redux'

import AlertsViewer from '../components/AlertsViewer'

import { createAlert } from '../actions/alerts'
import { fetchProjects } from '../actions/projects'

const mapStateToProps = (state, ownProps) => {
  return {
    activeFeeds: state.gtfsFilter.activeFeeds,
    allFeeds: state.gtfsFilter.allFeeds,
    alerts: state.alerts.all
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onComponentMount: (initialProps) => {
      console.log(initialProps)
      if (initialProps.alerts.length === 0) {
        console.log('fetching projects...')
        dispatch(fetchProjects())
      }

    },
    onStopClick: (stop, agency) => dispatch(createAlert(stop, agency)),
    onRouteClick: (route, agency) => dispatch(createAlert(route, agency)),
  }
}

const MainAlertsViewer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AlertsViewer)

export default MainAlertsViewer
