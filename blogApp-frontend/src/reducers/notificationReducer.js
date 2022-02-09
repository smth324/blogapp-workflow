const notificationReducer = (state = '', action) => {
  switch (action.type) {
  case 'NOTIFICATION_CHANGE':
    return action.data
  default:
    return state
  }
}
let timeoutid = 0
export const changeNotification = (message, duration) => {
  return async dispatch => {
    clearTimeout(timeoutid)
    dispatch({
      type: 'NOTIFICATION_CHANGE',
      data: message
    })
    timeoutid = setTimeout(() => {
      dispatch({
        type: 'NOTIFICATION_CHANGE',
        data: ''
      }
      )
    }, 1000 * duration)
  }
}

export default notificationReducer