import React from 'react'
import { connect } from 'react-redux'

import { saveAlert, deleteAlert } from '../actions/alerts'
import { setActiveTitle, setActiveDescription, setActiveUrl, setActiveCause,
  setActiveEffect, setActiveStart, setActiveEnd, setActivePublished,
  addActiveEntity, deleteActiveEntity, setActiveEntityType } from '../actions/activeAlert'

import AlertEditor from '../components/AlertEditor'

const mapStateToProps = (state, ownProps) => {
  return {
    alert: state.activeAlert,
    editableFeeds: state.projects.active.feeds
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
    onAddEntityClick: () => dispatch(addActiveEntity()),
    onDeleteEntityClick: (entity) => dispatch(deleteActiveEntity(entity)),
    entityTypeChanged: (entity, type) => dispatch(setActiveEntityType(entity, type))
  }
}

const ActiveAlertEditor = connect(
  mapStateToProps,
  mapDispatchToProps
)(AlertEditor)

export default ActiveAlertEditor
