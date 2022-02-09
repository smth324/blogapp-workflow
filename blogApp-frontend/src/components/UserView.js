import React from 'react'
import {
  List,ListItem,Paper
} from '@material-ui/core'
import { Link } from 'react-router-dom'
const UserView = ({ user }) => {
  if (!user){
    return null
  }
  return(
    <div>
      <h2>{user.username}</h2>
      <h3>Added Blogs</h3>
      <Paper style={{ maxHeight: 380, overflow: 'auto', background: 'whitesmoke' }}>
        <List>
          {user.blogs.map(x =>
            <ListItem key={x.id}>
              <Link to={`/blogs/${x.id}`}>{x.title}</Link>
            </ListItem>
          )}
        </List>
      </Paper>
    </div>
  )
}

export default UserView