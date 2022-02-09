const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username:1, name: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request,response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.status(200).json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/:id/comments', async (request,response) => {
  const blog = await Blog.findById(request.params.id)
  blog.comments = blog.comments.concat(request.body.comment)
  await blog.save()
  response.status(200).json(blog)
})

blogsRouter.post('/',middleware.userExtractor, async (request, response) => {
  if (!request.user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const blog = request.body
  const user = request.user
  const add = new Blog({
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes || 0,
    user: user._id
  })
  const result = await add.save()
  user.blogs = user.blogs.concat(result._id)
  await user.save()
  response.status(201).json(result)
})

blogsRouter.delete('/:id',middleware.userExtractor, async (request, response) => {
  if (!request.user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const blog = await Blog.findById(request.params.id)
  const user = request.user
  if (!blog) {
    return response.status(404).json({ error: 'already deleted' })
  }
  if (blog.user.toString() === user.id) {
    await Blog.findByIdAndDelete(request.params.id)
    return response.status(204).end()
  }
  return response.status(401).json({
    error: 'Unauthorized to access the blog',
  })
})

blogsRouter.put('/:id',middleware.userExtractor, async (request,response) => {
  const blog = request.body
  const add = {
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes
  }
  const updated = await Blog.findByIdAndUpdate(request.params.id,add,{ new:true })
  response.json(updated)
})

module.exports = blogsRouter