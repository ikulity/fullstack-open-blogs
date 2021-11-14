const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const likes = blogs.reduce((total, blog) => { return total + blog.likes }, 0)
    return likes
}

const favoriteBlog = (blogs) => {
    const favorite = blogs.reduce((prev, current) => {
        return (prev.likes > current.likes) ? prev : current
    })
    return favorite
}

const mostBlogs = (blogs) => {
    let authors = []
    blogs.forEach(blog => {
        const authorName = blog.author
        let isFound = false
        authors.forEach(authorObject => {
            if (authorObject.author === authorName) {
                isFound = true
                authorObject.blogs += 1
                console.log(`Author ${authorName} was found! New blog count is ${authorObject.blogs}`)
            }
        })
        if (!isFound) {
            authors = authors.concat({ author: authorName, blogs: 1 })
            console.log(`Author ${authorName} was not recorded, created a new object`)
            console.log('Heres the new authors list:', authors)
        } else {
            console.log(`Author ${authorName} was recorded, and increment happened!`)
        }
    })
    console.log("Authors and their blog counts", authors)
    return authors.reduce((prev, current) => {
        return (prev.blogs >= current.blogs) ? prev : current
    }, 0)
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs
}