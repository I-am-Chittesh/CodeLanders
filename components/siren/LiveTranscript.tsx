"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  sender: "AI" | "TARGET";
  text: string;
  timestamp: string;
}

interface LiveTranscriptProps {
  messages: Message[];
}

export default function LiveTranscript({ messages }: LiveTranscriptProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="relative w-full h-[400px] bg-black/90 border border-siren-green/30 rounded-lg overflow-hidden shadow-[0_0_30px_rgba(34,197,94,0.1)]">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-siren-green/10 border-b border-siren-green/20 flex items-center px-4 justify-between z-10">
        <span className="text-xs font-mono text-siren-green tracking-widest">LIVE TRANSCRIPT_LOG</span>
        <div className="flex space-x-1">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[10px] text-red-500 font-mono">REC</span>
        </div>
      </div>

      {/* The Scroll Area */}
      <div 
        ref={scrollRef}
        className="absolute top-8 bottom-0 left-0 right-0 overflow-y-auto p-4 space-y-3 font-mono text-sm scrollbar-thin scrollbar-thumb-siren-green/20 scrollbar-track-transparent"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                "flex flex-col max-w-[80%]",
                msg.sender === "AI" ? "ml-auto items-end" : "mr-auto items-start"
              )}
            >
              <span className={cn(
                "text-[10px] mb-1 opacity-50",
                msg.sender === "AI" ? "text-blue-400" : "text-red-400"
              )}>
                {msg.sender} :: {msg.timestamp}
              </span>
              <div className={cn(
                "p-3 rounded-sm border-l-2",
                msg.sender === "AI" 
                  ? "bg-blue-950/30 border-blue-500 text-blue-100" 
                  : "bg-red-950/30 border-red-500 text-red-100"
              )}>
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Formatting fix for empty state */}
        {messages.length === 0 && (
            <div className="flex h-full items-center justify-center opacity-20">
                <p className="text-siren-green animate-pulse">WAITING FOR AUDIO SIGNAL...</p>
            </div>
        )}
      </div>
    </div>
  );
}