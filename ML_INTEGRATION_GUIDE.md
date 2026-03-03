# ML Model Integration Guide

## Overview

The CodeLanders project now has a fully integrated machine learning pipeline powered by **Google Gemini API** for generating natural, context-aware responses to scammers, combined with **ElevenLabs** for realistic text-to-speech conversion and **Twilio** for voice delivery.

## Architecture

```
User Input / Scammer Message
        ↓
  Gemini ML Model (generates natural response)
        ↓
  ElevenLabs TTS (converts to speech audio)
        ↓
  Twilio (delivers voice call to scammer)
```

## Components

### 1. **ML Model: Google Gemini API**
- **Service**: Google Generative AI (Gemini 1.5 Flash)
- **Purpose**: Generate natural, context-aware responses based on scam type
- **Speed**: Ultra-fast inference for real-time voice interaction
- **Supports**: Multiple scam types with specialized prompts

### 2. **Shared Utilities**

#### `supabase/functions/_shared/gemini.ts`
Core ML functions:
- `generateAIResponse()` - Main function to generate responses
- `analyzeScamConversation()` - Analyze conversation for scam classification
- `generateVoiceCommand()` - Generate brief voice-friendly responses

#### `supabase/functions/_shared/prompts.ts`
System prompts for different scam types:
- `officer_vikram` - Indian bank officer (NPCI)
- `tech_support` - Microsoft Tech Support scammer
- `bank_impersonation` - Generic bank fraud
- `romance_scam` - Romantic interest extraction
- `anti_ai` - Human-like response patterns
- `analysis` - Fraud analysis and classification

### 3. **API Endpoints**

#### POST `/api/ai-response`
**Main entry point for generating AI responses**

Request:
```json
{
  "lastMessage": "Hello, I need to verify your account...",
  "scamType": "bank_impersonation",
  "context": {
    "targetPhone": "+1234567890",
    "scamType": "bank_impersonation",
    "conversationHistory": [...]
  }
}
```

Response:
```json
{
  "success": true,
  "aiResponse": "We've detected unusual activity. Please verify your details now.",
  "audioUrl": "data:audio/mpeg;base64,...",
  "callSid": "CA123...",
  "scamType": "bank_impersonation",
  "timestamp": "2026-03-03T10:30:00Z"
}
```

#### POST `/api/analyze-scam`
**Analyze scam conversations and provide recommendations**

Request:
```json
{
  "conversationHistory": "Full conversation transcript",
  "scamType": "general",
  "userMessage": "What should I say next?"
}
```

Response:
```json
{
  "success": true,
  "analysis": {
    "scamType": "tech_support",
    "confidence": 95,
    "indicators": ["urgency_creating", "remote_access_request"],
    "riskLevel": "high",
    "emotionalTone": "technical_authority",
    "suggestedProbe": "Can you walk me through the steps?"
  },
  "nextResponse": "...",
  "timestamp": "..."
}
```

### 4. **Supabase Functions**

#### `connect-call/index.ts`
Converts AI-generated text to Twilio-compatible audio

- Takes generated text from Gemini OR generates it on-demand
- Converts to speech via ElevenLabs
- Returns audio stream for Twilio
- Supports multiple voice IDs and settings

#### `analyze-scam/index.ts`
Analyzes conversations using Gemini

- Classifies scam type
- Calculates confidence scores
- Generates recommendations
- Provides next response suggestions

#### `generate-report/index.ts`
Creates detailed forensic reports

- Comprehensive markdown reports
- Threat metrics and classification
- Red flag identification
- Prevention recommendations

## Environment Variables Required

```env
# Gemini API
GEMINI_API_KEY=your_gemini_api_key

# ElevenLabs TTS
ELEVENLABS_API_KEY=your_elevenlabs_key
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM (optional, has default)

# Twilio Integration (optional)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
PUBLIC_APP_URL=https://yourapp.com
```

## Supported Scam Types

| Type | Prompt | Description |
|------|--------|-------------|
| `officer_vikram` | Officer Vikram (NPCI Banker) | Indian bank auditor pressuring for account details |
| `tech_support` | Microsoft Tech Support | Technical malware warnings and remote access requests |
| `bank_impersonation` | Generic Bank Fraud | Standard bank account compromise alerts |
| `romance_scam` | Romantic Interest | Emotional manipulation and money requests |
| `general` | Default Response | General-purpose scam response generator |

## Usage Examples

### Example 1: Generate Bank Officer Response

```bash
curl -X POST http://localhost:3000/api/ai-response \
  -H "Content-Type: application/json" \
  -d '{
    "lastMessage": "Can you confirm my current balance?",
    "scamType": "officer_vikram"
  }'
```

### Example 2: Analyze Conversation

```bash
curl -X POST https://your-project.supabase.co/functions/v1/analyze-scam \
  -H "Authorization: Bearer YOUR_SUPABASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "conversationHistory": "Full transcript...",
    "scamType": "tech_support"
  }'
```

### Example 3: Generate Voice Response

```bash
curl -X POST https://your-project.supabase.co/functions/v1/connect-call \
  -H "Authorization: Bearer YOUR_SUPABASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userMessage": "What happens next?",
    "scamType": "officer_vikram"
  }'
```

## How It Works: Complete Flow

### 1. **Conversation Starts**
   - Scammer initiates call or text
   - Message captured and sent to ML system

### 2. **AI Response Generation**
   - Message passed to Gemini API with appropriate system prompt
   - Model generates natural response based on scam type
   - Response constrained to 50-80 words for voice naturalness

### 3. **Speech Synthesis**
   - Generated text sent to ElevenLabs API
   - Converted to `ulaw_8000` audio format (Twilio standard)
   - Audio buffer returned with proper headers

### 4. **Voice Delivery**
   - Audio streamed to Twilio
   - Call plays to scammer in real-time
   - Next scammer input captured

### 5. **Analysis & Logging**
   - Conversation analyzed for scam classification
   - Confidence scores calculated
   - Metrics and recommendations generated
   - Full forensic report created

## Response Quality Features

✅ **Natural sounding** - Uses ML for contextual, human-like responses
✅ **Fast** - Gemini Flash model for sub-second inference
✅ **Adaptive** - Different prompts for different scam types
✅ **Emotional** - Romance scams get emotional responses
✅ **Technical** - Tech support scams get credible technical language
✅ **Anti-AI detection** - Avoids AI detection by scammers
✅ **Real-time** - Low latency for live voice calls

## Error Handling

All endpoints return proper HTTP status codes:
- `200` - Success
- `400` - Bad request (missing required fields)
- `401` - Unauthorized
- `500` - Server error (check logs)

Errors include detailed messages for debugging.

## Deployment Checklist

- [ ] Gemini API key configured in environment
- [ ] ElevenLabs API key configured
- [ ] Twilio credentials configured (if using voice calls)
- [ ] Environment variables set in production
- [ ] CORS headers configured properly
- [ ] Rate limiting implemented (if needed)
- [ ] Logging and monitoring enabled
- [ ] Error tracking configured

## Performance Metrics

- **Response generation**: 500-1000ms (Gemini Flash)
- **TTS conversion**: 800ms-2s (depending on text length)
- **Total latency**: 1.3-3s end-to-end
- **Concurrent calls**: Limited by API quotas

## Security Notes

⚠️ **Important**: Never expose API keys in client-side code
⚠️ Use environment variables only
⚠️ Implement rate limiting to prevent abuse
⚠️ Log all interactions for compliance
⚠️ Ensure GDPR/legal compliance for recordings

## Troubleshooting

### "Missing API credentials"
Check that `GEMINI_API_KEY` and `ELEVENLABS_API_KEY` are set

### "ElevenLabs Error"
Check API key validity and rate limits in ElevenLabs dashboard

### "No content in Gemini response"
Verify Gemini API is working and model name is correct

### "Twilio call failed"
Check Twilio credentials and phone number format

## Next Steps

1. Test responses with different scam types
2. Fine-tune system prompts based on feedback
3. Add more scam type specializations
4. Implement conversation memory for multi-turn interactions
5. Add analytics and reporting dashboard
