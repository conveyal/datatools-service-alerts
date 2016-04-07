export const getFeed = (feeds, id) => {
  // console.log(feeds, id)
  const feed = feeds.find(f => f.externalProperties.MTC.AgencyId === id)
  return feed
}

export const getFeedId = (feed) => {
  // console.log(feed)
  return feed.externalProperties.MTC.AgencyId
}

// export const FEEDID = 'defaultGtfsId'

// export function getMode(modes, id) {
//   return modes.find((mode) => mode.gtfsType === +id )
// }


export const getFeedsForPermission = (project, user, permission) => {
  return project && project.feeds ? project.feeds.filter((feed) => {
    return user.permissions.hasFeedPermission(project.id, feed.id, permission) !== null
  }) : []
}

// ensure list of feeds contains all agency IDs for set of entities
export const checkEntitiesForFeeds = (entities, feeds) => {
  let publishableIds = feeds.map(f => f.id)
  let entityIds = entities.map(e => e.agency.id)
  for (var i = 0; i < entityIds.length; i++) {
    if (publishableIds.indexOf(entityIds[i]) === -1) return false
  }
  return true
}
