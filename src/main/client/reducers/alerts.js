const alerts = (state = [], action) => {
  let foundIndex
  switch (action.type) {
    case 'SAVE_ALERT':
      // if alert exists, overwrite
      foundIndex = state.findIndex(a => a.id === action.alert.id)
      if(foundIndex !== -1) {
        return [
          ...state.slice(0, foundIndex),
          action.alert,
          ...state.slice(foundIndex + 1)
        ]
      }

      // otherwise, add new
      return [
        ...state,
        action.alert
      ]
    case 'DELETE_ALERT':
      foundIndex = state.findIndex(a => a.id === action.alert.id)
      if(foundIndex !== -1) {
        return [
          ...state.slice(0, foundIndex),
          ...state.slice(foundIndex + 1)
        ]
      }

    case 'RECEIVED_RTD_ALERTS':
      console.log('RECEIVED_RTD_ALERTS', action.rtdAlerts)
      return action.rtdAlerts.map((rtdAlert) => {
        return {
          id: rtdAlert.Id,
          title: rtdAlert.HeaderText,
          description: rtdAlert.DescriptionText,
          cause: rtdAlert.Cause,
          effect: rtdAlert.Effect,
          url: rtdAlert.Url,
          start: rtdAlert.StartDateTime*1000,
          end: rtdAlert.EndDateTime*1000,
          published: rtdAlert.Published === "Yes",
          affectedEntities: []
        }
      })

    default:
      return state
  }
}

export default alerts
