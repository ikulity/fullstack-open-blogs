const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const body = request.body
    const user = request.user

    const blog = new Blog({ 
        title: body.title,
        url: body.url,
        likes: body.likes,
        author: body.author,
        user: user._id,
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
    const id = request.params.id
    const user = request.user
    const blog = await Blog.findById(id)

    if (blog.user.toString() !== user._id.toString()) {
        return response.status(403).json({ error: 'not owner of the blog' })
    }

    const result = await Blog.findByIdAndRemove(id)
    user.blogs = user.blogs.filter(blog => blog !== id)
    await user.save()

    response.status(200).json(result)
})

blogsRouter.put('/:id', async (request, response) => {
    const id = request.params.id
    const updatedBlog = { likes: request.body.likes }
    const result = await Blog.findByIdAndUpdate(id, updatedBlog, { new: true })
    response.status(200).json(result)
})

module.exports = blogsRouter