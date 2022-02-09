import React, { useState } from 'react'
import { likeBlog, deleteBlog, commentBlog } from '../reducers/blogReducer'
import { useDispatch, useSelector } from 'react-redux'
import { TextField, Button,List,ListItem, Paper } from '@material-ui/core'
import { useHistory } from 'react-router-dom'

const BlogView =({ blog }) => {
  const [comment,setComment] = useState('')
  const dispatch = useDispatch()
  const history = useHistory()
  const user = useSelector(state => state.user)

  const like = async (blog) => {
    dispatch(likeBlog(blog))
  }

  const remove = async (blog) => {
    if (window.confirm(`Remove ${blog.title} by ${blog.author}`)) {
      dispatch(deleteBlog(blog))
      history.push('/')
    }
  }

  const addComment = async(blog) => {
    dispatch(commentBlog(blog,comment))
    setComment('')
  }

  if (!blog){
    return null
  }
  return(
    <div>
      <h2>{blog.title} {blog.author}</h2>
      <a href={blog.url} rel="noreferrer" target={'_blank'}>{blog.url}</a><br />
      {blog.likes} likes <Button variant="outlined" onClick={() => like(blog)}>like</Button><br />
      added by {blog.user.username}<br />
      {user.username === blog.user.username ? <Button variant="contained"  id='delete-button' onClick={() => remove(blog)}>remove</Button> : ''}
      <h3>Comments</h3>
      <TextField
        fullWidth
        label='Comment here'
        id="comment"
        value={comment}
        name="comment"
        onChange={({ target }) => setComment(target.value)}/>
      <Button variant="contained" color="primary" onClick={() => addComment(blog)}>add comment</Button>
      <List component={Paper} style={{ maxHeight: 300, overflow: 'auto',  background: 'whitesmoke' }}>
        {blog.comments.map((x,i) => <ListItem key={i}>{x}</ListItem>)}
      </List>
    </div>
  )
}

export default BlogView