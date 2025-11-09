# Banner Image Setup

## 📸 Where to Put the Banner Image

Save the banner image (the one with the microphone icon and features) as:

```
assets/banner.png
```

The image should be:
- **Name**: `banner.png`
- **Location**: `assets/` folder in the repository root
- **Dimensions**: 1152 x 648 pixels (current image size)
- **Format**: PNG with transparent or dark blue background

## ✅ Current Setup

The README.md has been updated to display the banner image at the top:

```markdown
![Voice AI Agent Starter Template Banner](assets/banner.png)
```

## 🎨 Alternative: Using GitHub-hosted Image

If you prefer to use a GitHub-hosted image URL instead:

1. Create a GitHub release
2. Upload the banner image to the release
3. Copy the image URL
4. Update README.md to use that URL:

```markdown
![Banner](https://github.com/mksinha01/pipecat-voice-agent-template/releases/download/v1.0.0/banner.png)
```

## 📝 To Complete Setup

1. **Save the banner image** to `assets/banner.png`
2. **Commit the image**:
   ```bash
   git add assets/banner.png
   git commit -m "Add banner image to README"
   ```
3. **Push to GitHub**:
   ```bash
   git push origin main
   ```

The banner will appear at the top of your README on GitHub!

## 🔄 If You Want to Use a Different Image

Simply replace `assets/banner.png` with your preferred image and commit:

```bash
# Replace the image file
cp /path/to/your/image.png assets/banner.png

# Commit
git add assets/banner.png
git commit -m "Update banner image"
git push
```

---

**Note**: The image you showed me is perfect for this! Just save it as `assets/banner.png` and commit it.
