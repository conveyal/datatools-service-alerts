import React from 'react'
import { connect } from 'react-redux'

import { fetchProjects } from '../actions/projects'
import { saveAlert, deleteAlert, createAlert, setActiveAlert } from '../actions/alerts'
import { setActiveTitle, setActiveDescription, setActiveUrl, setActiveCause,
  setActiveEffect, setActiveStart, setActiveEnd, setActivePublished,
  addActiveEntity, deleteActiveEntity, updateActiveEntity } from '../actions/activeAlert'

import AlertEditor from '../components/AlertEditor'

import { getFeedsForPermission } from '../util/util'

const agencyCompare = function(a, b) {
  if (a.name < b.name)
    return -1;
  if (a.name > b.name)
    return 1;
  return 0;
}
const mapStateToProps = (state, ownProps) => {
  return {
    alert: state.activeAlert,
    activeFeeds: state.gtfsFilter.activeFeeds,
    project: state.projects.active,
    user: state.user,
    editableFeeds: getFeedsForPermission(state.projects.active, state.user, 'edit-alert'),
    publishableFeeds: getFeedsForPermission(state.projects.active, state.user, 'approve-alert')
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onComponentMount: (initialProps) => {
      console.log(initialProps)

      if (initialProps.alert === null && initialProps.location.pathname === '/newalert'){
        console.log('alert', initialProps.alert)
        return dispatch(createAlert())
      }
      if (initialProps.alert === null && initialProps.location.pathname !== '/newalert') {
        console.log('need to set active alert')
        dispatch(fetchProjects())
        .then(() => {
          console.log('done fetching projects')
          const alertId = initialProps.location.pathname.split('/alert/')[1]
          console.log('getting', alertId)
          dispatch(setActiveAlert(+alertId))
        })
      }
    },
    onSaveClick: (alert) => dispatch(saveAlert(alert)),
    onDeleteClick: (alert) => dispatch(deleteAlert(alert)),
    onPublishClick: (alert, published) => dispatch(setActivePublished(published)),
    titleChanged: (title) => dispatch(setActiveTitle(title)),
    descriptionChanged: (title) => dispatch(setActiveDescription(title)),
    urlChanged: (title) => dispatch(setActiveUrl(title)),
    causeChanged: (cause) => dispatch(setActiveCause(cause)),
    effectChanged: (effect) => dispatch(setActiveEffect(effect)),
    startChanged: (start) => dispatch(setActiveStart(start)),
    endChanged: (end) => dispatch(setActiveEnd(end)),
    onAddEntityClick: (type, value, agency) => dispatch(addActiveEntity(type, value, agency)),
    onDeleteEntityClick: (entity) => dispatch(deleteActiveEntity(entity)),
    entityUpdated: (entity, field, value, agency) => dispatch(updateActiveEntity(entity, field, value, agency)),

    editorStopClick: (stop, agency) => dispatch(addActiveEntity('STOP', stop, agency)),
    editorRouteClick: (route, agency) => dispatch(addActiveEntity('ROUTE', route, agency))
  }
}

const ActiveAlertEditor = connect(
  mapStateToProps,
  mapDispatchToProps
)(AlertEditor)

export default ActiveAlertEditor
