# ⚠️ Daily API Key Issue - How to Fix

## Problem
The Daily API key in your `.env` file is **invalid** or **expired**. 

The current key: `pk_6052db9a-42cd-45d8-b6b9-b74054f0b7ae` is returning a **401 Unauthorized** error.

## Solution

### Step 1: Get a Valid Daily API Key

1. **Go to Daily.co Dashboard**: https://dashboard.daily.co/
2. **Sign Up or Log In**:
   - If you don't have an account, sign up (free tier available)
   - If you have an account, log in

3. **Get Your API Key**:
   - Click on **"Developers"** in the left sidebar
   - Click on **"API Keys"**
   - Copy your API key (starts with `pk_` or similar)

### Step 2: Update Your .env File

1. Open `backend\.env` file
2. Replace the `DAILY_API_KEY` line with your new key:
   ```
   DAILY_API_KEY=your-new-api-key-here
   ```

### Step 3: Restart the Backend Server

1. Stop the current server (press Ctrl+C in the terminal)
2. Start it again:
   ```powershell
   cd "c:\A SSD NEW WIN\code\agent-starter-embed\backend"
   python server.py
   ```

## Alternative: Use Text-Only Mode (No Voice)

If you don't want to use voice features right now, you can:

1. **Just use text chat** - It works without the Daily API key
2. The voice button will show an error, but text chat works fine
3. Get the API key later when you want to try voice mode

## Verify Your API Key

After updating the key, test it:

```powershell
# In your browser or using curl:
http://localhost:8001/test-daily
```

This will tell you if your API key is valid.

## Current Status

✅ **Text Chat**: Working  
❌ **Voice Mode**: Needs valid Daily API key  
✅ **Frontend**: Running on http://localhost:3000  
✅ **Backend**: Running on http://localhost:8001  

## Need Help?

1. **Daily.co Documentation**: https://docs.daily.co/
2. **Daily.co Support**: support@daily.co
3. **Check API Key Format**: Should start with `pk_` for production or similar prefix

---

**Once you update the API key, voice mode will work!** 🎤
