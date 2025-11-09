# 🚀 Deployment Guide

Complete guide for deploying your Pipecat voice AI agent to production.

---

## 🎯 Pre-Deployment Checklist

- [ ] All API keys configured in environment variables
- [ ] Backend tested locally
- [ ] Frontend tested locally
- [ ] CORS origins configured for production domain
- [ ] SSL/TLS certificates ready (HTTPS required for WebRTC)
- [ ] Daily.co account upgraded if needed (check rate limits)

---

## 🐳 Docker Deployment (Recommended)

### Option 1: Docker Compose

**1. Production docker-compose file:**

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: voiceai-backend-prod
    ports:
      - "8001:8001"
    environment:
      - DAILY_API_KEY=${DAILY_API_KEY}
      - DEEPGRAM_API_KEY=${DEEPGRAM_API_KEY}
      - CARTESIA_API_KEY=${CARTESIA_API_KEY}
      - GOOGLE_API_KEY=${GOOGLE_API_KEY}
    restart: always
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8001/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    networks:
      - voiceai-network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
      args:
        - NEXT_PUBLIC_BACKEND_URL=https://api.yourdomain.com
    container_name: voiceai-frontend-prod
    ports:
      - "3000:3000"
    depends_on:
      - backend
    restart: always
    networks:
      - voiceai-network

  nginx:
    image: nginx:alpine
    container_name: voiceai-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - backend
      - frontend
    restart: always
    networks:
      - voiceai-network

networks:
  voiceai-network:
    driver: bridge
```

**2. Deploy:**

```bash
# Set environment variables
export DAILY_API_KEY=your_key
export DEEPGRAM_API_KEY=your_key
export CARTESIA_API_KEY=your_key
export GOOGLE_API_KEY=your_key

# Build and start
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop
docker-compose -f docker-compose.prod.yml down
```

---

## ☁️ Cloud Platform Deployments

### AWS (Elastic Container Service)

**1. Build and push images:**

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com

# Build and tag backend
docker build -t voiceai-backend ./backend
docker tag voiceai-backend:latest YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/voiceai-backend:latest
docker push YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/voiceai-backend:latest

# Build and tag frontend
docker build -t voiceai-frontend ./frontend
docker tag voiceai-frontend:latest YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/voiceai-frontend:latest
docker push YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/voiceai-frontend:latest
```

**2. Create ECS task definition:**

```json
{
  "family": "voiceai-task",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/voiceai-backend:latest",
      "portMappings": [
        {
          "containerPort": 8001,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "DAILY_API_KEY",
          "value": "your_key"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/voiceai",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "backend"
        }
      }
    },
    {
      "name": "frontend",
      "image": "YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/voiceai-frontend:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NEXT_PUBLIC_BACKEND_URL",
          "value": "https://api.yourdomain.com"
        }
      ]
    }
  ],
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "1024",
  "memory": "2048",
  "networkMode": "awsvpc"
}
```

**3. Deploy with AWS CLI:**

```bash
# Create ECS cluster
aws ecs create-cluster --cluster-name voiceai-cluster

# Register task definition
aws ecs register-task-definition --cli-input-json file://task-definition.json

# Create service
aws ecs create-service \
  --cluster voiceai-cluster \
  --service-name voiceai-service \
  --task-definition voiceai-task \
  --desired-count 2 \
  --launch-type FARGATE
```

---

### Google Cloud Run

**1. Build and push:**

```bash
# Backend
cd backend
gcloud builds submit --tag gcr.io/YOUR_PROJECT/voiceai-backend
gcloud run deploy voiceai-backend \
  --image gcr.io/YOUR_PROJECT/voiceai-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars DAILY_API_KEY=your_key

# Frontend
cd ../frontend
gcloud builds submit --tag gcr.io/YOUR_PROJECT/voiceai-frontend
gcloud run deploy voiceai-frontend \
  --image gcr.io/YOUR_PROJECT/voiceai-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars NEXT_PUBLIC_BACKEND_URL=https://voiceai-backend-xyz.run.app
```

---

### Azure Container Apps

**1. Create resources:**

```bash
# Create resource group
az group create --name voiceai-rg --location eastus

# Create container registry
az acr create --resource-group voiceai-rg --name voiceairegistry --sku Basic

# Create container app environment
az containerapp env create \
  --name voiceai-env \
  --resource-group voiceai-rg \
  --location eastus
```

**2. Build and deploy:**

```bash
# Backend
az acr build --registry voiceairegistry --image voiceai-backend ./backend
az containerapp create \
  --name voiceai-backend \
  --resource-group voiceai-rg \
  --environment voiceai-env \
  --image voiceairegistry.azurecr.io/voiceai-backend \
  --target-port 8001 \
  --ingress external \
  --secrets daily-api-key=your_key \
  --env-vars DAILY_API_KEY=secretref:daily-api-key

# Frontend
az acr build --registry voiceairegistry --image voiceai-frontend ./frontend
az containerapp create \
  --name voiceai-frontend \
  --resource-group voiceai-rg \
  --environment voiceai-env \
  --image voiceairegistry.azurecr.io/voiceai-frontend \
  --target-port 3000 \
  --ingress external
```

---

### Railway (Easy Deploy)

**1. Install Railway CLI:**

```bash
npm install -g @railway/cli
railway login
```

**2. Deploy:**

```bash
# Initialize
railway init

# Deploy backend
cd backend
railway up

# Set environment variables in Railway dashboard
railway variables set DAILY_API_KEY=your_key

# Deploy frontend
cd ../frontend
railway up
railway variables set NEXT_PUBLIC_BACKEND_URL=https://your-backend.railway.app
```

---

### Render (Easy Deploy)

**1. Create `render.yaml`:**

```yaml
services:
  - type: web
    name: voiceai-backend
    env: docker
    dockerfilePath: ./backend/Dockerfile
    envVars:
      - key: DAILY_API_KEY
        sync: false
      - key: DEEPGRAM_API_KEY
        sync: false
      - key: CARTESIA_API_KEY
        sync: false
      - key: GOOGLE_API_KEY
        sync: false
    healthCheckPath: /health

  - type: web
    name: voiceai-frontend
    env: docker
    dockerfilePath: ./frontend/Dockerfile
    envVars:
      - key: NEXT_PUBLIC_BACKEND_URL
        value: https://voiceai-backend.onrender.com
```

**2. Deploy via Render dashboard or CLI**

---

## 🔒 SSL/TLS Setup

### Using Nginx with Let's Encrypt

**1. nginx.conf:**

```nginx
events {
    worker_connections 1024;
}

http {
    upstream backend {
        server backend:8001;
    }

    upstream frontend {
        server frontend:3000;
    }

    # Redirect HTTP to HTTPS
    server {
        listen 80;
        server_name yourdomain.com api.yourdomain.com;
        return 301 https://$server_name$request_uri;
    }

    # Backend API
    server {
        listen 443 ssl http2;
        server_name api.yourdomain.com;

        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;

        location / {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }

    # Frontend
    server {
        listen 443 ssl http2;
        server_name yourdomain.com;

        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;

        location / {
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

**2. Get SSL certificate:**

```bash
# Using certbot
certbot certonly --standalone -d yourdomain.com -d api.yourdomain.com

# Copy certificates
cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ./ssl/
cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ./ssl/
```

---

## 📊 Monitoring & Logging

### Application Monitoring

**1. Add health checks:**

```python
# backend/server.py
@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "services": {
            "daily": bool(DAILY_API_KEY),
            "deepgram": bool(os.getenv("DEEPGRAM_API_KEY")),
            "cartesia": bool(os.getenv("CARTESIA_API_KEY"))
        }
    }

@app.get("/metrics")
async def metrics():
    return {
        "active_bots": len(active_bots),
        "total_requests": request_counter,
        "uptime": time.time() - start_time
    }
```

**2. Setup logging:**

```python
import logging
from loguru import logger

# Configure structured logging
logger.add(
    "logs/app.log",
    rotation="1 day",
    retention="30 days",
    format="{time:YYYY-MM-DD HH:mm:ss} | {level} | {message}"
)
```

---

## 🔐 Environment Variables Management

### Using AWS Secrets Manager

```bash
# Store secrets
aws secretsmanager create-secret \
  --name voiceai/daily-api-key \
  --secret-string "your_daily_key"

# Retrieve in application
import boto3
client = boto3.client('secretsmanager')
secret = client.get_secret_value(SecretId='voiceai/daily-api-key')
DAILY_API_KEY = secret['SecretString']
```

### Using Docker Secrets

```bash
# Create secrets
echo "your_daily_key" | docker secret create daily_api_key -

# Use in docker-compose
services:
  backend:
    secrets:
      - daily_api_key
    environment:
      - DAILY_API_KEY_FILE=/run/secrets/daily_api_key
```

---

## 🎯 Production Optimizations

### Backend Dockerfile (Production)

```dockerfile
# backend/Dockerfile.prod
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Non-root user
RUN useradd -m appuser && chown -R appuser:appuser /app
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8001/health || exit 1

EXPOSE 8001

CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8001", "--workers", "4"]
```

### Frontend Dockerfile (Production)

```dockerfile
# frontend/Dockerfile.prod
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production image
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
USER nextjs

EXPOSE 3000

CMD ["npm", "start"]
```

---

## 📈 Scaling Strategies

### Horizontal Scaling

```bash
# Docker Swarm
docker service scale voiceai-backend=5

# Kubernetes
kubectl scale deployment voiceai-backend --replicas=5
```

### Load Balancing

```yaml
# AWS Application Load Balancer
services:
  backend:
    deploy:
      replicas: 3
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8001/health"]
```

---

## 🐛 Troubleshooting

### Common Issues

**1. WebRTC not working:**
- Ensure HTTPS is enabled (required for WebRTC)
- Check firewall rules allow WebRTC ports
- Verify Daily.co API key is valid

**2. High latency:**
- Choose STT/TTS providers closer to your users
- Enable CDN for static assets
- Use edge functions if available

**3. Memory issues:**
- Limit concurrent bot instances
- Implement proper cleanup in bot.py
- Monitor memory usage with tools

---

## 📚 Resources

- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [AWS ECS Deployment](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/)
- [Google Cloud Run Guide](https://cloud.google.com/run/docs)
- [Nginx Configuration](https://nginx.org/en/docs/)
