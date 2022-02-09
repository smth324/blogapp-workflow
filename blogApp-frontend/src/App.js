import React, { useEffect, useRef } from 'react'
import LoginForm from './components/LoginForm'
import BlogsForm from './components/BlogsForm'
import Notification from './components/Notification'
import Togglable from './components/Toggleable'
import BlogList from './components/BlogList'
import { changeNotification } from './reducers/notificationReducer'
import { useSelector,useDispatch } from 'react-redux'
import { initializeBlogs } from './reducers/blogReducer'
import { initializeUser, logoutUser } from './reducers/userReducer'
import {
  Link, Switch, Route,useRouteMatch, useHistory
} from 'react-router-dom'
import Users from './components/Users'
import { initializeUsers } from './reducers/allUsersReducer'
import UserView from './components/UserView'
import BlogView from './components/BlogView'
import {
  Container,
  AppBar,
  Toolbar,
  Button
} from '@material-ui/core'

const App = () => {
  const blogsFormRef = useRef()
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)
  const allUsers = useSelector(state => state.allUsers)
  const history = useHistory()

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUser())
    dispatch(initializeUsers())
  }, [dispatch])

  const usermatch = useRouteMatch('/users/:id')
  const userToView = usermatch
    ? allUsers.find(x => x.id === usermatch.params.id)
    : null
  const blogmatch = useRouteMatch('/blogs/:id')
  const blogToView = blogmatch
    ? blogs.find(x => x.id === blogmatch.params.id)
    : null


  const handleLogout = () => {
    dispatch(logoutUser())
    dispatch(changeNotification(`${user.username} logged out succesfully`, 5))
    history.push('/')
  }

  return (
    <Container>
      <div>
        <h2>Blogs Application</h2>
        <Notification/>
        {user === null
          ? <LoginForm />
          :<div>
            <AppBar position='static'>
              <Toolbar>
                <Button id="blogsappbar" color="inherit" component={Link} to="/">
                   Blogs
                </Button>
                <Button color="inherit" component={Link} to="/users">
                  Users
                </Button>
                <em>{user.username} logged in</em> <Button color="inherit" onClick={handleLogout}>logout</Button>
              </Toolbar>
            </AppBar>
            <Switch>

              <Route path="/blogs/:id">
                <BlogView blog={blogToView}/>
              </Route>

              <Route path="/users/:id">
                <UserView user={userToView}/>
              </Route>

              <Route path="/users">
                <Users/>
              </Route>

              <Route path="/">
                <h2>Blogs</h2>
                <Togglable buttonLabel="create new blog" ref={blogsFormRef}>
                  <BlogsForm toggleVisibility={() => blogsFormRef.current.toggleVisibility()} />
                </Togglable><br/>
                <BlogList blogs={blogs}/>
              </Route>

            </Switch>
          </div>}
      </div>
    </Container>
  )
}

export default App