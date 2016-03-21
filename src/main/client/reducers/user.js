import update from 'react-addons-update'

import { Auth0Manager, UserPermissions } from 'datatools-common'

const user = (state = {
  auth0: null,
  isCheckingLogin: true,
  token: null,
  profile: null,
  permissions: null
}, action) => {
  switch (action.type) {
    case 'CHECKING_EXISTING_LOGIN':
      return update(state, { isCheckingLogin: { $set: true }})
    case 'NO_EXISTING_LOGIN':
      return update(state, { isCheckingLogin: { $set: false }})
    case 'USER_LOGGED_IN':
      return update(state, {
        isCheckingLogin: { $set: false },
        token: { $set: action.token },
        profile: { $set: action.profile },
        permissions: { $set: new UserPermissions(action.profile.app_metadata.datatools)}
      })
    case 'RECEIVE_CONFIG':
      return update(state, { auth0: { $set: new Auth0Manager(action.config) }})
    default:
      return state
  }
}

export default user
