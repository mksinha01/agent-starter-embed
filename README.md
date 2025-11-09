# 🎙️ Pipecat Voice AI Agent - Universal Template

> **A production-ready, framework-agnostic template for integrating Pipecat voice AI agents with any frontend**

[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![Python](https://img.shields.io/badge/Python-3.9+-green.svg)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Transform any web application into a voice-enabled AI assistant in minutes. This standardized template provides everything you need to integrate real-time voice conversations powered by Pipecat AI framework.

---

## ⭐ Key Features

- ✅ **Frontend Agnostic**: Works with React, Vue, Angular, Next.js, or vanilla JavaScript
- ✅ **Plug & Play AI Services**: Easily swap STT, TTS, and LLM providers
- ✅ **Docker Ready**: Full containerization for instant deployment
- ✅ **Production Tested**: CORS, health checks, error handling, logging included
- ✅ **WebRTC Real-time**: Low-latency voice communication via Daily.co
- ✅ **Well Documented**: Comprehensive guides for customization and deployment
- ✅ **Example Integrations**: React, Vue, and vanilla JS examples included

---

## 🚀 Quick Start (5 Minutes)

### Prerequisites

- **Docker & Docker Compose** (recommended) OR
- **Python 3.9+** and **Node.js 18+**
- **Daily.co API key** (free tier: https://dashboard.daily.co/)

### 1. Clone & Setup

```bash
git clone <your-repo-url>
cd pipecat-voice-agent-template

# Copy environment template
cp backend/.env.example backend/.env
```

### 2. Configure API Keys

Edit `backend/.env` and add your keys:

```env
DAILY_API_KEY=your_daily_api_key_here        # Required
DEEPGRAM_API_KEY=your_deepgram_key           # Speech-to-Text
CARTESIA_API_KEY=your_cartesia_key           # Text-to-Speech  
GOOGLE_API_KEY=your_google_key               # Language Model
```

**Get API Keys:**
- Daily.co: https://dashboard.daily.co/developers
- Deepgram: https://console.deepgram.com/
- Cartesia: https://cartesia.ai/
- Google AI: https://makersuite.google.com/app/apikey

### 3. Run with Docker (Recommended)

```bash
# Start both backend and frontend
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

**Access your app:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8001
- API Docs: http://localhost:8001/docs

### 4. Or Run Locally

**Backend:**
```bash
cd backend
pip install -r requirements.txt
python server.py
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## � How to Use

### With the Included Frontend (Next.js)

1. Open http://localhost:3000
2. Click **"Enable Voice"** button
3. Start speaking - the AI will respond with voice!

### Integrate with Your Own Frontend

```javascript
// Step 1: Create a voice session
const response = await fetch('http://localhost:8001/create-room', {
  method: 'POST'
});
const { room_url, token } = await response.json();

// Step 2: Connect using Pipecat Client SDK
import { RTVIClient } from '@pipecat-ai/client-js';
import { DailyTransport } from '@pipecat-ai/daily-transport';

const client = new RTVIClient({
  transport: new DailyTransport(),
  params: { baseUrl: room_url },
  enableMic: true
});

await client.connect(token);
```

**See detailed integration guides:** [docs/FRONTEND_INTEGRATION.md](docs/FRONTEND_INTEGRATION.md)

---

## 🎨 Customization

### Swap AI Services

All AI services are configured in `backend/bot.py`. Mix and match providers:

```python
# Change Speech-to-Text
from pipecat.services.assemblyai import AssemblyAISTTService
stt = AssemblyAISTTService(api_key=os.getenv("ASSEMBLYAI_API_KEY"))

# Change Text-to-Speech
from pipecat.services.elevenlabs import ElevenLabsTTSService
tts = ElevenLabsTTSService(
    api_key=os.getenv("ELEVENLABS_API_KEY"),
    voice_id="rachel"
)

# Change Language Model
from pipecat.services.openai import OpenAILLMService
llm = OpenAILLMService(
    api_key=os.getenv("OPENAI_API_KEY"),
    model="gpt-4"
)
```

**Supported providers:**
- **STT**: Deepgram, AssemblyAI, Azure, Google, AWS Transcribe
- **TTS**: Cartesia, ElevenLabs, Azure, Google, AWS Polly, OpenAI
- **LLM**: Google Gemini, OpenAI GPT, Claude, Groq, Local (Ollama)

**Full customization guide:** [docs/AI_SERVICE_CUSTOMIZATION.md](docs/AI_SERVICE_CUSTOMIZATION.md)

### Replace the Frontend

This template works with **any frontend framework**:

1. **Keep the backend as-is** (it's framework-agnostic)
2. **Replace `/frontend`** with your React/Vue/Angular/etc. app
3. **Integrate using the REST API** - See examples:
   - [React Example](examples/react-example/)
   - [Vue Example](examples/vue-example/)
   - [Vanilla JS Example](examples/vanilla-js-example/)

---

## 📁 Repository Structure

```
pipecat-voice-agent-template/
├── backend/                    # Python FastAPI + Pipecat
│   ├── bot.py                 # Voice AI agent configuration
│   ├── server.py              # REST API server
│   ├── requirements.txt       # Python dependencies
│   ├── Dockerfile             # Backend container
│   └── .env.example           # Environment variables template
│
├── frontend/                   # Next.js frontend (swappable!)
│   ├── src/
│   │   ├── components/
│   │   │   └── ChatInterface.tsx
│   │   └── app/
│   ├── package.json
│   └── Dockerfile
│
├── docs/                       # Documentation
│   ├── FRONTEND_INTEGRATION.md     # How to integrate any frontend
│   ├── AI_SERVICE_CUSTOMIZATION.md # How to swap AI services
│   └── DEPLOYMENT.md               # Production deployment guide
│
├── examples/                   # Example integrations
│   ├── react-example/
│   ├── vue-example/
│   └── vanilla-js-example/
│
├── docker-compose.yml         # Multi-container orchestration
└── README.md                  # This file
```

---

## 🏗️ Architecture

```
┌─────────────────┐          ┌──────────────────┐
│  Any Frontend   │◄────────►│  FastAPI Server  │
│  (React/Vue/JS) │  REST API│  (Backend)       │
└─────────────────┘          └──────────────────┘
        │                             │
        │ WebRTC (Daily.co)          │
        ▼                             ▼
┌─────────────────┐          ┌──────────────────┐
│ Pipecat Client  │◄────────►│  Pipecat Bot     │
│ (Browser SDK)   │          │  (Python)        │
└─────────────────┘          └──────────────────┘
                                      │
                                      ▼
                            ┌──────────────────┐
                            │  AI Services     │
                            │  • STT (Deepgram)│
                            │  • TTS (Cartesia)│
                            │  • LLM (Gemini)  │
                            └──────────────────┘
```

**Key Components:**

1. **Backend Server** (`server.py`): REST API for room creation and health checks
2. **Pipecat Bot** (`bot.py`): Voice AI agent with STT → LLM → TTS pipeline
3. **Frontend**: Any web app that can make HTTP requests and use WebRTC
4. **Daily.co**: WebRTC infrastructure for real-time audio streaming

---

## 📚 Documentation

| Guide | Description |
|-------|-------------|
| [Frontend Integration](docs/FRONTEND_INTEGRATION.md) | Integrate with React, Vue, Angular, vanilla JS |
| [AI Service Customization](docs/AI_SERVICE_CUSTOMIZATION.md) | Swap STT, TTS, LLM providers |
| [Deployment Guide](docs/DEPLOYMENT.md) | Deploy to AWS, GCP, Azure, Railway, Render |

---

## 🎯 Use Cases

Perfect for building:

- 📞 **Voice Customer Support Bots**
- 🎓 **Educational Voice Assistants**  
- 🏥 **Healthcare Virtual Assistants**
- 🏪 **E-commerce Voice Shopping**
- 🎮 **Gaming Voice NPCs**
- 📱 **Mobile App Voice Features**
- 🌐 **Website Voice Interfaces**

---

## 🚢 Deployment

### Quick Deploy Options

- **Railway**: One-click Docker deployment
- **Render**: Auto-deploy from GitHub
- **AWS ECS/Fargate**: Production-scale containers
- **Google Cloud Run**: Serverless containers
- **Azure Container Apps**: Multi-container support

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed guides.

---

## � API Reference

### POST `/create-room`

Creates a Daily.co room and starts a bot instance.

**Response:**
```json
{
  "room_url": "https://your-domain.daily.co/room-name",
  "room_name": "room-name",
  "token": "user-access-token"
}
```

### GET `/health`

Health check endpoint.

### GET `/test-daily`

Tests Daily.co API configuration.

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License - Use this template freely for commercial and personal projects.

---

## 🙏 Acknowledgments

- **[Pipecat](https://pipecat.ai/)** - Voice AI framework
- **[Daily.co](https://daily.co/)** - WebRTC infrastructure
- **[Deepgram](https://deepgram.com/)** - Speech recognition
- **[Cartesia](https://cartesia.ai/)** - Text-to-speech
- **[Google AI](https://ai.google/)** - Language models

---

## 📞 Support

- 📖 **Documentation**: [docs/](docs/)
- 🐛 **Issues**: [GitHub Issues](../../issues)
- 💬 **Pipecat Docs**: https://docs.pipecat.ai
- 🎥 **Daily.co Docs**: https://docs.daily.co

---

## ⭐ Star This Repo!

If this template helps you build amazing voice AI applications, please star the repository!

---

**Built with ❤️ using [Pipecat](https://pipecat.ai) and [Daily.co](https://daily.co)**
