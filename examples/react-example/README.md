# React Integration Example

Minimal React example for integrating Pipecat voice AI.

## Installation

```bash
npm install @pipecat-ai/client-js @pipecat-ai/daily-transport
```

## Usage

```tsx
// VoiceChat.tsx
import { useState } from 'react';
import { RTVIClient } from '@pipecat-ai/client-js';
import { DailyTransport } from '@pipecat-ai/daily-transport';

export default function VoiceChat() {
  const [client, setClient] = useState<RTVIClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);

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
        setIsConnected(true);
      });

      voiceClient.on('disconnected', () => {
        console.log('Disconnected');
        setIsConnected(false);
      });

      voiceClient.on('userTranscript', (text: string) => {
        setTranscript((prev) => [...prev, `You: ${text}`]);
      });

      voiceClient.on('botTranscript', (text: string) => {
        setTranscript((prev) => [...prev, `Bot: ${text}`]);
      });

      // Connect
      await voiceClient.connect(token);
      setClient(voiceClient);
    } catch (error) {
      console.error('Failed to start voice:', error);
    }
  };

  const stopVoice = async () => {
    if (client) {
      await client.disconnect();
      setClient(null);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Voice AI Chat</h1>
      
      {!isConnected ? (
        <button onClick={startVoice}>Start Voice Chat</button>
      ) : (
        <button onClick={stopVoice}>Stop Voice Chat</button>
      )}

      <div style={{ marginTop: '20px' }}>
        <h3>Transcript:</h3>
        {transcript.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
    </div>
  );
}
```

## Features

- ✅ Start/stop voice chat
- ✅ Real-time transcription
- ✅ Connection status
- ✅ Error handling

## Next Steps

- Add visual feedback (audio waveforms)
- Implement chat history persistence
- Add voice selection
- Customize UI styling
