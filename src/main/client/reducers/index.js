import { combineReducers } from 'redux'

import alerts from './alerts'
import activeAlert from './activeAlert'
import visibilityFilter from './visibilityFilter'

const alertsApp = combineReducers({
  alerts,
  activeAlert,
  visibilityFilter
})

export default alertsApp
