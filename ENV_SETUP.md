# Environment Variables Configuration

## Required Variables

### Google Gemini API
```env
# Get from: https://makersuite.google.com/app/apikeys
GEMINI_API_KEY=your_gemini_api_key_here
```

### ElevenLabs Text-to-Speech
```env
# Get from: https://elevenlabs.io/app/settings/api-keys
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

# Optional: Custom voice ID (defaults to 21m00Tcm4TlvDq8ikWAM)
ELEVENLABS_VOICE_ID=your_preferred_voice_id
```

### Twilio (Optional - for live calls)
```env
# Get from: https://www.twilio.com/console
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890

# Your application URL for callbacks
PUBLIC_APP_URL=https://yourapp.com
```

### Supabase (Optional - for functions)
```env
# Get from: https://app.supabase.com/project/YOUR_PROJECT/settings/api
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## Setup Instructions

### 1. Google Gemini API
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikeys)
2. Create a new API key
3. Copy and paste into `GEMINI_API_KEY`

### 2. ElevenLabs API
1. Sign up at [ElevenLabs](https://elevenlabs.io)
2. Go to [Settings → API Keys](https://elevenlabs.io/app/settings/api-keys)
3. Copy your API key
4. Paste into `ELEVENLABS_API_KEY`

**For custom voices:**
- Go to [Voice Lab](https://elevenlabs.io/app/voice-lab)
- Use voice IDs for different accents/personalities
- Default ID `21m00Tcm4TlvDq8ikWAM` = "Rachel" (professional, neutral)
- Try `MF3mGyEYCl7XYWbV7PZT` for more character

### 3. Twilio Setup (Optional)
1. Create account at [Twilio](https://www.twilio.com)
2. Go to [Console → Account Info](https://www.twilio.com/console)
3. Copy Account SID and Auth Token
4. Get a phone number from [Phone Numbers](https://www.twilio.com/console/phone-numbers)
5. Set `PUBLIC_APP_URL` to where your app is hosted

### 4. Local Development
Create `.env.local` file in root directory:

```env
# NextJS local development
GEMINI_API_KEY=pk-...
ELEVENLABS_API_KEY=sk_...
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...
PUBLIC_APP_URL=http://localhost:3000
```

### 5. Production Deployment
Set environment variables in your deployment platform:

**Vercel:**
- Go to Settings → Environment Variables
- Add each variable

**Docker:**
```dockerfile
ENV GEMINI_API_KEY=your_key_here
ENV ELEVENLABS_API_KEY=your_key_here
```

**Supabase Functions:**
```bash
supabase secrets set GEMINI_API_KEY=your_key_here
supabase secrets set ELEVENLABS_API_KEY=your_key_here
```

## Testing Configuration

Once configured, test with:

```bash
# Test Gemini API
curl -X POST http://localhost:3000/api/ai-response \
  -H "Content-Type: application/json" \
  -d '{"lastMessage": "Test message", "scamType": "general"}'

# Should return JSON with aiResponse, audioUrl, etc.
```

## Troubleshooting

### "GEMINI_API_KEY is not set"
- Confirm `.env.local` exists in root directory
- Restart dev server: `npm run dev`
- Check that key is not empty

### "Invalid API key"
- Verify key is correct in Google Console
- Check that key matches your project
- Keys starting with `pk-` are public; use private key

### "ElevenLabs quota exceeded"
- Check usage at https://elevenlabs.io/app/account
- Upgrade plan if needed
- Implement rate limiting in code

### "Twilio: Invalid credentials"
- Verify Account SID and Auth Token are correct
- Check phone number format (should be +1234567890)
- Ensure number is verified in Twilio

## Security Best Practices

✅ **DO:**
- Store keys in environment variables only
- Use `.env.local` for local development (not in git)
- Rotate keys periodically
- Use minimal permission tokens
- Enable API rate limiting
- Monitor API usage

❌ **DON'T:**
- Commit `.env.local` to git
- Share API keys in code or repos
- Use same key across environments
- Store keys in client-side code
- Log API keys anywhere
- Use public keys for sensitive operations

## API Key Rotation

1. **Generate new key** in respective service console
2. **Update environment variable** in all environments
3. **Test new key** to ensure working
4. **Wait 24 hours** before disabling old key
5. **Disable old key** after confirming new one works

## Cost Estimates

**Monthly costs** (approximate):

| Service | Free Tier | Usage | Cost |
|---------|-----------|-------|------|
| Gemini API | 60 req/min | 1000 calls | ~$0 - $5 |
| ElevenLabs | 10k characters/month | 100k chars | ~$5 - $20 |
| Twilio | $0.0044/min | 100 mins | ~$4.40 |
| Total | Low | Moderate | ~$10-30 |

Check each service's pricing page for current rates.
