import React, { PropTypes } from 'react'
import $ from 'jquery'

import fetch from 'isomorphic-fetch'

import { Panel, Grid, Row, Col, Button } from 'react-bootstrap'

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
    stops: []
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
      const feedIds = this.props.feeds.map(feed => feed.id)
      const url = input ? `/api/stops?name=${input}&feed=${feedIds.toString()}` : `/api/stops?feed=${feedIds.toString()}`
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

