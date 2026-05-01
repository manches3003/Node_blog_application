# Node.js Blog Application

A full-stack blog application built with Node.js, Express.js, React, and PostgreSQL. Features complete CRUD operations, containerization with Docker, and Kubernetes deployment with horizontal auto-scaling.

![Node.js](https://img.shields.io/badge/Node.js-20-green?logo=node.js)
![Express.js](https://img.shields.io/badge/Express-4.18-blue?logo=express)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)
![Kubernetes](https://img.shields.io/badge/K8s-Deployed-blue?logo=kubernetes)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Frontend](#frontend)
- [Docker & Containerization](#docker--containerization)
- [Kubernetes Deployment](#kubernetes-deployment)
- [CI/CD Pipeline](#cicd-pipeline)
- [Load Testing](#load-testing)
- [License](#license)

---

## Features

- **Full CRUD Operations** - Create, Read, Update, Delete blog posts
- **Modern React Frontend** - Built with Vite, React Router, and responsive design
- **RESTful API** - Clean Express.js backend with Sequelize ORM
- **PostgreSQL Database** - Relational data storage with Sequelize
- **Docker Support** - Multi-stage builds for optimized container images
- **Kubernetes Ready** - Deployment manifests with HPA auto-scaling
- **CI/CD Pipeline** - Automated testing, building, and deployment via GitHub Actions

---

## Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| **Frontend** | React, Vite, React Router, Axios | 19 |
| **Backend** | Node.js, Express.js | 20 / 4.18 |
| **Database** | PostgreSQL | 15 |
| **ORM** | Sequelize | 6.35 |
| **Testing** | Jest, Supertest, k6 | Latest |
| **Container** | Docker | node:20-alpine |
| **Orchestration** | Kubernetes (Minikube) | Latest |
| **CI/CD** | GitHub Actions | Latest |

---

## Project Structure

```
node_blog_app/
├── app/                          # Backend source
│   ├── config/
│   │   └── database.js           # Sequelize connection
│   ├── models/
│   │   └── BlogPost.js           # Blog post model
│   ├── controllers/
│   │   └── postController.js     # CRUD handlers
│   └── routes/
│       └── api/
│           └── posts.js          # API routes
├── frontend/                     # React frontend
│   ├── src/
│   │   ├── api/
│   │   │   └── blogApi.js        # API service layer
│   │   ├── components/
│   │   │   ├── App.jsx
│   │   │   ├── PostList.jsx
│   │   │   ├── PostCard.jsx
│   │   │   ├── PostForm.jsx
│   │   │   └── PostDetail.jsx
│   │   ├── App.css
│   │   └── index.css
│   ├── dist/                     # Production build
│   └── package.json
├── k8s/                          # Kubernetes manifests
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── hpa.yaml
│   └── postgres.yaml
├── .github/
│   └── workflows/
│       └── ci.yml                # CI/CD pipeline
├── app.js                        # Express entry point
├── Dockerfile                    # Multi-stage build
├── docker-compose.yaml           # Local development
├── loadtest.js                   # k6 load test script
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- k6 (for load testing)
- Minikube (for K8s deployment)

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/manches3003/blog_application.git
   cd node_blog_app
   ```

2. **Install backend dependencies:**
   ```bash
   npm install
   ```

3. **Install frontend dependencies:**
   ```bash
   cd frontend && npm install && cd ..
   ```

4. **Start with Docker Compose (recommended):**
   ```bash
   docker-compose up -d
   ```

   Or run separately:
   ```bash
   # Terminal 1 - Backend
   npm run dev

   # Terminal 2 - Frontend (dev mode)
   cd frontend && npm run dev
   ```

5. **Access the application:**
   - Frontend: http://localhost:5173 (dev) or http://localhost:5000 (Docker)
   - API: http://localhost:5000/api

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/health` | Health status |
| GET | `/api/posts` | Get all posts |
| GET | `/api/posts/:id` | Get single post |
| POST | `/api/posts` | Create new post |
| PUT | `/api/posts/:id` | Update post |
| DELETE | `/api/posts/:id` | Delete post |

### Example Request

```bash
# Create a new post
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"My Post","content":"Blog content","author":"John"}'
```

---

## Frontend

The React frontend provides a modern, responsive UI for blog management.

### Development

```bash
cd frontend
npm run dev
```

### Production Build

```bash
cd frontend
npm run build
```

The built files are served from the backend's `public/` folder in production.

### Features

- **Post List** - Grid view of all blog posts
- **Post Detail** - Full post view with metadata
- **Create Post** - Form with validation
- **Edit Post** - Update existing posts
- **Delete Post** - With confirmation dialog
- **Responsive Design** - Works on all screen sizes

---

## Docker & Containerization

### Build Image

```bash
docker build -t manches300/node-blog-app:latest .
```

### Run with Docker Compose

```bash
docker-compose up -d
```

This starts:
- **PostgreSQL** on port 5432
- **Node.js App** on port 5000

### Multi-Stage Build

The Dockerfile uses a multi-stage build:
1. **Stage 1:** Builds React frontend
2. **Stage 2:** Builds backend + serves static frontend files

---

## Kubernetes Deployment

### Prerequisites

```bash
minikube start
```

### Deploy to Minikube

1. **Create Kubernetes Secret:**
   ```bash
   kubectl create secret generic node-blog-secrets \
     --from-literal=DATABASE_URL="postgresql://postgres:KES92%40pk@postgres:5432/node_blog_db" \
     --from-literal=SECRET_KEY="dev-secret-key"
   ```

2. **Apply Manifests:**
   ```bash
   kubectl apply -f k8s/postgres.yaml
   kubectl apply -f k8s/deployment.yaml
   kubectl apply -f k8s/service.yaml
   kubectl apply -f k8s/hpa.yaml
   ```

3. **Verify Deployment:**
   ```bash
   kubectl get pods
   kubectl get hpa
   ```

4. **Access Application:**
   ```bash
   minikube service node-blog-app --url
   ```

### Horizontal Pod Autoscaler (HPA)

| Setting | Value |
|---------|-------|
| Min Replicas | 2 |
| Max Replicas | 10 |
| CPU Target | 50% |
| Memory Target | 70% |

---

## CI/CD Pipeline

The GitHub Actions workflow automates:

1. **Test:** Runs Jest unit tests
2. **Frontend Build:** Builds React app
3. **Docker:** Builds and pushes image to Docker Hub
4. **Deploy:** Deploys to Minikube

### Required Secrets

| Secret Name | Description |
|-------------|-------------|
| `DOCKERHUB_USERNAME` | Docker Hub username |
| `DOCKERHUB_PASSWORD` | Docker Hub access token (Read & Write) |

### Workflow Triggers

- Push to `main` branch
- Pull requests to `main`

---

## Load Testing

### Run k6 Load Test

```bash
k6 run loadtest.js
```

### Test Configuration

| Stage | Duration | Target Users |
|-------|----------|--------------|
| Ramp up | 10s | 0 → 100 |
| Ramp up | 10s | 100 → 300 |
| Ramp up | 10s | 300 → 500 |
| Sustained | 60s | 500 |
| Ramp down | 10s | 500 → 0 |

### Thresholds

- 95% of requests complete within 2 seconds
- Error rate < 50%

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 5000) |
| `NODE_ENV` | Environment | No (default: development) |
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `SECRET_KEY` | Session/crypto key | Yes |

See `.env.example` for template.

---

## Useful Commands

### Docker

```bash
docker-compose up -d          # Start containers
docker-compose down           # Stop containers
docker-compose logs -f        # View logs
```

### Kubernetes

```bash
kubectl get pods              # List pods
kubectl get svc               # List services
kubectl get hpa               # Check autoscaler
kubectl logs -l app=node-blog-app -f  # View app logs
kubectl rollout restart deployment node-blog-app  # Restart
```

### Development

```bash
npm run dev                   # Start backend (dev)
npm run frontend              # Start frontend (dev)
npm run dev:all               # Start both
npm test                      # Run tests
```

---

## License

MIT License

---

## Author

**Kevin**  
GitHub: [@manches3003](https://github.com/manches3003)

---

## Acknowledgments

- DevOps Final Test Project
- Built as a Node.js/React rewrite of a Flask blog application
