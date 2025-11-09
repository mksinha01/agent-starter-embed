# 🎨 Frontend Integration Guide

This guide shows how to integrate the Pipecat voice AI backend with different frontend frameworks.

---

## 🔑 Core Concepts

The backend provides a simple REST API:
- **POST `/create-room`**: Creates a voice session and returns room credentials
- The Pipecat bot automatically joins the room
- Frontend uses `@pipecat-ai/client-js` SDK to connect

---

## ⚡ Quick Integration Steps

1. **Create a room**: Call `/create-room` endpoint
2. **Initialize client**: Use Pipecat Client SDK
3. **Connect**: Join the room with token
4. **Handle events**: Listen for audio, transcripts, errors

---

## 🚀 Framework Examples

### React / Next.js

```tsx
// components/VoiceChat.tsx
import { useState } from 'react';
import { RTVIClient } from '@pipecat-ai/client-js';
import { DailyTransport } from '@pipecat-ai/daily-transport';

export default function VoiceChat() {
  const [client, setClient] = useState<RTVIClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const startVoice = async () => {
    // 1. Create room
    const response = await fetch('http://localhost:8001/create-room', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const { room_url, token } = await response.json();

    // 2. Initialize client
    const voiceClient = new RTVIClient({
      transport: new DailyTransport(),
      params: {
        baseUrl: room_url,
        config: {
          tts: { voice: '79a125e8-cd45-4c13-8a67-188112f4dd22' },
          llm: { model: 'gemini-2.0-flash' }
        }
      },
      enableMic: true,
      enableCam: false,
      timeout: 15000
    });

    // 3. Event handlers
    voiceClient.on('connected', () => {
      console.log('Voice connected');
      setIsConnected(true);
    });

    voiceClient.on('disconnected', () => {
      console.log('Voice disconnected');
      setIsConnected(false);
    });

    voiceClient.on('userTranscript', (transcript) => {
      console.log('User said:', transcript);
    });

    voiceClient.on('botTranscript', (transcript) => {
      console.log('Bot said:', transcript);
    });

    // 4. Connect
    await voiceClient.connect(token);
    setClient(voiceClient);
  };

  const stopVoice = async () => {
    if (client) {
      await client.disconnect();
      setClient(null);
    }
  };

  return (
    <div>
      {!isConnected ? (
        <button onClick={startVoice}>Start Voice Chat</button>
      ) : (
        <button onClick={stopVoice}>Stop Voice Chat</button>
      )}
    </div>
  );
}
```

**Installation:**
```bash
npm install @pipecat-ai/client-js @pipecat-ai/daily-transport
```

---

### Vue.js 3

```vue
<!-- components/VoiceChat.vue -->
<template>
  <div>
    <button v-if="!isConnected" @click="startVoice">
      Start Voice Chat
    </button>
    <button v-else @click="stopVoice">
      Stop Voice Chat
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { RTVIClient } from '@pipecat-ai/client-js';
import { DailyTransport } from '@pipecat-ai/daily-transport';

const client = ref(null);
const isConnected = ref(false);

const startVoice = async () => {
  // Create room
  const response = await fetch('http://localhost:8001/create-room', {
    method: 'POST'
  });
  const { room_url, token } = await response.json();

  // Initialize client
  const voiceClient = new RTVIClient({
    transport: new DailyTransport(),
    params: {
      baseUrl: room_url,
      config: {
        tts: { voice: '79a125e8-cd45-4c13-8a67-188112f4dd22' }
      }
    },
    enableMic: true,
    enableCam: false
  });

  // Event handlers
  voiceClient.on('connected', () => {
    isConnected.value = true;
  });

  voiceClient.on('disconnected', () => {
    isConnected.value = false;
  });

  // Connect
  await voiceClient.connect(token);
  client.value = voiceClient;
};

const stopVoice = async () => {
  if (client.value) {
    await client.value.disconnect();
    client.value = null;
  }
};
</script>
```

---

### Vanilla JavaScript

```html
<!DOCTYPE html>
<html>
<head>
  <title>Voice AI Chat</title>
</head>
<body>
  <button id="start-voice">Start Voice Chat</button>
  <button id="stop-voice" style="display: none;">Stop Voice Chat</button>
  <div id="status"></div>

  <script type="module">
    import { RTVIClient } from 'https://cdn.jsdelivr.net/npm/@pipecat-ai/client-js/+esm';
    import { DailyTransport } from 'https://cdn.jsdelivr.net/npm/@pipecat-ai/daily-transport/+esm';

    let client = null;

    document.getElementById('start-voice').onclick = async () => {
      // Create room
      const response = await fetch('http://localhost:8001/create-room', {
        method: 'POST'
      });
      const { room_url, token } = await response.json();

      // Initialize client
      client = new RTVIClient({
        transport: new DailyTransport(),
        params: {
          baseUrl: room_url
        },
        enableMic: true,
        enableCam: false
      });

      // Event handlers
      client.on('connected', () => {
        document.getElementById('status').textContent = 'Connected';
        document.getElementById('start-voice').style.display = 'none';
        document.getElementById('stop-voice').style.display = 'block';
      });

      client.on('userTranscript', (transcript) => {
        console.log('You:', transcript);
      });

      client.on('botTranscript', (transcript) => {
        console.log('Bot:', transcript);
      });

      // Connect
      await client.connect(token);
    };

    document.getElementById('stop-voice').onclick = async () => {
      if (client) {
        await client.disconnect();
        document.getElementById('status').textContent = 'Disconnected';
        document.getElementById('start-voice').style.display = 'block';
        document.getElementById('stop-voice').style.display = 'none';
      }
    };
  </script>
</body>
</html>
```

---

### Angular

```typescript
// voice-chat.component.ts
import { Component } from '@angular/core';
import { RTVIClient } from '@pipecat-ai/client-js';
import { DailyTransport } from '@pipecat-ai/daily-transport';

@Component({
  selector: 'app-voice-chat',
  template: `
    <button *ngIf="!isConnected" (click)="startVoice()">
      Start Voice Chat
    </button>
    <button *ngIf="isConnected" (click)="stopVoice()">
      Stop Voice Chat
    </button>
  `
})
export class VoiceChatComponent {
  client: RTVIClient | null = null;
  isConnected = false;

  async startVoice() {
    // Create room
    const response = await fetch('http://localhost:8001/create-room', {
      method: 'POST'
    });
    const { room_url, token } = await response.json();

    // Initialize client
    this.client = new RTVIClient({
      transport: new DailyTransport(),
      params: {
        baseUrl: room_url
      },
      enableMic: true,
      enableCam: false
    });

    // Event handlers
    this.client.on('connected', () => {
      this.isConnected = true;
    });

    this.client.on('disconnected', () => {
      this.isConnected = false;
    });

    // Connect
    await this.client.connect(token);
  }

  async stopVoice() {
    if (this.client) {
      await this.client.disconnect();
      this.client = null;
    }
  }
}
```

---

## 🎯 Advanced Features

### Custom Event Handling

```typescript
client.on('userStartedSpeaking', () => {
  console.log('User started speaking');
});

client.on('userStoppedSpeaking', () => {
  console.log('User stopped speaking');
});

client.on('botStartedSpeaking', () => {
  console.log('Bot started speaking');
});

client.on('botStoppedSpeaking', () => {
  console.log('Bot stopped speaking');
});

client.on('error', (error) => {
  console.error('Voice error:', error);
});
```

### Sending Text Messages

```typescript
// Send text instead of voice
await client.sendMessage({
  type: 'user-text',
  text: 'Hello, how are you?'
});
```

### Interrupting the Bot

```typescript
// Stop the bot from speaking
await client.interrupt();
```

### Custom Configuration

```typescript
const client = new RTVIClient({
  transport: new DailyTransport(),
  params: {
    baseUrl: room_url,
    config: {
      tts: {
        voice: '79a125e8-cd45-4c13-8a67-188112f4dd22',
        model: 'sonic-english',
        language: 'en'
      },
      llm: {
        model: 'gemini-2.0-flash',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant specialized in technical support.'
          }
        ]
      },
      stt: {
        model: 'nova-2',
        language: 'en-US'
      }
    }
  },
  enableMic: true,
  enableCam: false,
  timeout: 30000
});
```

---

## 🔒 CORS Configuration

Make sure your backend allows your frontend origin. In `backend/server.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",     # Next.js
        "http://localhost:5173",     # Vite
        "http://localhost:4200",     # Angular
        "http://localhost:8080",     # Vue CLI
        "https://yourdomain.com"     # Production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 📱 Mobile Integration

### React Native

```typescript
import { RTVIClient } from '@pipecat-ai/client-react-native';
import { DailyTransport } from '@pipecat-ai/daily-transport-react-native';

// Same API as web, but uses React Native compatible transport
```

---

## 🧪 Testing

```typescript
// Test backend connectivity
const testBackend = async () => {
  try {
    const response = await fetch('http://localhost:8001/health');
    const data = await response.json();
    console.log('Backend status:', data);
  } catch (error) {
    console.error('Backend not reachable:', error);
  }
};

// Test room creation
const testRoomCreation = async () => {
  try {
    const response = await fetch('http://localhost:8001/create-room', {
      method: 'POST'
    });
    const data = await response.json();
    console.log('Room created:', data);
  } catch (error) {
    console.error('Failed to create room:', error);
  }
};
```

---

## 🎨 UI Components

Build a complete chat interface with:

1. **Voice button** - Start/stop voice
2. **Transcript display** - Show conversation
3. **Status indicator** - Connection state
4. **Error messages** - User feedback
5. **Audio visualizer** - Visual feedback

See the included Next.js example for a complete implementation.

---

## 📚 Resources

- [Pipecat Client SDK Docs](https://docs.pipecat.ai/client/introduction)
- [Daily.co JavaScript SDK](https://docs.daily.co/reference/daily-js)
- [WebRTC Best Practices](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)
