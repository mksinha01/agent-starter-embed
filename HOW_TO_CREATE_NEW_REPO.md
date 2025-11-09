# 🚀 How to Create a New Repository from This Template

This guide will help you turn this into a standard, reusable repository on GitHub.

---

## 📋 Prerequisites

- GitHub account
- Git installed locally
- GitHub CLI (optional, but recommended)

---

## 🎯 Option 1: Using GitHub CLI (Recommended)

### 1. Install GitHub CLI (if not already installed)

**Windows (PowerShell):**
```powershell
winget install --id GitHub.cli
```

**Mac:**
```bash
brew install gh
```

**Linux:**
```bash
(type -p wget >/dev/null || (sudo apt update && sudo apt-get install wget -y)) \
&& sudo mkdir -p -m 755 /etc/apt/keyrings \
&& wget -qO- https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo tee /etc/apt/keyrings/githubcli-archive-keyring.gpg > /dev/null \
&& sudo chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg \
&& echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
&& sudo apt update \
&& sudo apt install gh -y
```

### 2. Login to GitHub

```bash
gh auth login
```

Follow the prompts to authenticate.

### 3. Remove Old Remote (if exists)

```bash
cd "c:\A SSD NEW WIN\code\agent-starter-embed"
git remote -v
git remote remove origin
```

### 4. Create New Repository

```bash
# Create a public repository
gh repo create pipecat-voice-agent-template --public --source=. --remote=origin --description="Production-ready template for integrating Pipecat voice AI agents with any frontend"

# OR create a private repository
gh repo create pipecat-voice-agent-template --private --source=. --remote=origin --description="Production-ready template for integrating Pipecat voice AI agents with any frontend"
```

### 5. Add Files and Push

```bash
# Stage all files
git add .

# Commit
git commit -m "Initial commit: Complete Pipecat voice AI template with docs and examples"

# Push to main branch
git branch -M main
git push -u origin main
```

### 6. Enable GitHub Template Feature

```bash
# Make it a template repository (so others can use it easily)
gh repo edit --enable-template
```

---

## 🎯 Option 2: Using GitHub Website

### 1. Create Repository on GitHub

1. Go to https://github.com/new
2. Repository name: `pipecat-voice-agent-template`
3. Description: `Production-ready template for integrating Pipecat voice AI agents with any frontend`
4. Choose Public or Private
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

### 2. Remove Old Remote (if exists)

```powershell
cd "c:\A SSD NEW WIN\code\agent-starter-embed"
git remote -v
git remote remove origin
```

### 3. Connect to New Repository

```powershell
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/pipecat-voice-agent-template.git

# Verify
git remote -v
```

### 4. Push to GitHub

```powershell
# Stage all files
git add .

# Commit
git commit -m "Initial commit: Complete Pipecat voice AI template with docs and examples"

# Push to main branch
git branch -M main
git push -u origin main
```

### 5. Enable Template Feature

1. Go to your repository on GitHub
2. Click "Settings"
3. Under "General", check "Template repository"
4. Save changes

---

## 📝 After Creating the Repository

### 1. Add Topics/Tags

Go to your repository → About section → ⚙️ → Add topics:
- `pipecat`
- `voice-ai`
- `webrtc`
- `daily-co`
- `template`
- `docker`
- `fastapi`
- `nextjs`
- `typescript`
- `python`

### 2. Create GitHub Actions (Optional)

Create `.github/workflows/test.yml`:

```yaml
name: Test

on: [push, pull_request]

jobs:
  backend-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt
      - name: Run tests
        run: |
          cd backend
          # Add your test commands here

  frontend-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: |
          cd frontend
          npm ci
      - name: Build
        run: |
          cd frontend
          npm run build
```

### 3. Add Social Preview Image

1. Create a nice banner image (1280x640px)
2. Go to repository → Settings → Social Preview
3. Upload the image

### 4. Update README Badge URLs

In `README.md`, replace badge URLs with your repository URL.

### 5. Add Repository Secrets (for CI/CD)

If you plan to use GitHub Actions:
1. Go to Settings → Secrets and variables → Actions
2. Add repository secrets for API keys (for testing)

---

## 🌟 Make It a GitHub Template

Once your repository is public and has template enabled, others can use it by:

1. Going to your repository
2. Clicking "Use this template"
3. Creating a new repository from it

---

## 📢 Share Your Template

### Add to README

```markdown
## 🚀 Use This Template

Click "Use this template" to create your own repository from this template!

[![Use this template](https://img.shields.io/badge/Use%20this%20template-2ea44f?style=for-the-badge)](https://github.com/YOUR_USERNAME/pipecat-voice-agent-template/generate)
```

### Share on Social Media

Tweet about it:
```
🎙️ Just created a production-ready template for building voice AI agents with @pipecat_ai!

✅ Works with any frontend (React, Vue, vanilla JS)
✅ Docker-ready
✅ Swap AI services easily
✅ Full documentation

Check it out: https://github.com/YOUR_USERNAME/pipecat-voice-agent-template

#VoiceAI #WebRTC #OpenSource
```

---

## 🔄 Keeping It Updated

### Create Releases

When you make significant updates:

```bash
git tag -a v1.0.0 -m "Initial release"
git push origin v1.0.0
```

Then create a release on GitHub with release notes.

### Version Naming

Use semantic versioning:
- `v1.0.0` - Initial release
- `v1.1.0` - New features
- `v1.1.1` - Bug fixes
- `v2.0.0` - Breaking changes

---

## 📚 Additional Resources

- [GitHub Template Repositories](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-template-repository)
- [GitHub CLI Manual](https://cli.github.com/manual/)
- [Git Documentation](https://git-scm.com/doc)

---

## ✅ Final Checklist

Before making your template public:

- [ ] All sensitive data removed (API keys, tokens)
- [ ] .env files not committed (only .env.example)
- [ ] README is comprehensive
- [ ] Documentation is complete
- [ ] Examples work
- [ ] Docker setup works
- [ ] License file added
- [ ] Contributing guide added
- [ ] .gitignore is comprehensive
- [ ] Repository description set
- [ ] Topics/tags added
- [ ] Template feature enabled

---

## 🎉 You're Done!

Your standard Pipecat voice AI template is now ready to be used by others!

Others can now:
1. Use your template to create new projects
2. Clone and customize for their needs
3. Contribute improvements back to you

**Happy coding! 🚀**
