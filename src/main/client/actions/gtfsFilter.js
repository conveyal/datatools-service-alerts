export const addActiveFeed = (feed) => {
  return {
    type: 'ADD_ACTIVE_FEED',
    feed
  }
}

export const removeActiveFeed = (feed) => {
  return {
    type: 'REMOVE_ACTIVE_FEED',
    feed
  }
}

export const addAllActiveFeeds = () => {
  return {
    type: 'ADD_ALL_ACTIVE_FEEDS'
  }
}

export const removeAllActiveFeeds = () => {
  return {
    type: 'REMOVE_ALL_ACTIVE_FEEDS'
  }
}
