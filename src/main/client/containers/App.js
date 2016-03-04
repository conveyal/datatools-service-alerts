import React from 'react'
import { connect } from 'react-redux'

import DatatoolsNavbar from 'datatools-navbar'
import AlertsViewer from '../components/AlertsViewer'
import ActiveAlertEditor from './ActiveAlertEditor'

import { createAlert } from '../actions/alerts'

import config from '../config'

import '../style.css'

class App extends React.Component {

  constructor (props) {
    super(props)
  }

  logIn () { }

  logOut () { }

  resetPassword () { }

  render () {
    return (
      <div>
        <DatatoolsNavbar
          title={config.title}
          managerUrl={config.managerUrl}
          editorUrl={config.editorUrl}
          userAdminUrl='www.conveyal.com'
          username={null}
          loginHandler={this.logIn.bind(this)}
          logoutHandler={this.logOut.bind(this)}
          resetPasswordHandler={this.resetPassword.bind(this)}
        />
        {this.props.activeAlert !== null
          ? <ActiveAlertEditor />
          : <AlertsViewer onStopClick={this.props.onStopClick} />}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    activeAlert: state.activeAlert
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onStopClick: (stop) => dispatch(createAlert(stop))
  }
}

App = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

export default App
