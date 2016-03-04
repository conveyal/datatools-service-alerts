import update from 'react-addons-update'

const visibilityFilter = (state = {
  searchText: null,
  filter: 'ALL'
}, action) => {
  switch (action.type) {
    case 'SET_VISIBILITY_SEARCH_TEXT':
      return update(state, {searchText: {$set: action.text}})
    case 'SET_VISIBILITY_FILTER':
      return update(state, {filter: {$set: action.filter}})
    default:
      return state
  }
}

export default visibilityFilter
