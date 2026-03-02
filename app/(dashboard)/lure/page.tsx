"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Phone } from "lucide-react";

export default function LurePage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [status, setStatus] = useState("IDLE"); // IDLE | CALLING | ANALYZING | DETECTED
  const [logs, setLogs] = useState<string[]>([]);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length < 5) return;

    // STEP 1: SIMULATE CALL
    setStatus("CALLING");
    addLog("[SIREN] Initiating secure connection...");
    addLog(`[COMMS] Dialing: ${phoneNumber}`);
    
    setTimeout(() => {
      // STEP 2: SIMULATE AI LISTENING
      setStatus("ANALYZING");
      addLog("[AUDIO] Connection established. Voice AI active.");
      addLog("[AI] Engaging target... Deploying 'Transaction Block' scenario.");
      addLog("[LISTEN] Analyzing voice patterns for fraud markers...");
    }, 2500);

    setTimeout(() => {
      addLog("[PATTERN] Bank Refund script detected - 87% confidence match.");
      addLog("[VECTOR] Case similarity: Linked to 5 prior investigations.");
    }, 5000);

    setTimeout(() => {
      // STEP 3: ACCOUNT DETECTED -> REDIRECT TO STING
      setStatus("DETECTED");
      addLog("[ALERT] ███ ACCOUNT NUMBER CAPTURED ███");
      addLog("[ALERT] HIGH RISK CONFIRMED - Engaging Twilio dispatch...");
      addLog("[DISPATCH] Alert sent to Law Enforcement.");
      addLog("[SWITCH] Transferring to live monitoring console...");
      
      setTimeout(() => {
        router.push(`/sting?phone=${encodeURIComponent(phoneNumber)}`);
      }, 2000);
    }, 8000);
  };

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, msg]);
  };

  return (
    <main className="min-h-screen bg-black text-green-500 flex flex-col p-6 font-mono relative overflow-hidden">
      {/* SCANLINE OVERLAY */}
      <div className="absolute inset-0 pointer-events-none z-50 mix-blend-overlay opacity-10">
        <div className="scanlines" />
      </div>

      {/* HEADER: SIREN LOGO */}
      <header className="flex items-center justify-between mb-12 relative z-10 border-b-2 border-green-500 pb-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl font-bold tracking-widest text-green-400">
            ▲ SIREN ▲
          </div>
          <div className="text-xs text-green-600 uppercase tracking-widest">
            Active Defense System
          </div>
        </div>
        <div className="text-xs text-green-600 animate-pulse">
          [SYSTEM READY]
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col lg:flex-row gap-12 relative z-10 max-w-7xl mx-auto w-full">
        
        {/* LEFT: INFORMATION SECTION */}
        <div className="flex-1 space-y-6">
          <div className="border-l-2 border-green-500 pl-4">
            <h1 className="text-3xl font-bold text-green-400 mb-2 tracking-wider">
              OPERATION: LURE
            </h1>
            <p className="text-green-500 text-sm uppercase tracking-widest text-green-600">
              | Forensic Voice AI Engagement System |
            </p>
          </div>

          <div className="space-y-4 text-sm leading-relaxed">
            <div className="bg-black border border-green-500 p-4 rounded">
              <p className="text-green-400 font-bold mb-2">▶ MISSION OBJECTIVE</p>
              <p className="text-green-500">
                Deploy AI voice persona to engage suspected scammers. Extract bank account information and financial networks through deceptive conversation tactics.
              </p>
            </div>

            <div className="bg-black border border-green-600 p-4 rounded">
              <p className="text-green-400 font-bold mb-2">▶ ENGAGEMENT PROTOCOL</p>
              <ul className="text-green-500 space-y-1">
                <li>• AI claims blocked transaction requiring verification</li>
                <li>• Target extracted to reveal mule bank accounts</li>
                <li>• Real-time pattern matching against known scripts</li>
                <li>• Immediate dispatch to law enforcement on account detection</li>
              </ul>
            </div>

            <div className="bg-black border border-green-600 p-4 rounded">
              <p className="text-green-400 font-bold mb-2">▶ AUTHORIZED PERSONNEL ONLY</p>
              <p className="text-green-500 text-xs">
                This system is restricted to Law Enforcement and Banking Institutions. Unauthorized access is logged and monitored.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT: INPUT PANEL */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="border-2 border-green-500 bg-black p-6 rounded relative">
            {/* STATUS INDICATOR */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-green-700">
              <span className="text-xs uppercase tracking-widest text-green-600">ENGAGEMENT PANEL</span>
              <div className={`flex items-center gap-2 text-xs uppercase tracking-widest ${
                status === "IDLE" ? "text-green-400" : 
                status === "DETECTED" ? "text-red-500 animate-pulse" : 
                "text-yellow-500"
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  status === "IDLE" ? "bg-green-400" : 
                  status === "DETECTED" ? "bg-red-500 animate-pulse" : 
                  "bg-yellow-500 animate-pulse"
                }`} />
                {status === "IDLE" ? "READY" : status === "DETECTING" ? "ANALYZING" : "THREAT DETECTED"}
              </div>
            </div>

            {/* INPUT FORM */}
            {status === "IDLE" && (
              <form onSubmit={handleAnalyze} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-green-400 mb-2">
                    Target Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    className="w-full bg-black border border-green-500 text-green-400 px-4 py-3 focus:outline-none focus:border-green-300 focus:ring-1 focus:ring-green-400 placeholder:text-green-800"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                  <p className="text-xs text-green-700 mt-2">Entry format: +[Country Code] [Phone Number]</p>
                </div>

                <button 
                  type="submit"
                  disabled={phoneNumber.length < 5}
                  className="w-full bg-green-900 hover:bg-green-800 text-green-400 border border-green-500 px-4 py-3 font-bold uppercase tracking-widest transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:disabled:bg-green-900"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4" />
                    INITIATE CALL
                  </span>
                </button>
              </form>
            )}

            {/* PROCESSING STATE */}
            {status !== "IDLE" && (
              <div className="space-y-4">
                {/* LOGS */}
                <div className="bg-black border border-green-600 rounded p-4 max-h-64 overflow-y-auto space-y-1">
                  {logs.length === 0 ? (
                    <p className="text-green-700 text-sm">[STANDBY] Awaiting engagement...</p>
                  ) : (
                    logs.map((log, i) => (
                      <div
                        key={i}
                        className={`text-sm font-mono animate-in fade-in slide-in-from-left-2 duration-300 ${
                          log.includes("ALERT") || log.includes("CRITICAL")
                            ? "text-red-500 font-bold"
                            : log.includes("DETECTED") || log.includes("WARNING")
                            ? "text-yellow-500"
                            : "text-green-500"
                        }`}
                      >
                        {log}
                      </div>
                    ))
                  )}
                </div>

                {/* PROGRESS BAR */}
                <div className="space-y-2">
                  <div className="w-full h-1 bg-green-900 border border-green-600 overflow-hidden rounded">
                    <div
                      className={`h-full transition-all duration-[8000ms] ease-linear ${
                        status === "DETECTED" ? "bg-red-500 w-full" : "bg-green-500"
                      }`}
                      style={{
                        width: status === "IDLE" ? "0%" : status === "DETECTED" ? "100%" : "60%",
                      }}
                    />
                  </div>
                  <p className="text-xs text-green-700 text-right">
                    {status === "DETECTED" ? "THREAT IDENTIFIED" : "PROCESSING..."}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* FOOTER INFO */}
          <div className="text-xs text-green-700 space-y-1 border-t border-green-900 pt-4">
            <p>▸ SIREN v2.1 | Forensic Voice AI System</p>
            <p>▸ Authorized Access Only | Session Logged</p>
            <p>▸ Contact: law-enforcement-liaison@siren.local</p>
          </div>
        </div>
      </div>
    </main>
  );
}