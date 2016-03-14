import React, { PropTypes } from 'react'
import $ from 'jquery'

import fetch from 'isomorphic-fetch'

import { Panel, Grid, Row, Col, Button } from 'react-bootstrap'

import { PureComponent, shallowEqual } from 'react-pure-render'

import config from '../config'

import GtfsMap from './gtfsmap'
import GtfsSearch from './gtfssearch'

export default class GtfsMapSearch extends React.Component {

  constructor(props) {
    super(props)
    const position = [37.779871, -122.426966]
    this.state = {
      feedIds: config.feedIds,
      stops: [],
      message: '',
      position: position,
      map: {}
    }
  }

  componentDidMount() {
    // this.fetchUsers()
    console.log(this.props)

  }

  render() {
    const {attribution, centerCoordinates, geojson, markers, transitive, url, zoom} = this.props

    const handleStopSelection = (input) => {
      console.log(input)
      if (input === null) {
        this.setState({stops: [], routes: []})
      }
      else if (typeof input !== 'undefined' && input.stop){
        this.setState(Object.assign({}, this.state, { stops: [input.stop], position: [input.stop.stop_lat, input.stop.stop_lon] }))
      }
      else if (typeof input !== 'undefined' && input.route) {
        // this.setState(Object.assign({}, this.state, { routes: [input.route] }))
        fetch(`/api/patterns?route=${input.route.route_id}&feed=${input.route.feed_id}`)
        .then((response) => {
          return response.json()
        })
        .then((json) => {
          console.log(json)
          // const routes = json.map(p => p.associatedRoutes[0])
          // console.log(routes)
          this.setState(Object.assign({}, this.state, { routes: input.route, patterns: json[0] }))
          // this.setState(Object.assign({}, this.state, {  }))
          // return json
        })
      }
    }
    let displayedStops = this.state.stops
    let displayedPatterns = this.state.patterns
    console.log(displayedStops)
    return (
    <div>
      <GtfsSearch
        feeds={this.props.feeds}
        placeholder={this.props.placeholder}
        onChange={handleStopSelection}
        entities={['stops', 'routes']}
      />
      <GtfsMap
        feeds={this.props.feeds}
        onStopClick={this.props.onStopClick}
        onRouteClick={this.props.onRouteClick}
        stops={displayedStops}
        searchFocus={true}
        patterns={displayedPatterns}
        popupAction={this.props.popupAction}
      />
    </div>
    )
  }
}
