# 🤖 AI Service Customization Guide

Learn how to swap and customize the AI services in your Pipecat voice agent.

---

## 🎯 Overview

The Pipecat pipeline consists of three main AI services:

1. **STT (Speech-to-Text)**: Converts user's voice to text
2. **LLM (Language Model)**: Generates intelligent responses
3. **TTS (Text-to-Speech)**: Converts bot's text to voice

You can mix and match any supported providers!

---

## 🎤 Speech-to-Text (STT) Options

### Deepgram (Default)

```python
from pipecat.services.deepgram import DeepgramSTTService

stt = DeepgramSTTService(
    api_key=os.getenv("DEEPGRAM_API_KEY"),
    model="nova-2",           # Latest model
    language="en-US",         # Language code
    encoding="linear16",
    sample_rate=16000
)
```

**Best for**: High accuracy, fast processing, good pricing

### AssemblyAI

```python
from pipecat.services.assemblyai import AssemblyAISTTService

stt = AssemblyAISTTService(
    api_key=os.getenv("ASSEMBLYAI_API_KEY"),
    sample_rate=16000,
    word_boost=["technical", "terms"],  # Boost specific words
    language_code="en"
)
```

**Best for**: Speaker diarization, sentiment analysis

### Azure Speech

```python
from pipecat.services.azure import AzureSTTService

stt = AzureSTTService(
    api_key=os.getenv("AZURE_SPEECH_KEY"),
    region=os.getenv("AZURE_SPEECH_REGION"),
    language="en-US",
    continuous_recognition=True
)
```

**Best for**: Enterprise integration, multilingual support

### Google Cloud Speech

```python
from pipecat.services.google import GoogleSTTService

stt = GoogleSTTService(
    credentials_json=os.getenv("GOOGLE_CREDENTIALS_JSON"),
    language_code="en-US",
    model="latest_long",
    use_enhanced=True
)
```

**Best for**: Google Cloud ecosystem integration

### AWS Transcribe

```python
from pipecat.services.aws import AWSTranscribeSTTService

stt = AWSTranscribeSTTService(
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region="us-east-1",
    language_code="en-US"
)
```

**Best for**: AWS infrastructure, cost optimization

---

## 🗣️ Text-to-Speech (TTS) Options

### Cartesia (Default)

```python
from pipecat.services.cartesia import CartesiaTTSService

tts = CartesiaTTSService(
    api_key=os.getenv("CARTESIA_API_KEY"),
    voice_id="79a125e8-cd45-4c13-8a67-188112f4dd22",  # British Lady
    model="sonic-english",
    language="en",
    sample_rate=24000
)
```

**Popular voices:**
- `79a125e8-cd45-4c13-8a67-188112f4dd22` - British Lady
- `a0e99841-438c-4a64-b679-ae501e7d6091` - Barbershop Man
- `421b3369-f63f-4b03-8980-37a44df1d4e8` - Professional Woman

**Best for**: Natural, low-latency streaming voice

### ElevenLabs

```python
from pipecat.services.elevenlabs import ElevenLabsTTSService

tts = ElevenLabsTTSService(
    api_key=os.getenv("ELEVENLABS_API_KEY"),
    voice_id="21m00Tcm4TlvDq8ikWAM",  # Rachel
    model_id="eleven_monolingual_v1",
    stability=0.5,
    similarity_boost=0.75,
    optimize_streaming_latency=3
)
```

**Best for**: Ultra-realistic voices, voice cloning

### Azure TTS

```python
from pipecat.services.azure import AzureTTSService

tts = AzureTTSService(
    api_key=os.getenv("AZURE_SPEECH_KEY"),
    region=os.getenv("AZURE_SPEECH_REGION"),
    voice="en-US-JennyNeural",
    style="friendly",
    rate=1.0,
    pitch=0
)
```

**Best for**: Enterprise, Microsoft ecosystem

### Google Cloud TTS

```python
from pipecat.services.google import GoogleTTSService

tts = GoogleTTSService(
    credentials_json=os.getenv("GOOGLE_CREDENTIALS_JSON"),
    voice_name="en-US-Neural2-F",
    language_code="en-US",
    speaking_rate=1.0,
    pitch=0.0
)
```

**Best for**: Multilingual, WaveNet voices

### AWS Polly

```python
from pipecat.services.aws import AWSPollyTTSService

tts = AWSPollyTTSService(
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region="us-east-1",
    voice_id="Joanna",
    engine="neural"
)
```

**Best for**: AWS integration, cost-effective

### OpenAI TTS

```python
from pipecat.services.openai import OpenAITTSService

tts = OpenAITTSService(
    api_key=os.getenv("OPENAI_API_KEY"),
    voice="nova",  # alloy, echo, fable, onyx, nova, shimmer
    model="tts-1",
    speed=1.0
)
```

**Best for**: Quick setup, good quality

---

## 🧠 Language Model (LLM) Options

### Google Gemini (Default)

```python
from pipecat.services.google import GoogleLLMService

llm = GoogleLLMService(
    api_key=os.getenv("GOOGLE_API_KEY"),
    model="gemini-2.0-flash",  # or gemini-pro
    temperature=0.7,
    max_output_tokens=256
)
```

**Best for**: Fast responses, multimodal support

### OpenAI GPT

```python
from pipecat.services.openai import OpenAILLMService

llm = OpenAILLMService(
    api_key=os.getenv("OPENAI_API_KEY"),
    model="gpt-4o-mini",  # or gpt-4, gpt-3.5-turbo
    temperature=0.7,
    max_tokens=256,
    frequency_penalty=0.0,
    presence_penalty=0.0
)
```

**Best for**: High quality, function calling

### Anthropic Claude

```python
from pipecat.services.anthropic import AnthropicLLMService

llm = AnthropicLLMService(
    api_key=os.getenv("ANTHROPIC_API_KEY"),
    model="claude-3-sonnet-20240229",  # or claude-3-opus
    max_tokens=256,
    temperature=0.7
)
```

**Best for**: Long context, nuanced responses

### Azure OpenAI

```python
from pipecat.services.azure import AzureOpenAILLMService

llm = AzureOpenAILLMService(
    api_key=os.getenv("AZURE_OPENAI_KEY"),
    endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    deployment="gpt-4",
    temperature=0.7
)
```

**Best for**: Enterprise, compliance requirements

### Groq

```python
from pipecat.services.groq import GroqLLMService

llm = GroqLLMService(
    api_key=os.getenv("GROQ_API_KEY"),
    model="mixtral-8x7b-32768",  # or llama2-70b
    temperature=0.7,
    max_tokens=256
)
```

**Best for**: Ultra-fast inference, cost-effective

### Local LLM (Ollama)

```python
from pipecat.services.ollama import OllamaLLMService

llm = OllamaLLMService(
    base_url="http://localhost:11434",
    model="llama2",  # or mistral, mixtral, etc.
    temperature=0.7
)
```

**Best for**: Privacy, no API costs, offline

---

## 🎨 Complete Example: Mix and Match

```python
# bot.py - Custom configuration
import os
from pipecat.services.elevenlabs import ElevenLabsTTSService
from pipecat.services.deepgram import DeepgramSTTService
from pipecat.services.anthropic import AnthropicLLMService

# Use Deepgram STT (fast, accurate)
stt = DeepgramSTTService(
    api_key=os.getenv("DEEPGRAM_API_KEY"),
    model="nova-2"
)

# Use ElevenLabs TTS (ultra-realistic)
tts = ElevenLabsTTSService(
    api_key=os.getenv("ELEVENLABS_API_KEY"),
    voice_id="21m00Tcm4TlvDq8ikWAM",  # Rachel
    optimize_streaming_latency=3
)

# Use Claude LLM (nuanced responses)
llm = AnthropicLLMService(
    api_key=os.getenv("ANTHROPIC_API_KEY"),
    model="claude-3-sonnet-20240229"
)

# Build pipeline with custom services
pipeline = Pipeline([
    transport.input(),
    stt,                          # Your custom STT
    context_aggregator.user(),
    llm,                          # Your custom LLM
    tts,                          # Your custom TTS
    transport.output(),
    context_aggregator.assistant()
])
```

---

## ⚙️ Environment Variables Template

Update your `backend/.env`:

```env
# Daily.co (Required)
DAILY_API_KEY=your_daily_api_key

# STT Options (choose one or more)
DEEPGRAM_API_KEY=your_deepgram_key
ASSEMBLYAI_API_KEY=your_assemblyai_key
AZURE_SPEECH_KEY=your_azure_key
AZURE_SPEECH_REGION=eastus
GOOGLE_CREDENTIALS_JSON=path/to/credentials.json
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret

# TTS Options (choose one or more)
CARTESIA_API_KEY=your_cartesia_key
ELEVENLABS_API_KEY=your_elevenlabs_key
OPENAI_API_KEY=your_openai_key

# LLM Options (choose one or more)
GOOGLE_API_KEY=your_google_key
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
GROQ_API_KEY=your_groq_key
```

---

## 🔧 Requirements Installation

Update `backend/requirements.txt` based on your choices:

```txt
# Core (always required)
pipecat-ai[daily]
python-dotenv
fastapi
uvicorn[standard]
aiohttp

# STT Services (add what you use)
pipecat-ai[deepgram]
pipecat-ai[assemblyai]
pipecat-ai[azure]
pipecat-ai[google]

# TTS Services (add what you use)
pipecat-ai[cartesia]
pipecat-ai[elevenlabs]

# LLM Services (add what you use)
pipecat-ai[openai]
pipecat-ai[anthropic]
pipecat-ai[groq]
```

Or install everything:
```txt
pipecat-ai[all]
```

---

## 🎯 Optimization Tips

### Low Latency Setup
```python
# For minimal delay
stt = DeepgramSTTService(model="nova-2")  # Fast STT
llm = GroqLLMService(model="mixtral-8x7b-32768")  # Fast LLM
tts = CartesiaTTSService(voice_id="...")  # Streaming TTS
```

### High Quality Setup
```python
# For best quality
stt = AssemblyAISTTService()  # High accuracy
llm = AnthropicLLMService(model="claude-3-opus")  # Best reasoning
tts = ElevenLabsTTSService(voice_id="...")  # Ultra-realistic
```

### Cost-Effective Setup
```python
# For budget-conscious
stt = DeepgramSTTService()  # Affordable
llm = GroqLLMService()  # Free tier available
tts = OpenAITTSService()  # Simple pricing
```

---

## 📚 Resources

- [Pipecat Services Docs](https://docs.pipecat.ai/services)
- [Deepgram Pricing](https://deepgram.com/pricing)
- [ElevenLabs Voice Library](https://elevenlabs.io/voice-library)
- [OpenAI Models](https://platform.openai.com/docs/models)
- [Anthropic Claude](https://www.anthropic.com/claude)
