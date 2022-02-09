const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper.test.js')
const Blog = require('../models/blog')
const User = require('../models/user')
jest.setTimeout(10000)

beforeAll(async () => {
  await User.deleteMany({})
  const account = {
    username: 'valid',
    name: 'name',
    password:'user'
  }
  await api
    .post('/api/users')
    .send(account)
    .expect(201)
})
beforeEach(async () => {
  await Blog.deleteMany({})
  const account = {
    username: 'valid',
    password: 'user'
  }
  const login = await api
    .post('/api/login')
    .send(account)
  await api
    .post('/api/blogs')
    .send(helper.initialBlogs[0])
    .set('Authorization', `bearer ${login.body.token}`)
  await api
    .post('/api/blogs')
    .send(helper.initialBlogs[1])
    .set('Authorization', `bearer ${login.body.token}`)
})

describe('get', () => {
  test('gets all blogs', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('checks id', async () => {
    const returnedBlogs = await api.get('/api/blogs')
    expect(returnedBlogs.body[0].id).toBeDefined()
    expect(returnedBlogs.body[0]._id).toBe(undefined)
  })
  test('get specific blog', async () => {
    const blogs = await api.get('/api/blogs')
    const result = await api
      .get(`/api/blogs/${blogs.body[0].id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(result.body.title).toEqual(blogs.body[0].title)
  })
  test('get blog that doesnt exist', async () => {
    await api
      .get('/api/blogs/619ef29cad8993defdcff312')
      .expect(404)
  })
})

describe('post while logged in', () => {
  const newBlog = {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10
  }
  test('post success', async () => {
    const account = {
      username: 'valid',
      password: 'user'
    }
    const login = await api
      .post('/api/login')
      .send(account)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${login.body.token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await api.get('/api/blogs')
    expect(blogsAtEnd.body).toHaveLength(helper.initialBlogs.length + 1)
    expect(blogsAtEnd.body.map(x => x.title)).toContain(newBlog.title)
  })
  test('post likes 0', async () => {
    const account = {
      username: 'valid',
      password: 'user'
    }
    const login = await api
      .post('/api/login')
      .send(account)
      .expect('Content-Type', /application\/json/)
    const newerBlog = {
      title: 'like tester',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    }
    await api
      .post('/api/blogs')
      .send(newerBlog)
      .set('Authorization', `bearer ${login.body.token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const blogsAtEnd = await api.get('/api/blogs')
    expect(blogsAtEnd.body).toHaveLength(helper.initialBlogs.length + 1)
    expect(blogsAtEnd.body.filter(x => x.title === 'like tester')[0].likes).toBe(0)
  })
  test('post missing', async () => {
    const account = {
      username: 'valid',
      password: 'user'
    }
    const login = await api
      .post('/api/login')
      .send(account)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const missingBlog = {
      author: 'william',
      likes: 1
    }
    await api
      .post('/api/blogs')
      .send(missingBlog)
      .set('Authorization', `bearer ${login.body.token}`)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })
})
describe('delete', () => {
  test('deleting a blog', async () => {
    const account = {
      username: 'valid',
      password: 'user'
    }
    const login = await api
      .post('/api/login')
      .send(account)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogs = await api
      .get('/api/blogs')
    await api
      .delete(`/api/blogs/${blogs.body[0].id}`)
      .set('Authorization', `bearer ${login.body.token}`)
      .expect(204)
    const blogsAtEnd = await api.get('/api/blogs')
    expect(blogsAtEnd.body).toHaveLength(blogs.body.length - 1)
  })
})

describe('updating a blog', () => {
  test('update one blog', async () => {
    const blogs = await api
      .get('/api/blogs')
    const updatedBlog = { ...blogs.body[0], likes: blogs.body[0].likes -1 }
    await api
      .put(`/api/blogs/${blogs.body[0].id}`)
      .send(updatedBlog)
      .expect('Content-Type', /application\/json/)
    const blogs2 = await api
      .get('/api/blogs')
    expect(blogs2.body[0]).toEqual(updatedBlog)
  })
})

describe('no token', () => {
  const newBlog = {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10
  }
  test('posting with no token', async () => {
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)
      .expect({ error: 'token missing or invalid' })
  })
  test('deleting with no token', async () => {
    const blogs = await api
      .get('/api/blogs')
    await api
      .delete(`/api/blogs/${blogs.body[0].id}`)
      .expect(401)
      .expect('Content-Type', /application\/json/)
      .expect({ error: 'token missing or invalid' })
  })
  test ('deleting with wrong token', async () => {
    const blogs = await api
      .get('/api/blogs')
    await api
      .delete(`/api/blogs/${blogs.body[0].id}`)
      .set('Authorization', 'bearer wrongtoken')
      .expect(400)
      .expect('Content-Type', /application\/json/)
      .expect({ error: 'invalid token' })
  })
})
afterAll(() => {
  mongoose.connection.close()
})