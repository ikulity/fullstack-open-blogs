const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const blog = new Blog({ ...request.body, user: '619d1608500c911f378c7766' })
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
    const id = request.params.id
    const result = await Blog.findByIdAndRemove(id)
    response.status(200).json(result)
})

blogsRouter.put('/:id', async (request, response) => {
    const id = request.params.id
    const updatedBlog = { likes: request.body.likes }
    const result = await Blog.findByIdAndUpdate(id, updatedBlog, { new: true })
    response.status(200).json(result)
})

module.exports = blogsRouter