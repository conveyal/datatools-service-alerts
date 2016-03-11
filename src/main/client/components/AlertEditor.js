import React from 'react'

import { Grid, Row, Col, ButtonGroup, Button, Input, Panel } from 'react-bootstrap'
import DateTimeField from 'react-bootstrap-datetimepicker'

import AffectedEntity from './AffectedEntity'
import GtfsMap from '../gtfs/gtfsmap'

var causes = [
  'UNKNOWN_CAUSE',
  'TECHNICAL_PROBLEM',
  'STRIKE',
  'DEMONSTRATION',
  'ACCIDENT',
  'HOLIDAY',
  'WEATHER',
  'MAINTENANCE',
  'CONSTRUCTION',
  'POLICE_ACTIVITY',
  'MEDICAL_EMERGENCY',
  'OTHER_CAUSE'
]

var effects = [
  'UNKNOWN_EFFECT',
  'NO_SERVICE',
  'REDUCED_SERVICE',
  'SIGNIFICANT_DELAYS',
  'DETOUR',
  'ADDITIONAL_SERVICE',
  'MODIFIED_SERVICE',
  'STOP_MOVED',
  'OTHER_EFFECT'
]

export default class AlertEditor extends React.Component {

  render () {
    console.log(this.props.alert)
    return (
      <div>
        <Grid>
          <Row>
            <Col xs={4}>
              <Input
                type="text"
                label="Title"
                defaultValue={this.props.alert.title}
                onChange={evt => this.props.titleChanged(evt.target.value)}
              />
            </Col>
            <Col xs={5}>
              <Row>
                <Col xs={6}>
                  <div style={{marginBottom: '5px'}}><strong>Start</strong></div>
                  <DateTimeField
                    dateTime={this.props.alert.start}
                    onChange={time => this.props.startChanged(time)} />
                </Col>
                <Col xs={6}>
                  <div style={{marginBottom: '5px'}}><strong>End</strong></div>
                  <DateTimeField
                    dateTime={this.props.alert.end}
                    onChange={time => this.props.endChanged(time)} />
                </Col>
              </Row>
            </Col>

            <Col xs={3}>
              <ButtonGroup className='pull-right'>
                <Button onClick={(evt) => this.props.onSaveClick(this.props.alert)}>Save</Button>
                <Button onClick={(evt) => {
                  this.props.onPublishClick(this.props.alert, !this.props.alert.published)
                }}>
                  {this.props.alert.published ? 'Unpublish' : 'Publish'}</Button>
                <Button onClick={(evt) => this.props.onDeleteClick(this.props.alert)}>Delete</Button>
              </ButtonGroup>
            </Col>
          </Row>
          <Row>
            <Col xs={6}>

              <Row>
                <Col xs={6}>
                  <Input
                    type="select"
                    label="Cause"
                    onChange={(evt) => this.props.causeChanged(evt.target.value)}
                    value={this.props.alert.cause}
                  >
                    {causes.map((cause) => {
                      return <option value={cause}>{cause}</option>
                    })}
                  </Input>
                </Col>
                <Col xs={6}>
                  <Input
                    type="select"
                    label="Effect"
                    onChange={(evt) => this.props.effectChanged(evt.target.value)}
                    value={this.props.alert.effect}
                  >
                    {effects.map((effect) => {
                      return <option value={effect}>{effect}</option>
                    })}
                  </Input>
                </Col>
              </Row>

              <Row>
                <Col xs={12}>
                  <Input
                    type="textarea"
                    label="Description"
                    defaultValue={this.props.alert.description}
                    onChange={(evt) => this.props.descriptionChanged(evt.target.value)}
                  />
                </Col>
              </Row>

              <Row>
                <Col xs={12}>
                  <Input
                    type="text"
                    label="URL"
                    defaultValue={this.props.alert.url}
                    onChange={(evt) => this.props.urlChanged(evt.target.value)}
                  />
                </Col>
              </Row>

              <Row>
                <Col xs={12}>
                  <Panel header={<b>Affected Service</b>}>
                    <Row>
                      <Col xs={12}>
                        {this.props.alert.affectedEntities.map((entity) => {
                          return <AffectedEntity
                            entity={entity}
                            feeds={this.props.editableFeeds}
                            onDeleteEntityClick={this.props.onDeleteEntityClick}
                            entityTypeChanged={this.props.entityTypeChanged}
                          />
                        })}
                        <Button
                          onClick={(evt) => this.props.onAddEntityClick()}
                          className='pull-right'>Add</Button>
                      </Col>
                    </Row>
                  </Panel>
                </Col>
              </Row>
            </Col>

            <Col xs={6}>
              <GtfsMap
                feeds={this.props.editableFeeds}
              />
            </Col>

          </Row>
        </Grid>
      </div>
    )
  }
}
