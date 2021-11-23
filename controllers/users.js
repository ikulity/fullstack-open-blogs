const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
    response.json(users)
})

usersRouter.post('/', async (request, response) => {
    const body = request.body
    if (!body.password) throw new Error('Password is required!')
    if (body.password.length < 3) throw new Error('Password must be at least 3 characters')
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)
    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash
    })
    const savedUser = await user.save()
    response.status(201).json(savedUser)
})

// these are copied routes from the blogsRouter

// usersRouter.delete('/:id', async (request, response) => {
//     const id = request.params.id
//     const result = await User.findByIdAndRemove(id)
//     response.status(200).json(result)
// })

// usersRouter.put('/:id', async (request, response) => {
//     const id = request.params.id
//     const updatedUser = { likes: request.body.likes }
//     const result = await User.findByIdAndUpdate(id, updatedUser, { new: true })
//     response.status(200).json(result)
// })

module.exports = usersRouter