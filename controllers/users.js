const usersRouter = require('express').Router()
const User = require('../models/user')
const bcryptjs = require('bcryptjs')

usersRouter.post('/', async (request, response) => {
  const body = request.body
  if (body.password.length < 3) {
    return response.status(400).json({ error: 'password must be atleast 3 characters long' })
  }
  const passwordHash = await bcryptjs.hash(body.password, 10)
  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })
  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

usersRouter.get('/', async (request,response) => {
  const users = await User.find({}).populate('blogs', { title: 1 , url: 1, author: 1, })
  response.json(users)
})
module.exports = usersRouter