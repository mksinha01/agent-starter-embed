# Contributing to Pipecat Voice AI Agent Template

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

## 🤝 How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](../../issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, Python version, Node version, etc.)
   - Relevant logs or screenshots

### Suggesting Enhancements

1. Check [Issues](../../issues) to see if it's already suggested
2. Create a new issue with:
   - Clear description of the enhancement
   - Use cases and benefits
   - Potential implementation approach (if you have ideas)

### Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/pipecat-voice-agent-template.git
   cd pipecat-voice-agent-template
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow existing code style
   - Add comments where necessary
   - Update documentation if needed

4. **Test your changes**
   - Test backend: `cd backend && python server.py`
   - Test frontend: `cd frontend && npm run dev`
   - Test with Docker: `docker-compose up`

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add: descriptive commit message"
   ```

   **Commit message format:**
   - `Add:` for new features
   - `Fix:` for bug fixes
   - `Update:` for updates to existing features
   - `Docs:` for documentation changes
   - `Refactor:` for code refactoring

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Open a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your fork and branch
   - Provide a clear description of changes

## 📝 Code Style Guidelines

### Python (Backend)

- Follow [PEP 8](https://pep8.org/)
- Use type hints where applicable
- Add docstrings to functions and classes
- Keep functions small and focused
- Use meaningful variable names

Example:
```python
from typing import Dict, Any

async def create_room(api_key: str) -> Dict[str, Any]:
    """
    Create a Daily.co room for voice chat.
    
    Args:
        api_key: Daily.co API key
        
    Returns:
        Dictionary containing room_url, room_name, and token
    """
    # Implementation...
```

### TypeScript/JavaScript (Frontend)

- Use TypeScript for type safety
- Follow React best practices
- Use functional components and hooks
- Keep components small and reusable
- Use meaningful component and variable names

Example:
```typescript
interface VoiceChatProps {
  onConnect: () => void;
  onDisconnect: () => void;
}

export const VoiceChat: React.FC<VoiceChatProps> = ({ 
  onConnect, 
  onDisconnect 
}) => {
  // Implementation...
};
```

### Documentation

- Update README.md if you change functionality
- Add examples for new features
- Keep documentation clear and concise
- Include code examples where helpful

## 🔍 What We're Looking For

### High Priority

- **More frontend examples**: Angular, Svelte, SolidJS, etc.
- **More AI service integrations**: Additional STT/TTS/LLM providers
- **Production features**: Rate limiting, authentication, monitoring
- **Testing**: Unit tests, integration tests, E2E tests
- **Performance optimizations**: Caching, connection pooling, etc.
- **Mobile support**: React Native integration examples
- **Multilingual support**: i18n examples and guides

### Medium Priority

- **UI improvements**: Better chat interface, audio visualizations
- **Documentation**: More detailed guides, video tutorials
- **Error handling**: Better error messages and recovery
- **Logging**: Structured logging, log aggregation examples
- **DevOps**: CI/CD pipelines, automated deployments

### Nice to Have

- **Alternative transports**: Twilio, Agora, etc.
- **Recording features**: Save and playback conversations
- **Analytics**: Usage tracking, performance metrics
- **Multi-language voice**: Support for more languages
- **Custom voices**: Voice cloning examples

## 🧪 Testing Guidelines

Before submitting a PR, please test:

1. **Backend API**
   ```bash
   cd backend
   python server.py
   # Test all endpoints manually or with automated tests
   ```

2. **Frontend**
   ```bash
   cd frontend
   npm run dev
   # Test UI and voice functionality
   ```

3. **Docker**
   ```bash
   docker-compose up
   # Ensure both services start correctly
   ```

4. **Different browsers**
   - Chrome
   - Firefox
   - Safari
   - Edge

5. **Different environments**
   - Local development
   - Docker
   - Production build

## 🐛 Bug Fix Process

1. Create an issue describing the bug
2. Reference the issue in your PR
3. Include steps to reproduce
4. Add tests if applicable
5. Update documentation if needed

## ✨ Feature Addition Process

1. Open an issue to discuss the feature first
2. Wait for maintainer feedback
3. Implement the feature
4. Add documentation and examples
5. Submit PR with clear description

## 📋 PR Checklist

Before submitting your PR, ensure:

- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] Documentation is updated
- [ ] Examples are provided (if applicable)
- [ ] Commit messages are clear
- [ ] No unnecessary files are included
- [ ] .env files are not committed
- [ ] Changes work with Docker
- [ ] Changes work locally
- [ ] README is updated if needed

## 🎉 Recognition

Contributors will be:
- Listed in the repository
- Mentioned in release notes
- Thanked in the community

## 📞 Questions?

If you have questions about contributing:
- Open an issue with the "question" label
- Check existing issues and discussions
- Review the documentation

## 🙏 Thank You!

Your contributions make this project better for everyone. We appreciate your time and effort!

---

**Happy Contributing! 🚀**
