export function getFeed(feeds, id) {
  const feed = feeds.find((feed) => feed[FEEDID] === id )
  return feed
}

export function getFeedId(feed){
  return feed[FEEDID]
}

export const FEEDID = 'defaultGtfsId'

// export function getMode(modes, id) {
//   return modes.find((mode) => mode.gtfsType === +id )
// }


export const getFeedsForPermission = (projects, permissions, permission) => {
  if (projects.active !== null && typeof permissions !== 'undefined'){

    // return all feeds if user is admin
    if (typeof permissions.appPermissionLookup['administer-application'] !== 'undefined' && permissions.appPermissionLookup['administer-application'].type === 'administer-application'){
      return projects.active.feeds
    }
    // else filter by feeds listed in edit-alert permission
    else if (typeof permissions.projectLookup[projects.active.id] !== 'undefined'){
      console.log(permissions.projectLookup[projects.active.id])
      console.log(permissions.projectLookup[projects.active.id].permissions)
      
      const permissionObject = permissions.projectLookup[projects.active.id].permissions.find(p => p.type === permission)
      
      if (typeof permissionObject !== 'undefined')
        return projects.active.feeds.filter(f => permissionObject.feeds.indexOf(f.id) > -1)
      else
        return []
    }
    else{
      return []
    }
  }
  else{
    return []
  }
}