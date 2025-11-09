# Pipecat Voice AI Chat - Frontend

This is the frontend application for the Voice AI Chat using Next.js, React, shadcn/ui, and Pipecat Client SDK.

## Features

- 💬 Text chat interface with beautiful UI using shadcn components
- 🎤 Voice mode using Pipecat for real-time voice AI conversations
- 🔄 Seamless switching between text and voice modes
- 📱 Responsive design
- 🎨 Modern UI with Tailwind CSS

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Prerequisites

Make sure the backend server is running on `http://localhost:8000` for voice mode to work.

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **@pipecat-ai/client-js** - Pipecat client for voice AI
- **@pipecat-ai/daily-transport** - WebRTC transport layer

## Usage

1. **Text Mode**: Simply type your messages in the input field and press Enter or click Send
2. **Voice Mode**: Click "Enable Voice" button to start voice conversation
   - The AI will respond with both voice and text
   - Your speech will be transcribed and shown in the chat
   - Click "Disable Voice" to return to text mode

## Environment Variables

No environment variables needed for the frontend. All configuration is done through the backend API.
