import React, { PropTypes } from 'react'
import $ from 'jquery'

import fetch from 'isomorphic-fetch'

import { Panel, Grid, Row, Col, Button } from 'react-bootstrap'

import CreateUser from './createuser'
import UserSettings from './usersettings'
import PermissionData from './permissiondata'

import { Map, Marker, Popup, TileLayer, Polyline, MapControl } from 'react-leaflet'

import Select from 'react-select'

import config from './config'

export default class GtfsMap extends React.Component {
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

    this.state = {
      feedId: 'bart',
      stops: [],
      message: ''
    }
  }

  componentDidMount() {
    // this.fetchUsers()

  }

  render() {
    const {attribution, centerCoordinates, geojson, markers, transitive, url, zoom} = this.props

    const position = [37.779871, -122.426966]
    const polyline = [
      [37.779871, -122.426966],
      [37.78, -122.426966],
      [37.79, -122.426966],
    ]
    var mapStyle = {
      height: '400px',
      width: '600px'
    // WebkitTransition: 'all', // note the capital 'W' here
    // msTransition: 'all' // 'ms' is the only lowercase vendor prefix
    }
    const moveHandler = (zoom, something) => {
      const newZoom = zoom.target._zoom
      console.log(newZoom)
      if (newZoom > 13 ){
        this.setState(Object.assign({}, this.state, { message: '' }))
        const bounds = zoom.target.getBounds()
        // const maxLat = bounds._northEast.lat
        // const maxLng = bounds._northEast.lng
        // const minLat = bounds._southWest.lat
        // const minLng = bounds._southWest.lng

        const maxLat = bounds._southWest.lat
        const maxLng = bounds._northEast.lng
        const minLat = bounds._northEast.lat
        const minLng = bounds._southWest.lng

        this.getStopsForBox(maxLat, maxLng, minLat, minLng)
      }
      else{
        this.setState(Object.assign({}, this.state, { message: 'zoom in for stops' }))
      }

      // console.log(something)
    }
    return (
    <div>
      <Map 
        style={mapStyle} 
        center={position} 
        zoom={13} 
        onLeafletZoomend={moveHandler} 
        onLeafletMoveend={moveHandler} 
        className='Gtfs-Map' 
        >
        <TileLayer url='http://{s}.tile.osm.org/{z}/{x}/{y}.png' attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' />
        {this.state.stops.map((stop, index) => {
          return (
            <Marker
              position={[stop.stop_lat, stop.stop_lon]}
              {...stop}
              >
              {stop.label && <Popup><span>{stop.label}</span></Popup>}
            </Marker>
          )
        })}
      </Map>
    </div>
    )
  }

  getStopsForBox(maxLat, maxLng, minLat, minLng){
    return fetch(`/api/stops?max_lat=${maxLat}&max_lon=${maxLng}&min_lat=${minLat}&min_lon=${minLng}&feed=${this.state.feedId}`)
        .then((response) => {
          // console.log(response)
          // console.log(response.json())
          // this.state.stops = response.json()
          return response.json() // .map(stop => ({value: stop.stop_id, label: stop.stop_name}))
        })
        .then((json) => {
          // this.state.stops = json
          // this.setState(Object.assign({}, this.state, { stops: stopOptions }))
          // const stopOptions = json.map(stop => ({value: stop.stop_id, label: stop.stop_name}))
          console.log(json)
          // this.state.stops = json
          this.setState(Object.assign({}, this.state, { stops: json }))
          // console.log(stopOptions)
          return json
        })
  }
}


// class MapMessage extends MapControl{
//   constructor(props) {
//     super(props)

//     this.state = {
//       // feedId: 'bart',
//       // stops: [],
//       // message: ''
//     }
//   }

//   componentDidMount() {
//     // this.fetchUsers()

//   }

//   render() {
//     return (

//     )
//   }
// }

