import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { Alert } from '@material-ui/lab'

const Notification = () => {
  const message = useSelector(state => state.notification)

  if (message==='') {
    return  null
  }
  if (message.includes('Failed')){
    return (
      <Alert className='message' severity="error">
        {message}
      </Alert>
    )
  }
  if (message.includes('Information')) {
    return (
      <Alert className='message'  severity="info">
        {message}
      </Alert>
    )
  }


  return (
    <Alert className='message' severity="success">
      {message}
    </Alert>
  )
}
Notification.propTypes = {
  message: PropTypes.string
}
export default Notification