---
name: Bug Report - Voice Echo/Feedback
about: Report voice echo or audio feedback issues
title: '[BUG] AI agent's voice is being fed back into the microphone'
labels: bug, voice, audio
assignees: ''
---

## 🐛 Bug Description

When talking to the AI agent, the agent's voice output is being captured by the user's microphone, creating an echo/feedback loop.

## 🔍 Current Behavior

- User speaks to the AI agent
- AI agent responds with voice
- **The AI agent's voice output is picked up by the user's microphone**
- This causes the AI to hear its own voice
- May result in:
  - Echo effects
  - Audio feedback loop
  - AI responding to itself
  - Degraded conversation quality

## ✅ Expected Behavior

- User speaks to the AI agent
- AI agent responds with voice
- **Only the user's voice should be captured by the microphone**
- The AI agent's output should NOT be fed back into the input

## 🔧 Possible Causes

1. **Browser Audio Routing**
   - Browser may be routing system audio to microphone input
   - Lack of echo cancellation in audio pipeline

2. **Hardware Configuration**
   - "Stereo Mix" or "What U Hear" enabled in Windows audio settings
   - Microphone picking up speaker output physically

3. **WebRTC Configuration**
   - Missing echo cancellation settings in Daily.co transport
   - Audio constraints not properly configured

4. **Pipecat Configuration**
   - Missing audio processing filters
   - Incorrect audio input/output routing

## 🛠️ Potential Solutions

### Solution 1: Enable Browser Echo Cancellation

Update the Daily transport configuration in `backend/bot.py`:

```python
transport = DailyTransport(
    room_url=os.getenv("DAILY_ROOM_URL"),
    token=os.getenv("DAILY_TOKEN"),
    bot_name="Pipecat AI Agent",
    params=DailyParams(
        audio_out_enabled=True,
        audio_in_enabled=True,
        transcription_enabled=False,
        # Add echo cancellation
        audio_in_sample_rate=16000,
        audio_out_sample_rate=16000,
    ),
)
```

### Solution 2: Frontend Audio Constraints

Update frontend Pipecat client initialization in `frontend/src/components/ChatInterface.tsx`:

```typescript
const voiceClient = new RTVIClient({
  transport: new DailyTransport(),
  params: {
    baseUrl: room_url,
  },
  enableMic: true,
  enableCam: false,
  // Add audio constraints
  micAudioMode: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
  },
});
```

### Solution 3: Check Windows Audio Settings

**For Users:**
1. Right-click speaker icon → **Sounds**
2. Go to **Recording** tab
3. Right-click your microphone → **Properties**
4. Go to **Listen** tab
5. **Uncheck** "Listen to this device"
6. Go to **Advanced** tab
7. Ensure no loopback or monitoring is enabled

**Check for Stereo Mix:**
1. In Recording tab, right-click empty space
2. Check "Show Disabled Devices"
3. If "Stereo Mix" or "What U Hear" appears, ensure it's **disabled**

### Solution 4: Use Headphones

**Immediate Workaround:**
- Use headphones instead of speakers
- This physically prevents speaker output from being picked up by microphone
- Most effective immediate solution

### Solution 5: Daily.co Room Configuration

Update room creation in `backend/server.py`:

```python
room_data = {
    "properties": {
        "enable_chat": True,
        "enable_screenshare": False,
        "enable_recording": False,
        "exp": int(time.time() + 3600),
        # Add audio processing
        "enable_advanced_audio": True,
        "enable_noise_cancellation": True,
    }
}
```

## 📋 Environment

- **OS**: Windows 11 / Windows 10 / macOS / Linux
- **Browser**: Chrome / Firefox / Safari / Edge
- **Audio Setup**: Speakers / Headphones / Headset
- **Microphone**: Built-in / External USB / Bluetooth

## 🧪 Testing Steps

1. Start the backend server
2. Start the frontend application
3. Enable voice mode
4. Speak to the AI agent
5. Listen for echo when AI responds
6. Check if AI responds to its own voice

## 📝 Additional Notes

This is a common issue in WebRTC applications. The solutions above should help eliminate the feedback loop. If the issue persists, please provide:

- Browser console logs
- Audio device setup details
- Whether issue occurs with headphones
- Backend terminal logs

## 🔗 Related Documentation

- [WebRTC Audio Constraints](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints)
- [Daily.co Audio Settings](https://docs.daily.co/reference/daily-js/instance-methods/setInputDevicesAsync)
- [Pipecat Audio Processing](https://docs.pipecat.ai)

## ✅ Checklist

- [ ] Try using headphones (immediate workaround)
- [ ] Check Windows "Listen to this device" setting
- [ ] Disable "Stereo Mix" if enabled
- [ ] Update audio constraints in frontend
- [ ] Update Daily transport configuration
- [ ] Test in different browser
- [ ] Check browser audio permissions
