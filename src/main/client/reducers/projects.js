import update from 'react-addons-update'

const projects = (state = {
  isFetching: false,
  active: null,
  all: []
}, action) => {
  switch (action.type) {
    case 'REQUEST_PROJECTS':
      return update(state, { isFetching: { $set: true }})
    case 'RECEIVE_PROJECTS':
      const activeIndex = action.projects.findIndex(p => p.id === action.activeProjectId)
      return {
        isFetching: false,
        all: action.projects,
        active: activeIndex !== -1 ? action.projects[activeIndex] : null
      }
    default:
      return state
  }
}

export default projects
