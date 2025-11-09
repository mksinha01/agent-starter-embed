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
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
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


@app.get("/")
async def root():
    return {
        "message": "Pipecat Voice AI Backend is running",
        "daily_api_configured": bool(DAILY_API_KEY),
        "daily_api_key_prefix": DAILY_API_KEY[:8] + "..." if DAILY_API_KEY else None
    }


@app.get("/test-daily")
async def test_daily():
    """Test if Daily API key is working"""
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
        
        async with session.get(
            f"{DAILY_API_URL}/rooms",
            headers=headers
        ) as response:
            if response.status == 401:
                return {
                    "error": "Invalid API key",
                    "status": 401,
                    "message": "The Daily API key is not valid. Please check your .env file."
                }
            elif response.status == 200:
                return {
                    "status": "success",
                    "message": "Daily API key is valid!",
                    "api_key_prefix": DAILY_API_KEY[:8] + "..."
                }
            else:
                return {
                    "error": f"Unexpected status: {response.status}",
                    "message": await response.text()
                }


@app.post("/create-room", response_model=RoomResponse)
async def create_room():
    """Create a Daily room and return the room URL and token"""
    if not DAILY_API_KEY:
        raise HTTPException(
            status_code=500, 
            detail="DAILY_API_KEY not configured. Please add it to your .env file"
        )
    
    async with aiohttp.ClientSession() as session:
        # Create a room
        headers = {
            "Authorization": f"Bearer {DAILY_API_KEY}",
            "Content-Type": "application/json",
        }
        
        room_data = {
            "properties": {
                "enable_chat": True,
                "enable_screenshare": False,
                "enable_recording": False,
                "exp": int(time.time() + 3600),  # 1 hour from now
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
        
        # Create a token for the room
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
        
        # Create a bot token for the Pipecat bot
        bot_token_data = {
            "properties": {
                "room_name": room_name,
                "is_owner": False,
                "user_name": "Pipecat AI Bot"
            }
        }
        
        async with session.post(
            f"{DAILY_API_URL}/meeting-tokens",
            headers=headers,
            json=bot_token_data
        ) as response:
            if response.status != 200:
                error_text = await response.text()
                print(f"Warning: Failed to create bot token: {error_text}")
                bot_token = token  # Fallback to user token
            else:
                bot_response = await response.json()
                bot_token = bot_response["token"]
        
        # Start the Pipecat bot in a separate process
        try:
            env = os.environ.copy()
            env["DAILY_ROOM_URL"] = room_url
            env["DAILY_TOKEN"] = bot_token
            
            # Start bot process with output visible
            bot_process = subprocess.Popen(
                [sys.executable or "python", "bot.py"],
                env=env,
                cwd=os.path.dirname(__file__),
                stdout=None,  # Show output in console
                stderr=None   # Show errors in console
            )
            
            # Store the process
            active_bots[room_name] = bot_process
            print(f"Started bot process {bot_process.pid} for room {room_name}")
        except Exception as e:
            print(f"Warning: Failed to start bot: {e}")
            # Continue anyway - user can still join the room
        
        return RoomResponse(
            room_url=room_url,
            room_name=room_name,
            token=token
        )


@app.get("/health")
async def health():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
