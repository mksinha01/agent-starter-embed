# 🔊 Troubleshooting Voice Echo and Feedback Issues

If you're experiencing echo or hearing the AI agent's voice being fed back during conversations, follow these solutions.

---

## 🎯 Quick Fix (Works Immediately)

### ✅ **Use Headphones**

The most reliable immediate solution:
- Plug in headphones or a headset
- This physically prevents speaker output from being picked up by your microphone
- Works 100% of the time

---

## 🔧 Solution 1: Check Windows Audio Settings

### Disable "Listen to this device"

1. **Right-click** the speaker icon in taskbar
2. Select **"Sounds"**
3. Go to **"Recording"** tab
4. **Right-click** your microphone
5. Select **"Properties"**
6. Go to **"Listen"** tab
7. **UNCHECK** ☐ "Listen to this device"
8. Click **"Apply"** and **"OK"**

### Disable Stereo Mix / What U Hear

1. In the **Recording** tab, **right-click** empty space
2. Check **"Show Disabled Devices"**
3. If you see **"Stereo Mix"** or **"What U Hear"**:
   - Right-click it
   - Select **"Disable"**
4. Click **"OK"**

---

## 🔧 Solution 2: Update Frontend Audio Configuration

Edit `frontend/src/components/ChatInterface.tsx`:

```typescript
const voiceClient = new RTVIClient({
  transport: new DailyTransport(),
  params: {
    baseUrl: room_url,
  },
  enableMic: true,
  enableCam: false,
  timeout: 15000,
  // ✅ ADD THESE AUDIO CONSTRAINTS
  customSettings: {
    audio: {
      echoCancellation: true,      // ← Enable echo cancellation
      noiseSuppression: true,       // ← Reduce background noise
      autoGainControl: true,        // ← Normalize volume
    }
  }
});
```

After making this change:
```bash
cd frontend
npm run dev
```

---

## 🔧 Solution 3: Update Backend Configuration

Edit `backend/bot.py`:

### Add Echo Cancellation to Transport

```python
# Configure Daily transport for WebRTC
transport = DailyTransport(
    room_url=os.getenv("DAILY_ROOM_URL"),
    token=os.getenv("DAILY_TOKEN"),
    bot_name="Pipecat AI Agent",
    params=DailyParams(
        audio_out_enabled=True,
        audio_in_enabled=True,
        transcription_enabled=False,
        # ✅ ADD THESE SETTINGS
        audio_in_sample_rate=16000,
        audio_out_sample_rate=16000,
        vad_enabled=True,              # Voice Activity Detection
        vad_analyzer="silero",         # Better VAD
    ),
)
```

### Restart Backend

```bash
cd backend
python server.py
```

Or with Docker:
```bash
docker-compose restart backend
```

---

## 🔧 Solution 4: Browser-Level Fix

### Chrome/Edge

1. Go to `chrome://settings/content/microphone`
2. Ensure correct microphone is selected
3. Check site permissions for `localhost:3000`

### Firefox

1. Go to `about:preferences#privacy`
2. Scroll to **Permissions** → **Microphone**
3. Click **Settings** next to Microphone
4. Ensure correct device selected

---

## 🔧 Solution 5: Daily.co Room Configuration

Edit `backend/server.py` to add audio processing:

```python
room_data = {
    "properties": {
        "enable_chat": True,
        "enable_screenshare": False,
        "enable_recording": False,
        "exp": int(time.time() + 3600),
        # ✅ ADD THESE AUDIO PROPERTIES
        "enable_advanced_audio": True,
        "enable_noise_cancellation": True,
        "enable_audio_processing": {
            "enable_echo_cancellation": True,
        }
    }
}
```

Restart the backend after making changes.

---

## 🧪 Testing the Fix

1. **Clear browser cache** (Ctrl + Shift + Delete)
2. **Restart browser** completely
3. **Start backend**: `python backend/server.py`
4. **Start frontend**: `cd frontend && npm run dev`
5. **Open** http://localhost:3000
6. **Enable voice** and test

---

## 🎧 Hardware Solutions

### Best Microphones for Voice AI

1. **USB Headset with Boom Mic**
   - Reduces echo naturally
   - Directional mic picks up less ambient sound

2. **External USB Microphone**
   - Better quality than built-in mics
   - Often has hardware noise cancellation

3. **Gaming Headsets**
   - Designed for clear voice communication
   - Usually have good echo cancellation

### Avoid

❌ Built-in laptop microphones with laptop speakers  
❌ USB microphones placed near speakers  
❌ Bluetooth devices (may have latency issues)  

---

## 📊 Verify the Fix

Run this test:

1. Enable voice mode
2. Say: "Hello, can you hear me?"
3. Wait for AI response
4. Listen carefully:
   - ✅ **Good**: Only AI voice, no echo
   - ❌ **Bad**: You hear echo or AI responds to itself

---

## 🐛 Still Having Issues?

If echo persists after trying all solutions:

### Collect Debug Information

**Frontend Console** (F12 in browser):
```javascript
// Run this in browser console
navigator.mediaDevices.enumerateDevices().then(devices => {
  console.log('Audio Devices:', devices.filter(d => d.kind === 'audioinput'));
});
```

**Check Browser Logs**:
1. Open DevTools (F12)
2. Go to Console tab
3. Look for WebRTC errors
4. Copy any error messages

**Backend Logs**:
Check terminal where `python server.py` is running for errors.

### Report the Issue

Create a GitHub issue with:
- OS and version
- Browser and version
- Audio hardware (headphones/speakers/mic)
- Steps you've already tried
- Console logs (if any errors)

---

## 💡 Pro Tips

1. **Always use headphones for voice AI** - Most reliable solution
2. **Close other audio apps** - Discord, Zoom, etc. may interfere
3. **Use wired headphones** - Bluetooth can have latency
4. **Update audio drivers** - Especially on Windows
5. **Test with different browsers** - Some handle WebRTC better

---

## 🔗 Additional Resources

- [MDN: MediaTrackConstraints](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints)
- [Daily.co Audio Best Practices](https://docs.daily.co/guides/products/daily-prebuilt/advanced-features/audio-quality)
- [WebRTC Echo Cancellation](https://webrtc.org/getting-started/media-devices)

---

## ✅ Summary

| Solution | Difficulty | Effectiveness |
|----------|-----------|---------------|
| Use Headphones | ⭐ Easy | ⭐⭐⭐⭐⭐ 100% |
| Disable "Listen to device" | ⭐ Easy | ⭐⭐⭐⭐ 90% |
| Disable Stereo Mix | ⭐ Easy | ⭐⭐⭐⭐ 90% |
| Update Frontend Config | ⭐⭐ Medium | ⭐⭐⭐⭐ 85% |
| Update Backend Config | ⭐⭐ Medium | ⭐⭐⭐ 75% |
| Hardware Upgrade | ⭐⭐⭐ Hard | ⭐⭐⭐⭐⭐ 100% |

**Recommended Order:**
1. Try headphones first (immediate fix)
2. Check Windows audio settings
3. Update code configurations
4. Report if still not working

---

**Need more help?** Open an issue on GitHub with your specific setup details!
