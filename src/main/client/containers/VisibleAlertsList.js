import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

import { editAlert, deleteAlert } from '../actions/alerts'
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
const getFeedsForPermission = (projects, permissions, permission) => {
  if (projects.active !== null && typeof permissions !== 'undefined'){

    // return all feeds if user is admin
    if (typeof permissions.appPermissionLookup['administer-application'] !== 'undefined' && permissions.appPermissionLookup['administer-application'].type === 'administer-application'){
      return projects.active.feeds
    }
    // else filter by feeds listed in edit-alert permission
    else if (typeof permissions.projectLookup[projects.active.id] !== 'undefined'){
      console.log(permissions.projectLookup[projects.active.id])
      console.log(permissions.projectLookup[projects.active.id].permissions)
      
      const permissionObject = permissions.projectLookup[projects.active.id].permissions.find(p => p.type === permission)
      
      if (typeof permissionObject !== 'undefined')
        return projects.active.feeds.filter(f => permissionObject.feeds.indexOf(f.id) > -1)
      else
        return []
    }
    else{
      return []
    }
  }
  else{
    return []
  }
}
const mapStateToProps = (state, ownProps) => {
  console.log('all alerts', state.alerts.all)
  return {
    isFetching: state.alerts.isFetching,
    alerts: getVisibleAlerts(state.alerts.all, state.visibilityFilter),
    visibilityFilter: state.visibilityFilter,
    editableFeeds: getFeedsForPermission(state.projects, state.user.permissions, 'edit-alert'),
    publishableFeeds: getFeedsForPermission(state.projects, state.user.permissions, 'publish-alert')
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onEditClick: (alert) => dispatch(editAlert(alert)),
    onDeleteClick: (alert) => dispatch(deleteAlert(alert)),
    searchTextChanged: (text) => dispatch(setVisibilitySearchText(text)),
    visibilityFilterChanged: (filter) => dispatch(setVisibilityFilter(filter))
  }
}

const VisibleAlertsList = connect(
  mapStateToProps,
  mapDispatchToProps
)(AlertsList)

export default VisibleAlertsList
