# 🔧 Daily.co Payment Method Setup

## ⚠️ Current Error

**Error Message**: `account-missing-payment-method`

**What it means**: Your Daily.co account needs a payment method added to use their services (even for the free tier).

---

## ✅ How to Fix

### Step 1: Go to Daily.co Dashboard
Visit: https://dashboard.daily.co/

### Step 2: Sign In
- Use the account associated with your API key
- The API key starts with: `cf1ccaa6...`

### Step 3: Add Payment Method
1. Click on **"Settings"** (or **"Account"**) in the sidebar
2. Go to **"Billing"** section
3. Click **"Add Payment Method"**
4. Enter your credit/debit card details

### Step 4: Verify Free Tier
- Daily.co offers a **free tier** with:
  - 10,000 minutes per month
  - Up to 20 participants per room
  - No charge for free tier usage
- You won't be charged unless you exceed the free tier

### Step 5: Test the Connection
1. Refresh your frontend: http://localhost:3000
2. Click "Enable Voice"
3. Should now connect successfully!

---

## 💡 Alternative: Use a Different Account

If you don't want to add a payment method to this account:

### Option 1: Create New Daily.co Account
1. Sign up at https://dashboard.daily.co/ with a different email
2. Add payment method during signup
3. Get new API key from Developers → API Keys
4. Update `backend/.env` with new key:
   ```
   DAILY_API_KEY=your-new-api-key
   ```
5. Restart backend: `python server.py`

### Option 2: Use Trial Account
Some Daily.co accounts come with trial credits that don't require payment method. Check if this is available during signup.

---

## 🔍 Why Daily.co Requires This

**Security & Abuse Prevention**:
- Prevents abuse of free tier
- Standard practice for WebRTC services
- Ensures service quality and availability

**Don't Worry**:
- ✅ Free tier is truly free (up to limits)
- ✅ You can set spending limits
- ✅ Payment method is just for verification
- ✅ No automatic charges

---

## 📊 Daily.co Free Tier Limits

| Feature | Free Tier Limit |
|---------|----------------|
| Meeting minutes | 10,000 per month |
| Participants per room | Up to 20 |
| Recording storage | Limited |
| API calls | Generous limit |

**These limits are more than enough for development and testing!**

---

## 🛡️ Payment Method Safety Tips

1. **Use a card with low limit** for added security
2. **Set up billing alerts** in Daily.co dashboard
3. **Monitor usage** regularly in the dashboard
4. **Enable spending caps** if available

---

## ✅ After Adding Payment Method

Once you've added a payment method:

1. **No restart needed** - Daily.co updates immediately
2. **Refresh frontend** - http://localhost:3000
3. **Try voice mode** - Click "Enable Voice"
4. **Should connect** - No more errors!

Expected console output:
```
[Daily Transport] Initialized 1.4.0
[Pipecat Client] Initialized 1.4.0
Connected to voice AI
Bot is ready
```

---

## 🆘 Still Having Issues?

### If payment method is added but still getting errors:

1. **Wait 5 minutes** - Sometimes takes time to propagate
2. **Check API key** - Make sure it's from the right account
3. **Verify account status** - Check dashboard for any issues
4. **Try new API key** - Generate a fresh one

### Contact Daily.co Support:
- Email: support@daily.co
- Discord: https://discord.gg/daily
- Documentation: https://docs.daily.co/

---

## 📝 Summary

**Issue**: Daily.co requires payment method for account verification  
**Solution**: Add payment method at dashboard.daily.co  
**Cost**: Free tier available (10,000 min/month)  
**Time**: 5 minutes to set up  
**Benefit**: Voice mode will work perfectly!  

**Text chat works without any Daily.co setup** - you can use that while setting up payment method! 💬

---

## 🎉 Once Fixed

After adding payment method, voice mode will work:
- ✅ Real-time voice conversations
- ✅ Speech-to-text transcription
- ✅ AI voice responses
- ✅ Full conversation history

**The setup is worth it!** 🎤✨
