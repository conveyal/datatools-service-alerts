import { combineReducers } from 'redux'

import user from './user'
import projects from './projects'
import alerts from './alerts'
import activeAlert from './activeAlert'
import visibilityFilter from './visibilityFilter'

const alertsApp = combineReducers({
  user,
  projects,
  alerts,
  activeAlert,
  visibilityFilter
})

export default alertsApp
