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

    default:
      return state
  }
}

export default alerts
