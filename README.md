# Voice AI Chat with Pipecat

A full-stack voice and text AI chat application powered by Pipecat, featuring real-time voice conversations and a beautiful chat interface.

## 🚀 Features

- **💬 Text Chat**: Beautiful chat interface built with Next.js and shadcn/ui
- **🎤 Voice AI**: Real-time voice conversations using Pipecat framework
- **🔄 Seamless Switching**: Toggle between text and voice modes instantly
- **🎨 Modern UI**: Responsive design with Tailwind CSS and shadcn components
- **🤖 AI-Powered**: Integrated with multiple AI services:
  - **STT**: Deepgram for speech recognition
  - **TTS**: Cartesia for natural text-to-speech
  - **LLM**: OpenAI/Google Cloud for intelligent responses
  - **Transport**: Daily.co for WebRTC communication

## 📋 Prerequisites

- **Python 3.8+**
- **Node.js 18+**
- **Daily.co account** (free tier available at [dashboard.daily.co](https://dashboard.daily.co/))

## 🛠️ Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment variables:
   - Open `.env` file (already created with your API keys)
   - Add your Daily API key:
```
DAILY_API_KEY=your-daily-api-key-here
```

4. Get a Daily API key:
   - Sign up at https://dashboard.daily.co/
   - Go to Developers > API Keys
   - Copy your API key and add it to `.env`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

## 🚀 Running the Application

### Start Backend Server

1. Open a terminal in the `backend` directory

2. Start the FastAPI server:
```bash
python server.py
```

The server will run on http://localhost:8001

### Start Frontend Application

1. Open a new terminal in the `frontend` directory

2. Start the Next.js development server:
```bash
npm run dev
```

The frontend will run on http://localhost:3000

3. Open your browser and navigate to http://localhost:3000

## 📖 Usage

### Text Mode
1. Type your message in the input field at the bottom
2. Press Enter or click the Send button
3. The AI will respond with text

### Voice Mode
1. Click the **"Enable Voice"** button in the top right
2. Wait for the connection to establish
3. Start speaking naturally - the AI will listen and respond with voice
4. Your speech and the AI's responses will also appear as text in the chat
5. Click **"Disable Voice"** to return to text mode

## 🏗️ Architecture

```
┌─────────────┐          ┌──────────────┐          ┌─────────────┐
│   Frontend  │◄────────►│   FastAPI    │◄────────►│   Pipecat   │
│  (Next.js)  │  HTTP/WS │   Server     │          │     Bot     │
└─────────────┘          └──────────────┘          └─────────────┘
      │                                                     │
      │                                                     │
      ▼                                                     ▼
┌─────────────┐          ┌──────────────┐          ┌─────────────┐
│  Pipecat    │◄────────►│   Daily.co   │◄────────►│  AI Services│
│   Client    │  WebRTC  │   (WebRTC)   │          │  (STT/TTS)  │
└─────────────┘          └──────────────┘          └─────────────┘
```

## 🔧 Configuration

### API Keys (in `backend/.env`)

- **GOOGLE_CLOUD_API_KEY**: For LLM (already provided)
- **DEEPGRAM_API_KEY**: For speech-to-text (already provided)
- **CARTESIA_API_KEY**: For text-to-speech (already provided)
- **SARVAM_AI_API_KEY**: Additional AI service (already provided)
- **DAILY_API_KEY**: For WebRTC transport (you need to add this)

### Customization

#### Change TTS Voice
In `backend/bot.py`, modify the `voice_id`:
```python
tts = CartesiaTTSService(
    api_key=os.getenv("CARTESIA_API_KEY"),
    voice_id="79a125e8-cd45-4c13-8a67-188112f4dd22",  # Change this
)
```

#### Change LLM Model
In `backend/bot.py`, modify the model:
```python
llm = OpenAILLMService(
    api_key=os.getenv("OPENAI_API_KEY"),
    model="gpt-4o-mini",  # Change to gpt-4, gpt-3.5-turbo, etc.
)
```

#### Customize System Prompt
In `backend/bot.py`, modify the system message:
```python
messages = [
    {
        "role": "system",
        "content": "Your custom system prompt here...",
    }
]
```

## 📚 Tech Stack

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - UI component library
- **Pipecat Client SDK** - Voice AI client
- **Daily Transport** - WebRTC integration

### Backend
- **Python** - Programming language
- **Pipecat** - Voice AI framework
- **FastAPI** - Web framework
- **Deepgram** - Speech-to-text
- **Cartesia** - Text-to-speech
- **OpenAI** - Language model
- **Daily.co** - WebRTC infrastructure

## 🐛 Troubleshooting

### Voice mode won't connect
- Ensure backend server is running on port 8001
- Check that DAILY_API_KEY is set in `.env`
- Verify your microphone permissions in the browser

### No audio output
- Check your browser's audio settings
- Ensure speakers/headphones are connected
- Look for errors in browser console (F12)

### Backend errors
- Verify all API keys are correct in `.env`
- Check Python dependencies are installed
- Look at terminal output for error messages

## 📝 API Endpoints

### Backend (http://localhost:8001)

- `GET /` - Health check
- `POST /create-room` - Create Daily room and token
- `GET /health` - Health status

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

MIT License - feel free to use this project for learning and development.

## 🙏 Acknowledgments

- [Pipecat](https://pipecat.ai/) - Voice AI framework
- [Daily.co](https://daily.co/) - WebRTC infrastructure
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Deepgram](https://deepgram.com/) - Speech recognition
- [Cartesia](https://cartesia.ai/) - Text-to-speech

## 📞 Support

For questions or issues:
- Check the [Pipecat Documentation](https://docs.pipecat.ai/)
- Visit [Daily.co Docs](https://docs.daily.co/)
- Open an issue in this repository
