import React from 'react'
import moment from 'moment'

import { Panel, Row, Col, ButtonGroup, Button, Glyphicon, Input, DropdownButton, MenuItem } from 'react-bootstrap'

import GtfsSearch from '../gtfs/gtfssearch'

import modes from '../modes'

export default class AffectedEntity extends React.Component {
  constructor (props) {
    super(props)
  }
  render () {
    const getMode = (id) => {
      return modes.find((mode) => mode.gtfsType === +id )
    }
    const getFeed = (id) => {
      return this.props.feeds.find((feed) => feed.id === id )
    }
    const getEntitySummary = (entity) => {
      const type = entity.type
      const val = entity[type.toLowerCase()]
      console.log('val', val)
      const routeName = typeof entity.route !== 'undefined' ? entity.route.route_short_name || val.route_long_name : entity.route_id
      let stopName = typeof entity.stop !== 'undefined' ? `${entity.stop.stop_name} (${getFeed(entity.stop.feed_id).name})` : entity.stop_id
      let summary = ''
        switch (type) { 
          case 'AGENCY' :
            return val.name
          case 'STOP' :
            summary = stopName
            if (typeof routeName !== 'undefined'){
              summary += ` for ${routeName}`
            }
            return summary 
          case 'ROUTE' :
            summary = routeName
            if (typeof stopName !== 'undefined'){
              summary += ` at ${stopName}`
            }
            return summary 
          case 'MODE' :
            summary = val.name
            if (typeof stopName !== 'undefined'){
              summary += ` at ${stopName}`
            }
            return summary
        }
      // }
      // else {
        // return 'entity not found'
      // }
      
    }

    return (
      <Panel collapsible header={
        <Row>
          <Col xs={10}>
            {this.props.entity.type}: {getEntitySummary(this.props.entity)}
          </Col>
          <Col xs={2}>
            <ButtonGroup className='pull-right'>
              <Button bsSize="small" onClick={() => this.props.onDeleteEntityClick(this.props.entity)}>
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
                  <AgencySelector
                    feeds={this.props.feeds}
                    entityUpdated={this.props.entityUpdated}
                    entity={this.props.entity}
                  />
                </div>
              )
            case "MODE":
              return (
                <div>
                  <span><b>Mode:</b></span>
                  <ModeSelector
                    entityUpdated={this.props.entityUpdated}
                    value={this.props.entity.type}
                    entity={this.props.entity}
                  />
                  <div style={indent}>
                    <span><i>Refine by Agency:</i></span>
                    <AgencySelector
                      feeds={this.props.feeds}
                      entityUpdated={this.props.entityUpdated}
                      entity={this.props.entity}
                    />
                    <span><i>Refine by Stop:</i></span>
                    <StopSelector
                      feeds={this.props.feeds}
                      stop={this.props.entity.stop}
                      entityUpdated={this.props.entityUpdated}
                      entity={this.props.entity}
                    />
                  </div>
                </div>
              )
            case "STOP":
              return (
                <div>
                  <span><b>Stop:</b></span>
                  <StopSelector
                    feeds={this.props.feeds}
                    stop={this.props.entity.stop}
                    clearable={false}
                    entityUpdated={this.props.entityUpdated}
                    entity={this.props.entity}
                  />
                  <div style={indent}>
                    <span><i>Refine by Route:</i></span>
                    <RouteSelector
                      feeds={this.props.feeds}
                      route={this.props.entity.route}
                      entityUpdated={this.props.entityUpdated}
                      entity={this.props.entity}
                    />
                  </div>
                </div>
              )
            case "ROUTE":
              return (
                <div>
                  <span><b>Route:</b></span>
                  <RouteSelector
                    feeds={this.props.feeds}
                    route={this.props.entity.route}
                    clearable={false}
                    entityUpdated={this.props.entityUpdated}
                    entity={this.props.entity}
                  />
                  <div style={indent}>
                    <span><i>Refine by Stop:</i></span>
                    <StopSelector
                      feeds={this.props.feeds}
                      stop={this.props.entity.stop}
                      entityUpdated={this.props.entityUpdated}
                      entity={this.props.entity}
                    />
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
    const getMode = (id) => {
      return modes.find((mode) => mode.gtfsType === +id )
    }
    const getFeed = (id) => {
      return this.props.feeds.find((feed) => feed.id === id )
    }
    return (
      <div>
        <Input
          type="select"
          value={this.props.entity.agency && this.props.entity.agency.id}
          onChange={(evt) => {
            this.props.entityUpdated(this.props.entity, "AGENCY", getFeed(evt.target.value))
          }}
          //value={this.props.entity.type}
        >
          {this.props.feeds.map((feed) => {
            return <option key={feed.id} value={feed.id}>{feed.name}</option>
          })}
        </Input>
      </div>
    )
  }
}

class ModeSelector extends React.Component {

  render () {
    const getMode = (id) => {
      return modes.find((mode) => mode.gtfsType === +id )
    }
    const getFeed = (id) => {
      return this.props.feeds.find((feed) => feed.id === id )
    }
    return (
      <div>
        <Input
          type="select"
          value={this.props.entity.mode.gtfsType}
          onChange={(evt) => {
            this.props.entityUpdated(this.props.entity, "MODE", getMode(evt.target.value))
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
  state = {
    route: this.props.route
  };
  render () {
    console.log('render route ent', this.props.route)
    const getMode = (id) => {
      return modes.find((mode) => mode.gtfsType === +id )
    }
    const getFeed = (id) => {
      return this.props.feeds.find((feed) => feed.id === id )
    }
    var routes = []
    const agencyName = typeof this.state.route !== 'undefined' ? getFeed(this.state.route.feed_id).name : null
    return (
      <div>
        <GtfsSearch
          feeds={this.props.feeds}
          clearable={this.props.clearable}
          entities={['routes']}
          onChange={(evt) => {
            console.log(this.state.value)
            if (typeof evt !== 'undefined' && evt !== null)
              this.props.entityUpdated(this.props.entity, "ROUTE", evt.route, evt.agency)
            else if (evt == null)
              this.props.entityUpdated(this.props.entity, "ROUTE", null, null)
          }}
          value={this.state.route ? {'value': this.state.route.route_id, 'label': `${this.state.route.route_short_name !== null ? this.state.route.route_short_name : this.state.route.route_long_name} (${agencyName})`} : ''}
        />
      </div>
    )
  }
}

class StopSelector extends React.Component {
  state = {
    stop: this.props.stop
  };
  handleChange (input) {
    // this.props.onChange(input)
  }
  render () {
    console.log('render stop ent', this.props.stop)
    const getMode = (id) => {
      return modes.find((mode) => mode.gtfsType === +id )
    }
    const getFeed = (id) => {
      return this.props.feeds.find((feed) => feed.id === id )
    }

    var stops = []
    const agencyName = typeof this.state.stop !== 'undefined' ? getFeed(this.state.stop.feed_id).name : null
    return (
      <div>
        <GtfsSearch
          feeds={this.props.feeds}
          entities={['stops']}
          clearable={this.props.clearable}
          onChange={(evt) => {
            console.log(this.state.value)
            if (typeof evt !== 'undefined' && evt !== null)
              this.props.entityUpdated(this.props.entity, "STOP", evt.stop, evt.agency)
            else if (evt == null)
              this.props.entityUpdated(this.props.entity, "STOP", null, null)
          }}
          value={this.state.stop ? {'value': this.state.stop.stop_id, 'label': `${this.state.stop.stop_name} (${agencyName})`} : ''}
        />

      </div>
    )
  }
}
