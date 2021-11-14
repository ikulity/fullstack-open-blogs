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

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}