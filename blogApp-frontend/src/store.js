import { createStore, combineReducers,  applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import notificationReducer from './reducers/notificationReducer'
import blogReducer from './reducers/blogReducer'
import thunk from 'redux-thunk'
import userReducer from './reducers/userReducer'
import allUsersReducer from './reducers/allUsersReducer'


const reducer = combineReducers({
  blogs: blogReducer,
  user: userReducer,
  notification: notificationReducer,
  allUsers: allUsersReducer
})

const store = createStore(reducer,
  composeWithDevTools(applyMiddleware(thunk)))

export default store