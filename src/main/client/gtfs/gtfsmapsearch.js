import React, { PropTypes } from 'react'
import $ from 'jquery'

import fetch from 'isomorphic-fetch'

import { Panel, Grid, Row, Col, Button } from 'react-bootstrap'

import { PureComponent, shallowEqual } from 'react-pure-render'

import config from '../config'

import GtfsMap from './gtfsmap'
import GtfsSearch from './gtfssearch'

export default class GtfsMapSearch extends React.Component {
  static propTypes = {
    attribution: PropTypes.string,
    centerCoordinates: PropTypes.arrayOf(PropTypes.number),
    geojson: PropTypes.arrayOf(PropTypes.object).isRequired,
    markers: PropTypes.arrayOf(PropTypes.object).isRequired,
    onZoom: PropTypes.func,
    transitive: PropTypes.object,
    url: PropTypes.string.isRequired,
    zoom: PropTypes.number
  };

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
      if (typeof input !== 'undefined' && input.stop){
        console.log("setting state...")
        this.setState(Object.assign({}, this.state, { stops: [input.stop], position: [input.stop.stop_lat, input.stop.stop_lon] }))
        console.log(this.state.stops)
      }
    }
    var displayedStops = this.state.stops
    console.log(displayedStops)
    return (
    <div>
      <GtfsSearch 
        feeds={this.props.feeds}
        onChange={handleStopSelection}
      />
      <GtfsMap 
        feeds={this.props.feeds}
        onStopClick={this.props.onStopClick}
        stops={displayedStops}
      />
    </div>
    )
  }
}