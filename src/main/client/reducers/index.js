import { combineReducers } from 'redux'

import activeAlert from './activeAlert'
import alerts from './alerts'
import gtfsFilter from './gtfsFilter'
import projects from './projects'
import user from './user'
import visibilityFilter from './visibilityFilter'

const alertsApp = combineReducers({
  activeAlert,
  alerts,
  gtfsFilter,
  projects,
  user,
  visibilityFilter
})

export default alertsApp
