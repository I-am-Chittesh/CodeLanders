# ML Model Integration - Quick Reference

## 🎯 What We've Built

A complete ML-powered scam baiting system that:
1. **Generates natural responses** using Google Gemini AI
2. **Converts to speech** via ElevenLabs TTS
3. **Delivers via phone** through Twilio
4. **Analyzes conversations** for scam classification
5. **Generates forensic reports** for law enforcement

## 📁 Key Files

### Shared Utilities
- `supabase/functions/_shared/gemini.ts` - ML functions
- `supabase/functions/_shared/prompts.ts` - System prompts for different scams

### Functions (Backend)
- `supabase/functions/connect-call/index.ts` - TTS to audio
- `supabase/functions/analyze-scam/index.ts` - Scam classification
- `supabase/functions/generate-report/index.ts` - Forensic reports

### API Routes (Next.js)
- `app/api/ai-response/route.ts` - Main response generation endpoint

## 🚀 Quick Start

### 1. Set Environment Variables
```env
GEMINI_API_KEY=your_key_here
ELEVENLABS_API_KEY=your_key_here
TWILIO_ACCOUNT_SID=your_sid_here
TWILIO_AUTH_TOKEN=your_token_here
TWILIO_PHONE_NUMBER=+1234567890
PUBLIC_APP_URL=http://localhost:3000
```

See `ENV_SETUP.md` for full configuration details.

### 2. Start Development Server
```bash
npm run dev
```

### 3. Test the ML Endpoints

#### Test 1: Generate AI Response
```bash
curl -X POST http://localhost:3000/api/ai-response \
  -H "Content-Type: application/json" \
  -d '{
    "lastMessage": "Can you verify my account number?",
    "scamType": "officer_vikram"
  }'
```

Expected response includes:
- `aiResponse` - Generated text
- `audioUrl` - Base64 encoded audio
- `callSid` - Twilio call ID (if enabled)

#### Test 2: Analyze Scam
```bash
curl -X POST http://localhost:3000/api/analyze-scam \
  -H "Content-Type: application/json" \
  -d '{
    "conversationHistory": "Scammer: Your account is compromised...",
    "scamType": "tech_support",
    "userMessage": "What should I say?"
  }'
```

## 🧠 Scam Types Supported

| Type | Use Case | Tone |
|------|----------|------|
| `officer_vikram` | Indian bank scams | Impatient, bureaucratic |
| `tech_support` | Microsoft/Apple fraud | Technical, urgent |
| `bank_impersonation` | Generic bank fraud | Professional, authoritative |
| `romance_scam` | Emotional manipulation | Warm, vulnerable |
| `general` | Default/unknown | Standard scammer |

## 🔄 Request/Response Format

### Generate Response
**Request:**
```json
{
  "lastMessage": "User/Scammer's message",
  "scamType": "officer_vikram",
  "context": {
    "targetPhone": "+1234567890",
    "conversationHistory": ["Previous messages..."]
  }
}
```

**Response:**
```json
{
  "success": true,
  "aiResponse": "Generated text response",
  "audioUrl": "data:audio/mpeg;base64,...",
  "callSid": "CA123abc...",
  "scamType": "officer_vikram",
  "timestamp": "2026-03-03T10:30:00Z"
}
```

### Analyze Conversation
**Request:**
```json
{
  "conversationHistory": "Full transcript",
  "scamType": "tech_support",
  "userMessage": "What should I say next?"
}
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "scamType": "tech_support",
    "confidence": 95,
    "indicators": ["urgency", "remote_access"],
    "riskLevel": "high"
  },
  "nextResponse": "Suggested response text"
}
```

## 🎤 How the ML Pipeline Works

```
Scammer Message
     ↓
[Gemini API] ← System prompt (language model)
     ↓
Generated Response (1-2 sentences)
     ↓
[ElevenLabs] ← Voice settings (emotional, natural)
     ↓
Audio Stream (ulaw_8000 format)
     ↓
[Twilio] ← Phone delivery
     ↓
Scammer hears realistic response
```

## 🎭 Example Interactions

### Officer Vikram (Bank Scam)
```
Scammer: "Can you tell me my account balance?"
AI: "Listen, your account is flagged in the Settlement Ledger. 
    We need your alternate UPI ID to process the unblock."
```

### Tech Support Scam
```
Scammer: "I'm calling about malware on your computer"
AI: "Yes, we detected suspicious activity. Can you 
    open Event Viewer for me? You'll see the errors there."
```

### Romance Scam
```
Scammer: "I need money for emergency"
AI: "I love you so much, but I'm scared. Can you help me? 
    My medical bills are crushing me..."
```

## 📊 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/ai-response` | POST | Generate AI response |
| `/api/analyze-scam` | POST | Analyze conversation |
| `/api/speak` | GET | TTS fallback |

## 🔐 Security & Privacy

- API keys kept in environment variables only
- No sensitive data in logs
- All communications HTTPS in production
- GDPR compliant (no personal data stored)
- Rate limiting recommended
- Audit logging recommended

## 🐛 Troubleshooting

**"Missing API credentials"**
- Check `.env.local` file exists
- Verify keys are not empty
- Restart dev server after changes

**"Gemini API Error"**
- Verify API key is valid
- Check Google Cloud project has API enabled
- Check rate limits in Google Console

**"ElevenLabs Error"**
- Verify API key is correct
- Check text isn't too long
- Monitor usage quota

**"Twilio Error"**
- Verify credentials are correct
- Check phone number format
- Ensure number is verified

## 📈 Next Steps

1. ✅ ML Model integrated (Gemini)
2. ✅ TTS integrated (ElevenLabs)
3. ✅ Twilio integration ready
4. ⏳ Deploy to production
5. ⏳ Monitor performance metrics
6. ⏳ Collect feedback and improve prompts
7. ⏳ Add analytics dashboard
8. ⏳ Expand scam type support

## 📚 Documentation

- `ML_INTEGRATION_GUIDE.md` - Complete architecture & usage
- `ENV_SETUP.md` - Environment configuration
- `QUICK_REFERENCE.md` - This file

## 💬 Support

For issues:
1. Check error messages in console
2. Review `ML_INTEGRATION_GUIDE.md`
3. Verify environment variables
4. Check API credentials and quotas
5. Review logs for detailed errors

## 📝 Example cURL Commands

### Generate response (Office Vikram - Bank Scam):
```bash
curl -X POST http://localhost:3000/api/ai-response \
  -H "Content-Type: application/json" \
  -d '{
    "lastMessage": "Hello, I need to verify your account details for security purposes",
    "scamType": "officer_vikram"
  }' | jq '.aiResponse'
```

### Analyze tech support conversation:
```bash
curl -X POST http://localhost:3000/api/ai-response \
  -H "Content-Type: application/json" \
  -d '{
    "lastMessage": "We detected malware on your Windows machine",
    "scamType": "tech_support"
  }' | jq '.aiResponse'
```

### Generate romance scam response:
```bash
curl -X POST http://localhost:3000/api/ai-response \
  -H "Content-Type: application/json" \
  -d '{
    "lastMessage": "I miss you so much",
    "scamType": "romance_scam"
  }' | jq '.aiResponse'
```

---

**Last Updated:** March 3, 2026
**Status:** ✅ Production Ready
