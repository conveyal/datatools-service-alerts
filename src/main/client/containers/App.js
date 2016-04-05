import React from 'react'
import { connect } from 'react-redux'
import { Router, Route } from 'react-router'

import NoAccessScreen from '../components/NoAccessScreen'
import MainAlertsViewer from '../containers/MainAlertsViewer'
import ActiveAlertEditor from '../containers/ActiveAlertEditor'

import { checkExistingLogin, userLoggedIn } from '../actions/user'
import { fetchConfig } from '../actions/config'

import '../style.css'

class App extends React.Component {

  constructor (props) {
    super(props)

    // this.props.fetchConfig().then(() => {
    //   return this.props.checkExistingLogin()
    // })
  }

  componentDidMount() {
    // this.props.fetchConfig().then(() => {
    //   return this.props.checkExistingLogin()
    // })
    this.props.fetchConfig()
      .then(() => {
        this.props.checkExistingLogin()
        .then((action) => {
          console.log('got config + login')
        })
      })
  }
  render () {
    let canAccess = false, noAccessReason
    if(this.props.user.profile === null) {
      noAccessReason = 'NOT_LOGGED_IN'
    }
    else if(!this.props.user.permissions.hasProjectPermission(this.props.config.activeProjectId, 'edit-alert')) {
      noAccessReason = 'INSUFFICIENT_PERMISSIONS'
    }
    else {
      canAccess = true
    }

    return (
      <div>
        {!canAccess
          ? <NoAccessScreen reason={noAccessReason} />
          : <Router history={this.props.history}>
            <Route path='/' component={MainAlertsViewer} />
            <Route path='/newalert' component={ActiveAlertEditor} />
            <Route path='/alert/:alertId' component={ActiveAlertEditor} />
          </Router>
        }
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user,
    config: state.config
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchConfig: () => dispatch(fetchConfig()),
    checkExistingLogin: () => dispatch(checkExistingLogin())
  }
}

App = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

export default App
