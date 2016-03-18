import { push } from 'react-router-redux'
import { browserHistory } from 'react-router'

import moment from 'moment'

// alerts management action

let nextAlertId = 0
let nextStopEntityId = 100

export function createAlert (entity) {
  return function (dispatch, getState) {
    nextAlertId--
    let entities = []

    if (entity) {
      nextStopEntityId++
      let type = typeof entity.stop_id !== 'undefined' ? 'STOP' : 'ROUTE'
      let newEntity = {
        id: nextStopEntityId,
        type: type
      }
      const typeKey = type.toLowerCase()
      newEntity[typeKey] = entity
      entities.push(newEntity)
    }

    const alert = {
      id: nextAlertId,
      title: 'New Alert',
      affectedEntities: entities,
      published: false,
      start: moment().unix()*1000,
      end: moment().add(30, 'day').unix()*1000
    }

    dispatch(updateActiveAlert(alert))
    browserHistory.push('/newalert')
  }
}

/*export const createAlert = (entity) => {
  nextAlertId--
  let entities = []
  if (entity) {
    nextStopEntityId++
    let type = typeof entity.stop_id !== 'undefined' ? 'STOP' : 'ROUTE'
    let newEntity = {
      id: nextStopEntityId,
      type: type
    }
    const typeKey = type.toLowerCase()
    newEntity[typeKey] = entity
    entities.push(newEntity)
  }
  return {
    type: 'CREATE_ALERT',
    alert: {
      id: nextAlertId,
      title: 'New Alert',
      affectedEntities: entities,
      published: false
    }
  }
}*/

/*export const saveAlert = (alert) => {
  return {
    type: 'SAVE_ALERT',
    alert
  }
}*/

/*export const editAlert = (alert) => {
  return {
    type: 'EDIT_ALERT',
    alert
  }
}*/

export const deleteAlert = (alert) => {
  return {
    type: 'DELETE_ALERT',
    alert
  }
}

export const requestRtdAlerts = () => {
  return {
    type: 'REQUEST_RTD_ALERTS',
  }
}


export const receivedRtdAlerts = (rtdAlerts, activeProject) => {
  return {
    type: 'RECEIVED_RTD_ALERTS',
    rtdAlerts,
    activeProject
  }
}

export function fetchRtdAlerts() {
  return function (dispatch, getState) {
    dispatch(requestRtdAlerts())
    fetch(getState().config.rtdApi).then((res) => {
      return res.json()
    }).then((alerts) => {
      return dispatch(receivedRtdAlerts(alerts, getState().projects.active))
    })
  }
}

export const updateActiveAlert = (alert) => {
  return {
    type: 'UPDATE_ACTIVE_ALERT',
    alert
  }
}

export function editAlert(alert) {
  return function (dispatch, getState) {
    dispatch(updateActiveAlert(alert))
    browserHistory.push('/alert/'+alert.id)
  }
}

export function saveAlert(alert) {
  return function (dispatch, getState) {
    console.log('saving...')
    var json = {
      Id: null,
      HeaderText: alert.title || 'New Alert',
      DescriptionText: alert.description || '',
      Url: alert.url || '',
      Cause: alert.cause || 'UNKNOWN_CAUSE',
      Effect: alert.effect || 'UNKNOWN_EFFECT',
      Published: 'No',
      StartDateTime: alert.start/1000 || 0,
      EndDateTime: alert.end/1000 || 0,
      ServiceAlertEntities: alert.affectedEntities.map((entity) => {
        console.log('ent', entity)
        return {
          Id: entity.id,
          AlertId: alert.id,
          AgencyId: entity.agency ? entity.agency.defaultGtfsId : null,
          RouteId: entity.route ? entity.route.route_id : null,
          RouteType: entity.mode ? entity.mode.gtfsType : null,
          StopId: entity.stop ? entity.stop.stop_id : null,
          TripId: null,
          ServiceAlertTrips: []
        }
      })
    }

    console.log('saving', alert.id, json)
    const url = getState().config.rtdApi + (alert.id < 0 ? '' : '/' + alert.id)
    const method = alert.id < 0 ? 'post' : 'put'
    console.log('url/method', url, method)
    fetch(url, {
      method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(json)
    }).then((res) => {
      console.log('status='+res.status)
      browserHistory.push('/')
      dispatch(fetchRtdAlerts())
    })
  }
}
