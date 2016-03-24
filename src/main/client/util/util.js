export function getFeed(feeds, id) {
  return feeds.find((feed) => feed.defaultGtfsId === id )
}

export function getFeedId(feed){
	return feed.defaultGtfsId
}

// export function getMode(modes, id) {
//   return modes.find((mode) => mode.gtfsType === +id )
// }