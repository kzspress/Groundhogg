import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import Modal from 'react-bootstrap/Modal'
import Alert from 'react-bootstrap/Alert'
import ProgressBar from 'react-bootstrap/ProgressBar'
import { connect } from 'react-redux'
import { bulkJobProcessItems } from '../../actions/bulkJobActions'

const BulkJob = ({
  show,
  start,
  numRemaining,
  numCompleted,
  actionName,
  bulkJobProcessItems
}) => {

  useEffect(() => {
    if ( start ){
      bulkJobProcessItems()
    }
  }, [start])

  const totalItems = numRemaining + numCompleted;

  return (

    <Modal
      show={ show }
      backdrop={ 'static' }
      keyboard={ false }
    >
      <Modal.Header>
        <Modal.Title>
          { actionName }
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ProgressBar
          animated
          now={ (  numCompleted / totalItems ) * 100 }
          variant={ 'success' }/>
        <p>Complete: { numCompleted }</p>
        <p>Remaining: { numRemaining }</p>
        <Alert variant={ 'warning' }>
          <Alert.Heading>
            { 'Working...' }
          </Alert.Heading>
          <p>
            { 'Please do not leave or navigate way from this page until the process is complete.' }
          </p>
        </Alert>
      </Modal.Body>
    </Modal>
  )
}

export default connect( state => ({
  show: state.bulkJob.show,
  start: state.bulkJob.start,
  numRemaining: state.bulkJob.numRemaining,
  numCompleted: state.bulkJob.numCompleted,
  actionName: state.bulkJob.actionName,
}), {
  bulkJobProcessItems
} )(BulkJob)