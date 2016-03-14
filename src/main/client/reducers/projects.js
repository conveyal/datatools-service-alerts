import config from '../config'

const projects = (state = {
  active: null,
  all: []
}, action) => {
  switch (action.type) {
    case 'USER_LOGGED_IN':
      //var active = null
      /*for(var project of action.projects) {
        if(project.id === config.activeProjectId) {
          active = project
        }
      }*/
      let activeIndex = action.projects.findIndex(p => p.id == config.activeProjectId)

      return {
        all: action.projects,
        active: activeIndex !== -1 ? action.projects[activeIndex] : null
      }
    default:
      return state
  }
}

export default projects
