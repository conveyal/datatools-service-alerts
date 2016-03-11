import config from '../config'

const projects = (state = {
  active: null,
  all: []
}, action) => {
  switch (action.type) {
    case 'USER_LOGGED_IN':
      var active = null
      for(var project of action.projects) {
        if(project.id === config.activeProjectId) {
          console.log('found active!')
          active = project
        }
      }

      return {
        all: action.projects,
        active
      }
    default:
      return state
  }
}

export default projects
