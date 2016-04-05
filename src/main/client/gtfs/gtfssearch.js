import React, { PropTypes } from 'react'

import fetch from 'isomorphic-fetch'

import { Panel, Grid, Row, Col, Button, Glyphicon, Label } from 'react-bootstrap'

import { PureComponent, shallowEqual } from 'react-pure-render'

import { Map, Marker, Popup, TileLayer, Polyline, MapControl } from 'react-leaflet'

import Select from 'react-select'

import { getFeed, getFeedId } from '../util/util'

export default class GtfsSearch extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      value: this.props.value
    };
  }

  cacheOptions (options) {
    options.forEach(o => {
      this.options[o.value] = o.feature
    })
  }

  componentWillReceiveProps (nextProps) {
    if (!shallowEqual(nextProps.value, this.props.value)) {
      this.setState({value: nextProps.value})
      console.log('props received', this.state.value)
      // console.log()
      this.refs.gtfsSelect.onChange()
    }
  }
  renderOption (option) {
    return <span style={{ color: 'black' }}>{option.stop ? <Glyphicon glyph="map-marker" /> : <Glyphicon glyph="option-horizontal" />} {option.label} <Label>{option.agency.name}</Label> {option.link}</span>
  }
  onChange (value) {
    this.setState({value})
  }
  render() {
    console.log('render search feeds', this.props.feeds)
    const getStops = (input) => {
      const feedIds = this.props.feeds.map(getFeedId)
      console.log(feedIds)
      const limit = this.props.limit ? '&limit=' + this.props.limit : ''
      const nameQuery = input ? '&name=' + input : ''
      const url = this.props.filterByRoute ? `/api/stops?route=${this.props.filterByRoute.route_id}&feed=${feedIds.toString()}${limit}` : `/api/stops?feed=${feedIds.toString()}${nameQuery}${limit}`
      return fetch(url)
        .then((response) => {
          return response.json()
        })
        .then((stops) => {
          const stopOptions = stops !== null && stops.length > 0 ? stops.map(stop => ({stop, value: stop.stop_id, label: stop.stop_name, agency: getFeed(this.props.feeds, stop.feed_id)})) : []
          return stopOptions
        })
        .catch((error) => {
          console.log(error)
          return []
        })
    }
    const getRoutes = (input) => {
      const feedIds = this.props.feeds.map(getFeedId)
      const getRouteName = (route) => {
        let routeName = route.route_short_name && route.route_long_name ? `${route.route_short_name} - ${route.route_long_name}` :
          route.route_long_name ? route.route_long_name :
          route.route_short_name ? route.route_short_name : null
        return routeName
      }
      // don't need to use limit here
      // const limit = this.props.limit ? '&limit=' + this.props.limit : ''
      const nameQuery = input ? '&name=' + input : ''
      const url = this.props.filterByStop ? `/api/routes?stop=${this.props.filterByStop.stop_id}&feed=${feedIds.toString()}` : `/api/routes?feed=${feedIds.toString()}${nameQuery}`
      return fetch(url)
        .then((response) => {
          return response.json()
        })
        .then((routes) => {
          const routeOptions = routes !== null && routes.length > 0 ? routes.map(route => ({route, value: route.route_id, label: `${getRouteName(route)}`, agency: getFeed(this.props.feeds, route.feed_id)})) : []
          return routeOptions
        })
        .catch((error) => {
          console.log(error)
          return []
        })
    }
    const getOptions = (input) => {

      const entities = typeof this.props.entities !== 'undefined' ? this.props.entities : ['routes', 'stops']
      let entitySearches = []
      if (entities.indexOf('stops') > -1){
        entitySearches.push(getStops(input))
      }
      if (entities.indexOf('routes') > -1){
        entitySearches.push(getRoutes(input))
      }
      return Promise.all(entitySearches).then((results) => {
        const stops = results[0]
        const routes = typeof results[1] !== 'undefined' ? results[1] : []
        const options = { options: [...stops,...routes] }
        console.log('search options', options)
        return options
      })
    }
    const handleChange = (input) => {
      this.onChange(input)
      this.props.onChange(input)
    }

    const onFocus = (input) => {
      // clear options to onFocus to ensure only valid route/stop combinations are selected
      this.refs.gtfsSelect.loadOptions('')
    }

    const placeholder = 'Begin typing to search for ' + this.props.entities.join(' or ') + '...'
    return (
    <Select.Async
      ref='gtfsSelect'
      cache={false}
      onFocus={onFocus}
      filterOptions={false}
      minimumInput={this.props.minimumInput !== null ? this.props.minimumInput : 1}
      clearable={this.props.clearable}
      placeholder={this.props.placeholder || placeholder}
      loadOptions={getOptions}
      value={this.state.value}
      optionRenderer={this.renderOption}
      onChange={handleChange} />
    )
  }
}
