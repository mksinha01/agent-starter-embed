# Voice AI Integration Guide

Complete step-by-step guide for integrating Daily.co + Pipecat voice AI assistant into any frontend application.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Prerequisites](#prerequisites)
3. [Backend Setup](#backend-setup)
4. [Frontend Integration](#frontend-integration)
5. [Audio Playback Configuration](#audio-playback-configuration)
6. [Testing & Debugging](#testing--debugging)
7. [Troubleshooting](#troubleshooting)
8. [Production Deployment](#production-deployment)

---

## Architecture Overview

### System Flow

```
User Browser (Frontend)
    ↓ HTTP POST
Backend API (/create-room)
    ↓ Creates Daily.co room
Daily.co Cloud
    ↓ WebRTC Connection
Pipecat Bot (Docker Container)
    ↓ AI Pipeline
Deepgram STT → Groq LLM → Cartesia TTS
    ↓ Audio Stream
User Browser Speakers 🔊
```

### Technology Stack

- **Transport**: Daily.co WebRTC (real-time audio/video)
- **Backend**: FastAPI + Pipecat Python framework
- **STT**: Deepgram (Speech-to-Text)
- **LLM**: Groq Llama 3.3 70B
- **TTS**: Cartesia (Text-to-Speech)
- **Frontend**: React/Next.js + Daily.js SDK

---

## Prerequisites

### 1. API Keys Required

Get these API keys before starting:

| Service | Purpose | Get Key From | Cost |
|---------|---------|--------------|------|
| **Daily.co** | WebRTC transport | https://dashboard.daily.co | Free tier available |
| **Deepgram** | Speech-to-Text | https://console.deepgram.com | Free tier available |
| **Groq** | LLM inference | https://console.groq.com | Free tier available |
| **Cartesia** | Text-to-Speech | https://cartesia.ai | Free trial available |

### 2. System Requirements

- Docker installed (for backend container)
- Node.js 18+ (for frontend)
- Modern browser with WebRTC support (Chrome/Firefox/Edge)

---

## Backend Setup

### Step 1: Create Backend Directory Structure

```bash
mkdir -p packages/services/voice-agent
cd packages/services/voice-agent
```

### Step 2: Create Environment File

Create `packages/services/voice-agent/.env`:

```properties
# Daily.co Configuration (WebRTC)
DAILY_API_KEY=your_daily_api_key_here
DAILY_DOMAIN=your_daily_domain  # Optional

# Deepgram Configuration (Speech-to-Text)
DEEPGRAM_API_KEY=your_deepgram_api_key_here

# Groq Configuration (LLM)
GROQ_API_KEY=your_groq_api_key_here

# Cartesia Configuration (Text-to-Speech)
CARTESIA_API_KEY=your_cartesia_api_key_here

# Server Configuration
HOST=0.0.0.0
PORT=8001
LOG_LEVEL=INFO
```

### Step 3: Create Python Requirements

Create `packages/services/voice-agent/requirements.txt`:

```txt
fastapi==0.115.5
uvicorn[standard]==0.32.1
pipecat-ai==0.0.93
aiohttp==3.11.9
python-dotenv==1.0.1
loguru==0.7.3
pydantic==2.10.3
```

### Step 4: Create FastAPI Server

Create `packages/services/voice-agent/server.py`:

```python
"""
FastAPI server to handle Daily room creation and token generation
"""
import os
import sys
import time
import asyncio
import subprocess
import aiohttp
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Store active bot processes
active_bots = {}

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001", 
        "https://your-production-domain.com"  # Add your production URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DAILY_API_KEY = os.getenv("DAILY_API_KEY")
DAILY_API_URL = "https://api.daily.co/v1"


class RoomResponse(BaseModel):
    room_url: str
    room_name: str
    token: str


@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "healthy"}


@app.post("/create-room", response_model=RoomResponse)
async def create_room():
    """
    Create a Daily.co room and spawn a Pipecat bot
    Returns room URL and user token
    """
    if not DAILY_API_KEY:
        raise HTTPException(
            status_code=500, 
            detail="DAILY_API_KEY not configured"
        )
    
    async with aiohttp.ClientSession() as session:
        headers = {
            "Authorization": f"Bearer {DAILY_API_KEY}",
            "Content-Type": "application/json",
        }
        
        # Step 1: Create Daily.co room
        room_data = {
            "properties": {
                "enable_chat": True,
                "enable_screenshare": False,
                "enable_recording": False,
                "exp": int(time.time() + 3600),  # 1 hour expiry
            }
        }
        
        async with session.post(
            f"{DAILY_API_URL}/rooms",
            headers=headers,
            json=room_data
        ) as response:
            if response.status != 200:
                error_text = await response.text()
                raise HTTPException(
                    status_code=response.status,
                    detail=f"Failed to create room: {error_text}"
                )
            
            room = await response.json()
            room_url = room["url"]
            room_name = room["name"]
        
        # Step 2: Create user token
        token_data = {
            "properties": {
                "room_name": room_name,
                "is_owner": True,
            }
        }
        
        async with session.post(
            f"{DAILY_API_URL}/meeting-tokens",
            headers=headers,
            json=token_data
        ) as response:
            if response.status != 200:
                error_text = await response.text()
                raise HTTPException(
                    status_code=response.status,
                    detail=f"Failed to create token: {error_text}"
                )
            
            token_response = await response.json()
            token = token_response["token"]
        
        # Step 3: Create bot token
        bot_token_data = {
            "properties": {
                "room_name": room_name,
                "is_owner": False,
                "user_name": "AI Assistant Bot"
            }
        }
        
        async with session.post(
            f"{DAILY_API_URL}/meeting-tokens",
            headers=headers,
            json=bot_token_data
        ) as response:
            if response.status != 200:
                bot_token = token  # Fallback to user token
            else:
                bot_response = await response.json()
                bot_token = bot_response["token"]
        
        # Step 4: Start Pipecat bot
        try:
            env = os.environ.copy()
            env["DAILY_ROOM_URL"] = room_url
            env["DAILY_TOKEN"] = bot_token
            
            bot_process = subprocess.Popen(
                [sys.executable or "python", "bot.py"],
                env=env,
                cwd=os.path.dirname(__file__),
            )
            
            active_bots[room_name] = bot_process
            print(f"Started bot process {bot_process.pid} for room {room_name}")
        except Exception as e:
            print(f"Warning: Failed to start bot: {e}")
        
        return RoomResponse(
            room_url=room_url,
            room_name=room_name,
            token=token
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
```

### Step 5: Create Pipecat Bot

Create `packages/services/voice-agent/bot.py`:

```python
"""
Pipecat AI bot for voice conversations
"""
import asyncio
import aiohttp
import os
from dotenv import load_dotenv
from loguru import logger

from pipecat.frames.frames import EndFrame
from pipecat.pipeline.pipeline import Pipeline
from pipecat.pipeline.runner import PipelineRunner
from pipecat.pipeline.task import PipelineParams, PipelineTask
from pipecat.processors.aggregators.openai_llm_context import OpenAILLMContext
from pipecat.services.cartesia import CartesiaTTSService
from pipecat.services.deepgram import DeepgramSTTService
from pipecat.services.groq import GroqLLMService
from pipecat.transports.services.daily import DailyParams, DailyTransport

load_dotenv()


async def main():
    logger.info("🤖 AI Voice Assistant starting...")
    logger.info(f"Room URL: {os.getenv('DAILY_ROOM_URL')}")
    
    async with aiohttp.ClientSession() as session:
        # Configure Daily transport
        transport = DailyTransport(
            room_url=os.getenv("DAILY_ROOM_URL"),
            token=os.getenv("DAILY_TOKEN"),
            bot_name="AI Assistant",
            params=DailyParams(
                audio_out_enabled=True,
                audio_in_enabled=True,
                transcription_enabled=False,
            ),
        )

        # Configure services
        stt = DeepgramSTTService(
            api_key=os.getenv("DEEPGRAM_API_KEY"),
        )

        tts = CartesiaTTSService(
            api_key=os.getenv("CARTESIA_API_KEY"),
            voice_id="a0e99841-438c-4a64-b679-ae501e7d6091",  # Barbershop Man
        )

        llm = GroqLLMService(
            api_key=os.getenv("GROQ_API_KEY"),
            model="llama-3.3-70b-versatile",
        )

        # Set up conversation context
        context = OpenAILLMContext(
            messages=[
                {
                    "role": "system",
                    "content": """You are a helpful AI assistant.

Be friendly, professional, and concise in your responses.
Keep answers brief for voice interactions.""",
                }
            ]
        )
        context_aggregator = llm.create_context_aggregator(context)

        # Build pipeline
        pipeline = Pipeline(
            [
                transport.input(),
                stt,
                context_aggregator.user(),
                llm,
                tts,
                transport.output(),
                context_aggregator.assistant(),
            ]
        )

        task = PipelineTask(
            pipeline,
            params=PipelineParams(
                allow_interruptions=True,
                enable_metrics=True,
            ),
        )

        @transport.event_handler("on_first_participant_joined")
        async def on_first_participant_joined(transport, participant):
            logger.info(f"👋 First participant joined: {participant}")

        @transport.event_handler("on_participant_left")
        async def on_participant_left(transport, participant, reason):
            logger.info(f"👋 Participant left: {participant}")
            await task.queue_frame(EndFrame())

        logger.info("🚀 Starting bot...")
        runner = PipelineRunner()
        await runner.run(task)
        logger.info("✅ Bot completed")


if __name__ == "__main__":
    asyncio.run(main())
```

### Step 6: Create Dockerfile

Create `packages/services/voice-agent/Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    portaudio19-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8001

# Run FastAPI server
CMD ["python", "server.py"]
```

### Step 7: Create Docker Compose

Create `docker-compose.yml` in project root:

```yaml
version: '3.8'

services:
  voice-agent:
    build: ./packages/services/voice-agent
    container_name: voice-agent
    ports:
      - "8001:8001"
    env_file:
      - ./packages/services/voice-agent/.env
    restart: unless-stopped
```

### Step 8: Start Backend

```bash
# Build and start
docker-compose up voice-agent --build -d

# Check logs
docker-compose logs -f voice-agent

# Test health
curl http://localhost:8001/health
```

---

## Frontend Integration

### Step 1: Install Dependencies

```bash
npm install @daily-co/daily-js
# or
yarn add @daily-co/daily-js
```

### Step 2: Create Voice Assistant Component

Create `app/components/VoiceAssistant.tsx`:

```typescript
'use client';

import { useState, useRef, useEffect } from 'react';
import DailyIframe, { DailyCall } from '@daily-co/daily-js';

type SessionState = 'idle' | 'connecting' | 'connected' | 'error';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_VOICE_BACKEND_URL || 'http://localhost:8001';

export default function VoiceAssistant() {
  const [sessionState, setSessionState] = useState<SessionState>('idle');
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  
  const callFrameRef = useRef<DailyCall | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (callFrameRef.current) {
        callFrameRef.current.destroy();
      }
      // Remove audio element
      const audioElement = document.getElementById('daily-audio-output');
      if (audioElement) {
        audioElement.remove();
      }
    };
  }, []);

  const addMessage = (role: 'user' | 'assistant' | 'system', content: string) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}-${Math.random()}`,
      role,
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const startSession = async () => {
    setError(null);
    setMessages([]);
    setSessionState('connecting');
    addMessage('system', 'Connecting to voice assistant...');

    try {
      // Step 1: Create Daily.co room
      const response = await fetch(`${BACKEND_URL}/create-room`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Backend error: ${response.status}`);
      }

      const { room_url, token } = await response.json();
      addMessage('system', 'Room created! Connecting...');

      // Step 2: Create Daily call object
      const callFrame = DailyIframe.createCallObject({
        audioSource: true,
        videoSource: false,
        subscribeToTracksAutomatically: true,
      });

      callFrameRef.current = callFrame;

      // Step 3: Set up audio playback handler
      // CRITICAL: This manually routes audio to speakers
      callFrame.on('track-started', async (event: any) => {
        console.log('🔊 Track started:', event);
        
        // If this is audio from remote participant (the bot)
        if (event.track && event.track.kind === 'audio' && !event.participant.local) {
          console.log('📢 Remote audio detected from:', event.participant);
          
          try {
            const audioTrack = event.track;
            const stream = new MediaStream([audioTrack]);
            
            // Create or reuse audio element
            let audioElement = document.getElementById('daily-audio-output') as HTMLAudioElement;
            if (!audioElement) {
              audioElement = document.createElement('audio');
              audioElement.id = 'daily-audio-output';
              audioElement.autoplay = true;
              document.body.appendChild(audioElement);
              console.log('🔊 Created audio output element');
            }
            
            audioElement.srcObject = stream;
            await audioElement.play();
            console.log('▶️ Playing remote audio!');
            
            addMessage('system', '🔊 AI voice enabled!');
          } catch (err) {
            console.error('Failed to play audio:', err);
            addMessage('system', '⚠️ Click anywhere to enable audio');
          }
        }
      });

      // Step 4: Set up event handlers
      callFrame.on('joined-meeting', () => {
        console.log('✅ Joined meeting');
        setSessionState('connected');
        addMessage('system', '🎙️ Connected! Start speaking!');
      });

      callFrame.on('participant-joined', (event: any) => {
        console.log('👤 Participant joined:', event.participant);
        if (event.participant?.user_name?.includes('Bot')) {
          addMessage('system', '🤖 AI Assistant joined!');
        }
      });

      callFrame.on('error', (error: any) => {
        console.error('❌ Daily.co error:', error);
        setError(`Connection error: ${error.errorMsg || error.toString()}`);
        setSessionState('error');
      });

      callFrame.on('left-meeting', () => {
        console.log('👋 Left meeting');
        setSessionState('idle');
        addMessage('system', 'Session ended');
      });

      // Step 5: Join the room
      await callFrame.join({ url: room_url, token: token });

    } catch (error: any) {
      console.error('Error starting session:', error);
      setError(error.message || 'Failed to start session');
      setSessionState('error');
      addMessage('system', `❌ Error: ${error.message}`);
    }
  };

  const endSession = () => {
    if (callFrameRef.current) {
      callFrameRef.current.leave();
      callFrameRef.current.destroy();
      callFrameRef.current = null;
    }
    
    // Clean up audio element
    const audioElement = document.getElementById('daily-audio-output');
    if (audioElement) {
      audioElement.remove();
    }
    
    setSessionState('idle');
    setIsMuted(false);
  };

  const toggleMute = () => {
    if (callFrameRef.current) {
      const newMuteState = !isMuted;
      callFrameRef.current.setLocalAudio(!newMuteState);
      setIsMuted(newMuteState);
      addMessage('system', newMuteState ? '🔇 Muted' : '🎤 Unmuted');
    }
  };

  return (
    <div className="voice-assistant">
      <h2>🎙️ Voice AI Assistant</h2>
      
      {error && <div className="error">{error}</div>}
      
      <div className="status">
        Status: {sessionState.toUpperCase()}
        {sessionState === 'connected' && (
          <span> | {isMuted ? '🔇 Muted' : '🎤 Listening'}</span>
        )}
      </div>

      <div className="controls">
        {sessionState === 'idle' && (
          <button onClick={startSession}>Start Voice Session</button>
        )}

        {sessionState === 'connecting' && (
          <div>Connecting...</div>
        )}

        {sessionState === 'connected' && (
          <>
            <button onClick={toggleMute}>
              {isMuted ? 'Unmute' : 'Mute'}
            </button>
            <button onClick={endSession}>End Session</button>
          </>
        )}
      </div>

      <div className="messages">
        <h3>Session Log</h3>
        {messages.map((msg) => (
          <div key={msg.id} className={`message message-${msg.role}`}>
            <span className="role">{msg.role}:</span>
            <span className="content">{msg.content}</span>
            <span className="time">{msg.timestamp.toLocaleTimeString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Step 3: Add Environment Variable

Add to `.env.local`:

```properties
NEXT_PUBLIC_VOICE_BACKEND_URL=http://localhost:8001
```

### Step 4: Use Component in Your App

```typescript
import VoiceAssistant from '@/components/VoiceAssistant';

export default function VoiceAssistantPage() {
  return (
    <div>
      <VoiceAssistant />
    </div>
  );
}
```

---

## Audio Playback Configuration

### Why Manual Audio Handling is Required

**Critical Understanding**: Daily.co's `createCallObject()` manages WebRTC connections but **does NOT automatically route audio to browser speakers**.

### The Audio Chain

```
Bot speaks → Cartesia TTS generates audio
    ↓
Daily.co transport sends audio over WebRTC
    ↓
Frontend receives audio track (track-started event)
    ↓
❌ STOPS HERE if you don't manually handle it!
    ↓
✅ Create MediaStream + HTMLAudioElement
    ↓
✅ Connect and play → User hears audio 🔊
```

### Key Code Pattern

```typescript
// THIS IS ESSENTIAL FOR AUDIO PLAYBACK
callFrame.on('track-started', async (event) => {
  if (event.track?.kind === 'audio' && !event.participant.local) {
    // 1. Get remote audio track
    const stream = new MediaStream([event.track]);
    
    // 2. Create audio element
    const audio = document.createElement('audio');
    audio.autoplay = true;
    
    // 3. Connect and play
    audio.srcObject = stream;
    await audio.play();  // 🔊 USER HEARS THIS
  }
});
```

### Browser Autoplay Policy

Some browsers block autoplay. Handle this:

```typescript
try {
  await audio.play();
} catch (err) {
  // Show message to user
  alert('Click anywhere to enable audio');
  
  // Or add click listener
  document.addEventListener('click', () => {
    audio.play();
  }, { once: true });
}
```

---

## Testing & Debugging

### Backend Testing

```bash
# 1. Check health
curl http://localhost:8001/health

# 2. Test room creation
curl -X POST http://localhost:8001/create-room

# 3. Watch logs
docker logs voice-agent -f

# Look for:
# ✅ "Bot started speaking"
# ✅ "Joined https://pdv.daily.co/..."
# ✅ "CartesiaTTSService generating TTS"
```

### Frontend Debugging

Open Browser Console (F12) and look for:

```javascript
// Success indicators:
✅ "✅ Joined Daily.co meeting"
✅ "👤 Participant joined: Bot"
✅ "📢 Remote audio track detected"
✅ "🔊 Created audio output element"
✅ "▶️ Playing remote audio!"

// Error indicators:
❌ "Failed to create room"
❌ "Failed to play audio" (autoplay blocked)
❌ "Daily.co error"
```

### Audio Element Verification

In browser console:

```javascript
// Check if audio element exists
document.getElementById('daily-audio-output')
// Should return: <audio> element

// Check if it's playing
const audio = document.getElementById('daily-audio-output');
console.log('Paused:', audio.paused);  // false = playing
console.log('Volume:', audio.volume);  // 1 = full volume
```

### Network Tab Check

1. Open DevTools → Network
2. Filter: `WS` (WebSocket)
3. Look for Daily.co WebSocket connection
4. Should show: Status 101 Switching Protocols

---

## Troubleshooting

### Issue: Can't Hear Bot Voice

**Symptoms**: Bot joins, but no audio

**Solutions**:

1. **Check audio element**:
```javascript
console.log(document.getElementById('daily-audio-output'));
// Should exist when bot speaks
```

2. **Check browser audio**:
   - System volume not muted
   - Browser tab not muted
   - Click page to enable autoplay

3. **Check backend logs**:
```bash
docker logs voice-agent --tail 50 | grep "speaking"
# Should see: "Bot started speaking"
```

4. **Verify API keys**:
```bash
docker exec voice-agent printenv | grep API_KEY
# Check all keys are present
```

### Issue: 401 Unauthorized

**Cause**: Invalid Daily.co API key

**Solution**:
```bash
# Test API key
curl -H "Authorization: Bearer YOUR_KEY" \
  https://api.daily.co/v1/rooms

# Update .env with valid key
# Rebuild container
docker-compose up voice-agent --build -d
```

### Issue: Bot Doesn't Join

**Symptoms**: Room created, but bot never appears

**Solutions**:

1. **Check bot logs**:
```bash
docker logs voice-agent | grep "Bot"
# Look for errors
```

2. **Verify bot process started**:
```bash
docker exec voice-agent ps aux | grep bot.py
# Should show running process
```

3. **Check room expiry**:
```python
# In server.py, verify room expiry is set:
"exp": int(time.time() + 3600)  # 1 hour
```

### Issue: Microphone Not Working

**Symptoms**: Can't speak to bot

**Solutions**:

1. **Check browser permissions**:
   - Click lock icon in address bar
   - Allow microphone access

2. **Test microphone**:
```javascript
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => console.log('Mic OK'))
  .catch(err => console.error('Mic error:', err));
```

3. **Check mute state**:
```javascript
callFrame.localAudio()  // Should be true (unmuted)
```

### Issue: High Latency

**Symptoms**: Slow response time

**Solutions**:

1. **Use faster LLM**:
```python
# Switch from llama-3.1-70b to:
model="llama-3.3-70b-versatile"  # Faster
```

2. **Optimize system prompt**:
```python
# Keep prompts short
"Be concise. One sentence responses."
```

3. **Check network**:
```bash
ping api.groq.com
# Should be <100ms
```

---

## Production Deployment

### Backend Deployment

#### Option 1: Docker on Cloud VM

```bash
# 1. Deploy to DigitalOcean/AWS/GCP
# 2. Install Docker
# 3. Clone repo
# 4. Set environment variables
# 5. Run:
docker-compose up -d

# 6. Set up reverse proxy (nginx):
server {
    listen 443 ssl;
    server_name voice-api.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:8001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

#### Option 2: Railway.app

```yaml
# railway.toml
[build]
builder = "DOCKERFILE"
dockerfilePath = "packages/services/voice-agent/Dockerfile"

[deploy]
startCommand = "python server.py"
healthcheckPath = "/health"
```

### Frontend Deployment

#### Update Environment Variables

```properties
# Production .env
NEXT_PUBLIC_VOICE_BACKEND_URL=https://voice-api.yourdomain.com
```

#### Deploy to Vercel/Netlify

```bash
# Build
npm run build

# Deploy
vercel deploy --prod
```

### Security Considerations

1. **API Keys**: Use environment variables, never commit
2. **CORS**: Restrict to your domain only
3. **Rate Limiting**: Add to FastAPI
4. **HTTPS**: Required for microphone access in production
5. **Room Expiry**: Set appropriate expiry times

### Monitoring

Add logging:

```python
# In server.py
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.middleware("http")
async def log_requests(request, call_next):
    logger.info(f"Request: {request.method} {request.url}")
    response = await call_next(request)
    return response
```

---

## Summary Checklist

### Backend ✅
- [ ] Created `.env` with all API keys
- [ ] Created `server.py` (FastAPI)
- [ ] Created `bot.py` (Pipecat)
- [ ] Created `Dockerfile`
- [ ] Created `docker-compose.yml`
- [ ] Container running on port 8001
- [ ] `/health` endpoint returns 200
- [ ] Room creation works

### Frontend ✅
- [ ] Installed `@daily-co/daily-js`
- [ ] Created voice assistant component
- [ ] Added `track-started` handler for audio
- [ ] Added manual audio element creation
- [ ] Added auto-play to speakers
- [ ] Set `NEXT_PUBLIC_VOICE_BACKEND_URL`
- [ ] Tested microphone access
- [ ] Tested audio playback

### Testing ✅
- [ ] Can start voice session
- [ ] Bot joins room
- [ ] Can speak and see transcript
- [ ] Can **hear** bot responses 🔊
- [ ] Can mute/unmute
- [ ] Can end session cleanly

### Production ✅
- [ ] Backend deployed with HTTPS
- [ ] Frontend deployed
- [ ] Environment variables set
- [ ] CORS configured
- [ ] Monitoring enabled
- [ ] Error handling tested

---

## Key Takeaways

1. **Daily.co WebRTC** handles connection, not audio playback
2. **Manual audio handling** is REQUIRED via `track-started` event
3. **HTMLAudioElement** routes audio to browser speakers
4. **API keys** must match between backend `.env` and service providers
5. **Docker container** must be rebuilt after `.env` changes
6. **Browser permissions** for microphone required
7. **HTTPS required** in production for WebRTC

---

## Additional Resources

- [Daily.co Documentation](https://docs.daily.co/)
- [Pipecat Framework](https://github.com/pipecat-ai/pipecat)
- [WebRTC Basics](https://webrtc.org/getting-started/overview)
- [Daily.js SDK Reference](https://docs.daily.co/reference/daily-js)

---

**Last Updated**: November 10, 2025  
**Version**: 1.0  
**Tested With**: Daily.js 0.72.0, Pipecat 0.0.93, Next.js 15
