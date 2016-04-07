import React from 'react'
import moment from 'moment'

import { Panel, Row, Col, ButtonGroup, Button, Glyphicon, Input, DropdownButton, MenuItem } from 'react-bootstrap'

import GtfsSearch from '../gtfs/gtfssearch'

import modes from '../modes'

import { getFeed } from '../util/util'

export default class AffectedEntity extends React.Component {
  constructor (props) {
    super(props)
  }
  render () {
    const getMode = (id) => {
      return modes.find((mode) => mode.gtfsType === +id )
    }
    const getRouteName = (route) => {
      let routeName = route.route_short_name && route.route_long_name ? `${route.route_short_name} - ${route.route_long_name}` :
        route.route_long_name ? route.route_long_name :
        route.route_short_name ? route.route_short_name : null
      return routeName
    }
    const getEntitySummary = (entity) => {
      console.log(entity)
      const type = entity.type
      const val = entity[type.toLowerCase()]
      console.log('val', val)
      let agencyName = ''
      if (typeof entity.agency !== 'undefined' && entity.agency !== null){
        agencyName = entity.agency.name
      }
      else if (typeof entity.stop !== 'undefined' && entity.stop !== null){
        const feed = getFeed(this.props.feeds, entity.stop.feed_id)
        agencyName = typeof feed !== 'undefined' ? feed.name : 'Unknown agency'
      }

      const routeName = typeof entity.route !== 'undefined' && entity.route !== null ? getRouteName(entity.route) : entity.route_id
      let stopName = typeof entity.stop !== 'undefined' && entity.stop !== null ? `${entity.stop.stop_name} (${agencyName})` : entity.stop_id
      let summary = ''
        switch (type) {
          case 'AGENCY' :
            return agencyName
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
          let selectedFeeds = [this.props.entity.agency] || this.props.activeFeeds
          console.log(selectedFeeds)
          let selectedRoute = this.props.entity.route
          let selectedStop = this.props.entity.stop
          console.log(selectedStop)
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
                      feeds={selectedFeeds}
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
                    feeds={this.props.activeFeeds}
                    stop={this.props.entity.stop}
                    clearable={false}
                    entityUpdated={this.props.entityUpdated}
                    entity={this.props.entity}
                  />
                  <div style={indent}>
                    <span><i>Refine by Route:</i></span>
                    <RouteSelector
                      feeds={selectedFeeds}
                      minimumInput={0}
                      filterByStop={selectedStop}
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
                    feeds={this.props.activeFeeds}
                    route={this.props.entity.route}
                    clearable={false}
                    entityUpdated={this.props.entityUpdated}
                    entity={this.props.entity}
                  />
                  <div style={indent}>
                    <span><i>Refine by Stop:</i></span>
                    <StopSelector
                      feeds={selectedFeeds}
                      minimumInput={0}
                      filterByRoute={selectedRoute}
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
    return (
      <div>
        <Input
          type="select"
          value={this.props.entity.agency && this.props.entity.agency.externalProperties.MTC.AgencyId}
          onChange={(evt) => {
            this.props.entityUpdated(this.props.entity, "AGENCY", getFeed(this.props.feeds, evt.target.value))
          }}
          //value={this.props.entity.type}
        >
          {this.props.feeds.map((feed) => {
            return <option key={feed.externalProperties.MTC.AgencyId} value={feed.externalProperties.MTC.AgencyId}>{feed.name}</option>
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
    const getRouteName = (route) => {
      let routeName = route.route_short_name && route.route_long_name ? `${route.route_short_name} - ${route.route_long_name}` :
        route.route_long_name ? route.route_long_name :
        route.route_short_name ? route.route_short_name : null
      return routeName
    }
    var routes = []
    const feed = typeof this.state.route !== 'undefined' ? getFeed(this.props.feeds, this.state.route.feed_id) : null
    const agencyName = feed ? feed.name : 'Unknown agency'

    return (
      <div>
        <GtfsSearch
          feeds={this.props.feeds}
          limit={100}
          minimumInput={this.props.minimumInput}
          filterByStop={this.props.filterByStop}
          clearable={this.props.clearable}
          entities={['routes']}
          onChange={(evt) => {
            console.log(this.state.value)
            if (typeof evt !== 'undefined' && evt !== null)
              this.props.entityUpdated(this.props.entity, "ROUTE", evt.route, evt.agency)
            else if (evt == null)
              this.props.entityUpdated(this.props.entity, "ROUTE", null, null)
          }}
          value={this.state.route ? {'value': this.state.route.route_id, 'label': `${getRouteName(this.state.route)} (${agencyName})`} : ''}
        />
      </div>
    )
  }
}

class StopSelector extends React.Component {
  state = {
    stop: this.props.stop
  };
  // TODO: clear stop or route if parent select changes...
  componentWillReceiveProps (nextProps) {
    // if (!shallowEqual(nextProps.value, this.props.value)) {
    //   this.setState({value: nextProps.value})
      console.log('props received', this.state.stop)
      // console.log()
    //   this.refs.gtfsSelect.onChange()
    // }
  }

  render () {
    console.log('render stop ent', this.props.stop)
    const getMode = (id) => {
      return modes.find((mode) => mode.gtfsType === +id )
    }
    var stops = []
    const feed = typeof this.state.stop !== 'undefined' ? getFeed(this.props.feeds, this.state.stop.feed_id) : null
    const agencyName = feed ? feed.name : 'Unkown agency'
    return (
      <div>
        <GtfsSearch
          feeds={this.props.feeds}
          limit={100}
          minimumInput={this.props.minimumInput}
          filterByRoute={this.props.filterByRoute}
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
