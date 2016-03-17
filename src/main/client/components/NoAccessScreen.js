import React from 'react'

import { Grid, Row, Col } from 'react-bootstrap'

import ManagerNavbar from '../containers/ManagerNavbar'

export default class NoAccessScreen extends React.Component {

  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div>
        <ManagerNavbar />
        <Grid>
          <Row>
            <Col xs={12}>
              {(() => {
                switch (this.props.reason) {
                  case 'NOT_LOGGED_IN': return <i>You must be logged in to access this area.</i>
                  case 'INSUFFICIENT_PERMISSIONS': return <i>This user does not have permission to access this area.</i>
                  default: return <i>Unable to Access Module</i>
                }
              })()}
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}
