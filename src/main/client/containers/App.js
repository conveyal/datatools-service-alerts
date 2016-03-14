import React from 'react'
import { connect } from 'react-redux'

import DatatoolsNavbar from 'datatools-navbar'
import { Auth0Manager, DataManager } from 'datatools-common'

import AlertsViewer from '../components/AlertsViewer'
import NoAccessScreen from '../components/NoAccessScreen'
import ActiveAlertEditor from './ActiveAlertEditor'

import { addActiveEntity } from '../actions/activeAlert'
import { createAlert, receivedRtdAlerts } from '../actions/alerts'
import { userLoggedIn } from '../actions/user'

import config from '../config'

import '../style.css'

class App extends React.Component {

  constructor (props) {
    super(props)

    this.auth0 = new Auth0Manager(config)
    this.dataManager = new DataManager({
      managerUrl : config.managerUrl
    })

    var login = this.auth0.checkExistingLogin()
    if (login) this.handleLogin(login)
  }


  handleLogin (loginPromise) {
    var projectsPromise = loginPromise.then((user) => {
      // retrieve all projects (feed collections) and populate feeds for the default project
      return this.dataManager.getProjectsAndFeeds(user)
    })

    /*var alertsPromise = fetch(config.rtdApi).then((res) => {
      return res.json()
    })*/

    Promise.all([loginPromise, projectsPromise]).then((results) => {
      let user = results[0]
      let projects = results[1]

      //let rtdAlerts = results[2]
      //console.log('got api alerts', rtdAlerts)
      this.props.userLoggedIn(user, projects)
      //this.props.receivedRtdAlerts(rtdAlerts)
    })
  }

  render () {

    let canAccess = false, noAccessReason
    if(this.props.user === null) {
      noAccessReason = 'NOT_LOGGED_ID'
    }
    else if(!this.props.user.permissions.hasProjectPermission(config.activeProjectId, 'edit-alert')) {
      noAccessReason = 'INSUFFICIENT_PERMISSIONS'
    }
    else {
      canAccess = true
    }

    return (
      <div>
        <DatatoolsNavbar
          title={config.title}
          managerUrl={config.managerUrl}
          editorUrl={config.editorUrl}
          userAdminUrl={config.userAdminUrl}
          username={ this.props.user ? this.props.user.profile.email : null }
          loginHandler={() => { console.log('login'); this.handleLogin(this.auth0.loginViaLock()) }}
          logoutHandler={() => { this.auth0.logout() }}
          resetPasswordHandler={() => { this.auth0.resetPassword() }}
        />
        {!canAccess
          ? <NoAccessScreen reason={noAccessReason} />
          : this.props.activeAlert !== null
            ? <ActiveAlertEditor
              onStopClick={this.props.editorStopClick}
              onRouteClick={this.props.editorRouteClick}
            />
            : <AlertsViewer
              activeFeeds={this.props.activeFeeds}
              onStopClick={this.props.onStopClick}
              onRouteClick={this.props.onRouteClick}
            />
        }
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user,
    activeAlert: state.activeAlert,
    activeFeeds: state.gtfsFilter.activeFeeds
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    userLoggedIn: (user, projects) => dispatch(userLoggedIn(user, projects)),
    onStopClick: (stop) => dispatch(createAlert(stop)),
    onRouteClick: (route) => dispatch(createAlert(route)),
    editorStopClick: (stop) => dispatch(addActiveEntity('STOP', stop)),
    editorRouteClick: (route) => dispatch(addActiveEntity('ROUTE', route)),
    receivedRtdAlerts: (rtdAlerts) => dispatch(receivedRtdAlerts(rtdAlerts)),
  }
}

App = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

export default App
