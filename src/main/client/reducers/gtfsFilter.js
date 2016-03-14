import update from 'react-addons-update'
import config from '../config'

const gtfsFilter = (state = {
  allFeeds: [],
  activeFeeds: []
}, action) => {
  let activeFeeds

  switch (action.type) {
    case 'USER_LOGGED_IN':
      let activeIndex = action.projects.findIndex(p => p.id == config.activeProjectId)
      if(activeIndex !== -1) {
        let userFeeds = []
        if(action.user.permissions.isProjectAdmin(config.activeProjectId)) {
          userFeeds = action.projects[activeIndex].feeds
        }
        else if(action.user.permissions.hasProjectPermission(config.activeProjectId, 'edit-alert')) {
          const permission = action.user.permissions.getProjectPermission(config.activeProjectId, 'edit-alert')
          let userFeedIds = permission.feeds || action.user.permissions.getProjectDefaultFeeds(config.activeProjectId)
          userFeeds = action.projects[activeIndex].feeds.filter((feed) => {
            return userFeedIds.indexOf(feed.id) !== -1
          })
        }
        //const permission = t
        let validatedFeeds = userFeeds.filter((feed) => {
          return feed.latestVersionId !== undefined
        })
        return update(state, {
          allFeeds: {$set: validatedFeeds},
          activeFeeds: {$set: validatedFeeds}
        })
      }

    case 'ADD_ACTIVE_FEED':
      activeFeeds = [
        ...state.activeFeeds,
        action.feed
      ]
      return update(state, {activeFeeds: {$set: activeFeeds}})

    case 'REMOVE_ACTIVE_FEED':
      let foundIndex = state.activeFeeds.findIndex(f => f.id === action.feed.id)
      if(foundIndex !== -1) {
        activeFeeds = [
          ...state.activeFeeds.slice(0, foundIndex),
          ...state.activeFeeds.slice(foundIndex + 1)
        ]
        return update(state, {activeFeeds: {$set: activeFeeds}})
      }
      return update(state, {activeFeeds: {$set: activeFeeds}})

    case 'ADD_ALL_ACTIVE_FEEDS':
      return update(state, {activeFeeds: {$set: state.allFeeds}})

    case 'REMOVE_ALL_ACTIVE_FEEDS':
      return update(state, {activeFeeds: {$set: []}})

    default:
      return state
  }
}

export default gtfsFilter
