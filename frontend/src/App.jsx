import { Routes, Route, Link } from 'react-router-dom'
import PostList from './components/PostList'
import PostForm from './components/PostForm'
import PostDetail from './components/PostDetail'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo">
            <span className="logo-icon">📝</span>
            <span className="logo-text">Node Blog</span>
          </Link>
          <nav className="nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/posts" className="nav-link">Posts</Link>
            <Link to="/posts/new" className="nav-link nav-link-primary">+ New Post</Link>
          </nav>
        </div>
      </header>

      <main className="main">
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/posts" element={<PostList />} />
          <Route path="/posts/new" element={<PostForm />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/posts/:id/edit" element={<PostForm edit />} />
        </Routes>
      </main>

      <footer className="footer">
        <p>&copy; 2026 Node Blog Application. Built with React + Vite</p>
      </footer>
    </div>
  )
}

export default App
