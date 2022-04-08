const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const util = require('util')

const initialBlogs = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    },
    {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
    }
]
const newBlog = {
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0
}
const blogWithNolikes = {
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html"
}
const faultyBlog = {
    author: "Me, myself and I"
}
const user = { username: "testUser", password: "test"}
let token = "";
beforeAll(async () => {
    await api.post('/api/users')
        .send(user)
    const response = await api.post('/api/login')
        .send(user)
    token = response.body.token
})
beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[2])
    await blogObject.save()
})

test('initial notes have length of 3 and they are returned as JSON', async () => {
    const response = await api.get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveLength(initialBlogs.length)
})

test('a blog post has the property "id"', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
})

describe('adding a blog', () => {
    test('the length of the collection should increment and response should include the new blog', async () => {
        const response = await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `Bearer ${token}`)
            .expect(201)
        console.log("body: " + response.body)
        expect(response.body).toMatchObject(newBlog)

        // fetch all and check length
        const allBlogs = await api.get('/api/blogs')
        expect(allBlogs.body).toHaveLength(initialBlogs.length + 1)
    })

    test('if "likes" property is missing it defaults to 0', async () => {
        const response = await api
            .post('/api/blogs')
            .send(blogWithNolikes)
            .set('Authorization', `Bearer ${token}`)
            .expect(201)
        expect(response.body.likes).toBe(0)
    })

    test('if title or url are not defined, response returns "400 bad request"', async () => {
        await api.post('/api/blogs').send(faultyBlog).set('Authorization', `Bearer ${token}`).expect(400)
    })

    test('if token is not given, response returns 401', async () => {
        console.log(util.inspect(newBlog, {colors: true}))
        await api.post('/api/blogs').send(newBlog).expect(401)
    })
})

describe('deleting a blog', () => {
    test('returns the deleted blogs data', async () => {
        // create blog for test user
        const createResponse = await api.post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `Bearer ${token}`)
            .expect(201)
        const blog = createResponse.body

        // deletion
        const deletionResponse = await api.delete(`/api/blogs/${blog.id}`).set('Authorization', `Bearer ${token}`)
        expect(deletionResponse.body).toStrictEqual(blog)
    })
    test('if token is not given, response returns 401', async () => {
        await api.delete(`/api/blogs/${initialBlogs[0].id}`).send(newBlog).expect(401)
    })
})

describe('updating a blog', () => {
    test('updating the likes property should return the blog with new likes count', async () => {
        // fetch all blogs and pick one id to delete
        const allBlogs = await api.get('/api/blogs')
        const blog = allBlogs.body[0]

        const newLikes = { likes: 10 }
        const response = await api.put(`/api/blogs/${blog.id}`).send(newLikes)
        expect(response.body).toStrictEqual({ ...blog, ...newLikes })
    })
})


afterAll(() => {
    mongoose.connection.close()
})