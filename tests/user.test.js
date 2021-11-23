const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const User = require('../models/user')
const initialUsers = [
    {
        username: 'ikulity',
        name: 'myname',
        passwordHash: 'blaa',
    },
    {
        username: 'morty240',
        name: 'mort-e',
        passwordHash: 'blaa',
    }
]

beforeEach(async () => {
    await User.deleteMany({})
    let userObject = new User(initialUsers[0])
    await userObject.save()
    userObject = new User(initialUsers[1])
    await userObject.save()
})

describe('adding a user', () => {
    const badUsers = [
        {
            password: 'blaa',
            name: 'trollUser'
        },
        {
            username: 'doingthisforfun',
            name: 'trollUser',
            password: '12'
        },
        {
            username: 'do',
            name: 'trollUser',
            password: '123456'
        },
        {
            username: initialUsers[0].username,
            name: 'trollUser',
            password: 'verygoodpassword'
        }
    ]
    test('username and password are required', async () => {
        const response = await api.post('/api/users').send(badUsers[0])
        console.log(response.status)
        expect(response.status).toBe(400)
    })
    test('username must be at least 3 characters', async () => {
        const response = await api.post('/api/users').send(badUsers[1])
        expect(response.status).toBe(400)
    })
    test('password must be at least 3 characters', async () => {
        const response = await api.post('/api/users').send(badUsers[2])
        expect(response.status).toBe(400)
    })
    test('usernames must be unique', async () => {
        const response = await api.post('/api/users').send(badUsers[3])
        expect(response.status).toBe(400)
    })
    const validUser = {
        username: "uniqueName",
        name: "validUser",
        password: "thispasswordisvalid"
    }
    test('successful user creation returns the user object', async () => {
        const response = await api.post('/api/users').send(validUser)
        expect(response.body).toMatchObject({ username: validUser.username, name: validUser.name })
    })
})


afterAll(() => {
    mongoose.connection.close()
})