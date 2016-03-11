import React from 'react'
import { connect } from 'react-redux'

import DatatoolsNavbar from 'datatools-navbar'
import { Auth0Manager, DataManager } from 'datatools-common'

import AlertsViewer from '../components/AlertsViewer'
import NoAccessScreen from '../components/NoAccessScreen'
import ActiveAlertEditor from './ActiveAlertEditor'

import { createAlert } from '../actions/alerts'
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

    console.log('loaded auth0, dm')

    var login = this.auth0.checkExistingLogin()
    if (login) this.handleLogin(login)
  }


  handleLogin (loginPromise) {
    console.log('handleLogin');

    var projectsPromise = loginPromise.then((user) => {
      // retrieve all projects (feed collections) and populate feeds for the default project
      return this.dataManager.getProjectsAndFeeds(user)
    })

    Promise.all([loginPromise, projectsPromise]).then((results) => {
      let user = results[0]
      let projects = results[1]

      console.log('got user/proj', user, projects);
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
            ? <ActiveAlertEditor />
            : <AlertsViewer
              editableFeeds={this.props.editableFeeds}
              onStopClick={this.props.onStopClick}
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
    editableFeeds: state.projects.active ? state.projects.active.feeds : []
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    userLoggedIn: (user, projects) => dispatch(userLoggedIn(user, projects)),
    onStopClick: (stop) => dispatch(createAlert(stop))
  }
}

App = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

export default App
