# Vue.js Integration Example

Minimal Vue 3 example for integrating Pipecat voice AI.

## Installation

```bash
npm install @pipecat-ai/client-js @pipecat-ai/daily-transport
```

## Usage

```vue
<!-- VoiceChat.vue -->
<template>
  <div class="voice-chat">
    <h1>Voice AI Chat</h1>
    
    <button v-if="!isConnected" @click="startVoice">
      Start Voice Chat
    </button>
    <button v-else @click="stopVoice">
      Stop Voice Chat
    </button>

    <div class="transcript">
      <h3>Transcript:</h3>
      <div v-for="(line, index) in transcript" :key="index">
        {{ line }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RTVIClient } from '@pipecat-ai/client-js';
import { DailyTransport } from '@pipecat-ai/daily-transport';

const client = ref<RTVIClient | null>(null);
const isConnected = ref(false);
const transcript = ref<string[]>([]);

const startVoice = async () => {
  try {
    // Create room
    const response = await fetch('http://localhost:8001/create-room', {
      method: 'POST',
    });
    const { room_url, token } = await response.json();

    // Initialize client
    const voiceClient = new RTVIClient({
      transport: new DailyTransport(),
      params: {
        baseUrl: room_url,
      },
      enableMic: true,
      enableCam: false,
    });

    // Event handlers
    voiceClient.on('connected', () => {
      console.log('Connected');
      isConnected.value = true;
    });

    voiceClient.on('disconnected', () => {
      console.log('Disconnected');
      isConnected.value = false;
    });

    voiceClient.on('userTranscript', (text: string) => {
      transcript.value.push(`You: ${text}`);
    });

    voiceClient.on('botTranscript', (text: string) => {
      transcript.value.push(`Bot: ${text}`);
    });

    // Connect
    await voiceClient.connect(token);
    client.value = voiceClient;
  } catch (error) {
    console.error('Failed to start voice:', error);
  }
};

const stopVoice = async () => {
  if (client.value) {
    await client.value.disconnect();
    client.value = null;
  }
};
</script>

<style scoped>
.voice-chat {
  padding: 20px;
}

.transcript {
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
</style>
```

## Features

- ✅ Start/stop voice chat
- ✅ Real-time transcription
- ✅ Connection status
- ✅ Vue 3 Composition API

## Next Steps

- Add Pinia store for state management
- Implement audio visualization
- Add voice settings panel
- Create reusable composables
