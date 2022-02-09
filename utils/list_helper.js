const _ = require('lodash')
const dummy = (blogs) => {
  blogs
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (total,item) => {
    return total + item.likes
  }
  return blogs.reduce(reducer,0)
}

const favorite = (blogs) => {
  return blogs.find(x => x.likes === Math.max.apply(Math,blogs.map(x => x.likes)))
}

const mostBlogs = (blogs) => {
  const result = _(blogs.map(x => x.author)).countBy().entries().maxBy(_.last())
  return {
    'author': result[0],
    'blogs': result[1]
  }
}

const mostLikes = (blogs) => {
  const mostLiked = Object.entries(_.mapValues(_.groupBy(blogs, x => x.author), totalLikes)).reduce((a, b) => a[1] > b[1] ? a : b)
  return { 'author': mostLiked[0], 'likes': mostLiked[1] }
}
module.exports = {
  dummy, totalLikes, favorite, mostBlogs, mostLikes
}