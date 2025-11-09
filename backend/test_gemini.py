import os
from dotenv import load_dotenv

load_dotenv()

# Test Google Gemini API (Free API)
try:
    import google.generativeai as genai
    
    # Get API key
    api_key = os.getenv('GOOGLE_API_KEY') or os.getenv('GOOGLE_CLOUD_API_KEY')
    if not api_key:
        print("❌ GOOGLE_API_KEY not found in .env file")
        exit(1)
    
    print(f"✅ API Key found: {api_key[:20]}...")
    
    # Configure the free Gemini API
    genai.configure(api_key=api_key)
    
    print("✅ Gemini API configured successfully")
    
    # Create model instance with correct model name
    model = genai.GenerativeModel('gemini-2.0-flash')
    
    # Test with a simple question
    response = model.generate_content(
        'Say "Hello! I am Google Gemini and I am working correctly!" in a friendly way.'
    )
    
    print("\n📝 Gemini Response:")
    print(response.text)
    print("\n✅ Google Gemini LLM is working correctly!")
    
except ImportError as e:
    print(f"❌ Import Error: {e}")
    print("Please install: pip install google-generativeai")
except Exception as e:
    print(f"❌ Error testing Gemini: {e}")
