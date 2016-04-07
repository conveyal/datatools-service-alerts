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
        const feed = editableFeeds ? editableFeeds.find((f) => { return feedsInAlert[i].id === f.id }) : null
        if (feed)
          matchedFeeds.push(feed)
      }
      if (matchedFeeds.length !== feedsInAlert.length){
        return false
      }
      else{
        return true
      }
    }
    console.log(this.props.editableFeeds, uniqueFeedsInAlert)
    const editingIsDisabled = this.props.alert.published && !compareFeedSets(this.props.publishableFeeds, uniqueFeedsInAlert) ? true : !compareFeedSets(this.props.editableFeeds, uniqueFeedsInAlert)

    // if user has edit rights and alert is unpublished, user can delete alert, else check if they have publish rights
    const deleteIsDisabled = !editingIsDisabled && !this.props.alert.published ? false : !compareFeedSets(this.props.publishableFeeds, uniqueFeedsInAlert)
    const deleteButtonMessage = this.props.alert.published && deleteIsDisabled ? 'Cannot delete because alert is published'
      : !compareFeedSets(this.props.editableFeeds, uniqueFeedsInAlert) ? 'Cannot alter alerts for other agencies' : 'Delete alert'

      const editButtonMessage = this.props.alert.published && deleteIsDisabled ? 'Cannot edit because alert is published'
        : !compareFeedSets(this.props.editableFeeds, uniqueFeedsInAlert) ? 'Cannot alter alerts for other agencies' : 'Edit alert'

    return (
      <Panel collapsible header={
        <Row>
          <Col xs={8}>
            <strong>{this.props.alert.title} (#{this.props.alert.id})</strong>
          </Col>
          <Col xs={4}>
            <ButtonGroup className='pull-right'>
              <Button title={editButtonMessage} disabled={editingIsDisabled} onClick={() => this.props.onEditClick(this.props.alert)}>
                <Glyphicon glyph="pencil" />
              </Button>
              <Button title={deleteButtonMessage} disabled={deleteIsDisabled} onClick={() => this.props.onDeleteClick(this.props.alert)}>
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
