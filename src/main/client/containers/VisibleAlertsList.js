import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

import { editAlert } from '../actions/alerts'
import { setVisibilitySearchText, setVisibilityFilter } from '../actions/visibilityFilter'

import AlertsList from '../components/AlertsList'

const getVisibleAlerts = (alerts, visibilityFilter) => {
  let visibleAlerts = alerts.filter(alert =>
    alert.title.toLowerCase().indexOf((visibilityFilter.searchText || '').toLowerCase()) !== -1)
  let now = moment()
  switch (visibilityFilter.filter) {
    case 'ALL':
      return visibleAlerts
    case 'ACTIVE':
      return visibleAlerts.filter(alert =>
        moment(alert.start).isBefore(now) && moment(alert.end).isAfter(now))
    case 'FUTURE':
      return visibleAlerts.filter(alert => moment(alert.start).isAfter(now))
    case 'ARCHIVED':
      return visibleAlerts.filter(alert => moment(alert.end).isBefore(now))
    case 'DRAFT':
      return visibleAlerts.filter(alert => !alert.published)
  }
  return visibleAlerts
}

const mapStateToProps = (state, ownProps) => {
  return {
    alerts: getVisibleAlerts(state.alerts, state.visibilityFilter),
    visibilityFilter: state.visibilityFilter
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onEditClick: (alert) => dispatch(editAlert(alert)),
    searchTextChanged: (text) => dispatch(setVisibilitySearchText(text)),
    visibilityFilterChanged: (filter) => dispatch(setVisibilityFilter(filter))
  }
}

const VisibleAlertsList = connect(
  mapStateToProps,
  mapDispatchToProps
)(AlertsList)

export default VisibleAlertsList