import React from 'react'

import { Panel, Button, DropdownButton, MenuItem, Badge, Glyphicon } from 'react-bootstrap'

export default class GtfsFilter extends React.Component {

  constructor (props) {
    super(props)
  }

  render () {
    var badgeStyle = {
      color: '#000',
      backgroundColor: '#ddd'
    }

    var removeIconStyle = {
      color: 'red',
      cursor: 'pointer'
    }

    var buttonRowStyle = {
      marginTop: '15px',
      textAlign: 'center'
    }

    var compare = function(a, b) {
      var aName = a.shortName || a.name
      var bName = b.shortName || b.name
      if(aName < bName) return -1
      if(aName > bName) return 1
      return 0
    }

    var activeFeeds = this.props.activeFeeds.sort(compare)
    var nonActiveFeeds = this.props.allFeeds.filter((feed) => {
      return (activeFeeds.indexOf(feed) === -1)
    }).sort(compare)

    var feedLookup = {}
    for(var f of this.props.allFeeds) feedLookup[f.id] = f

    return (
      <Panel>
        <div>
          {(activeFeeds.length > 0)
            ? activeFeeds.map((feed) => {
              return <span>
                <Badge style={badgeStyle}>
                  {feed.shortName || feed.name}&nbsp;
                  <Glyphicon
                    glyph='remove'
                    style={removeIconStyle}
                    onClick={(evt) => { this.props.onRemoveFeed(feed) }}
                  />
                </Badge>&nbsp;
              </span>
            })
            : <i>(No feeds selected)</i>
          }
        </div>
        <div style={buttonRowStyle}>
          <DropdownButton
            title="Add Feed"
            onSelect={(evt, eventKey) => { this.props.onAddFeed(feedLookup[eventKey]) }}
          >
            {nonActiveFeeds.map((feed) => {
              return <MenuItem eventKey={feed.id}>
                {feed.shortName || feed.name}
              </MenuItem>
            })}
          </DropdownButton>
          <Button onClick={this.props.onAddAllFeeds}>Add All</Button>
          <Button onClick={this.props.onRemoveAllFeeds}>Remove All</Button>
        </div>
      </Panel>
    )
  }
}
