const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')
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
    test('the length of the collection should increment and response should include the new blog', async () => {
        const response = await api.post('/api/blogs').send(newBlog)
        expect(response.body).toMatchObject(newBlog)

        // fetch all and check length
        const allBlogs = await api.get('/api/blogs')
        expect(allBlogs.body).toHaveLength(initialBlogs.length + 1)
    })

    test('if "likes" property is missing it defaults to 0', async () => {
        const response = await api.post('/api/blogs').send(blogWithNolikes)
        expect(response.body.likes).toBe(0)
    })

    test('if title or url are not defined, response returns "400 bad request"', async () => {
        await api.post('/api/blogs').send(faultyBlog).expect(400)
    })
})

describe('deleting a blog', () => {
    test('returns the deleted blogs data', async () => {
        // fetch all blogs and pick one id to delete
        const allBlogs = await api.get('/api/blogs')
        const blog = allBlogs.body[0]

        // deletion
        const response = await api.delete(`/api/blogs/${blog.id}`)
        console.log("RESPONSE BODY", response.body)
        expect(response.body).toStrictEqual(blog)
    })
})


afterAll(() => {
    mongoose.connection.close()
})