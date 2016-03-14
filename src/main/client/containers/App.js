import React from 'react'
import { connect } from 'react-redux'

import DatatoolsNavbar from 'datatools-navbar'
import { Auth0Manager, DataManager } from 'datatools-common'

import AlertsViewer from '../components/AlertsViewer'
import NoAccessScreen from '../components/NoAccessScreen'
import ActiveAlertEditor from './ActiveAlertEditor'

import { createAlert } from '../actions/alerts'
import { addActiveEntity } from '../actions/activeAlert'
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

    Promise.all([loginPromise, projectsPromise]).then((results) => {
      let user = results[0]
      let projects = results[1]

      this.props.userLoggedIn(user, projects)
    })
  }

  render () {
    return (
      <div>
        <DatatoolsNavbar
          title={config.title}
          managerUrl={config.managerUrl}
          editorUrl={config.editorUrl}
          userAdminUrl='www.conveyal.com'
          username={ this.props.user ? this.props.user.profile.email : null }
          loginHandler={() => { console.log('login'); this.handleLogin(this.auth0.loginViaLock()) }}
          logoutHandler={() => { this.auth0.logout() }}
          resetPasswordHandler={() => { this.auth0.resetPassword() }}
        />
        {this.props.user === null
          ? <NoAccessScreen />
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
    editorRouteClick: (route) => dispatch(addActiveEntity('ROUTE', route))
  }
}

App = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

export default App
