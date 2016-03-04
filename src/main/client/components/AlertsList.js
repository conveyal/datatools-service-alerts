import React from 'react'

import { Row, Col, ButtonGroup, Button, Input } from 'react-bootstrap'
import AlertPreview from './AlertPreview'

export default class AlertsList extends React.Component {

  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div>
        <Row>
          <Input
            type="text"
            placeholder="Search Alerts"
            onChange={evt => this.props.searchTextChanged(evt.target.value)}
          />
        </Row>
        <Row>
          <ButtonGroup justified>
            <Button
              bsStyle={this.props.visibilityFilter.filter === 'ALL' ? 'primary' : 'default'}
              onClick={() => this.props.visibilityFilterChanged('ALL')}
              href="#">All</Button>
            <Button
              bsStyle={this.props.visibilityFilter.filter === 'ACTIVE' ? 'primary' : 'default'}
              onClick={() => this.props.visibilityFilterChanged('ACTIVE')}
              href="#">Active</Button>
            <Button
              bsStyle={this.props.visibilityFilter.filter === 'FUTURE' ? 'primary' : 'default'}
              onClick={() => this.props.visibilityFilterChanged('FUTURE')}
              href="#">Future</Button>
            <Button
              bsStyle={this.props.visibilityFilter.filter === 'ARCHIVED' ? 'primary' : 'default'}
              onClick={() => this.props.visibilityFilterChanged('ARCHIVED')}
              href="#">Archived</Button>
            <Button
              bsStyle={this.props.visibilityFilter.filter === 'DRAFT' ? 'primary' : 'default'}
              onClick={() => this.props.visibilityFilterChanged('DRAFT')}
              href="#">Draft</Button>
          </ButtonGroup>
          <div className="form-group">&nbsp;</div>
        </Row>
        <Row>
        {this.props.alerts.map((alert) => {
          return <AlertPreview
            alert={alert}
            key={alert.id}
            onEditClick={this.props.onEditClick}
            onZoomClick={this.props.onZoomClick}
            onDeleteClick={this.props.onDeleteClick}
          />
        })}
        </Row>
      </div>
    )
  }
}
