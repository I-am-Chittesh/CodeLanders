#  SIREN: Semantic Interaction & Response for Extracting Nodes
---------------
> *Automated Active Defense System aimed at dismantling money mule networks through AI-driven forensic engagement.*

---

##  Overview

**The Problem:** Cyber and Financial systems operate in silos. Security teams detect phishing emails, while banks monitor transaction logs. This disconnection allows cyber-criminals to recruit "money mules" and launder stolen funds long before a fraud investigation even begins.

**The Solution:** SIREN is a **Forensic AI Bait Agent**. Instead of passively blocking scams, SIREN proactively engages with scammers. It uses **Google Gemini 1.5 Pro** to generate vulnerable personas and **ElevenLabs** to hold real-time, emotional voice conversations. Its goal is not to chat, but to **extract** the mule account details used for money laundering and generate actionable police reports instantly.

---

##  Key Features

* Autonomous Persona Generation
    Dynamically creates victim profiles (e.g., "Grandpa Arthur") tailored to specific scam scripts (Refund, Crypto, Tech Support) using **Gemini 1.5 Pro**.

*  Bi-Directional Voice Intelligence
    Real-time, low-latency voice interaction using **ElevenLabs Turbo v2.5** and **Supabase Edge Functions**. Includes "Barge-In" capability—if the scammer interrupts, the AI listens immediately.

*  Live Psych-Profile Dashboard
    A "War Room" interface that visualizes the scammer's stress levels and the AI's extraction progress in real-time.

*  Vector-Based Script Matching
    Uses **pgvector** to fingerprint scam scripts. If a scammer uses a known script, SIREN instantly links them to a broader criminal network.

*  Automated Forensic Reporting
    Generates a timestamped PDF containing the call transcript, audio recording, and the extracted bank account/crypto wallet for law enforcement.

---

## Tech Stack

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Frontend** | Next.js 15 (App Router) | High-performance "War Room" Dashboard |
| **Styling** | Tailwind CSS + Shadcn/UI | Professional Forensic UI Components |
| **Database** | Supabase (PostgreSQL) | Structured Data & Vector Search (`pgvector`) |
| **Backend** | Supabase Edge Functions | Serverless Logic (Deno) for low-latency voice relay |
| **AI Brain** | **Google Gemini 1.5 Pro** | Reasoning, Strategy, and Persona Management |
| **AI Ears** | **Gemini 1.5 Flash** | Real-time Speech-to-Text |
| **AI Voice** | **ElevenLabs API** | Emotional, Human-like Text-to-Speech |

---

## Getting Started

### Prerequisites
* Node.js 20+
* Supabase Account
* API Keys: Google AI Studio (Gemini), ElevenLabs

### 1. Clone the Repository
```bash
git clone [https://github.com/yourusername/siren.git](https://github.com/yourusername/siren.git)
cd siren

##anvi branch