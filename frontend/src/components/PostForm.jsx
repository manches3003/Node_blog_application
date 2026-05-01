import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { blogApi } from '../api/blogApi'
import './PostForm.css'

function PostForm({ edit = false }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (edit && id) {
      loadPost()
    }
  }, [id, edit])

  const loadPost = async () => {
    try {
      setLoading(true)
      const post = await blogApi.getPostById(id)
      setFormData({
        title: post.title || '',
        content: post.content || '',
        author: post.author || '',
      })
    } catch (err) {
      alert('Failed to load post')
      console.error('Error loading post:', err)
      navigate('/posts')
    } finally {
      setLoading(false)
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.content.trim()) newErrors.content = 'Content is required'
    if (!formData.author.trim()) newErrors.author = 'Author is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    try {
      setLoading(true)
      if (edit) {
        await blogApi.updatePost(id, formData)
        alert('Post updated successfully!')
      } else {
        await blogApi.createPost(formData)
        alert('Post created successfully!')
      }
      navigate('/posts')
    } catch (err) {
      alert(`Failed to ${edit ? 'update' : 'create'} post`)
      console.error('Error saving post:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading && edit) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading post...</p>
      </div>
    )
  }

  return (
    <div className="form-container">
      <div className="form-header">
        <Link to="/posts" className="back-link">← Back to Posts</Link>
        <h1>{edit ? 'Edit Post' : 'Create New Post'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter post title..."
            className={errors.title ? 'error' : ''}
          />
          {errors.title && <span className="error-text">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="author">Author</label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="Enter author name..."
            className={errors.author ? 'error' : ''}
          />
          {errors.author && <span className="error-text">{errors.author}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Write your blog post content..."
            rows={12}
            className={errors.content ? 'error' : ''}
          />
          {errors.content && <span className="error-text">{errors.content}</span>}
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/posts')} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : edit ? 'Update Post' : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default PostForm
