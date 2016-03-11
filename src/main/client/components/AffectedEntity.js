import React from 'react'
import moment from 'moment'

import { Panel, Row, Col, ButtonGroup, Button, Glyphicon, Input } from 'react-bootstrap'


/*var agencies = [
  {
    id: 'BA',
    name: 'BART'
  },
]*/

var modes = [
  {
    gtfsType: 0,
    name: 'Tram/LRT'
  },
  {
    gtfsType: 1,
    name: 'Subway/Metro'
  },
  {
    gtfsType: 2,
    name: 'Rail'
  },
  {
    gtfsType: 3,
    name: 'Bus'
  },
  {
    gtfsType: 4,
    name: 'Ferry'
  },
  {
    gtfsType: 5,
    name: 'Cable Car'
  },
  {
    gtfsType: 6,
    name: 'Gondola'
  },
  {
    gtfsType: 7,
    name: 'Funicular'
  }
]

export default class AffectedEntity extends React.Component {

  constructor (props) {
    super(props)
  }

  render () {

    /*var modesContent =  (
      <Input
        type="select"
        onChange={(evt) => {
          //this.props.entityModeChanged(this.props.entity, evt.target.value)
        }}
        //value={this.props.entity.type}
      >
        {modes.map((mode) => {
          return <option value={mode.gtfsType}>{mode.name}</option>
        })}
      </Input>
    )*/

    return (
      <Panel header={
        <Row>
          <Col xs={2}>
            Affects:
          </Col>
          <Col xs={6}>
            <Input
              type="select"
              onChange={(evt) => {
                this.props.entityTypeChanged(this.props.entity, evt.target.value)
              }}
              value={this.props.entity.type}
            >
              <option value='AGENCY'>Agency</option>
              <option value='MODE'>Mode</option>
              <option value='STOP'>Stop</option>
              <option value='ROUTE'>Route</option>
            </Input>
          </Col>
          <Col xs={4}>
            <ButtonGroup className='pull-right'>
              <Button onClick={() => this.props.onDeleteEntityClick(this.props.entity)}>
                <Glyphicon glyph="remove" />
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
      }>

        {(() => {
          var indent = {
            paddingLeft: '30px'
          }
          switch (this.props.entity.type) {
            case "AGENCY":
              return (
                <div>
                  <span><b>Agency:</b></span>
                  <AgencySelector feeds={this.props.feeds} />
                </div>
              )
            case "MODE":
              return (
                <div>
                  <span><b>Mode:</b></span>
                  <ModeSelector />
                  <div style={indent}>
                    <span><i>Refine by Agency:</i></span>
                    <AgencySelector feeds={this.props.feeds} />
                    <span><i>Refine by Stop:</i></span>
                    <StopSelector />
                  </div>
                </div>
              )
            case "STOP":
              return (
                <div>
                  <span><b>Stop:</b></span>
                  <StopSelector stop={this.props.entity.stop} />
                  <div style={indent}>
                    <span><i>Refine by Route:</i></span>
                    <RouteSelector />
                  </div>
                </div>
              )
            case "ROUTE":
              return (
                <div>
                  <span><b>Route:</b></span>
                  <RouteSelector />
                  <div style={indent}>
                    <span><i>Refine by Stop:</i></span>
                    <StopSelector />
                  </div>
                </div>
              )

          }
        })()}

      </Panel>
    )
  }
}


class AgencySelector extends React.Component {

  render () {
    return (
      <div>
        <Input
          type="select"
          onChange={(evt) => {
            //this.props.entityModeChanged(this.props.entity, evt.target.value)
          }}
          //value={this.props.entity.type}
        >
          {this.props.feeds.map((feed) => {
            return <option value={feed.id}>{feed.name}</option>
          })}
        </Input>
      </div>
    )
  }
}

class ModeSelector extends React.Component {

  render () {
    return (
      <div>
        <Input
          type="select"
          onChange={(evt) => {
            //this.props.entityModeChanged(this.props.entity, evt.target.value)
          }}
          //value={this.props.entity.type}
        >
          {modes.map((mode) => {
            return <option value={mode.gtfsType}>{mode.name}</option>
          })}
        </Input>
      </div>
    )
  }
}

class RouteSelector extends React.Component {

  render () {
    var routes = []
    return (
      <div>
        <Input
          type="select"
          onChange={(evt) => {
            //this.props.entityModeChanged(this.props.entity, evt.target.value)
          }}
          //value={this.props.entity.type}
        >
          {routes.map((route) => {
            return <option value={route.id}>{route.name}</option>
          })}
        </Input>
      </div>
    )
  }
}

class StopSelector extends React.Component {

  render () {
    console.log('render stop ent', this.props.stop)
    var stops = []
    return (
      <div>
        <Input
          type="text"
          value={this.props.stop ? this.props.stop.stop_name : "None Selected"}
        />
      </div>
    )
  }
}
