# CodeLanders: Technical Architecture & Implementation Guide

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Tech Stack](#tech-stack)
4. [Core Components](#core-components)
5. [API Routes & Endpoints](#api-routes--endpoints)
6. [Database Schema](#database-schema)
7. [Security & Privacy](#security--privacy)
8. [Deployment Guide](#deployment-guide)
9. [Development Workflow](#development-workflow)

---

## System Overview

**SIREN** (formerly SIREN - *Semantic Interaction & Response for Extracting Nodes* is an **AI-driven forensic engagement system** designed to automatically detect, analyze, and report scam call operations. The system uses advanced AI models to simulate vulnerable personas, engage with scammers in real-time voice conversations, extract account information used for money laundering, and generate actionable forensic reports for law enforcement.

### Problem Statement
Traditional fraud detection operates reactively:
- Banks detect fraudulent transactions after money is transferred
- Security teams identify phishing campaigns weeks later
- Law enforcement has minimal real-time intelligence on criminal networks
- Money mule networks operate undisturbed due to lack of early intervention

### Solution
CodeLanders proactively engages with scammers:
- **AI-Generated Personas**: Dynamically creates believable victim profiles tailored to specific scam types
- **Real-time Voice Interaction**: Maintains low-latency, emotionally intelligent voice conversations
- **Forensic Intelligence**: Extracts bank details, cryptocurrency wallets, and mule account information
- **Instant Reporting**: Generates timestamped forensic reports with call transcripts and audio for law enforcement

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     USER INTERFACE LAYER                     │
│  (Next.js 15 App Router + React + Tailwind CSS + Framer)   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   STING      │  │    LURE      │  │    VAULT     │        │
│  │  (Simulate   │  │ (Record &    │  │  (Store &    │        │
│  │  Live Call)  │  │  Analyze)    │  │  Retrieve)   │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    API GATEWAY LAYER                         │
│  (Next.js App Router + Node.js Runtime)                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────┐  ┌─────────────────┐                   │
│  │ /api/ai-response│  │ /api/call-alert │                   │
│  │ AI Response Gen │  │ Twilio Dispatch │                   │
│  └─────────────────┘  └─────────────────┘                   │
│                                                               │
│  ┌─────────────────┐  ┌─────────────────┐                   │
│  │ /api/speak      │  │ /api/call-status│                   │
│  │ ElevenLabs TTS  │  │ Status Tracking │                   │
│  └─────────────────┘  └─────────────────┘                   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              AI & NLP SERVICES LAYER                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────┐  ┌──────────────────────┐          │
│  │  Google Gemini 1.5   │  │  ElevenLabs Voice   │          │
│  │  - Pro (Reasoning)   │  │  - Turbo v2.5       │          │
│  │  - Flash (STT)       │  │  - Emotional TTS    │          │
│  │  - Reasoning Model   │  │  - Voice Cloning    │          │
│  └──────────────────────┘  └──────────────────────┘          │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Twilio Communications Platform                      │   │
│  │  - PSTN Call Handling (VoIP)                        │   │
│  │  - Call Status Webhooks                            │   │
│  │  - TwiML Response Engine                           │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              DATA PERSISTENCE LAYER                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────┐  ┌──────────────────────┐          │
│  │  Supabase Database   │  │  Edge Functions      │          │
│  │  (PostgreSQL)        │  │  (Deno Runtime)      │          │
│  │  - scam_calls        │  │  - analyze-scam      │          │
│  │  - call_transcripts  │  │  - connect-call      │          │
│  │  - extracted_data    │  │  - generate-report   │          │
│  │  - pgvector Search   │  │  - Vector Embedding  │          │
│  └──────────────────────┘  └──────────────────────┘          │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

### Frontend Framework
- **Next.js 15** (App Router, Server Components, Streaming)
  - Deployed on Vercel for zero-config deployments
  - Built-in TypeScript support
  - API routes co-located with frontend
- **React 19** (Latest hooks & concurrency features)
- **TypeScript** (Full type safety across the stack)

### Styling & UI
- **Tailwind CSS 3.4** (Utility-first CSS framework)
  - Custom animations and gradients
  - Responsive grid layouts
  - Dark mode theming
- **Shadcn/UI** (Accessible React component library)
- **Framer Motion 12** (Advanced animation library)
  - Smooth page transitions
  - Real-time waveform animations
  - Voice recording bar visualizations
- **Lucide React** (Icon library)

### Backend & Runtime
- **Supabase** (Backend-as-a-Service)
  - **PostgreSQL Database** with advanced extensions
  - **Supabase Auth** for user authentication
  - **Realtime** for WebSocket-based live updates
  - **Edge Functions** (Deno runtime) for serverless compute
- **Twilio** (Communications as a Service)
  - PSTN integration for voice calls
  - Programmable Voice API
  - SMS & messaging capabilities

### AI & Machine Learning
- **Google Generative AI (Gemini)**
  - **Gemini 1.5 Pro**: Advanced reasoning for persona generation, scam analysis
  - **Gemini 1.5 Flash**: Real-time speech-to-text transcription
  - **Gemini 2.0 with Extended Thinking**: Deep reasoning for forensic analysis
  - Context window: 1M+ tokens for long conversation histories
- **ElevenLabs API**
  - **Turbo v2.5**: Real-time text-to-speech conversion
  - **Voice ID**: Alice (British female) for official authority tone
  - **Emotional Intelligence**: Adjustable speed, pitch, emotion indicators
  - Latency: <500ms for production deployment

### Database Extensions
- **pgvector** (Vector similarity search)
  - Semantic script matching
  - Anomaly detection
  - Scammer fingerprinting
- **Supabase Realtime** (PostgreSQL Logical Decoding)
  - WebSocket subscriptions
  - Live dashboard updates

---

## Core Components

### 1. STING (Simulation & Threat Intelligence via Neural Gaming)
**Location**: `app/(dashboard)/sting/`

**Purpose**: Simulates real-time scam calls with AI-generated personas and live voice interaction.

**Key Features**:
- **Live Call Dashboard**: Real-time visualization of call metrics
- **Animated Recording Bar**: Green waveform visualization at top of page (40 animated bars)
- **Stress Gauge**: Real-time psychology profile of the target scammer
- **Risk Score Tracker**: Dynamic risk assessment (0-100)
- **Audio Waveform**: Live visualization of voice intensity
- **Message Transcript**: Live call transcript with speaker identification (AI vs TARGET)
- **Scammer Geolocation**: Map-based location tracking
- **AI Voice Simulation Button**: Trigger Gemini responses and ElevenLabs synthesis

**Implementation**:
```tsx
// Core state management
const [riskScore, setRiskScore] = useState(15);
const [stressLevel, setStressLevel] = useState(20);
const [audioIntensity, setAudioIntensity] = useState(30);
const [messages, setMessages] = useState<Message[]>([]);

// Voice animation bar component
<div className="h-12 bg-gradient-to-r from-green-900/30 to-green-900/20">
  {[...Array(40)].map((_, i) => (
    <motion.div
      animate={{ height: [8, Math.random() * 40 + 8, 8] }}
      transition={{ duration: 0.2, repeat: Infinity }}
    />
  ))}
</div>
```

### 2. LURE (Live Unified Recording Engine)
**Location**: `app/(dashboard)/lure/`

**Purpose**: Records, analyzes, and processes scam call audio with forensic metadata.

**Key Features**:
- **Audio Recording Capture**: Browser MediaRecorder API integration
- **Real-time Transcription**: Gemini Flash STT processing
- **Metadata Collection**: Timestamp, duration, caller ID, network info
- **Playback Controls**: Speed adjustment, volume control, segment seeking
- **Export Options**: MP3, WAV, forensic bundle formats

### 3. VAULT (Verified Account & Unified Logs)
**Location**: `app/(dashboard)/vault/`

**Purpose**: Centralized storage and retrieval of forensic case data with searchable archive.

**Key Features**:
- **Case Database**: Sortable, filterable list of recorded calls
- **Full-Text Search**: Supabase FTS (Full-Text Search)
- **Advanced Filtering**: By date, risk score, extracted account data
- **Export Forensic Reports**: PDF generation with call transcripts
- **Vector Search**: Semantic similarity to known scam patterns
- **Tabbed Interface**: Details, Transcript, Evidence tabs

---

## API Routes & Endpoints

### POST `/api/ai-response`
**Purpose**: Generate AI bank official responses using Gemini

**Request Body**:
```json
{
  "lastMessage": "Hello, is this the bank?",
  "context": {
    "targetPhone": "+91...",
    "scamType": "bank_impersonation",
    "conversationHistory": ["msg1", "msg2"]
  }
}
```

**Response**:
```json
{
  "response": "This is Security Officer from your bank...",
  "type": "bank_impersonation",
  "confidence": 0.95,
  "timestamp": "2026-03-03T10:30:00Z"
}
```

**Implementation Details**:
- Uses Gemini 1.5 Pro with system prompts for different scam types
- Response capped at 50 words for low-latency TTS conversion
- Supports 4 scam types: bank_impersonation, tech_support, crypto_scam, romance_fraud

### POST `/api/speak`
**Purpose**: Convert AI response text to realistic voice using ElevenLabs

**Request Body**:
```json
{
  "text": "This is a bank security alert...",
  "voiceId": "MF3mGyEYCl7XYWbV7PZT"
}
```

**Response**:
```json
{
  "audioUrl": "https://elevenlabs-api.com/audio/...",
  "duration": 4.5,
  "format": "mp3"
}
```

### POST `/api/call-alert`
**Purpose**: Trigger Twilio alert call to authorities

**Request Body**:
```json
{
  "phoneNumber": "+91...",
  "caseData": {
    "riskScore": 85,
    "stressLevel": 75,
    "messagesCount": 12,
    "extractedData": {
      "bankAccount": "987654321098",
      "ifscCode": "HDFC0001234"
    }
  }
}
```

**Response**:
```json
{
  "callSid": "CA1234567890abcdef",
  "status": "initiated",
  "to": "+91...",
  "from": "+16198783851"
}
```

### POST `/api/call-handler`
**Purpose**: Handle Twilio webhooks and stateful call management

**Webhook Payload** (from Twilio):
```xml
<Message>
  <CallSid>CA1234567890abcdef</CallSid>
  <CallStatus>in-progress</CallStatus>
  <RecordingUrl>https://api.twilio.com/recordings/...</RecordingUrl>
</Message>
```

**Response** (TwiML XML):
```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="woman">
    ALERT: SIREN system has detected and intercepted a scam call.
    Account number has been successfully extracted.
  </Say>
</Response>
```

### POST `/api/alert-response` & `/api/alert-followup`
**Purpose**: Handle user interactions during alert calls

**Request**:
```json
{
  "digit": "1",
  "callSid": "CA1234567890abcdef"
}
```

---

## Database Schema

### Primary Tables

#### `scam_calls`
```sql
CREATE TABLE scam_calls (
  id UUID PRIMARY KEY,
  phone_number VARCHAR(20),
  scam_type VARCHAR(50),
  risk_score NUMERIC(5,2),
  stress_level NUMERIC(5,2),
  status VARCHAR(50), -- 'active', 'completed', 'escalated'
  call_duration INTEGER,
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for fast queries
CREATE INDEX idx_scam_calls_status ON scam_calls(status);
CREATE INDEX idx_scam_calls_created_at ON scam_calls(created_at DESC);
CREATE INDEX idx_scam_calls_risk_score ON scam_calls(risk_score DESC);
```

#### `call_transcripts`
```sql
CREATE TABLE call_transcripts (
  id UUID PRIMARY KEY,
  scam_call_id UUID REFERENCES scam_calls(id),
  sender VARCHAR(50), -- 'AI' or 'TARGET'
  text TEXT,
  timestamp TIMESTAMP,
  embedding VECTOR(768), -- pgvector for semantic search
  created_at TIMESTAMP DEFAULT NOW()
);

-- Vector index for semantic search
CREATE INDEX idx_transcripts_embedding ON call_transcripts
  USING ivfflat (embedding vector_cosine_ops);
```

#### `extracted_data`
```sql
CREATE TABLE extracted_data (
  id UUID PRIMARY KEY,
  scam_call_id UUID REFERENCES scam_calls(id),
  bank_account VARCHAR(100),
  ifsc_code VARCHAR(20),
  crypto_wallet VARCHAR(255),
  phone_mule VARCHAR(20),
  upi_id VARCHAR(100),
  card_last_4 VARCHAR(4),
  confidence NUMERIC(5,2),
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `scam_patterns` (Vector Search)
```sql
CREATE TABLE scam_patterns (
  id UUID PRIMARY KEY,
  pattern_type VARCHAR(50),
  keywords TEXT[],
  embedding VECTOR(768),
  network_cluster_id VARCHAR(100),
  frequency COUNT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Security & Privacy

### Data Protection
- **End-to-End Encryption**: All sensitive data (account numbers, transcripts) encrypted at rest in Supabase using AES-256
- **Role-Based Access Control (RBAC)**: Supabase Row Level Security (RLS) policies
- **Sensitive Data Masking**: Phone numbers masked as +XX XXXX XXXX in UI logs

### API Security
- **API Key Management**: Anon keys for browser requests, service keys for backend
- **CORS Policy**: Restricted to authorized domains only
- **Rate Limiting**: Built into Supabase Edge Functions
- **Request Validation**: Zod schema validation on all POST endpoints

### Compliance
- **GDPR Compliance**: Data retention policies, automatic deletion after 90 days
- **India's Privacy Laws**: Compliance with BharatStack framework
- **Law Enforcement Data**: Forensic reports encrypted and audited
- **Call Recording Consent**: Implicit consent through scammer engagement

### Environment Variables
**NEVER commit `.env.local`** to version control:
```bash
# AI/ML Services
GEMINI_API_KEY=xxx
ELEVENLABS_API_KEY=xxx

# Database
NEXT_PUBLIC_SUPABASE_URL=xxx
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx

# Communications
TWILIO_ACCOUNT_SID=xxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_PHONE_NUMBER=xxx

# Deployment
PUBLIC_APP_URL=xxx  # Ngrok/Serveo for local webhooks
```

---

## Deployment Guide

### Local Development
```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# 3. Start Supabase locally (optional)
supabase start

# 4. Run development server
npm run dev

# 5. Set up Twilio webhook tunneling
ssh -R 80:localhost:3000 serveo.net
# Copy the URL and update PUBLIC_APP_URL in .env.local
```

### Production Deployment (Vercel)

**Step 1: Connect Repository**
```bash
# Push to GitHub (already configured)
git push origin master
```

**Step 2: Configure Vercel**
1. Go to vercel.com → Create new project
2. Import GitHub repository
3. Set environment variables in Vercel dashboard:
   - GEMINI_API_KEY
   - ELEVENLABS_API_KEY
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - TWILIO_ACCOUNT_SID
   - TWILIO_AUTH_TOKEN
   - PUBLIC_APP_URL (your Vercel domain)

**Step 3: Deploy**
```bash
# Automatic deployment on push to master
git push origin master
# Vercel builds and deploys automatically
# Check deployment status: vercel.com/dashboard
```

**Step 4: Configure Webhooks**
- Update Twilio Webhook URL: `https://[your-domain].vercel.app/api/call-handler`
- Update Webhook URL: `https://[your-domain].vercel.app/api/call-status`

### Scaling Considerations
- **Edge Functions**: Supabase Edge Functions auto-scale globally
- **Database**: PostgreSQL read replicas for analytics queries
- **CDN**: Vercel edge network caches static assets globally
- **Vector Search**: pgvector indexes optimized for 100k+ patterns

---

## Development Workflow

### Project Structure
```
CodeLanders/
├── app/                           # Next.js app directory
│   ├── (dashboard)/               # Authenticated routes
│   │   ├── sting/                 # Live call simulation
│   │   │   ├── page.tsx           # Main STING interface
│   │   │   └── content.tsx        # STING logic + state
│   │   ├── lure/                  # Audio recording
│   │   │   ├── page.tsx
│   │   │   └── content.tsx
│   │   └── vault/                 # Case archive
│   │       ├── page.tsx
│   │       └── content.tsx
│   ├── api/                       # API routes
│   │   ├── ai-response/           # Gemini response generation
│   │   ├── speak/                 # ElevenLabs TTS
│   │   ├── call-alert/            # Twilio alert dispatch
│   │   ├── call-handler/          # Twilio webhook handler
│   │   └── [other routes]/
│   ├── auth/                      # Authentication routes
│   │   └── callback/              # OAuth callback handler
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Home page
├── components/
│   ├── siren/                     # SIREN system components
│   │   ├── AudioWaveform.tsx      # Waveform visualization
│   │   ├── StressGauge.tsx        # Stress meter
│   │   ├── ScammerMap.tsx         # Geolocation map
│   │   ├── LiveTranscript.tsx     # Call transcript
│   │   └── [others]/
│   ├── ui/                        # Shadcn UI components
│   └── providers/                 # React context providers
├── lib/
│   ├── utils.ts                   # Helper utilities
│   ├── types.ts                   # TypeScript interfaces
│   └── supabase/                  # Supabase client setup
├── supabase/
│   ├── migrations/                # SQL migration files
│   └── functions/                 # Deno edge functions
├── middleware.ts                  # Next.js middleware
├── tsconfig.json                  # TypeScript config
├── tailwind.config.ts             # Tailwind config
└── package.json                   # Dependencies

```

### Common Development Tasks

**Adding a New API Endpoint**:
```typescript
// app/api/[feature]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseClient } from "@/lib/supabase/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input with Zod
    // Process with AI/ML services
    // Save to Supabase
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

**Adding a New Component**:
```typescript
// components/siren/[New].tsx
"use client";

import { motion } from "framer-motion";

interface Props {
  // Define props
}

export default function NewComponent({ ...props }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Component JSX */}
    </motion.div>
  );
}
```

**Adding Database Migrations**:
```bash
# Create migration
supabase migration new add_new_table

# Edit: supabase/migrations/[timestamp]_add_new_table.sql
# Run: supabase migration up

# Deploy: changes automatically apply on next push
```

### Debugging Guide

**Check Gemini API Calls**:
```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

// Enable debug logs
console.log("Request payload:", { ...params });
const response = await model.generateContent(params);
console.log("Response:", response);
```

**Check Twilio Webhook Receipts**:
```bash
# Visit: twilio.com/console/phone-numbers/[YOUR_NUMBER]
# Check "Webhook URLs" section
# Test endpoint: curl -X POST https://your-domain/api/call-handler -d "test"
```

**Database Connection Issues**:
```typescript
// Test Supabase connection
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const { data, error } = await supabase.from("scam_calls").select("*").limit(1);
console.log(error || data);
```

---

## Performance Metrics

### Target KPIs
- **Page Load Time**: <2 seconds (First Contentful Paint)
- **API Response Time**: <500ms (99th percentile)
- **Voice Latency**: <300ms (AI response → ElevenLabs → Twilio)
- **Voice Recognition Accuracy**: >95% (Gemini Flash STT)
- **Concurrent Calls**: 100+ simultaneous sessions
- **Database Query Time**: <50ms for filtered searches

### Monitoring
- **Vercel Analytics**: Built-in performance monitoring
- **Supabase Metrics**: Query performance, function execution time
- **Twilio Insights**: Call quality metrics, latency tracking
- **Custom Logging**: Structured JSON logs sent to monitoring service

---

## Future Enhancements

1. **Multi-Language Support**: Extend Gemini to generate responses in 10+ languages
2. **Advanced Biometrics**: Voice fingerprinting for scammer network mapping
3. **Real-time Collaboration**: Multiple operators working on same case
4. **Predictive Intelligence**: ML model predicting scammer behavior patterns
5. **Mobile Application**: React Native app for law enforcement in the field
6. **Blockchain Integration**: Immutable forensic evidence storage

---

## Contributing Guidelines

1. Create feature branch: `git checkout -b feature/[name]`
2. Make changes following TypeScript/React best practices
3. Test locally: `npm run dev` + `npm run build`
4. Run linter: `npm run lint`
5. Commit with descriptive messages
6. Open PR with description of changes
7. Deploy to staging via Vercel preview environment

---

## License & Legal

This project is developed for law enforcement and authorized cybersecurity agencies only. Unauthorized use of this system to harass, record, or intercept calls is illegal and violates wiretapping laws (US ECPA, India ITA 2000, etc.).

**Legal Notice**: All scammer engagements are recorded and reported to relevant authorities. Users must comply with local regulations regarding call recording, consent, and law enforcement coordination.

---

**Last Updated**: March 3, 2026
**Version**: 1.0.0
**Maintained By**: CodeLanders Development Team
