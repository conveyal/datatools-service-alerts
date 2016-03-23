import React, { PropTypes } from 'react'
import $ from 'jquery'

import fetch from 'isomorphic-fetch'

import { Panel, Grid, Row, Col, Button, Glyphicon, Label } from 'react-bootstrap'

import { PureComponent, shallowEqual } from 'react-pure-render'

import { Map, Marker, Popup, TileLayer, Polyline, MapControl } from 'react-leaflet'

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
    return <span style={{ color: 'black' }}>{option.stop ? <Glyphicon glyph="map-marker" /> : <Glyphicon glyph="option-horizontal" />} {option.label} <Label>{option.agency.name}</Label> {option.link}</span>
  }
  onChange (value) {
    this.setState({value})
    this.props.onChange && this.props.onChange(value && this.options[value.value])
  }
  render() {
    console.log('render search feeds', this.props.feeds);
    const getFeed = (id) => {
      return this.props.feeds.find((feed) => feed.id === id )
    }
    const getStops = (input) => {
      const feedIds = this.props.feeds.map(feed => feed.id)
      const url = input ? `/api/stops?name=${input}&feed=${feedIds.toString()}` : `/api/stops?feed=${feedIds.toString()}`
      return fetch(url)
        .then((response) => {
          return response.json()
        })
        .then((json) => {
          const stopOptions = json.map(stop => ({stop, value: stop.stop_id, label: `${stop.stop_name}`, agency: getFeed(stop.feed_id)}))
          return { options: stopOptions }
        })
    }
    const getRoutes = (input) => {
      const feedIds = this.props.feeds.map(feed => feed.id)
      const url = input ? `/api/routes?name=${input}&feed=${feedIds.toString()}` : `/api/routes?feed=${feedIds.toString()}`
      return fetch(url)
        .then((response) => {
          return response.json()
        })
        .then((json) => {
          const routeOptions = json.map(route => ({route, value: route.route_id, label: `${route.route_short_name !== null ? route.route_short_name : route.route_long_name}`, agency: getFeed(route.feed_id)}))
          return { options: routeOptions }
        })
    }
    const getOptions = (input) => {

      const entities = typeof this.props.entities !== 'undefined' ? this.props.entities : ['routes', 'stops']

      if (entities.length === 1 && entities[0] === 'stops'){
        console.log('getting stops')
        return getStops(input)
      }
      else if (entities.length === 1 && entities[0] === 'routes'){
        console.log('getting routes')
        return getRoutes(input)
      }
      else{
        return Promise.all([getStops(input), getRoutes(input)]).then((results) => {
          const stops = results[0]
          const routes = results[1]
          const options = { options: [...stops.options,...routes.options] }
          console.log('search options', options)
          return options
        })
      }
    }
    const handleChange = (input) => {
      this.onChange(input)
      this.props.onChange(input)
    }

    const placeholder = 'Begin typing to search for ' + this.props.entities.join(' or ') + '...'
    return (
    <Select.Async
      autoload={true}
      cacheAsyncResults={false}
      filterOptions={false}
      minimumInput={3}
      clearable={this.props.clearable}
      placeholder={this.props.placeholder || placeholder}
      loadOptions={getOptions}
      value={this.state.value}
      optionRenderer={this.renderOption}
      onChange={handleChange} />
    )
  }
}
