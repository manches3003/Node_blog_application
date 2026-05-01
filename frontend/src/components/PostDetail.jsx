import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { blogApi } from '../api/blogApi'
import './PostDetail.css'

function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadPost()
  }, [id])

  const loadPost = async () => {
    try {
      setLoading(true)
      const data = await blogApi.getPostById(id)
      setPost(data)
      setError(null)
    } catch (err) {
      setError('Failed to load post')
      console.error('Error loading post:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return

    try {
      await blogApi.deletePost(id)
      navigate('/posts')
    } catch (err) {
      alert('Failed to delete post')
      console.error('Error deleting post:', err)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'No date'
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading post...</p>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="error-container">
        <p className="error-message">{error || 'Post not found'}</p>
        <Link to="/posts" className="btn btn-primary">Back to Posts</Link>
      </div>
    )
  }

  return (
    <div className="post-detail-container">
      <Link to="/posts" className="back-link">← Back to Posts</Link>

      <article className="post-detail">
        <header className="post-detail-header">
          <h1 className="post-detail-title">{post.title}</h1>
          <div className="post-meta">
            <span className="meta-item">
              <span className="meta-icon">✍️</span>
              {post.author || 'Anonymous'}
            </span>
            <span className="meta-item">
              <span className="meta-icon">📅</span>
              {formatDate(post.createdAt)}
            </span>
          </div>
        </header>

        <div className="post-detail-content">
          {post.content}
        </div>

        <footer className="post-detail-footer">
          <Link to={`/posts/${id}/edit`} className="btn btn-primary">
            Edit Post
          </Link>
          <button onClick={handleDelete} className="btn btn-danger">
            Delete Post
          </button>
        </footer>
      </article>
    </div>
  )
}

export default PostDetail
