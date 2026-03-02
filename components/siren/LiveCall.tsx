"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, Phone, PhoneOff, Activity, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils"; // Ensure you have your utils set up

export default function LiveCall() {
  const [isLive, setIsLive] = useState(false);
  const [status, setStatus] = useState("SECURE LINE: DISCONNECTED");
  const [transcript, setTranscript] = useState<string[]>([]);
  const socketRef = useRef<WebSocket | null>(null);
  const recognitionRef = useRef<any>(null);

  // 1. Initialize the WebSocket Connection (The Phone Line)
  const startCall = () => {
    setStatus("ESTABLISHING UPLINK...");
    
    // REPLACE with your actual Supabase Project Ref once you have it
    // Example: wss://xyzproject.supabase.co/functions/v1/connect-call
    const socketUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      ? `${process.env.NEXT_PUBLIC_SUPABASE_URL.replace("https", "wss")}/functions/v1/connect-call`
      : "ws://localhost:54321/functions/v1/connect-call"; // Local fallback

    const socket = new WebSocket(socketUrl);

    socket.onopen = () => {
      setStatus("SECURE CONNECTION ESTABLISHED");
      setIsLive(true);
      startListening(); // Start the mic immediately
    };

    socket.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      
      // If we receive audio, play it
      if (data.audio) {
        setStatus("INCOMING TRANSMISSION...");
        const audio = new Audio(`data:audio/mp3;base64,${data.audio}`);
        await audio.play();
        setStatus("LISTENING...");
      }

      // If we receive text (Officer Vikram's script), show it
      if (data.text) {
        setTranscript((prev) => [...prev, `OFFICER: ${data.text}`]);
      }
    };

    socket.onclose = () => {
      setStatus("CONNECTION TERMINATED");
      setIsLive(false);
      stopListening();
    };

    socketRef.current = socket;
  };

  const endCall = () => {
    if (socketRef.current) {
      socketRef.current.close();
    }
    stopListening();
    setIsLive(false);
    setStatus("SECURE LINE: DISCONNECTED");
  };

  // 2. Initialize Browser Speech Recognition (The Ears)
  const startListening = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      // @ts-ignore
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true; // Keep listening
      recognition.interimResults = false; // Only send final sentences
      recognition.lang = "en-US"; // Or 'en-IN' for Indian accent

      recognition.onresult = (event: any) => {
        const lastResult = event.results[event.results.length - 1];
        if (lastResult.isFinal) {
          const text = lastResult[0].transcript;
          setTranscript((prev) => [...prev, `TARGET: ${text}`]);
          
          // SEND TO BACKEND (Your Friend)
          if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({ text: text }));
            setStatus("SENDING DATA...");
          }
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
    } else {
      alert("Browser does not support Speech API. Use Chrome.");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto p-6 space-y-8">
      
      {/* STATUS HEADER */}
      <div className="flex items-center space-x-3 bg-black/50 px-6 py-3 rounded-full border border-siren-green/30">
        <div className={cn("w-3 h-3 rounded-full animate-pulse", isLive ? "bg-green-500" : "bg-red-500")} />
        <span className="font-mono text-siren-green tracking-widest text-sm uppercase">
          {status}
        </span>
      </div>

      {/* THE BIG RED BUTTON */}
      <div className="relative group">
        <div className={cn(
          "absolute -inset-1 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000",
          isLive ? "bg-red-600 animate-pulse" : "bg-green-600"
        )}></div>
        <button
          onClick={isLive ? endCall : startCall}
          className={cn(
            "relative w-32 h-32 rounded-full flex items-center justify-center border-4 transition-all duration-300 transform active:scale-95 shadow-2xl",
            isLive 
              ? "bg-black border-red-500 text-red-500 hover:bg-red-950/30" 
              : "bg-black border-green-500 text-green-500 hover:bg-green-950/30"
          )}
        >
          {isLive ? <PhoneOff className="w-12 h-12" /> : <Phone className="w-12 h-12" />}
        </button>
      </div>

      {/* LIVE TRANSCRIPT (THE MATRIX) */}
      <div className="w-full h-64 bg-black border border-gray-800 rounded-lg p-4 overflow-y-auto font-mono text-sm space-y-2 shadow-inner">
        {transcript.length === 0 && (
          <div className="text-gray-600 text-center mt-20">Waiting for voice activity...</div>
        )}
        {transcript.map((line, i) => (
          <div key={i} className={cn("p-2 rounded", line.startsWith("TARGET") ? "text-white bg-gray-900" : "text-green-400 text-right")}>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}