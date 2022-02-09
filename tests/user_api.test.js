const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const bcryptjs = require('bcryptjs')
jest.setTimeout(10000)
beforeEach(async () => {
  jest.setTimeout(10000)
  await User.deleteMany({})
  const passwordHash = await bcryptjs.hash('password', 10)
  const initialUser = new User({
    username: 'first',
    name: 'user',
    passwordHash,
  })
  await initialUser.save()
})

describe('posting users', () => {
  test('creating an invalid user with short password', async () => {
    const initialUsers = await User.find({})
    const invalidUser = {
      username: 'invalid',
      name: 'userinv',
      password: 'in'
    }
    await api
      .post('/api/users')
      .send(invalidUser)
      .expect(400)
      .expect({ error: 'password must be atleast 3 characters long' })
      .expect('Content-Type', /application\/json/)
    const usersAtEnd = await User.find({})
    expect(usersAtEnd.length).toBe(initialUsers.length)
  })
  test('creating a valid user', async () => {
    const initialUsers = await User.find({})
    const validUser = {
      username: 'valid',
      name: 'validuser',
      password: 'validpass'
    }
    await api
      .post('/api/users')
      .send(validUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const usersAtEnd = await User.find({})
    expect(usersAtEnd.length).toBe(initialUsers.length + 1)
    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(validUser.username)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
