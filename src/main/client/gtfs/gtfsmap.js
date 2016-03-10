import React, { PropTypes } from 'react'
import $ from 'jquery'

import fetch from 'isomorphic-fetch'

import { Panel, Grid, Row, Col, Button } from 'react-bootstrap'

import { PureComponent, shallowEqual } from 'react-pure-render'

import { Map, Marker, Popup, TileLayer, Polyline, MapControl } from 'react-leaflet'

import config from '../config'

import Select from 'react-select'

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
    const position = [37.779871, -122.426966]
    this.state = {
      feedId: config.feedIds,
      stops: [],
      message: '',
      position: position,
      map: {}
    }
  }

  componentDidMount() {
    // this.fetchUsers()

  }

  render() {
    const {attribution, centerCoordinates, geojson, markers, transitive, url, zoom} = this.props


    const handleSelection = (input) => {
      this.onChange(input)
    }


    const polyline = [
      [37.779871, -122.426966],
      [37.78, -122.426966],
      [37.79, -122.426966],
    ]
    var mapStyle = {
      height: '400px',
      width: '555px'
    // WebkitTransition: 'all', // note the capital 'W' here
    // msTransition: 'all' // 'ms' is the only lowercase vendor prefix
    }
    const handleStopSelection = (input) => {
      console.log(input)
      if (typeof input !== 'undefined' && input.stop){
        this.setState(Object.assign({}, this.state, { stops: [input.stop], position: [input.stop.stop_lat, input.stop.stop_lon] }))

      }
    }
    const layerAddHandler = (e) => {
      console.log(e)
      if (this.state.stops.length === 1 && typeof e.layer !== 'undefined' && typeof e.layer._popup !== 'undefined'){
        e.layer.openPopup()
      }
    }
    const moveHandler = (zoom) => {
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
      <StopSearch
        onChange={handleStopSelection}
      />
      <div>&nbsp;</div>
      <Map
        style={mapStyle}
        center={this.state.position}
        zoom={13}
        onLeafletZoomend={moveHandler}
        onLeafletMoveend={moveHandler}
        onLeafletLayeradd={layerAddHandler}
        className='Gtfs-Map'
        >
        <TileLayer url='http://{s}.tile.osm.org/{z}/{x}/{y}.png' attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' />
        {this.state.stops.map((stop, index) => {
          if (typeof stop !== 'undefined') {
            return (
              <Marker
                position={[stop.stop_lat, stop.stop_lon]}
                key={`marker-${stop.stop_id}`}
                >
                <Popup>
                  <div>
                    <h3>{stop.stop_name}</h3>
                    <ul>
                      <li><strong>ID:</strong> {stop.stop_id}</li>
                      <li><strong>Agency:</strong> BART</li>
                      {stop.stop_desc && <li><strong>Desc:</strong> {stop.stop_desc}</li>}
                    </ul>
                    <Button href="#" onClick={() => this.props.onStopClick(stop)}>Create Alert for {stop.stop_id}</Button>
                  </div>
                </Popup>
              </Marker>
            )
          }
        })}
      </Map>
    </div>
    )
  }

  getStopsForBox(maxLat, maxLng, minLat, minLng){
    return fetch(`/api/stops?max_lat=${maxLat}&max_lon=${maxLng}&min_lat=${minLat}&min_lon=${minLng}&feed=${this.state.feedId.toString()}`)
        .then((response) => {
          return response.json()
        })
        .then((json) => {
          console.log(json)
          this.setState(Object.assign({}, this.state, { stops: json }))
          return json
        })
  }
}
class StopPopup extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      stop: this.props.stop
    }
  }

  componentDidMount() {
    // this.fetchUsers()

  }
  render() {
    const stop = this.state.stop
    return (
      <Popup>
        <div>
          <h3>{stop.stop_name}</h3>
          <ul>
            <li><strong>ID:</strong> {stop.stop_id}</li>
            <li><strong>Agency:</strong> BART</li>
            {stop.stop_desc && <li><strong>Desc:</strong> {stop.stop_desc}</li>}
          </ul>
          <Button href="#">Create Alert for {stop.stop_id}</Button>
        </div>
      </Popup>
    )
  }
}
class StopSearch extends React.Component {
  /*
 * assuming the API returns something like this:
 *   const json = [
 *     { value: 'one', label: 'One' },
 *     { value: 'two', label: 'Two' }
 *   ]
 */

  options = {};

  state = {
    feedId: config.feedIds
  };

  cacheOptions (options) {
    options.forEach(o => {
      this.options[o.value] = o.feature
    })
  }

  componentWillReceiveProps (nextProps) {
    if (!shallowEqual(nextProps.value, this.props.value)) {
      this.setState({value: nextProps.value})
    }
  }

  onChange (value) {
    this.setState({value})
    this.props.onChange && this.props.onChange(value && this.options[value.value])
  }

  render() {
    const getOptions = (input) => {
      const url = input ? `/api/stops?name=${input}&feed=${this.state.feedId.toString()}` : `/api/stops?feed=${this.state.feedId.toString()}`
      return fetch(url)
        .then((response) => {
          // console.log(response)
          // console.log(response.json())
          // this.state.stops = response.json()
          return response.json() // .map(stop => ({value: stop.stop_id, label: stop.stop_name}))
        })
        .then((json) => {
          // this.state.stops = json
          this.setState(Object.assign({}, this.state, { stops: stopOptions }))
          const stopOptions = json.map(stop => ({stop, value: stop.stop_id, label: stop.stop_name}))
          console.log(json)
          console.log(stopOptions)
          return { options: stopOptions }
        })
    }
    const handleChange = (input) => {
      this.onChange(input)
      this.props.onChange(input)
    }
    const options = [
      {value: 'one', label: 'One'},
      {value: 'two', label: 'Two'}
    ]
    const selectStyle = {
      'z-index': '2000'
    }
    const placeHolder = 'Begin typing to search for stops...'
    return (
    <Select.Async
      autoload={true}
      cacheAsyncResults={false}
      filterOptions={false}
      minimumInput={1}
      placeholder={placeHolder}
      loadOptions={getOptions}
      value={this.state.value}
      onChange={handleChange} />
    )
  }
}
