import React from 'react'

import fetch from 'isomorphic-fetch'
import Select from 'react-select'

import { PureComponent, shallowEqual } from 'react-pure-render'

import config from './config'

export default class StopSearch extends React.Component {
  /*
 * assuming the API returns something like this:
 *   const json = [
 *     { value: 'one', label: 'One' },
 *     { value: 'two', label: 'Two' }
 *   ]
 */

  options = {};

  state = {
    feedId: 'bart'
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
      const url = input ? `/api/stops?name=${input}&feed=${this.state.feedId}` : `/api/stops?feed=${this.state.feedId}`
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
          const stopOptions = json.map(stop => ({value: stop.stop_id, label: stop.stop_name}))
          console.log(json)
          console.log(stopOptions)
          return { options: stopOptions }
        })
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
      value={this.state.value} />
    )
  }
}

// onInputChange={loadOptions}

// autoload={false}
//     cacheAsyncResults={false}
//     filterOptions={false}
//     loadOptions={loadOptions}
//     minimumInput={3}
//     {...this.props}
//     onChange={value => this.onChange(value)}
//     value={this.state.value}
