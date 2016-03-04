// alerts management action

let nextAlertId = 0
let nextStopEntityId = 100

export const createAlert = (initialStop) => {
  nextAlertId++
  let entities = []
  if (initialStop) {
    nextStopEntityId++
    entities.push({
      id: nextStopEntityId,
      type: 'STOP',
      stop: initialStop
    })
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
