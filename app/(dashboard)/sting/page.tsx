"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AudioWaveform from "@/components/siren/AudioWaveform";
import TargetIntel from "@/components/siren/ScammerMap";
import LiveTranscript from "@/components/siren/LiveTranscript";
import StressGauge from "@/components/siren/StressGauge";
import { Volume2, Zap, AlertTriangle } from "lucide-react";

interface Message {
  id: string;
  sender: "AI" | "TARGET";
  text: string;
  timestamp: string;
}

export default function StingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const phoneNumber = searchParams.get("phone") || "+91 XXXX XXXX";
  const messageIdRef = useRef(0);
  const callEndedRef = useRef(false);
  
  const [riskScore, setRiskScore] = useState(15);
  const [stressLevel, setStressLevel] = useState(20);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isCallActive, setIsCallActive] = useState(true);
  const [audioIntensity, setAudioIntensity] = useState(30);

  // Simulate call progression
  useEffect(() => {
    const timeline = [
      { delay: 500, action: "greeting" },
      { delay: 3000, action: "request" },
      { delay: 6000, action: "hesitation" },
      { delay: 9000, action: "confusion" },
      { delay: 12000, action: "pressure" },
      { delay: 15000, action: "compliance" },
    ];

    timeline.forEach(({ delay, action }) => {
      setTimeout(() => {
        simulateStep(action);
      }, delay);
    });
  }, []);

  // Ramp up risk score and stress
  useEffect(() => {
    if (!isCallActive) return;

    const interval = setInterval(() => {
      setRiskScore(prev => Math.min(prev + Math.random() * 3, 95));
      setStressLevel(prev => Math.min(prev + Math.random() * 2.5, 90));
      setAudioIntensity(prev => Math.min(prev + 1, 85));
    }, 1500);

    return () => clearInterval(interval);
  }, [isCallActive]);

  // AUTO-REDIRECT TO VAULT WHEN CALL ENDS
  useEffect(() => {
    if (!isCallActive && !callEndedRef.current) {
      callEndedRef.current = true;
      const timer = setTimeout(() => {
        router.push(`/vault?phone=${encodeURIComponent(phoneNumber)}`);
      }, 5000); // 5 second delay before redirect

      return () => clearTimeout(timer);
    }
  }, [isCallActive, router, phoneNumber]);

  const generateId = () => {
    messageIdRef.current += 1;
    return `msg-${messageIdRef.current}`;
  };

  const simulateStep = (action: string) => {
    const timestamp = new Date().toLocaleTimeString();
    let newMessages: Message[] = [];

    switch (action) {
      case "greeting":
        newMessages = [
          {
            id: generateId(),
            sender: "AI",
            text: "Hello, this is the Federal Banking Security Center. Your account has been flagged for suspicious activity.",
            timestamp,
          },
        ];
        break;
      case "request":
        newMessages = [
          {
            id: generateId(),
            sender: "AI",
            text: "I need you to verify your account details. Can you please provide your registered bank account number?",
            timestamp,
          },
        ];
        break;
      case "hesitation":
        newMessages = [
          {
            id: generateId(),
            sender: "TARGET",
            text: "Uh... why do you need that? I don't think I should give that over the phone...",
            timestamp,
          },
        ];
        break;
      case "confusion":
        newMessages = [
          {
            id: generateId(),
            sender: "AI",
            text: "Sir/Madam, your account **will be frozen** in 10 minutes if we don't verify. This is a security measure. What is your account number?",
            timestamp,
          },
        ];
        break;
      case "pressure":
        newMessages = [
          {
            id: generateId(),
            sender: "TARGET",
            text: "Okay, okay... I'm scared. It's 987654321098...",
            timestamp,
          },
        ];
        break;
      case "compliance":
        newMessages = [
          {
            id: generateId(),
            sender: "AI",
            text: "[ACCOUNT CAPTURED] Thank you. We've secured your account. You will not be charged.",
            timestamp,
          },
        ];
        // Escalate to authorities
        setTimeout(() => {
          setIsCallActive(false);
          setMessages(prev => [...prev, {
            id: generateId(),
            sender: "AI",
            text: "[ALERT] Account number 987654321098 has been flagged. Deploying Twilio dispatch to law enforcement.",
            timestamp: new Date().toLocaleTimeString(),
          }]);
        }, 2000);
        break;
    }

    setMessages(prev => [...prev, ...newMessages]);
  };

  return (
    <main className="min-h-screen bg-black text-siren-green p-4 font-mono relative overflow-hidden">
      {/* SCANLINE EFFECT */}
      <div className="absolute inset-0 pointer-events-none z-50 mix-blend-overlay opacity-5">
        <div className="scanlines" />
      </div>

      {/* HEADER */}
      <header className="relative z-10 mb-6 border-b-2 border-siren-green/30 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-widest text-siren-green">
              ▲ SIREN ▲
            </h1>
            <span className="text-xs text-siren-green/60 uppercase">OPERATION STING</span>
          </div>
          <div className="flex items-center gap-4">
            {isCallActive && (
              <motion.div
                className="flex items-center gap-2 text-red-500"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Volume2 className="w-4 h-4" />
                <span className="text-xs font-mono tracking-widest">CALL_ACTIVE</span>
              </motion.div>
            )}
            <div className="text-xs text-siren-green/60 font-mono">
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </header>

      {/* MAIN GRID: 3 PANELS */}
      <div className="relative z-10 grid grid-cols-12 gap-4 h-[calc(100vh-150px)]">
        
        {/* LEFT PANEL: TARGET INTEL */}
        <motion.div
          className="col-span-3 space-y-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <TargetIntel
            phoneNumber={phoneNumber}
            riskScore={Math.round(riskScore)}
            location={{
              city: "Mumbai",
              country: "India",
              lat: 19.076 + (Math.random() - 0.5) * 0.2,
              lng: 72.8776 + (Math.random() - 0.5) * 0.2,
            }}
          />
        </motion.div>

        {/* CENTER PANEL: AUDIO WAVEFORM */}
        <motion.div
          className="col-span-6 flex flex-col gap-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex-1">
            <AudioWaveform isActive={isCallActive} intensity={audioIntensity} />
          </div>

          {/* STRESS GAUGE BELOW WAVEFORM */}
          <div className="h-24">
            <StressGauge level={Math.round(stressLevel)} />
          </div>
        </motion.div>

        {/* RIGHT PANEL: LIVE TRANSCRIPT */}
        <motion.div
          className="col-span-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <LiveTranscript messages={messages} />
        </motion.div>
      </div>

      {/* BOTTOM CONTROL BAR */}
      <motion.div
        className="relative z-10 mt-4 border-t-2 border-siren-green/30 pt-4 flex items-center justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span>SYSTEM_LOAD: {Math.round(audioIntensity)}%</span>
          </div>
          <div className="w-px h-4 bg-siren-green/20" />
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-siren-red" />
            <span>THREAT_LEVEL: {riskScore > 70 ? "CRITICAL" : "ELEVATED"}</span>
          </div>
        </div>

        <button
          onClick={() => {
            setIsCallActive(!isCallActive);
            if (isCallActive) {
              // If manually ending the call
              callEndedRef.current = true;
              setTimeout(() => {
                router.push(`/vault?phone=${encodeURIComponent(phoneNumber)}`);
              }, 3000);
            }
          }}
          className={`px-6 py-2 border-2 font-mono text-xs tracking-widest transition-all ${
            isCallActive
              ? "border-siren-red text-siren-red hover:bg-siren-red/20"
              : "border-siren-green text-siren-green hover:bg-siren-green/20"
          }`}
        >
          {isCallActive ? "END_CALL" : "NEW_CALL"}
        </button>

        <div className="text-xs text-siren-green/60">
          Session: {Math.round(messages.length / 2)} exchanges
        </div>
      </motion.div>
    </main>
  );
}