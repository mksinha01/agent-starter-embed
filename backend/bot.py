import asyncio
import aiohttp
import os
import sys
from typing import AsyncGenerator

from pipecat.frames.frames import (
    AudioRawFrame,
    EndFrame,
    Frame,
    LLMMessagesUpdateFrame,
    TextFrame,
)
from pipecat.pipeline.pipeline import Pipeline
from pipecat.pipeline.runner import PipelineRunner
from pipecat.pipeline.task import PipelineParams, PipelineTask
from pipecat.processors.aggregators.openai_llm_context import (
    OpenAILLMContext,
    OpenAILLMContextFrame,
)
from pipecat.services.cartesia import CartesiaTTSService
from pipecat.services.deepgram import DeepgramSTTService
from pipecat.services.google import GoogleLLMService
from pipecat.transports.services.daily import DailyParams, DailyTransport

from dotenv import load_dotenv
load_dotenv()

from loguru import logger


async def main():
    logger.info("🤖 Bot starting up...")
    logger.info(f"Room URL: {os.getenv('DAILY_ROOM_URL')}")
    logger.info(f"Token configured: {'Yes' if os.getenv('DAILY_TOKEN') else 'No'}")
    
    async with aiohttp.ClientSession() as session:
        # Configure Daily transport for WebRTC
        transport = DailyTransport(
            room_url=os.getenv("DAILY_ROOM_URL"),
            token=os.getenv("DAILY_TOKEN"),
            bot_name="Pipecat AI Agent",
            params=DailyParams(
                audio_out_enabled=True,
                audio_in_enabled=True,
                transcription_enabled=False,  # Disable to avoid admin permission error
            ),
        )

        # Configure STT (Speech-to-Text) with Deepgram
        stt = DeepgramSTTService(
            api_key=os.getenv("DEEPGRAM_API_KEY"),
        )

        # Configure TTS (Text-to-Speech) with Cartesia
        tts = CartesiaTTSService(
            api_key=os.getenv("CARTESIA_API_KEY"),
            voice_id="79a125e8-cd45-4c13-8a67-188112f4dd22",  # British Lady
        )

        # Configure LLM with Google Gemini
        llm = GoogleLLMService(
            api_key=os.getenv("GOOGLE_API_KEY"),
            model="gemini-2.0-flash",
        )

        # Set up conversation context using OpenAI-compatible format
        context = OpenAILLMContext(
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful AI assistant. You can have natural conversations with users through both voice and text. Be friendly, concise, and engaging.",
                }
            ]
        )
        context_aggregator = llm.create_context_aggregator(context)

        # Build the pipeline
        pipeline = Pipeline(
            [
                transport.input(),  # Audio/text from user
                stt,  # Speech to text
                context_aggregator.user(),  # Aggregate user input
                llm,  # Generate response
                tts,  # Text to speech
                transport.output(),  # Send back to user
                context_aggregator.assistant(),  # Aggregate assistant response
            ]
        )

        # Create and run the task
        task = PipelineTask(
            pipeline,
            params=PipelineParams(
                allow_interruptions=True,
                enable_metrics=True,
                enable_usage_metrics=True,
            ),
        )

        @transport.event_handler("on_first_participant_joined")
        async def on_first_participant_joined(transport, participant):
            logger.info(f"👋 First participant joined: {participant}")
            await transport.capture_participant_transcription(participant["id"])
            # Don't send initial greeting - wait for user to speak first
            logger.info("Waiting for user to speak...")

        @transport.event_handler("on_participant_left")
        async def on_participant_left(transport, participant, reason):
            logger.info(f"👋 Participant left: {participant}, reason: {reason}")
            await task.queue_frame(EndFrame())

        @transport.event_handler("on_call_state_updated")
        async def on_call_state_updated(transport, state):
            logger.info(f"📞 Call state updated: {state}")
            if state == "left":
                await task.queue_frame(EndFrame())

        logger.info("🚀 Starting pipeline runner...")
        runner = PipelineRunner()

        await runner.run(task)
        logger.info("✅ Bot completed successfully")


if __name__ == "__main__":
    asyncio.run(main())
