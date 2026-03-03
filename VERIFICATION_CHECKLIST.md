# ML Model Integration - Verification Checklist

## 🚀 Pre-Deployment Verification

Use this checklist to ensure the ML model integration is properly configured and ready for deployment.

## ✅ Configuration Verification

### Environment Variables
- [ ] `.env.local` file exists in root directory
- [ ] `GEMINI_API_KEY` is set and not empty
- [ ] `ELEVENLABS_API_KEY` is set and not empty
- [ ] `ELEVENLABS_VOICE_ID` is set (or using default: 21m00Tcm4TlvDq8ikWAM)
- [ ] `TWILIO_ACCOUNT_SID` is set (optional but recommended)
- [ ] `TWILIO_AUTH_TOKEN` is set (optional but recommended)
- [ ] `TWILIO_PHONE_NUMBER` is set (optional but recommended)
- [ ] `PUBLIC_APP_URL` is set to your domain

### API Keys Validation
- [ ] Google Gemini API key format: `sk-...` or similar
- [ ] ElevenLabs API key format: `sk_...` or similar
- [ ] Keys are not visible in any committed code
- [ ] Keys are not logged to console

## ✅ File Structure Verification

### Shared Utilities
- [ ] `/supabase/functions/_shared/gemini.ts` exists
- [ ] `/supabase/functions/_shared/gemini.ts` contains `generateAIResponse()` function
- [ ] `/supabase/functions/_shared/prompts.ts` exists
- [ ] `/supabase/functions/_shared/prompts.ts` contains 7+ scam type prompts

### API Functions
- [ ] `/supabase/functions/connect-call/index.ts` exists
- [ ] `/supabase/functions/connect-call/index.ts` imports gemini utilities
- [ ] `/supabase/functions/analyze-scam/index.ts` exists
- [ ] `/supabase/functions/analyze-scam/index.ts` uses Gemini for analysis
- [ ] `/supabase/functions/generate-report/index.ts` exists
- [ ] `/supabase/functions/generate-report/index.ts` generates forensic reports

### API Routes
- [ ] `/app/api/ai-response/route.ts` exists
- [ ] `/app/api/ai-response/route.ts` supports multiple scam types
- [ ] `/app/api/ai-response/route.ts` integrates with ElevenLabs
- [ ] `/app/api/ai-response/route.ts` supports Twilio (if configured)

### Documentation
- [ ] `ML_INTEGRATION_GUIDE.md` exists and is comprehensive
- [ ] `ENV_SETUP.md` exists with configuration instructions
- [ ] `QUICK_REFERENCE.md` exists with examples
- [ ] `IMPLEMENTATION_SUMMARY.md` exists with overview

## ✅ Dependency Verification

### Installed Packages
- [ ] `@google/generative-ai` version ^0.24.1 installed
- [ ] `@supabase/supabase-js` installed
- [ ] `twilio` version ^5.12.2 installed
- [ ] All packages up to date: `npm update`

Run:
```bash
npm list @google/generative-ai @supabase/supabase-js twilio
```

## ✅ Code Quality Verification

### TypeScript Checks
- [ ] No TypeScript errors: `npm run build`
- [ ] No unused imports in modified files
- [ ] Type safety enforced throughout

### Linting
- [ ] No ESLint errors: `npm run lint`
- [ ] Code formatting consistent
- [ ] No console errors on startup

Run:
```bash
npm run build
npm run lint
```

## ✅ API Endpoint Tests

### Test /api/ai-response
- [ ] Endpoint responds to POST requests
- [ ] Returns JSON with required fields
- [ ] Generates AI responses for different scam types
- [ ] Generates valid audio URLs
- [ ] Handles errors gracefully

Test:
```bash
curl -X POST http://localhost:3000/api/ai-response \
  -H "Content-Type: application/json" \
  -d '{"lastMessage": "Test", "scamType": "officer_vikram"}'
```

### Test Different Scam Types
- [ ] `officer_vikram` generates responses
- [ ] `tech_support` generates responses
- [ ] `bank_impersonation` generates responses
- [ ] `romance_scam` generates responses
- [ ] `general` generates default responses

### Test Error Handling
- [ ] Missing `lastMessage` returns 400 error
- [ ] Invalid API keys show proper error
- [ ] Network errors handled gracefully
- [ ] Timeout errors handled properly

## ✅ ML Model Integration Tests

### Google Gemini API
- [ ] API key is valid and active
- [ ] Model `gemini-1.5-flash` is accessible
- [ ] Responses are generated correctly
- [ ] Temperature and token settings work

Test:
```bash
node test-ml-integration.js
```

### ElevenLabs TTS
- [ ] API key is valid and active
- [ ] Text-to-speech conversion works
- [ ] Audio format is correct (ulaw_8000 for Twilio)
- [ ] Voice settings are applied correctly

### Twilio Integration (Optional)
- [ ] Account SID and Auth Token are valid
- [ ] Phone number is verified
- [ ] Calls can be made successfully
- [ ] TwiML generation works

## ✅ Performance Verification

### Response Times
- [ ] Gemini response: < 1 second
- [ ] TTS generation: < 2 seconds
- [ ] Total request: < 3.5 seconds

Test:
```bash
time curl -X POST http://localhost:3000/api/ai-response \
  -H "Content-Type: application/json" \
  -d '{"lastMessage": "Test", "scamType": "general"}'
```

### Audio Quality
- [ ] Audio is audible and clear
- [ ] Speech is natural sounding
- [ ] Voice matches expected personality
- [ ] No audio artifacts or glitches

## ✅ Security Verification

### API Key Security
- [ ] API keys not visible in code
- [ ] API keys not in Git history
- [ ] Environment variables used exclusively
- [ ] `.env.local` included in `.gitignore`

Check:
```bash
grep -r "sk-" . --include="*.ts" --include="*.tsx" --include="*.js"
grep -r "GEMINI_API_KEY" . --include="*.ts" --include="*.tsx" --include="*.js" | grep -v ".env"
```

### CORS Configuration
- [ ] CORS headers set correctly
- [ ] Cross-origin requests allowed
- [ ] Credentials handled securely

### Rate Limiting
- [ ] Rate limiting implemented (if needed)
- [ ] API quotas monitored
- [ ] Usage alerts configured

## ✅ Logging & Monitoring

### Console Logging
- [ ] Helpful debug messages present
- [ ] No sensitive data logged
- [ ] Error messages are informative
- [ ] Log levels appropriate

### Error Tracking
- [ ] Error notifications configured
- [ ] Failed requests tracked
- [ ] API failures monitored
- [ ] Quota warnings enabled

## ✅ Documentation Verification

### README/Getting Started
- [ ] Clear setup instructions
- [ ] API endpoint documented
- [ ] Example requests included
- [ ] Troubleshooting guide provided

### Code Comments
- [ ] Complex logic explained
- [ ] Function purposes documented
- [ ] Parameters documented
- [ ] Return values explained

### API Documentation
- [ ] Request/response formats documented
- [ ] Error codes documented
- [ ] Scam types listed
- [ ] Examples provided

## ✅ Deployment Readiness

### Pre-production
- [ ] All tests passing
- [ ] No errors in console
- [ ] Performance acceptable
- [ ] Security verified

### Environment Setup
- [ ] Production API keys configured
- [ ] Production URLs set
- [ ] Logging enabled
- [ ] Monitoring enabled

### Final Checks
- [ ] Build succeeds: `npm run build`
- [ ] No warnings or errors
- [ ] Deploy configuration ready
- [ ] Rollback plan in place

## 🧪 Test Suite Results

Run comprehensive tests:

```bash
# Run the test suite
node test-ml-integration.js
```

Expected output:
```
✓ Passed: 10
✗ Failed: 0
  Total:  10

🎉 All tests passed! ML integration is working correctly.
```

## 🔧 Quick Troubleshooting

### Issue: "GEMINI_API_KEY is not set"
**Solution:** Check `.env.local` exists and has the key

```bash
cat .env.local | grep GEMINI_API_KEY
```

### Issue: "Invalid API key"
**Solution:** Verify key in Google Cloud Console

```bash
# Don't expose key, but verify format
echo $GEMINI_API_KEY | head -c 10
```

### Issue: "ElevenLabs quota exceeded"
**Solution:** Check usage limits and upgrade if needed

Go to: https://elevenlabs.io/app/account

### Issue: "Response generation timeout"
**Solution:** May indicate API overload, retry with backoff

```bash
# Check API status
curl https://api.openai.com/v1/models  # If using OpenAI
```

### Issue: "No audio generated"
**Solution:** Check ElevenLabs account and API key

```bash
# Test ElevenLabs directly
curl https://api.elevenlabs.io/v1/user \
  -H "xi-api-key: $ELEVENLABS_API_KEY"
```

## 📋 Sign-Off Checklist

Before going to production, ensure:

- [ ] All checkboxes above completed ✓
- [ ] Test suite passes completely
- [ ] No errors in logs
- [ ] Performance meets requirements
- [ ] Security audit passed
- [ ] Team has approved
- [ ] Rollback procedure documented
- [ ] Monitoring dashboard configured
- [ ] Support team trained

## 🚀 Deployment Steps

1. **Verify all checkboxes above ✓**
2. **Run test suite:** `node test-ml-integration.js`
3. **Build application:** `npm run build`
4. **Stage secrets:** Set production environment variables
5. **Deploy:** Push to production environment
6. **Verify:** Test endpoints in production
7. **Monitor:** Watch error rates and performance
8. **Alert team:** Notify about deployment

## 📞 Support

If issues persist after verification:

1. Check `ML_INTEGRATION_GUIDE.md`
2. Review `ENV_SETUP.md` configuration
3. Check logs for detailed errors
4. Verify API key quotas and limits
5. Contact API providers (Google, ElevenLabs)

---

**Last Updated:** March 3, 2026
**Status:** Ready for Production Use ✅
