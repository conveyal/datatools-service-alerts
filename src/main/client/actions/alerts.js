// alerts management action

let nextAlertId = 0
let nextStopEntityId = 100

export const createAlert = (entity) => {
  nextAlertId++
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
      title: 'New Alert #' + nextAlertId,
      affectedEntities: entities,
      published: false
    }
  }
}

export const saveAlert = (alert) => {
  return {
    type: 'SAVE_ALERT',
    alert
  }
}

export const editAlert = (alert) => {
  return {
    type: 'EDIT_ALERT',
    alert
  }
}

export const deleteAlert = (alert) => {
  return {
    type: 'DELETE_ALERT',
    alert
  }
}

export const receivedRtdAlerts = (rtdAlerts) => {
  return {
    type: 'RECEIVED_RTD_ALERTS',
    rtdAlerts
  }
}
