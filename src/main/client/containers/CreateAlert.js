import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'

import { createAlert } from '../actions/alerts'

let CreateAlert = ({ dispatch }) => {
  return (
    <Button
      bsStyle='primary'
      bsSize='large'
      onClick={() => {
        dispatch(createAlert())
      }}
      className='pull-right'
    >New Alert</Button>
  )
}

CreateAlert = connect()(CreateAlert)

export default CreateAlert
