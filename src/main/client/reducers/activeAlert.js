import update from 'react-addons-update'

const activeAlert = (state = null, action) => {
  let entities, foundIndex
  switch (action.type) {
    case 'CREATE_ALERT':
    case 'EDIT_ALERT':
      return action.alert
    case 'SAVE_ALERT':
    case 'DELETE_ALERT':
    case 'SET_ACTIVE_PUBLISHED':
      return null

    case 'SET_ACTIVE_TITLE':
      return update(state, {title: {$set: action.title}})
    case 'SET_ACTIVE_DESCRIPTION':
      return update(state, {description: {$set: action.description}})
    case 'SET_ACTIVE_URL':
      return update(state, {url: {$set: action.url}})
    case 'SET_ACTIVE_CAUSE':
      return update(state, {cause: {$set: action.cause}})
    case 'SET_ACTIVE_EFFECT':
      return update(state, {effect: {$set: action.effect}})
    case 'SET_ACTIVE_START':
      return update(state, {start: {$set: parseInt(action.start)}})
    case 'SET_ACTIVE_END':
      return update(state, {end: {$set: parseInt(action.end)}})
    case 'SET_ACTIVE_PUBLISHED':
      return update(state, {published: {$set: action.published}})

    case 'ADD_ACTIVE_AFFECTED_ENTITY':
      entities = [...state.affectedEntities, action.entity]
      return update(state, {affectedEntities: {$set: entities}})
    case 'SET_ACTIVE_AFFECTED_ENTITY_TYPE':
      console.log('change type', action.entity, action.entityType)
      foundIndex = state.affectedEntities.findIndex(e => e.id === action.entity.id)
      if(foundIndex !== -1) {
        let updatedEntity = update(action.entity, {type: {$set: action.entityType}})
        entities = [
          ...state.affectedEntities.slice(0, foundIndex),
          updatedEntity,
          ...state.affectedEntities.slice(foundIndex + 1)
        ]
        return update(state, {affectedEntities: {$set: entities}})
      }
      return state
    case 'DELETE_ACTIVE_AFFECTED_ENTITY':
      foundIndex = state.affectedEntities.findIndex(e => e.id === action.entity.id)
      if(foundIndex !== -1) {
        entities = [
          ...state.affectedEntities.slice(0, foundIndex),
          ...state.affectedEntities.slice(foundIndex + 1)
        ]
        return update(state, {affectedEntities: {$set: entities}})
      }
      return state

    default:
      return state
  }
}

export default activeAlert