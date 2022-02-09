import loginService from '../services/login'
import blogService from '../services/blogs'
import { changeNotification } from './notificationReducer'

const userReducer = (state = null, action) => {
  switch (action.type) {
  case 'LOGIN_USER':
    return action.data
  case 'LOGOUT_USER':
    return null
  default:
    return state
  }
}

export const loginUser = loginInfo => {
  return async dispatch => {
    try {
      const user = await loginService(loginInfo)
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      dispatch({
        type: 'LOGIN_USER',
        data: user
      })
      dispatch(changeNotification(`${user.username} logged in succesfully`, 5))
    } catch (excpetion) {
      dispatch(changeNotification('Logged in failed or incorrect username or password', 5))
    }
  }}

export const initializeUser = () => {
  const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
  if (loggedUserJSON) {
    const user = JSON.parse(loggedUserJSON)
    blogService.setToken(user.token)
    return  {
      type: 'LOGIN_USER',
      data: user
    }
  }
  return {
    type: 'LOGOUT_USER'
  }
}

export const logoutUser = () => {
  window.localStorage.clear()
  return {
    type: 'LOGOUT_USER'
  }
}

export default userReducer