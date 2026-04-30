import { Link } from 'react-router-dom'
import './PostCard.css'

function PostCard({ post, onDelete }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'No date'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const truncateContent = (content, maxLength = 150) => {
    if (!content) return ''
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  return (
    <div className="post-card">
      <div className="post-card-header">
        <h3 className="post-title">{post.title}</h3>
        <span className="post-date">{formatDate(post.createdAt)}</span>
      </div>

      <p className="post-excerpt">{truncateContent(post.content)}</p>

      <div className="post-card-actions">
        <Link to={`/posts/${post.id}`} className="btn btn-secondary btn-sm">
          Read More
        </Link>
        <div className="post-card-actions-right">
          <Link to={`/posts/${post.id}/edit`} className="btn btn-outline btn-sm">
            Edit
          </Link>
          <button
            onClick={() => onDelete(post.id)}
            className="btn btn-danger btn-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default PostCard
