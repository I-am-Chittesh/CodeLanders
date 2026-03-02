"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Mic, Square, Play, Copy, AlertTriangle, RotateCcw } from "lucide-react";

interface ConversationEntry {
  scammer_speech: string;
  bank_speech: string;
  audio_base64: string;
  timestamp: string;
}

export default function LureRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [conversation, setConversation] = useState<ConversationEntry[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lastRequestTime, setLastRequestTime] = useState(0);
  const [cooldownCounter, setCooldownCounter] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioElementRef = useRef<HTMLAudioElement>(null);
  const cooldownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 🎤 Start recording
  const startRecording = async () => {
    try {
      setError("");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      audioChunksRef.current = [];
      console.log("🎤 Recording started...");

      recorder.ondataavailable = (event) => {
        console.log(`📦 Audio chunk received: ${event.data.size} bytes`);
        audioChunksRef.current.push(event.data);
      };

      recorder.onstop = async () => {
        console.log(`🛑 Recording stopped. Total chunks: ${audioChunksRef.current.length}`);
        await processScammerCall();
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (err: any) {
      setError(`Microphone access denied: ${err.message}`);
      console.error("Recording error:", err);
    }
  };

  // ⏹️ Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // 📤 Send to backend
  const processScammerCall = async () => {
    try {
      setIsProcessing(true);
      setError("");

      // ⏱️ RATE LIMITING: Free tier quota protection
      const RATE_LIMIT_SECONDS = 30;
      const timeSinceLastRequest = Date.now() - lastRequestTime;
      const secondsRemaining = Math.ceil((RATE_LIMIT_SECONDS * 1000 - timeSinceLastRequest) / 1000);

      if (lastRequestTime !== 0 && timeSinceLastRequest < RATE_LIMIT_SECONDS * 1000) {
        setError(`⏳ Rate limited. Please wait ${secondsRemaining}s before next request (Free tier protection)`);
        setIsProcessing(false);
        startCooldown(secondsRemaining);
        return;
      }

      if (audioChunksRef.current.length === 0) {
        setError("No audio recorded. Please try again.");
        setIsProcessing(false);
        return;
      }

      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });

      if (audioBlob.size === 0) {
        setError("Audio blob is empty. Please try again.");
        setIsProcessing(false);
        return;
      }

      const formData = new FormData();
      formData.append("audio", audioBlob);

      console.log(`📤 Sending scammer audio (${audioBlob.size} bytes)...`);

      const response = await fetch("/api/scammer-call", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      console.log("Response status:", response.status);
      console.log("Response data:", data);

      if (!response.ok) {
        const errorMsg = data.message || data.error || "Backend error";
        throw new Error(errorMsg);
      }

      console.log("✅ Response:", data);

      // ✅ Record successful request time
      setLastRequestTime(Date.now());

      // Add to conversation
      setConversation((prev) => [data, ...prev]);

      // Auto-play audio
      if (data.audio_base64) {
        playAudio(data.audio_base64);
      }
    } catch (err: any) {
      setError(`Error: ${err.message}`);
      console.error("Processing error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  // 🔊 Convert base64 to audio and play
  const playAudio = (base64Audio: string) => {
    try {
      const binaryString = atob(base64Audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([bytes], { type: "audio/mpeg" });
      const url = URL.createObjectURL(blob);

      if (audioElementRef.current) {
        audioElementRef.current.src = url;
        audioElementRef.current.play();
        setIsPlaying(true);

        audioElementRef.current.onended = () => {
          setIsPlaying(false);
          URL.revokeObjectURL(url);
        };
      }
    } catch (err) {
      console.error("Playback error:", err);
    }
  };

  // ⏱️ Start cooldown timer for rate limiting
  const startCooldown = (seconds: number) => {
    setCooldownCounter(seconds);

    if (cooldownIntervalRef.current) {
      clearInterval(cooldownIntervalRef.current);
    }

    cooldownIntervalRef.current = setInterval(() => {
      setCooldownCounter((prev) => {
        if (prev <= 1) {
          if (cooldownIntervalRef.current) {
            clearInterval(cooldownIntervalRef.current);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (cooldownIntervalRef.current) {
        clearInterval(cooldownIntervalRef.current);
      }
    };
  }, []);

  // 📋 Copy conversation to clipboard
  const copyConversation = () => {
    const convText = conversation
      .map(
        (entry) =>
          `[${entry.timestamp}]\nSCAMMER: ${entry.scammer_speech}\nBANK: ${entry.bank_speech}\n`
      )
      .join("\n");

    navigator.clipboard.writeText(convText);
    alert("Conversation copied to clipboard!");
  };

  // 🔄 Clear conversation
  const clearConversation = () => {
    if (confirm("Clear all conversation entries?")) {
      setConversation([]);
    }
  };

  return (
    <motion.div
      className="w-full max-h-screen overflow-y-auto backdrop-blur-xl bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-500/40 rounded-2xl p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* HEADER */}
      <div className="mb-8">
        <motion.div
          className="flex items-center gap-3 mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-2xl">🎭</div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            SCAMMER SIMULATOR
          </h2>
        </motion.div>
        <p className="text-sm text-cyan-300/60">
          Speak as a scammer. AI responds as bank official. Full conversation logged.
        </p>
      </div>

      {/* RECORD BUTTON */}
      <div className="mb-8">
        <motion.button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          className={`w-full py-4 px-6 font-bold text-lg uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-3 ${
            isRecording
              ? "bg-gradient-to-r from-red-600 to-orange-600 border border-red-400/50 text-white shadow-lg shadow-red-500/30"
              : "bg-gradient-to-r from-cyan-600 to-blue-600 border border-cyan-400/50 text-white hover:shadow-lg hover:shadow-cyan-500/30"
          } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
          whileHover={!isProcessing ? { scale: 1.02 } : {}}
          whileTap={!isProcessing ? { scale: 0.98 } : {}}
        >
          {isProcessing ? (
            <>
              <motion.div
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              PROCESSING...
            </>
          ) : isRecording ? (
            <>
              <motion.div
                className="w-4 h-4 bg-red-300 rounded-sm"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 0.6, repeat: Infinity }}
              />
              STOP RECORDING
            </>
          ) : (
            <>
              <Mic className="w-5 h-5" />
              START RECORDING
            </>
          )}
        </motion.button>

        {isProcessing && (
          <motion.div
            className="mt-4 space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-center justify-between text-xs text-cyan-300/60 mb-2">
              <span className="font-mono">🎤 Recording → 📝 Transcribing → 🏦 Generating → 🔊 Speaking</span>
            </div>
            <div className="w-full h-1 bg-cyan-900/30 rounded-full overflow-hidden border border-cyan-500/30">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-400"
                animate={{ width: ["0%", "100%"] }}
                transition={{ duration: 3, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        )}

        {cooldownCounter > 0 && (
          <motion.div
            className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 text-sm text-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            ⏳ Rate limited: Wait {cooldownCounter}s
          </motion.div>
        )}
      </div>

      {/* ERROR DISPLAY */}
      {error && (
        <motion.div
          className="mb-6 p-4 bg-red-900/20 border border-red-500/40 rounded-lg text-red-400 text-sm flex gap-3"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>{error}</p>
        </motion.div>
      )}

      {/* AUDIO ELEMENT (hidden) */}
      <audio ref={audioElementRef} className="hidden" />

      {/* PLAYBACK STATUS */}
      {isPlaying && (
        <motion.div
          className="mb-6 p-3 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-500/40 rounded-lg text-cyan-300 text-sm flex items-center gap-3"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6, repeat: Infinity }}
          >
            🔊
          </motion.div>
          <span>Bank official responding...</span>
        </motion.div>
      )}

      {/* CONVERSATION LOG */}
      {conversation.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wider">
              📋 CONVERSATION LOG ({conversation.length})
            </h3>
            <div className="flex gap-2">
              <motion.button
                onClick={copyConversation}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-cyan-900/30 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/50 hover:border-cyan-400/60 rounded-lg transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Copy className="w-3 h-3" />
                COPY
              </motion.button>
              <motion.button
                onClick={clearConversation}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-red-900/30 border border-red-500/40 text-red-300 hover:bg-red-900/50 hover:border-red-400/60 rounded-lg transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RotateCcw className="w-3 h-3" />
                CLEAR
              </motion.button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto space-y-3 p-4 backdrop-blur-sm bg-black/30 border border-cyan-500/20 rounded-xl">
            {conversation.map((entry, idx) => (
              <motion.div
                key={idx}
                className="space-y-2 pb-3 border-b border-cyan-500/20 last:border-b-0"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="text-xs text-cyan-400/50 font-mono">[{entry.timestamp}]</div>

                <div className="bg-gradient-to-r from-red-900/30 to-transparent border-l-2 border-red-500 pl-3 py-2 rounded-r">
                  <p className="text-xs font-bold text-red-400 mb-1">YOU (SCAMMER)</p>
                  <p className="text-sm text-red-300/80">{entry.scammer_speech}</p>
                </div>

                <div className="bg-gradient-to-r from-cyan-900/30 to-transparent border-l-2 border-cyan-500 pl-3 py-2 rounded-r">
                  <p className="text-xs font-bold text-cyan-400 mb-1">BANK OFFICIAL</p>
                  <p className="text-sm text-cyan-300/80">{entry.bank_speech}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <p className="text-xs text-cyan-400/50 mt-3 font-mono">
            ✅ All conversations logged to: conversation_log.txt
          </p>
        </div>
      )}

      {/* EMPTY STATE */}
      {conversation.length === 0 && !isRecording && !isProcessing && (
        <motion.div
          className="p-6 border border-cyan-500/20 rounded-xl bg-cyan-900/10 text-center text-cyan-400/60 text-sm"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          👆 Click "START RECORDING" to begin
        </motion.div>
      )}

      {/* INSTRUCTIONS */}
      <div className="mt-6 p-4 border-l-2 border-cyan-500/50 bg-cyan-900/10 rounded text-xs text-cyan-300/70 space-y-2 font-mono">
        <p>✅ Speak as a scammer calling a bank</p>
        <p>✅ Real-time transcription & response generation</p>
        <p>✅ AI responds as bank official via TTS</p>
        <p>✅ Full forensic logging for analysis</p>
      </div>
    </motion.div>
  );
}
