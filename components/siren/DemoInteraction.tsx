"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Mic, Square, Play, Copy, AlertTriangle } from "lucide-react";

interface InteractionLog {
  user_transcript: string;
  ai_reply: string;
  audio_base64: string;
  timestamp: string;
}

export default function DemoInteraction() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [logs, setLogs] = useState<InteractionLog[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioElementRef = useRef<HTMLAudioElement>(null);

  // 🎤 Initialize MediaRecorder
  const startRecording = async () => {
    try {
      setError("");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      recorder.onstop = async () => {
        await processAudio();
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

  // 📤 Send audio to backend
  const processAudio = async () => {
    try {
      setIsProcessing(true);
      setError("");

      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });

      const formData = new FormData();
      formData.append("audio", audioBlob);

      console.log(`📤 Sending ${(audioBlob.size / 1024).toFixed(2)} KB to backend...`);

      const response = await fetch("/api/presentation-demo", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Backend error");
      }

      console.log("✅ Response:", data);

      // Add to logs
      setLogs((prev) => [data, ...prev]);

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
      // Convert base64 to binary
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

  // 📋 Copy log to clipboard
  const copyLog = () => {
    const logText = logs
      .map(
        (log) =>
          `[${log.timestamp}]\nUser: ${log.user_transcript}\nAI: ${log.ai_reply}\n`
      )
      .join("\n");

    navigator.clipboard.writeText(logText);
    alert("Log copied to clipboard!");
  };

  return (
    <motion.div
      className="w-full max-w-2xl mx-auto p-6 border-2 border-siren-green rounded-lg bg-black/50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-siren-green mb-2 tracking-wider">
          🎙️ LIVE EVIDENCE RECORDER
        </h2>
        <p className="text-xs sm:text-sm text-siren-green/60">
          Speak to the system. Watch it transcribe, generate fraud response, and speak back.
        </p>
      </div>

      {/* RECORD BUTTON */}
      <div className="mb-6">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          className={`w-full py-4 px-6 border-2 font-bold text-lg uppercase tracking-widest rounded transition-all ${
            isRecording
              ? "border-siren-red bg-siren-red/20 text-siren-red hover:bg-siren-red/30 animate-pulse"
              : "border-siren-green bg-siren-green/10 text-siren-green hover:bg-siren-green/20"
          } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isProcessing ? (
            <span className="flex items-center justify-center gap-2">
              🔄 PROCESSING...
            </span>
          ) : isRecording ? (
            <span className="flex items-center justify-center gap-2">
              <Square className="w-5 h-5" /> STOP RECORDING
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Mic className="w-5 h-5" /> START RECORDING
            </span>
          )}
        </button>

        {isProcessing && (
          <motion.p
            className="text-xs sm:text-sm text-siren-green/70 mt-3 text-center font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            🎤 Recording → 📝 Transcribing → 🤖 Generating → 🔊 Speaking...
          </motion.p>
        )}
      </div>

      {/* ERROR DISPLAY */}
      {error && (
        <motion.div
          className="mb-6 p-4 border-2 border-siren-red bg-siren-red/10 rounded text-siren-red text-sm flex gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
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
          className="mb-6 p-3 border-l-2 border-siren-green bg-siren-green/5 text-siren-green text-sm font-mono flex items-center gap-2"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Play className="w-4 h-4 animate-bounce" />
          <span>🔊 Playing audio response...</span>
        </motion.div>
      )}

      {/* EVIDENCE LOG */}
      {logs.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-siren-green uppercase tracking-wider">
              📋 LIVE EVIDENCE LOG ({logs.length})
            </h3>
            <button
              onClick={copyLog}
              className="flex items-center gap-1 px-2 py-1 text-xs border border-siren-green/50 text-siren-green/70 hover:text-siren-green hover:border-siren-green rounded transition-all"
            >
              <Copy className="w-3 h-3" />
              COPY
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto space-y-3 p-4 border border-siren-green/30 rounded bg-black/30 font-mono text-xs">
            {logs.map((log, idx) => (
              <motion.div
                key={idx}
                className="space-y-1 pb-3 border-b border-siren-green/20"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="text-siren-green/60">
                  [{log.timestamp}]
                </div>

                <div className="text-siren-green">
                  <span className="text-blue-400 font-bold">USER:</span>
                  <br />
                  <span className="ml-4 italic">{log.user_transcript}</span>
                </div>

                <div className="text-siren-green">
                  <span className="text-red-400 font-bold">AI (SCAMMER):</span>
                  <br />
                  <span className="ml-4 italic">{log.ai_reply}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* EMPTY STATE */}
      {logs.length === 0 && !isRecording && !isProcessing && (
        <div className="p-4 border border-siren-green/20 rounded bg-black/20 text-center text-siren-green/50 text-sm">
          👆 Click "START RECORDING" to begin the demo
        </div>
      )}

      {/* INSTRUCTIONS */}
      <div className="mt-6 p-3 border-l-2 border-siren-green/30 bg-black/50 text-xs text-siren-green/70 space-y-1 font-mono">
        <p>✅ Speak clearly into your microphone</p>
        <p>✅ System will transcribe your audio</p>
        <p>✅ AI generates a realistic scammer response</p>
        <p>✅ Response is converted to speech and played back</p>
        <p>✅ All interactions logged to demo_evidence_log.txt</p>
      </div>
    </motion.div>
  );
}
