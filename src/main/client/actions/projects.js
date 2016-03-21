import fetch from 'isomorphic-fetch'

import { DataManager } from 'datatools-common'

import { updateGtfsFilter } from './gtfsFilter'
import { fetchRtdAlerts } from './alerts'

function requestProjects() {
  return {
    type: 'REQUEST_PROJECTS',
  }
}

function receiveProjects(projects, activeProjectId) {
  return {
    type: 'RECEIVE_PROJECTS',
    projects,
    activeProjectId
  }
}

export function fetchProjects() {
  return function (dispatch, getState) {
    dispatch(requestProjects())
    const dm = new DataManager({ managerUrl : getState().config.managerUrl })
    dm.getProjectsAndFeeds(getState().user).then((projects) => {
      console.log('got projects!', projects)
      return dispatch(receiveProjects(projects, getState().config.activeProjectId))
    }).then(() => {
      console.log('updating filter')
      dispatch(updateGtfsFilter(getState().projects.active, getState().user))
      return dispatch(fetchRtdAlerts())
    })
  }
}
