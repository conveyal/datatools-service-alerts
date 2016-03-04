// edit active alert actions

export const setActiveTitle = (title) => {
  return {
    type: 'SET_ACTIVE_TITLE',
    title
  }
}

export const setActiveDescription = (description) => {
  return {
    type: 'SET_ACTIVE_DESCRIPTION',
    description
  }
}

export const setActiveUrl = (url) => {
  return {
    type: 'SET_ACTIVE_URL',
    url
  }
}

export const setActiveCause = (cause) => {
  return {
    type: 'SET_ACTIVE_CAUSE',
    cause
  }
}

export const setActiveEffect = (effect) => {
  return {
    type: 'SET_ACTIVE_EFFECT',
    effect
  }
}

export const setActiveStart = (start) => {
  return {
    type: 'SET_ACTIVE_START',
    start
  }
}

export const setActiveEnd = (end) => {
  return {
    type: 'SET_ACTIVE_END',
    end
  }
}

export const setActivePublished = (published) => {
  return {
    type: 'SET_ACTIVE_PUBLISHED',
    published
  }
}

let nextEntityId = 0
export const addActiveEntity = () => {
  nextEntityId++
  return {
    type: 'ADD_ACTIVE_AFFECTED_ENTITY',
    entity: {
      id: nextEntityId,
      type: 'AGENCY'
    }
  }
}

export const deleteActiveEntity = (entity) => {
  return {
    type: 'DELETE_ACTIVE_AFFECTED_ENTITY',
    entity
  }
}

export const setActiveEntityType = (entity, entityType) => {
  return {
    type: 'SET_ACTIVE_AFFECTED_ENTITY_TYPE',
    entity,
    entityType
  }
}
