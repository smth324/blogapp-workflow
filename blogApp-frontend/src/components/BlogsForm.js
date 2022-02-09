import React, { useState } from 'react'
import { TextField, Button } from '@material-ui/core'
import { useDispatch } from 'react-redux'
import { createNewBlog } from '../reducers/blogReducer'

const Blogs = ({ toggleVisibility }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const dispatch = useDispatch()
  const handleCreate = (event) => {
    event.preventDefault()
    dispatch(createNewBlog({
      title: title,
      url: url,
      author: author
    }))
    toggleVisibility()
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>Create New Blog</h2>
      <form onSubmit={handleCreate}>
        <div>
          <TextField
            label="Title"
            id="title"
            value={title}
            name="title"
            onChange={({ target }) => setTitle(target.value)}/>
        </div>
        <div>
          <TextField
            label="Author"
            id="author"
            value={author}
            name="author"
            onChange={({ target }) => setAuthor(target.value)}/>
        </div>
        <div>
          <TextField
            label="URL"
            id="url"
            value={url}
            name="url"
            onChange={({ target }) => setUrl(target.value)}/>
        </div>
        <Button variant="outlined" color="primary" onClick={toggleVisibility}>cancel</Button> <Button id='create-blog' variant="contained" color="primary"  type="submit">Create</Button>
      </form><br/>
    </div>)
}

export default Blogs