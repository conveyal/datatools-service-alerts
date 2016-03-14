import React from 'react'
import { connect } from 'react-redux'

import { saveAlert, deleteAlert } from '../actions/alerts'
import { setActiveTitle, setActiveDescription, setActiveUrl, setActiveCause,
  setActiveEffect, setActiveStart, setActiveEnd, setActivePublished,
  addActiveEntity, deleteActiveEntity, updateActiveEntity } from '../actions/activeAlert'

import AlertEditor from '../components/AlertEditor'

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
    editableFeeds: state.projects.active.feeds.sort(agencyCompare)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
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
    onAddEntityClick: (type, value) => dispatch(addActiveEntity(type, value)),
    onDeleteEntityClick: (entity) => dispatch(deleteActiveEntity(entity)),
    entityUpdated: (entity, field, value) => dispatch(updateActiveEntity(entity, field, value))
  }
}

const ActiveAlertEditor = connect(
  mapStateToProps,
  mapDispatchToProps
)(AlertEditor)

export default ActiveAlertEditor
