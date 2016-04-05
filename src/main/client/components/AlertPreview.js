import React from 'react'
import moment from 'moment'

import { Panel, Grid, Row, Col, ButtonGroup, Button, Glyphicon, Label } from 'react-bootstrap'
import { Link } from 'react-router'

export default class AlertPreview extends React.Component {

  constructor (props) {
    super(props)
  }

  render () {
    var feeds = this.props.alert.affectedEntities.map((ent) => {
      return ent.agency
    })
    var uniqueFeedsInAlert = [...new Set(feeds)]
    const compareFeedSets = (editableFeeds, feedsInAlert) => {
      let matchedFeeds = []
      for (var i = 0; i < feedsInAlert.length; i++) {

        // for each editable feed, add it to the matched feeds array if it is in the set of alert feeds
        const feed = editableFeeds.find((f) => { return feedsInAlert[i].id === f.id })
        if (typeof feed !== 'undefined')
          matchedFeeds.push(feed)
      }
      if (matchedFeeds.length !== feedsInAlert.length){
        return false
      }
      else{
        return true
      }
    }
    // const editingIsDisabled = !compareFeedSets(this.props.editableFeeds, uniqueFeedsInAlert)
    // const publishingIsDisabled = !compareFeedSets(this.props.publishableFeeds, uniqueFeedsInAlert)
    const editingIsDisabled = false
    const publishingIsDisabled = false
    // console.log(publishingIsDisabled)
    return (
      <Panel collapsible header={
        <Row>
          <Col xs={8}>
            <strong>{this.props.alert.title} (#{this.props.alert.id})</strong>
          </Col>
          <Col xs={4}>
            <ButtonGroup className='pull-right'>
              <Button disabled={editingIsDisabled} onClick={() => this.props.onEditClick(this.props.alert)}>
                <Glyphicon glyph="pencil" />
              </Button>
              <Button disabled={publishingIsDisabled} onClick={() => this.props.onDeleteClick(this.props.alert)}>
                <Glyphicon glyph="remove" />
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
      }>
        <p>
          <i>{moment(this.props.alert.start).format('MMM Do YYYY, h:mm:ssa')} to {moment(this.props.alert.end).format('MMM Do YYYY, h:mm:ssa')} </i>
          {this.props.alert.published
            ? <Label bsStyle="success" className='pull-right'>published</Label>
            : <Label bsStyle="warning" className='pull-right'>unpublished</Label>
          }
        </p>
        <p>{this.props.alert.description}</p>
        <p>URL: <a href={this.props.alert.url} target="_blank">{this.props.alert.url}</a></p>
        <p>
        {this.props.alert.affectedEntities.length
          ? <Label bsStyle="danger" className='pull-right'>{this.props.alert.affectedEntities.length} affected service(s)</Label>
          : <Label className='pull-right'>General alert</Label>
        }
        </p>
      </Panel>
    )
  }
}
