# Node.js Blog Application - Complete Project Summary

## Project Origin

**Context:** DevOps Final Test requirement to rewrite an existing Flask blog application in Node.js/Express.js with full containerization and Kubernetes deployment.

**Original Flask App:** `C:\DATA_BACKUP\ALL_LANGUAGES_PROGRAMS\flask-blog` (fully functional with CI/CD, HPA, minikube deployment)

**New Node.js App:** `C:\DATA_BACKUP\ALL_LANGUAGES_PROGRAMS\node_blog_app`

---

## Test Requirements (100 Points Total)

| Deliverable | Points | Status |
|-------------|--------|--------|
| Rewrite Flask → Node.js/Express (CRUD endpoints) | 25 | ✅ Complete |
| Dockerfile (node:20-alpine) + docker-compose.yaml (named networks, volumes, healthcheck) | 25 | ✅ Complete |
| K8s Deployment manifest (replicas:1, probes, resource limits) | 20 | ✅ Complete |
| K8s Service manifest | 10 | ✅ Complete |
| Deploy on Minikube + Load test (500 users, 60s) + Report (PDF) | 20 | ⏳ Ready for execution |

---

## Project Structure

```
node_blog_app/
├── app.js                              # Main Express application entry point
├── package.json                        # Dependencies (express, sequelize, pg, etc.)
│
├── app/
│   ├── config/
│   │   └── database.js                 # Sequelize PostgreSQL connection
│   ├── models/
│   │   └── BlogPost.js                 # BlogPost Sequelize model
│   ├── controllers/
│   │   └── postController.js           # CRUD controller logic
│   └── routes/
│       └── api/
│           └── posts.js                # API route definitions
│
├── k8s/
│   ├── deployment.yaml                 # K8s Deployment (replicas, probes, resources)
│   ├── service.yaml                    # K8s NodePort Service
│   ├── hpa.yaml                        # Horizontal Pod Autoscaler
│   └── postgres.yaml                   # PostgreSQL Deployment + Service
│
├── Dockerfile                          # Docker build (node:20-alpine)
├── docker-compose.yaml                 # Docker Compose with networks & volumes
├── loadtest.js                         # k6 load test script (500 users, 60s)
├── tests/
│   └── posts.test.js                   # Jest unit tests
│
├── .env.example                        # Environment variables template
├── .dockerignore                       # Docker ignore patterns
├── .gitignore                          # Git ignore patterns
├── README.md                           # Documentation
└── .github/workflows/ci.yml            # CI/CD pipeline
```

---

## API Endpoints (Mirrors Flask App)

| Endpoint | Method | Description | Flask Equivalent |
|----------|--------|-------------|------------------|
| `/` | GET | Health check | `/` |
| `/health` | GET | Health endpoint | N/A |
| `/api/posts` | GET | Get all posts | `/posts` (API) |
| `/api/posts/:id` | GET | Get single post | `/posts/<id>` (API) |
| `/api/posts` | POST | Create new post | `/posts/create` (API) |
| `/api/posts/:id` | PUT | Update post | `/posts/<id>/update` (API) |
| `/api/posts/:id` | DELETE | Delete post | `/posts/<id>/delete` (API) |

---

## Technology Stack

| Component | Technology | Version |
|-----------|------------|---------|
| **Runtime** | Node.js | 20 (Alpine) |
| **Framework** | Express.js | 4.18.2 |
| **Database** | PostgreSQL | 15 (Alpine) |
| **ORM** | Sequelize | 6.35.2 |
| **Testing** | Jest + Supertest | 29.7.0 |
| **Load Testing** | k6 | Latest |
| **Container** | Docker | Latest |
| **Orchestration** | Kubernetes (minikube) | Latest |

---

## Docker Configuration

### Dockerfile Highlights
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1
CMD ["node", "app.js"]
```

### docker-compose.yaml Highlights
```yaml
services:
  app:
    build: .
    ports:
      - "5000:5000"
    networks:
      - blog-network
    healthcheck:
      test: ["CMD", "wget", "--spider", "http://localhost:5000/health"]
      interval: 30s
      timeout: 3s
      retries: 3

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_PASSWORD: KES92@pk  # User's actual password
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - blog-network

networks:
  blog-network:
    driver: bridge
    name: node-blog-network

volumes:
  postgres-data:
    name: node-blog-postgres-data
```

---

## Kubernetes Configuration

### Deployment (k8s/deployment.yaml)
```yaml
spec:
  replicas: 1  # Required by test
  template:
    spec:
      containers:
      - name: node-blog-app
        image: manches300/node-blog-app:latest
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 5000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 5000
          initialDelaySeconds: 5
          periodSeconds: 5
```

### Service (k8s/service.yaml)
```yaml
spec:
  type: NodePort
  selector:
    app: node-blog-app
  ports:
  - port: 80
    targetPort: 5000
    nodePort: 30080
```

### HPA (k8s/hpa.yaml)
```yaml
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: node-blog-app
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        averageUtilization: 50
  - type: Resource
    resource:
      name: memory
      target:
        averageUtilization: 70
```

### PostgreSQL (k8s/postgres.yaml)
- Single Deployment with 1 replica
- ClusterIP Service on port 5432
- Resource limits: 512Mi RAM, 500m CPU
- Health checks using `pg_isready`

---

## Deployment Commands

### 1. Create Kubernetes Secret
```bash
kubectl create secret generic node-blog-secrets `
  --from-literal=DATABASE_URL="postgresql://postgres:KES92@pk@postgres:5432/node_blog_db" `
  --from-literal=SECRET_KEY="dev-secret-key"
```

**Note:** The `@` symbol in password `KES92@pk` must be URL-encoded as `%40` in DATABASE_URL:
```
postgresql://postgres:KES92%40pk@postgres:5432/node_blog_db
```

### 2. Apply Manifests
```bash
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/hpa.yaml
```

### 3. Verify Deployment
```bash
kubectl get pods
kubectl get deployment node-blog-app
kubectl get hpa node-blog-app-hpa
kubectl get service node-blog-app
```

### 4. Access Application
```bash
minikube service node-blog-app --url
```

---

## Load Testing

### k6 Script (loadtest.js)
```javascript
export const options = {
  stages: [
    { duration: '10s', target: 100 },
    { duration: '10s', target: 300 },
    { duration: '10s', target: 500 },
    { duration: '60s', target: 500 },  // 500 users for 60 seconds (requirement)
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.1'],
  },
};
```

### Run Load Test
```bash
k6 run loadtest.js
```

---

## CI/CD Pipeline (.github/workflows/ci.yml)

1. **Test Job:** Runs on `ubuntu-latest`, executes `npm test`
2. **Build & Deploy Job:** 
   - Logs into Docker Hub
   - Builds and pushes image
   - Deploys to minikube using `manusa/actions-setup-minikube@v2`

### Required GitHub Secrets
| Name | Value |
|------|-------|
| `DOCKERHUB_USERNAME` | manches300 |
| `DOCKERHUB_PASSWORD` | Docker Hub token/password |

---

## Key Design Decisions

| Decision | Reason |
|----------|--------|
| **Sequelize ORM** | Mirrors Flask's SQLAlchemy patterns, familiar to user |
| **node:20-alpine** | Test requirement, smaller image size |
| **Separate controllers/routes** | Clean architecture, mirrors Flask's structure |
| **Health endpoint at `/health`** | Standard practice, used by probes |
| **Named networks/volumes** | Test requirement for docker-compose |
| **Resource limits** | Test requirement, matches Flask app config |
| **HPA min:2, max:10** | Matches Flask app, demonstrates scaling knowledge |

---

## Assumptions for Report

1. **Database:** PostgreSQL 15-alpine (same as Flask app)
2. **Docker Hub:** User has `manches300` account (verified from Flask deployment)
3. **Password:** `KES92@pk` (from user's docker-compose.yaml modification)
4. **Minikube:** Available and configured (user has existing minikube from Flask app)
5. **Load Test Tool:** k6 (industry standard, easy to script)
6. **Test Environment:** NODE_ENV=production (K8s deployment)
7. **Port:** 5000 (same as Flask app for consistency)

---

## Troubleshooting Reference

### Common Issues from Flask App (May Apply)

| Issue | Solution |
|-------|----------|
| **ImagePullBackOff** | Verify image exists on Docker Hub, check image name in deployment |
| **Database connection fails** | Check secret has correct DATABASE_URL with URL-encoded password |
| **Pod in CrashLoopBackOff** | `kubectl logs -l app=node-blog-app` to see error |
| **HPA not working** | Verify metrics-server is running: `kubectl get pods -n kube-system \| grep metrics` |
| **Pending pods** | Check resources: `kubectl top nodes`, minikube has limited RAM |

### Useful Commands
```bash
# View logs
kubectl logs -l app=node-blog-app
kubectl logs -l app=node-blog-app -f

# Check resource usage
kubectl top pods -l app=node-blog-app

# Restart deployment
kubectl rollout restart deployment node-blog-app

# Delete all pods (force recreate)
kubectl delete pods -l app=node-blog-app

# Check events
kubectl get events --sort-by='.lastTimestamp'
```

---

## Report Structure (20 Points)

Suggested outline for PDF report:

1. **Introduction** (2 pts)
   - Project overview
   - Architecture diagram

2. **Implementation** (5 pts)
   - Node.js/Express rewrite decisions
   - Folder structure
   - API endpoint mapping (Flask → Express)

3. **Containerization** (5 pts)
   - Dockerfile explanation
   - docker-compose.yaml with networks/volumes
   - Health checks

4. **Kubernetes Deployment** (5 pts)
   - Deployment manifest (resources, probes)
   - Service configuration
   - HPA configuration
   - Deployment steps

5. **Load Testing Results** (3 pts)
   - Test methodology
   - k6 script explanation
   - Results (response times, error rates)
   - Screenshots of HPA scaling

6. **Assumptions & Challenges** (Bonus)
   - All assumptions documented
   - Issues encountered and resolved

---

## Session Continuation

If continuing this work in a future session, provide this summary to the AI assistant. Key points:

- User prefers to **do the work themselves** - AI should **ask before making changes**
- User has **existing minikube setup** from Flask app
- User's **Docker Hub username:** `manches300`
- **Database password:** `KES92@pk` (remember to URL-encode `@` as `%40`)
- All files are **complete and ready** for testing/deployment

---

## Files Checklist

- [x] `package.json` - Dependencies configured
- [x] `app.js` - Express app entry point
- [x] `app/config/database.js` - Sequelize connection
- [x] `app/models/BlogPost.js` - Data model
- [x] `app/controllers/postController.js` - CRUD logic
- [x] `app/routes/api/posts.js` - API routes
- [x] `Dockerfile` - node:20-alpine, healthcheck
- [x] `docker-compose.yaml` - Named networks, volumes, healthchecks
- [x] `k8s/deployment.yaml` - replicas:1, probes, resources
- [x] `k8s/service.yaml` - NodePort service
- [x] `k8s/hpa.yaml` - Auto-scaling config
- [x] `k8s/postgres.yaml` - Database deployment
- [x] `loadtest.js` - k6 script (500 users, 60s)
- [x] `tests/posts.test.js` - Unit tests
- [x] `.github/workflows/ci.yml` - CI/CD pipeline
- [x] `README.md` - Documentation
- [x] `.env.example`, `.dockerignore`, `.gitignore`

**Status: READY FOR DEPLOYMENT**

---

**Created:** 2026-04-30  
**Author:** Kevin  
**Repository:** https://github.com/manches3003/blog_application (Flask)  
**New Project:** C:\DATA_BACKUP\ALL_LANGUAGES_PROGRAMS\node_blog_app
