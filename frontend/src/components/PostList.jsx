import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { blogApi } from '../api/blogApi'
import PostCard from './PostCard'
import './PostList.css'

function PostList() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      setLoading(true)
      const data = await blogApi.getAllPosts()
      setPosts(Array.isArray(data) ? data : [])
      setError(null)
    } catch (err) {
      setError('Failed to load posts. Make sure the API server is running.')
      console.error('Error loading posts:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return

    try {
      await blogApi.deletePost(id)
      setPosts(posts.filter(post => post.id !== id))
    } catch (err) {
      alert('Failed to delete post')
      console.error('Error deleting post:', err)
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading posts...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={loadPosts} className="retry-button">Retry</button>
      </div>
    )
  }

  return (
    <div className="post-list-container">
      <div className="post-list-header">
        <h1>All Posts</h1>
        <Link to="/posts/new" className="btn btn-primary">
          + Create New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📭</span>
          <h2>No posts yet</h2>
          <p>Be the first to create a blog post!</p>
          <Link to="/posts/new" className="btn btn-primary">Create Post</Link>
        </div>
      ) : (
        <div className="post-grid">
          {posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default PostList
