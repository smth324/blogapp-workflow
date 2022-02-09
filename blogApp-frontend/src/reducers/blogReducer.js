import blogService from '../services/blogs'
import { changeNotification } from './notificationReducer'

const blogReducer = (state = [], action) => {
  switch (action.type) {
  case 'INIT_BLOGS':
    return action.data
  case 'NEW_BLOG':
    return [...state, action.data]
  case 'LIKE_BLOG':
    return state.map(x => x.id !== action.data.id ? x : { ...action.data, likes : action.data.likes + 1 } )
  case 'DELETE_BLOG':
    return state.filter(x => x.id !== action.data.id)
  case 'COMMENT_BLOG':
    return state.map(x => x.id !== action.data.blog.id ? x : { ...action.data.blog, comments : action.data.commentedBlog.comments })
  default:
    return state
  }
}
export const commentBlog = (blog,comment) => {
  return async dispatch => {
    const commentedBlog = await blogService.addComment(blog.id,{ comment: comment })
    dispatch({
      type: 'COMMENT_BLOG',
      data: { blog,commentedBlog }
    })
  }
}
export const deleteBlog = blog => {
  return async dispatch => {
    try {
      await blogService.remove(blog.id)
      dispatch({
        type: 'DELETE_BLOG',
        data: blog
      })
      dispatch(changeNotification(`${blog.title} Deleted Succesfully`,5))
    } catch (excpetion) {
      dispatch(changeNotification(`${blog.title} Failed to Delete`,5))
    }
  }
}
export const likeBlog = blog => {
  return async dispatch => {
    await blogService.update(blog.id, { ...blog, likes: blog.likes + 1 })
    dispatch({
      type: 'LIKE_BLOG',
      data: blog
    })
  }
}
export const createNewBlog = blog => {
  return async dispatch => {
    try {
      const newBlog = await blogService.create(blog)
      dispatch({
        type:'NEW_BLOG',
        data: newBlog
      })
      dispatch(initializeBlogs())
      dispatch(changeNotification(`${blog.title} Added Succesfully`,5))
    } catch (exception) {
      dispatch(changeNotification(`${blog.title} Failed to Add`,5))
    }
  }
}
export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch({
      type: 'INIT_BLOGS',
      data: blogs
    })
  }
}

export default blogReducer