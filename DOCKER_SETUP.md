# 🐳 Docker Setup for Voice AI Agent

Docker solves the Python version and dependency compatibility issues!

## ✅ Benefits of Using Docker

- ✅ Uses Python 3.11 (compatible with all packages)
- ✅ Pre-configured environment
- ✅ No conda/pip conflicts
- ✅ Works on Windows, Mac, Linux
- ✅ Isolated from your system Python
- ✅ `daily-python` package will install correctly

## 📋 Prerequisites

1. **Install Docker Desktop**:
   - Download: https://www.docker.com/products/docker-desktop
   - Install and start Docker Desktop
   - Make sure Docker is running (check system tray)

2. **Verify Docker Installation**:
   ```bash
   docker --version
   docker-compose --version
   ```

## 🚀 Quick Start

### Option 1: Use Docker Compose (Recommended)

Run both frontend and backend together:

```bash
cd "c:\A SSD NEW WIN\code\agent-starter-embed"
docker-compose up --build
```

That's it! Your app will be available at:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8001

### Option 2: Run Containers Separately

**Backend only:**
```bash
cd "c:\A SSD NEW WIN\code\agent-starter-embed\backend"
docker build -t voiceai-backend .
docker run -p 8001:8001 --env-file .env voiceai-backend
```

**Frontend only:**
```bash
cd "c:\A SSD NEW WIN\code\agent-starter-embed\frontend"
docker build -t voiceai-frontend .
docker run -p 3000:3000 voiceai-frontend
```

## 🔧 Docker Commands

### Start services:
```bash
docker-compose up
```

### Start in background:
```bash
docker-compose up -d
```

### Rebuild and start:
```bash
docker-compose up --build
```

### Stop services:
```bash
docker-compose down
```

### View logs:
```bash
# All services
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Frontend only
docker-compose logs -f frontend
```

### Restart a service:
```bash
docker-compose restart backend
docker-compose restart frontend
```

## 📝 Configuration Files

### docker-compose.yml
Main configuration file that orchestrates both services.

### backend/Dockerfile
- Uses Python 3.11
- Installs system dependencies (gcc, portaudio, ffmpeg)
- Installs Python packages from requirements.txt
- Exposes port 8001

### frontend/Dockerfile
- Uses Node.js 20 LTS
- Installs npm dependencies
- Builds Next.js app
- Exposes port 3000

## 🔍 Troubleshooting

### Docker not starting?
```bash
# Check Docker status
docker ps

# If Docker Desktop isn't running, start it from Windows Start menu
```

### Port already in use?
```bash
# Check what's using the port
netstat -ano | findstr :8001
netstat -ano | findstr :3000

# Kill the process or change port in docker-compose.yml
```

### Container won't build?
```bash
# Clean rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up
```

### See what's running:
```bash
docker ps
```

### Access container shell:
```bash
# Backend
docker exec -it voiceai-backend bash

# Frontend
docker exec -it voiceai-frontend sh
```

### Check container logs:
```bash
docker logs voiceai-backend
docker logs voiceai-frontend
```

## 🧪 Testing After Docker Start

Once containers are running, test the system:

```bash
# Test backend health
curl http://localhost:8001/health

# Test room creation
curl -X POST http://localhost:8001/create-room

# Open frontend
start http://localhost:3000
```

## 🎯 Development Workflow

### With Hot Reload (Development)

For development with hot reload, use volume mounts (already configured in docker-compose.yml):

```bash
docker-compose up
```

Any changes you make to the code will automatically reflect in the containers!

### Without Docker (If you prefer)

After Docker works, you can verify the exact Python/Node versions and replicate locally:

```bash
# Check Python version in container
docker exec voiceai-backend python --version

# Check installed packages
docker exec voiceai-backend pip list
```

## 📦 What Gets Installed in Docker

### Backend (Python 3.11):
- ✅ pipecat-ai[daily,deepgram,google,cartesia]
- ✅ google-generativeai
- ✅ fastapi
- ✅ uvicorn[standard]
- ✅ python-dotenv
- ✅ aiohttp
- ✅ **daily-python** (works in Python 3.11!)

### Frontend (Node 20):
- ✅ Next.js 14
- ✅ @pipecat-ai/client-js
- ✅ @pipecat-ai/daily-transport
- ✅ shadcn/ui components

## 🎉 Success Indicators

When Docker is working correctly, you'll see:

```
✅ voiceai-backend   | INFO:     Started server process [1]
✅ voiceai-backend   | INFO:     Uvicorn running on http://0.0.0.0:8001
✅ voiceai-frontend  | ready - started server on 0.0.0.0:3000
```

Then:
1. Open http://localhost:3000
2. Click "Enable Voice"
3. Allow microphone access
4. Start talking to your AI! 🎤

---

## 💡 Why Docker Fixes the Issue

The Python 3.13 on your system doesn't have `daily-python` packages available. Docker uses Python 3.11, which has full support for all required packages including `daily-python`.

**No more dependency hell! 🎉**
