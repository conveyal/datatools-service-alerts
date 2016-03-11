const user = (state = null, action) => {
  switch (action.type) {
    case 'USER_LOGGED_IN':
      return action.user
    default:
      return state
  }
}

export default user
