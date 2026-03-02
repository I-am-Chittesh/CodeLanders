"use client";

import { useState } from "react";
import LiveTranscript from "@/components/siren/LiveTranscript";
import StressGauge from "@/components/siren/StressGauge";
import LiveCall from "@/components/siren/LiveCall"; // Keep your logic component!

export default function StingPage() {
  // Mock data for UI testing (Replace with real WebSocket data later)
  const [messages, setMessages] = useState([
    { id: '1', sender: 'AI', text: 'Good morning, this is Officer Vikram from NPCI.', timestamp: '10:42:01' },
    { id: '2', sender: 'TARGET', text: 'Why is my transaction blocked?', timestamp: '10:42:05' },
  ]);
  const [stress, setStress] = useState(45);

  return (
    <main className="min-h-screen bg-black text-white p-6 relative overflow-hidden font-sans selection:bg-siren-green/30">
      
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 pointer-events-none" />

      {/* Header */}
      <header className="flex items-center justify-between mb-8 border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
            SIREN <span className="text-red-600">PROTOCOL</span>
          </h1>
          <p className="text-xs font-mono text-gray-500">SECURE INTELLIGENCE RESPONSE NODE // ACTIVE</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="px-3 py-1 bg-red-900/20 border border-red-900/50 text-red-500 text-xs font-mono rounded">
            STATUS: INTERCEPTING
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)]">
        
        {/* Left Panel: The Phone & Metrics (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
            {/* The Big Button */}
            <LiveCall /> 
            
            {/* The Stress Gauge */}
            <StressGauge level={stress} />

            {/* Case Info Card */}
            <div className="p-4 border border-gray-800 rounded-lg bg-gray-900/50">
                <h3 className="text-xs text-gray-400 font-mono mb-2">TARGET_PROFILE</h3>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between border-b border-gray-800 pb-1">
                        <span className="text-gray-500">PHONE</span>
                        <span className="font-mono text-white">+91 98765 XXXXX</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-800 pb-1">
                        <span className="text-gray-500">RISK SCORE</span>
                        <span className="font-mono text-red-500">CRITICAL (98)</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Right Panel: The Matrix Log (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col">
            <LiveTranscript messages={messages as any} />
            
            {/* Map Placeholder or Waveform */}
            <div className="mt-6 flex-1 border border-gray-800 rounded-lg bg-black/50 relative flex items-center justify-center">
                <p className="text-xs text-gray-600 font-mono">[ GEO-LOCATION TRANGULATION MODULE ]</p>
                {/* You can add a waveform visualizer here later */}
            </div>
        </div>

      </div>
    </main>
  );
}