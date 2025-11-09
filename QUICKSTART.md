# Quick Start Guide

## ✅ Everything is set up and running!

### Current Status:
- ✅ **Frontend**: Running on http://localhost:3000
- ✅ **Backend**: Running on http://localhost:8001
- ✅ **Dependencies**: Installed
- ✅ **API Keys**: Configured

## 🚀 Using the Application

1. **Open your browser** and go to: http://localhost:3000

2. **Test Text Chat**:
   - Type a message in the input box
   - Press Enter or click Send
   - The AI will respond (simulated response in text mode)

3. **Enable Voice Mode**:
   - Click the "Enable Voice" button in the top right
   - Grant microphone permissions when prompted
   - Wait for the connection to establish
   - Start speaking naturally
   - The AI will respond with voice and text

4. **Disable Voice Mode**:
   - Click "Disable Voice" to return to text mode

## 📝 Important Notes

### Backend Server
- **Port**: Changed from 8000 to 8001 (port 8000 was in use)
- **URL**: http://localhost:8001
- **Endpoints**:
  - `GET /` - Health check
  - `POST /create-room` - Create Daily room
  - `GET /health` - Health status

### Frontend
- **Port**: 3000
- **Updated** to connect to backend on port 8001

### Voice Mode Requirements
For voice mode to work, you need to:
1. Keep the backend server running
2. Have a valid Daily.co API key (✅ already configured)
3. Allow microphone access in your browser

## 🔧 Troubleshooting

### If voice mode doesn't connect:
1. Check that backend is running: http://localhost:8001/health
2. Check browser console (F12) for errors
3. Verify microphone permissions

### If you need to restart:
**Frontend**:
```powershell
cd "c:\A SSD NEW WIN\code\agent-starter-embed\frontend"
npm run dev
```

**Backend**:
```powershell
cd "c:\A SSD NEW WIN\code\agent-starter-embed\backend"
python server.py
```

## 🎉 You're Ready!

Open http://localhost:3000 in your browser and start chatting with your AI assistant!
