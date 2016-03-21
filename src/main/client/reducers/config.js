const config = (state = {
  isFetching: false
}, action) => {
  switch (action.type) {
    case 'REQUEST_CONFIG':
      return {
        isFetching: true
      }
    case 'RECEIVE_CONFIG':
      let config = Object.assign({}, action.config, {
        isFetching: false
      })
      return config
    default:
      return state
  }
}

export default config
