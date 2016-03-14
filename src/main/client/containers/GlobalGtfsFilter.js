import React from 'react'
import { connect } from 'react-redux'

import GtfsFilter from '../gtfs/GtfsFilter'

import { addActiveFeed, removeActiveFeed, addAllActiveFeeds, removeAllActiveFeeds } from '../actions/gtfsFilter'

const mapStateToProps = (state, ownProps) => {
  return {
    activeFeeds: state.gtfsFilter.activeFeeds,
    allFeeds: state.gtfsFilter.allFeeds
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onAddFeed: (feed) => dispatch(addActiveFeed(feed)),
    onRemoveFeed: (feed) => dispatch(removeActiveFeed(feed)),
    onAddAllFeeds: () => dispatch(addAllActiveFeeds()),
    onRemoveAllFeeds: () => dispatch(removeAllActiveFeeds())
  }
}

const GlobalGtfsFilter = connect(
  mapStateToProps,
  mapDispatchToProps
)(GtfsFilter)

export default GlobalGtfsFilter
