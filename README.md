# Node.js Blog Application

Express.js blog application with PostgreSQL, deployed on Kubernetes (minikube) with Docker containerization.

## Project Structure

```
node_blog_app/
├── app.js                          # Main Express application
├── app/
│   ├── config/
│   │   └── database.js             # Sequelize database configuration
│   ├── controllers/
│   │   └── postController.js       # Blog post CRUD controllers
│   ├── models/
│   │   └── BlogPost.js             # BlogPost Sequelize model
│   └── routes/
│       └── api/
│           └── posts.js            # API routes
├── k8s/
│   ├── deployment.yaml             # Kubernetes Deployment
│   ├── service.yaml                # Kubernetes Service
│   ├── hpa.yaml                    # Horizontal Pod Autoscaler
│   └── postgres.yaml               # PostgreSQL Deployment + Service
├── Dockerfile                      # Docker build configuration
├── docker-compose.yaml             # Docker Compose with networks & volumes
├── package.json                    # Node.js dependencies
├── .env.example                    # Environment variables template
└── README.md
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check |
| `/health` | GET | Health check endpoint |
| `/api/posts` | GET | Get all blog posts |
| `/api/posts/:id` | GET | Get single blog post |
| `/api/posts` | POST | Create new blog post |
| `/api/posts/:id` | PUT | Update blog post |
| `/api/posts/:id` | DELETE | Delete blog post |

## Local Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Environment Variables

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials.

### 3. Run with Docker Compose

```bash
docker-compose up --build
```

Application will be available at `http://localhost:5000`

### 4. Run Locally (without Docker)

```bash
npm run dev
```

## Deployment to Minikube

### Step 1: Start Minikube

```bash
minikube start
```

### Step 2: Build and Push Docker Image

```bash
docker build -t manches300/node-blog-app:latest .
docker push manches300/node-blog-app:latest
```

### Step 3: Create Kubernetes Secret

```bash
kubectl create secret generic node-blog-secrets \
  --from-literal=DATABASE_URL="postgresql://postgres:postgres@postgres:5432/node_blog_db" \
  --from-literal=SECRET_KEY="dev-secret-key-change-in-production"
```

### Step 4: Apply Kubernetes Manifests

```bash
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/hpa.yaml
```

### Step 5: Verify Pods

```bash
kubectl get pods
```

### Step 6: Access Application

```bash
minikube service node-blog-app --url
```

## Kubernetes Configuration

### Resources

| Container | Memory Request | Memory Limit | CPU Request | CPU Limit |
|-----------|----------------|--------------|-------------|-----------|
| node-blog-app | 128Mi | 256Mi | 100m | 500m |
| postgres | 256Mi | 512Mi | 100m | 500m |

### Health Probes

- **Liveness Probe**: HTTP GET `/health` (initial delay: 30s, period: 10s)
- **Readiness Probe**: HTTP GET `/health` (initial delay: 5s, period: 5s)

### HPA Configuration

- **minReplicas**: 2
- **maxReplicas**: 10
- **Scale up**: CPU > 50% or Memory > 70%
- **Scale down**: Stabilization window 60s

## Useful Commands

### View Logs

```bash
kubectl logs -l app=node-blog-app
kubectl logs -l app=node-blog-app -f
```

### Scale Application

```bash
kubectl scale deployment node-blog-app --replicas=5
```

### Check HPA

```bash
kubectl get hpa node-blog-app-hpa
kubectl get hpa node-blog-app-hpa -w
```

### Monitor Resources

```bash
kubectl top pods -l app=node-blog-app
```

## Testing

```bash
npm test
```

## Load Testing

Using k6:

```javascript
import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 500,
  duration: '60s',
};

export default function () {
  http.get('http://localhost:5000/api/posts');
  sleep(1);
}
```

Run:

```bash
k6 run loadtest.js
```

## Tech Stack

| Component | Technology |
|-----------|------------|
| **Runtime** | Node.js 20 (Alpine) |
| **Framework** | Express.js 4.18 |
| **Database** | PostgreSQL 15 |
| **ORM** | Sequelize 6.35 |
| **Container** | Docker |
| **Orchestration** | Kubernetes (minikube) |

## License

MIT
