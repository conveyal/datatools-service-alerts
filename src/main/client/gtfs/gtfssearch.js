import React, { PropTypes } from 'react'
import $ from 'jquery'

import fetch from 'isomorphic-fetch'

import { Panel, Grid, Row, Col, Button, Glyphicon } from 'react-bootstrap'

import { PureComponent, shallowEqual } from 'react-pure-render'

import { Map, Marker, Popup, TileLayer, Polyline, MapControl } from 'react-leaflet'

import config from '../config'

import Select from 'react-select'

export default class GtfsSearch extends React.Component {
  /*
 * assuming the API returns something like this:
 *   const json = [
 *     { value: 'one', label: 'One' },
 *     { value: 'two', label: 'Two' }
 *   ]
 */

  // onChange={handleStopSelection}
  options = {};

  state = {
    stops: [],
    routes: [],
    value: this.props.value
  };

  cacheOptions (options) {
    options.forEach(o => {
      this.options[o.value] = o.feature
    })
  }

  componentWillReceiveProps (nextProps) {
    if (!shallowEqual(nextProps.value, this.props.value)) {
      this.setState({value: nextProps.value})
      console.log(this.state.value)
    }
  }
  renderOption (option) {
    return <span style={{ color: 'black' }}>{option.stop ? <Glyphicon glyph="map-marker" /> : <Glyphicon glyph="option-horizontal" />} {option.label} {option.link}</span>
  }
  onChange (value) {
    this.setState({value})
    this.props.onChange && this.props.onChange(value && this.options[value.value])
  }
  getFeedName (feedId) {
    const feedMap = this.props.feeds.reduce((map, obj) => {
      map[obj.id] = obj.shortName !== null ? obj.shortName : obj.name;
      return map;
    })
  }
  render() {
    console.log('render search feeds', this.props.feeds);
    const feedMap = this.props.feeds.reduce((map, obj) => {
      map[obj.id] = obj.shortName !== null ? obj.shortName : obj.name;
      return map;
    }, {})

    const getStops = (input, callback) => {
      const feedIds = this.props.feeds.map(feed => feed.id)
      const entities = typeof this.props.entities !== 'undefined' ? this.props.entities : ['routes', 'stops']
      console.log(entities)
      // var options;
      const url = input ? `/api/stops?name=${input}&feed=${feedIds.toString()}` : `/api/stops?feed=${feedIds.toString()}`
      return fetch(url)
        .then((response) => {
          console.log('fetch stops');
          // console.log(response)
          // console.log(response.json())
          // this.state.stops = response.json()
          return response.json() // .map(stop => ({value: stop.stop_id, label: stop.stop_name}))
        })
        .then((json) => {
          this.setState(Object.assign({}, this.state, { stops: stopOptions }))
          const stopOptions = json.map(stop => ({stop, value: stop.stop_id, label: `${stop.stop_name} (${feedMap[stop.feed_id]})`}))
          console.log(json)
          console.log(stopOptions)
          return { options: stopOptions }
        })
        // .then((options) => callback(input, options))
      }
    const getRoutes = (input, options) => {
      console.log('now fetch routes');
      console.log('stop options' + options)
      console.log(options)
      const feedIds = this.props.feeds.map(feed => feed.id)
      const url = input ? `/api/routes?name=${input}&feed=${feedIds.toString()}` : `/api/routes?feed=${feedIds.toString()}`
      return fetch(url)
        .then((response) => {
          // console.log(response)
          // console.log(response.json())
          // this.state.stops = response.json()
          return response.json() // .map(stop => ({value: stop.stop_id, label: stop.stop_name}))
        })
        .then((json) => {
          this.setState(Object.assign({}, this.state, { routes: routeOptions }))
          const routeOptions = json.map(route => ({route, value: route.route_id, label: `${route.route_short_name !== null ? route.route_short_name : route.route_long_name} (${feedMap[route.feed_id]})`}))
          console.log(json)
          console.log(options)
          console.log(routeOptions)
          // option.options = [
          //   ...option.options,
          //   routeOptions
          // ]
          return { options: routeOptions }
        })
      }
    const getOptions = (input) => {

      const entities = typeof this.props.entities !== 'undefined' ? this.props.entities : ['routes', 'stops']

      // TODO: get this working... instead of what's below
      if (entities.length === 1 && entities[0] === 'stops'){
        console.log('getting stops')
        return getStops(input)
      }
      else if (entities.length === 1 && entities[0] === 'routes'){
        console.log('getting routes')
        return getRoutes(input)
      }
      else{
        const feedIds = this.props.feeds.map(feed => feed.id)
      console.log(entities)
      var options = []
      const url = input ? `/api/stops?name=${input}&feed=${feedIds.toString()}` : `/api/stops?feed=${feedIds.toString()}`
      return fetch(url)
        .then((response) => {
          console.log('fetch stops');
          // console.log(response)
          // console.log(response.json())
          // this.state.stops = response.json()
          return response.json() // .map(stop => ({value: stop.stop_id, label: stop.stop_name}))
        })
        .then((json) => {
          this.setState(Object.assign({}, this.state, { stops: stopOptions }))
          const stopOptions = json.map(stop => ({stop, value: stop.stop_id, label: `${stop.stop_name} (${feedMap[stop.feed_id]})`}))
          console.log(json)
          console.log(stopOptions)
          options = [...stopOptions]
          // return { options: stopOptions }
        }).then(() => {
          console.log('now fetch routes');
          const url = input ? `/api/routes?name=${input}&feed=${feedIds.toString()}` : `/api/routes?feed=${feedIds.toString()}`
          return fetch(url)
            .then((response) => {
              // console.log(response)
              // console.log(response.json())
              // this.state.stops = response.json()
              return response.json() // .map(stop => ({value: stop.stop_id, label: stop.stop_name}))
            })
            .then((json) => {
              this.setState(Object.assign({}, this.state, { routes: routeOptions }))
              const routeOptions = json.map(route => ({route, value: route.route_id, label: `${route.route_short_name !== null ? route.route_short_name : route.route_long_name} (${feedMap[route.feed_id]})`}))
              console.log(json)
              console.log(routeOptions)
              // option.options = [
              //   ...option.options,
              //   routeOptions
              // ]
              return { options: [...options,...routeOptions] }
          })
        });
      }


    }
    const handleChange = (input) => {
      this.onChange(input)
      this.props.onChange(input)
    }
    const options = [
      {value: 'one', label: 'One'},
      {value: 'two', label: 'Two'}
    ]
    const placeHolder = 'Begin typing to search for ' + this.props.entities.join(' or ') + '...'
    return (
    <Select.Async
      autoload={true}
      cacheAsyncResults={false}
      filterOptions={false}
      minimumInput={1}
      clearable={this.props.clearable}
      placeholder={this.props.placeholder || placeHolder}
      loadOptions={getOptions}
      value={this.state.value}
      optionRenderer={this.renderOption}
      onChange={handleChange} />
    )
  }
}
