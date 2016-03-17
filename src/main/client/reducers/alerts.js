import modes from '../modes'

const alerts = (state = {
  isFetching: false,
  all: []
}, action) => {
  let foundIndex
  switch (action.type) {
    /*case 'SAVE_ALERT':
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
      ]*/
      
    /*case 'DELETE_ALERT':
      foundIndex = state.findIndex(a => a.id === action.alert.id)
      if(foundIndex !== -1) {
        return [
          ...state.slice(0, foundIndex),
          ...state.slice(foundIndex + 1)
        ]
      }*/

    case 'REQUEST_RTD_ALERTS':
      return {
        isFetching: true,
        all: []
      }
    case 'RECEIVED_RTD_ALERTS':
      console.log('RECEIVED_RTD_ALERTS', action.rtdAlerts)
      const allAlerts = action.rtdAlerts.map((rtdAlert) => {

        //let activeIndex = action.projects.findIndex(p => p.id == config.activeProjectId)
        let project = action.activeProject // action.projects[activeIndex]

        let alert = {
          id: rtdAlert.Id,
          title: rtdAlert.HeaderText,
          description: rtdAlert.DescriptionText,
          cause: rtdAlert.Cause,
          effect: rtdAlert.Effect,
          url: rtdAlert.Url,
          start: rtdAlert.StartDateTime*1000,
          end: rtdAlert.EndDateTime*1000,
          published: rtdAlert.Published === "Yes",
          affectedEntities: rtdAlert.ServiceAlertEntities.map((ent) => {
            let entity = {
              id: ent.Id,
            }

            if(ent.AgencyId) {
              let feed = project.feeds.find(f => f.defaultGtfsId === ent.AgencyId)
              entity.agency = feed
              entity.type = 'AGENCY'
            }

            if(ent.RouteType) {
              let mode = modes.find(m => m.gtfsType === ent.RouteType)
              entity.mode = mode
              entity.type = 'MODE'
            }

            return entity
          })
        }
        return alert
      })

      return {
        isFetching: false,
        all: allAlerts
      }

    default:
      return state
  }
}

export default alerts
