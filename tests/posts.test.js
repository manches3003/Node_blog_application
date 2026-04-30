const request = require('supertest');
const app = require('../app');

describe('Blog API Endpoints', () => {

  describe('GET /health', () => {
    it('should return healthy status', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('healthy');
    });
  });

  describe('GET /', () => {
    it('should return API info', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toContain('Node Blog API');
    });
  });

  describe('GET /api/posts', () => {
    it('should return all posts', async () => {
      const res = await request(app).get('/api/posts');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('posts');
      expect(Array.isArray(res.body.posts)).toBe(true);
    });
  });

  describe('POST /api/posts', () => {
    it('should create a new post', async () => {
      const newPost = {
        title: 'Test Post',
        content: 'This is test content',
        author: 'Test Author'
      };

      const res = await request(app)
        .post('/api/posts')
        .send(newPost);

      expect(res.statusCode).toBe(201);
      expect(res.body.post).toHaveProperty('id');
      expect(res.body.post.title).toBe('Test Post');
    });

    it('should return 400 if title is missing', async () => {
      const res = await request(app)
        .post('/api/posts')
        .send({ content: 'No title' });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain('required');
    });
  });

  describe('GET /api/posts/:id', () => {
    it('should return a single post', async () => {
      // First create a post
      const createRes = await request(app)
        .post('/api/posts')
        .send({ title: 'Single Post', content: 'Content' });

      const postId = createRes.body.post.id;

      // Then fetch it
      const res = await request(app).get(`/api/posts/${postId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.post.id).toBe(postId);
    });

    it('should return 404 for non-existent post', async () => {
      const res = await request(app).get('/api/posts/99999');
      expect(res.statusCode).toBe(404);
    });
  });

  describe('PUT /api/posts/:id', () => {
    it('should update a post', async () => {
      // Create a post first
      const createRes = await request(app)
        .post('/api/posts')
        .send({ title: 'Original', content: 'Original content' });

      const postId = createRes.body.post.id;

      // Update it
      const res = await request(app)
        .put(`/api/posts/${postId}`)
        .send({ title: 'Updated Title' });

      expect(res.statusCode).toBe(200);
      expect(res.body.post.title).toBe('Updated Title');
    });
  });

  describe('DELETE /api/posts/:id', () => {
    it('should delete a post', async () => {
      // Create a post first
      const createRes = await request(app)
        .post('/api/posts')
        .send({ title: 'To Delete', content: 'Will be deleted' });

      const postId = createRes.body.post.id;

      // Delete it
      const res = await request(app)
        .delete(`/api/posts/${postId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toContain('deleted');
    });
  });
});
