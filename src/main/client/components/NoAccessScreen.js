import React from 'react'

import { Grid, Row, Col } from 'react-bootstrap'

export default class NoAccessScreen extends React.Component {

  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div>
        <Grid>
          <Row>
            <Col xs={12}>
              You must be logged in to access this area.
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}
