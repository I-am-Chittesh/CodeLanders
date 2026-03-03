"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AudioWaveform from "@/components/siren/AudioWaveform";
import TargetIntel from "@/components/siren/ScammerMap";
import LiveTranscript from "@/components/siren/LiveTranscript";
import StressGauge from "@/components/siren/StressGauge";
import { Zap, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";

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
  const [isCallingAlert, setIsCallingAlert] = useState(false);
  const [alertStatus, setAlertStatus] = useState("");
  const [isSimulatingVoice, setIsSimulatingVoice] = useState(false);
  const [aiResponse, setAiResponse] = useState<string>("");
  const [locationCoords, setLocationCoords] = useState({ lat: 19.076, lng: 72.8776 });
  const audioRef = useRef<HTMLAudioElement>(null);

  // Initialize location with random offset on client only
  useEffect(() => {
    setLocationCoords({
      lat: 19.076 + (Math.random() - 0.5) * 0.2,
      lng: 72.8776 + (Math.random() - 0.5) * 0.2,
    });
  }, []);

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

  // Function to trigger Twilio alert call
  const triggerAlertCall = async () => {
    try {
      setIsCallingAlert(true);
      setAlertStatus("Initiating alert call...");

      const response = await fetch("/api/call-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber,
          caseData: {
            riskScore,
            stressLevel,
            messagesCount: messages.length,
          },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setAlertStatus(`Alert call initiated - Call SID: ${data.callSid}`);
        console.log("Alert call success:", data);
      } else {
        setAlertStatus(`⚠️ ${data.message || data.error}`);
        console.warn("Alert call warning:", data);
      }
    } catch (error) {
      console.error("Failed to initiate alert call:", error);
      setAlertStatus("Alert call queued - offline mode");
    } finally {
      setIsCallingAlert(false);
    }
  };

  // Simulate AI voice response
  const simulateAiVoice = async () => {
    try {
      setIsSimulatingVoice(true);
      
      // Get the last scammer message
      const lastScammerMessage = [...messages]
        .reverse()
        .find(m => m.sender === "TARGET")?.text;

      if (!lastScammerMessage) {
        setAiResponse("No scammer message to respond to");
        return;
      }

      console.log("🎤 Generating AI voice response...");

      const response = await fetch("/api/ai-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lastMessage: lastScammerMessage,
          context: {
            targetPhone: phoneNumber,
            riskScore,
            stressLevel,
          },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setAiResponse(data.aiResponse);
        
        // Play the audio if available
        if (data.audioUrl && audioRef.current) {
          audioRef.current.src = data.audioUrl;
          audioRef.current.play().catch(err => console.error("Playback error:", err));
        }

        console.log("✅ AI response generated:", data.aiResponse);
        if (data.callSid) {
          console.log("✅ Twilio call initiated:", data.callSid);
        }
      } else {
        setAiResponse("Failed to generate AI response");
      }
    } catch (error) {
      console.error("Failed to simulate AI voice:", error);
      setAiResponse("Error generating response");
    } finally {
      setIsSimulatingVoice(false);
    }
  };

  // AUTO-REDIRECT TO VAULT WHEN CALL ENDS
  useEffect(() => {
    if (!isCallActive && !callEndedRef.current) {
      callEndedRef.current = true;
      
      // Trigger alert call first
      triggerAlertCall();
      
      const timer = setTimeout(() => {
        router.push(`/vault?phone=${encodeURIComponent(phoneNumber)}`);
      }, 5000); // 5 second delay before redirect

      return () => clearTimeout(timer);
    }
  }, [isCallActive, router, phoneNumber, riskScore, stressLevel, messages.length]);

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
    <main className="h-screen w-screen bg-gradient-to-br from-slate-950 via-red-950 to-slate-950 relative overflow-hidden flex flex-col">
      {/* ANIMATED BACKGROUND - PREMIUM */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"
          animate={{ x: [0, 50, -30], y: [0, 30, -50] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-10 right-20 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl"
          animate={{ x: [0, -40, 30], y: [0, -30, 50] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 left-1/3 w-72 h-72 bg-yellow-500/5 rounded-full blur-3xl"
          animate={{ x: [50, -50, 30], y: [-30, 50, -50] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* CONTENT WRAPPER */}
      <div className="relative z-10 w-screen flex-1 overflow-y-auto py-6 sm:py-8">
        
        {/* HEADER */}
        <motion.div
          className="mb-10 max-w-7xl mx-auto px-4 sm:px-6"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div>
              <motion.h1 
                className="text-5xl sm:text-6xl font-black tracking-tighter mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                <span className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
                  OPERATION: STING
                </span>
              </motion.h1>
              <motion.p 
                className="text-red-300/80 text-base uppercase tracking-widest font-semibold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Live Call Analysis & Enforcement Dispatch
              </motion.p>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              {isCallActive && (
                <motion.div
                  className="px-4 py-2 backdrop-blur-sm bg-gradient-to-r from-red-900/30 to-transparent border border-red-500/40 rounded-lg flex items-center gap-2"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <motion.div
                    className="w-2 h-2 bg-red-500 rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                  />
                  <span className="text-xs font-semibold text-red-400 uppercase tracking-widest">CALL ACTIVE</span>
                </motion.div>
              )}
              <div className="text-xs text-cyan-300/60 font-mono px-3 py-2 backdrop-blur-sm bg-cyan-900/10 border border-cyan-500/20 rounded-lg" suppressHydrationWarning>
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </motion.div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          
          {/* LEFT PANEL: TARGET INTEL */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="backdrop-blur-xl bg-gradient-to-br from-slate-800/40 via-slate-700/40 to-slate-900/30 border border-slate-600/30 rounded-2xl p-6 h-full">
              <TargetIntel
                phoneNumber={phoneNumber}
                riskScore={Math.round(riskScore)}
                location={{
                  city: "Mumbai",
                  country: "India",
                  lat: locationCoords.lat,
                  lng: locationCoords.lng,
                }}
              />
            </div>
          </motion.div>

          {/* CENTER PANEL: AUDIO WAVEFORM & STRESS */}
          <motion.div
            className="lg:col-span-6 space-y-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* AUDIO WAVEFORM */}
            <div className="backdrop-blur-xl bg-gradient-to-br from-slate-800/40 via-slate-700/40 to-slate-900/30 border border-slate-600/30 rounded-2xl p-6">
              <AudioWaveform isActive={isCallActive} intensity={audioIntensity} />
            </div>

            {/* AI VOICE SIMULATION BUTTON */}
            <motion.div
              className="backdrop-blur-xl bg-gradient-to-br from-slate-800/40 via-slate-700/40 to-slate-900/30 border border-slate-600/30 rounded-2xl p-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex flex-col items-center gap-4">
                <p className="text-xs uppercase tracking-widest text-slate-300/60 font-semibold">ML Response Generation</p>
                <motion.button
                  onClick={simulateAiVoice}
                  disabled={isSimulatingVoice || !isCallActive}
                  className="px-8 py-3 font-bold uppercase tracking-widest rounded-xl bg-gradient-to-r from-slate-700 to-slate-600 border border-slate-600/50 text-white hover:shadow-lg hover:shadow-slate-900/30 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: !isSimulatingVoice ? 1.05 : 1 }}
                  whileTap={{ scale: !isSimulatingVoice ? 0.95 : 1 }}
                >
                  {isSimulatingVoice ? (
                    <span className="flex items-center gap-2">
                      <motion.div
                        className="w-2 h-2 bg-white rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity }}
                      />
                      GENERATING...
                    </span>
                  ) : (
                    "🤖 RESPOND USING ML"
                  )}
                </motion.button>

                {/* AI Response Display */}
                {aiResponse && (
                  <motion.div
                    className="w-full mt-2 p-3 backdrop-blur-sm bg-slate-700/20 border border-slate-600/30 rounded-lg"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <p className="text-xs text-slate-300/60 uppercase tracking-widest font-semibold mb-1">AI RESPONSE:</p>
                    <p className="text-sm text-slate-200 leading-relaxed">{aiResponse}</p>
                  </motion.div>
                )}

                {/* Hidden Audio Player */}
                <audio ref={audioRef} className="hidden" />
              </div>
            </motion.div>

            {/* STRESS GAUGE */}
            <div className="backdrop-blur-xl bg-gradient-to-br from-slate-800/40 via-slate-700/40 to-slate-900/30 border border-slate-600/30 rounded-2xl p-6">
              <StressGauge level={Math.round(stressLevel)} />
            </div>
          </motion.div>

          {/* RIGHT PANEL: LIVE TRANSCRIPT */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="backdrop-blur-xl bg-gradient-to-br from-slate-800/40 via-slate-700/40 to-slate-900/30 border border-slate-600/30 rounded-2xl p-6 h-full">
              <LiveTranscript messages={messages} />
            </div>
          </motion.div>
        </div>

        {/* CONTROL BAR */}
        <motion.div
          className="backdrop-blur-xl bg-gradient-to-br from-slate-800/40 via-slate-700/40 to-slate-900/30 border border-slate-600/30 rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
            {/* STATUS INFO */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-slate-300">
                <Zap className="w-4 h-4" />
                <span className="font-semibold">System Load: {Math.round(audioIntensity)}%</span>
              </div>
              <div className="w-full h-2 bg-slate-700/30 rounded-full overflow-hidden border border-slate-600/30">
                <motion.div
                  className="h-full bg-gradient-to-r from-slate-400 to-slate-300"
                  animate={{ width: `${audioIntensity}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* THREAT LEVEL */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-400" />
                <span className="font-semibold text-slate-300">Threat Level</span>
              </div>
              <div className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest text-center ${
                riskScore > 70 
                  ? "bg-red-900/30 border border-red-500/40 text-red-400" 
                  : "bg-slate-700/30 border border-slate-600/40 text-slate-300"
              }`}>
                {riskScore > 70 ? "CRITICAL" : "ELEVATED"}
              </div>
            </div>

            {/* SESSION INFO */}
            <div className="text-sm">
              <p className="text-slate-300/60 text-xs uppercase tracking-widest mb-1">Session Exchanges</p>
              <p className="text-2xl font-bold text-slate-200">{Math.round(messages.length / 2)}</p>
            </div>

            {/* ACTION BUTTON */}
            <motion.button
              onClick={() => {
                setIsCallActive(!isCallActive);
                if (isCallActive) {
                  callEndedRef.current = true;
                  triggerAlertCall();
                  setTimeout(() => {
                    router.push(`/vault?phone=${encodeURIComponent(phoneNumber)}`);
                  }, 3000);
                }
              }}
              disabled={isCallingAlert}
              className={`py-3 px-6 font-bold uppercase tracking-widest rounded-xl transition-all text-sm ${
                isCallActive
                  ? "bg-gradient-to-r from-red-600 to-red-500 border border-red-400/50 text-white hover:shadow-lg hover:shadow-red-500/30 disabled:opacity-50"
                  : "bg-gradient-to-r from-slate-700 to-slate-600 border border-slate-600/50 text-white hover:shadow-lg hover:shadow-slate-900/30 disabled:opacity-50"
              }`}
              whileHover={{ scale: !isCallingAlert ? 1.02 : 1 }}
              whileTap={{ scale: !isCallingAlert ? 0.98 : 1 }}
            >
              {isCallingAlert ? "CALLING ALERT..." : isCallActive ? "END CALL" : "NEW CALL"}
            </motion.button>
          </div>

          {/* ALERT STATUS MESSAGE */}
          {alertStatus && (
            <motion.div
              className="mt-4 p-3 backdrop-blur-sm bg-slate-700/20 border border-slate-600/30 rounded-lg text-slate-300 text-xs text-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              ✓ {alertStatus}
            </motion.div>
          )}
        </motion.div>

        {/* PAGE NAVIGATION */}
        <motion.div
          className="backdrop-blur-xl bg-gradient-to-br from-slate-800/40 via-slate-700/40 to-slate-900/30 border border-slate-600/30 rounded-2xl p-4 sm:p-5 mb-6 w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400/60 font-mono">PAGE 2 / 3 - STING</div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <motion.button
                onClick={() => router.push("/lure")}
                className="flex items-center justify-center gap-2 px-6 py-3 font-bold uppercase tracking-widest rounded-xl bg-gradient-to-r from-slate-700 to-slate-600 border border-slate-600/50 text-white hover:shadow-lg hover:shadow-slate-900/30 transition-all text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft className="w-4 h-4" />
                GO TO LURE
              </motion.button>
              <motion.button
                onClick={() => router.push(`/vault?phone=${encodeURIComponent(phoneNumber)}`)}
                className="flex items-center justify-center gap-2 px-6 py-3 font-bold uppercase tracking-widest rounded-xl bg-gradient-to-r from-slate-700 to-slate-600 border border-slate-600/50 text-white hover:shadow-lg hover:shadow-slate-900/30 transition-all text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                GO TO VAULT
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}