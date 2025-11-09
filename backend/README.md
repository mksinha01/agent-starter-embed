# Pipecat Voice AI Backend

This is the backend service for the voice AI agent using Pipecat.

## Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Configure your `.env` file with the API keys (already provided)

3. Get a Daily API key:
   - Sign up at https://dashboard.daily.co/
   - Get your API key and add it to `.env` as `DAILY_API_KEY`

## Running the Server

Start the FastAPI server:
```bash
python server.py
```

The server will run on http://localhost:8001

## Running the Bot

In a separate terminal, run the bot:
```bash
python bot.py
```

## API Endpoints

- `GET /` - Health check
- `POST /create-room` - Create a Daily room and return credentials
- `GET /health` - Health status
