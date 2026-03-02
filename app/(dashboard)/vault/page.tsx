"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Download, Printer, Share2, AlertTriangle, ChevronDown } from "lucide-react";

interface Transcript {
  time: string;
  sender: "AI" | "TARGET";
  text: string;
}

export default function VaultPage() {
  const searchParams = useSearchParams();
  const phoneNumber = searchParams.get("phone") || "+91 XXXX XXXX";
  const [caseId, setCaseId] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>("threat");

  // Generate caseId on client only to avoid hydration mismatch
  useEffect(() => {
    setCaseId(`SIREN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`);
  }, []);

  const reportData = {
    phoneNumber,
    accountNumber: "987654321098",
    extractedAt: new Date().toLocaleTimeString(),
    city: "Mumbai",
    country: "India",
    latitude: "19.076",
    longitude: "72.877",
    riskScore: 92,
    duration: "4m 23s",
    scriptType: "Bank Refund Authorization",
    transcript: [
      { time: "00:05", sender: "AI" as const, text: "Hello, this is the Federal Banking Security Center. Your account has been flagged for suspicious activity." },
      { time: "00:10", sender: "TARGET" as const, text: "Why is my transaction blocked?" },
      { time: "00:15", sender: "AI" as const, text: "I need you to verify your account details. Can you please provide your registered bank account number?" },
      { time: "00:45", sender: "TARGET" as const, text: "Uh... why do you need that? I don't think I should give that over the phone..." },
      { time: "01:00", sender: "AI" as const, text: "Sir/Madam, your account will be frozen in 10 minutes if we don't verify. This is a security measure. What is your account number?" },
      { time: "02:15", sender: "TARGET" as const, text: "Okay, okay... I'm scared. It's 987654321098..." },
      { time: "02:20", sender: "AI" as const, text: "[ACCOUNT CAPTURED] Thank you. We've secured your account. You will not be charged." },
    ],
  };

  const handleDownloadPDF = () => {
    setIsExporting(true);
    setTimeout(() => {
      alert("PDF Report Downloaded: " + caseId + ".pdf");
      setIsExporting(false);
    }, 1500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const reportText = `SIREN Forensic Report ${caseId}\nTarget Phone: ${reportData.phoneNumber}\nExtracted Account: ${reportData.accountNumber}\nRisk Score: ${reportData.riskScore}%\nLocation: ${reportData.city}, ${reportData.country}`;
    navigator.clipboard.writeText(reportText);
    alert("Report copied to clipboard!");
  };

  return (
    <main className="min-h-screen bg-black text-siren-green font-mono relative print:bg-white print:text-black overflow-x-hidden">
      {/* BACKGROUND SCANLINE */}
      <div className="fixed inset-0 pointer-events-none opacity-5 print:hidden">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="scanlines" x="0" y="0" width="100%" height="2" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="100%" y2="0" stroke="#22c55e" strokeWidth="1" opacity="0.03" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#scanlines)" />
        </svg>
      </div>

      <div className="relative z-10 w-full">
        {/* STICKY HEADER */}
        <motion.header 
          className="sticky top-0 bg-black/95 border-b border-siren-green/30 p-4 sm:p-6 z-20 print:static print:bg-white print:border-black/20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-wider text-siren-green print:text-black">
                ▲ SIREN ▲
              </h1>
              <p className="text-xs text-siren-green/60 print:text-black/60 mt-0.5">FORENSIC REPORT</p>
            </div>
            <div className="text-xs font-mono space-y-0.5 print:hidden">
              <p className="text-siren-green/80">{caseId || "SIREN-LOADING"}</p>
              {typeof window !== 'undefined' && (
                <p className="text-siren-green/50">{new Date().toLocaleString()}</p>
              )}
            </div>
          </div>
        </motion.header>

        {/* MAIN CONTENT */}
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-4 print:p-4 print:space-y-3">
          
          {/* THREAT ALERT - ALWAYS VISIBLE */}
          <motion.div
            className="bg-siren-red/10 border-2 border-siren-red p-4 sm:p-5 rounded-lg print:bg-red-50 print:border-red-300"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex gap-3 items-start">
              <AlertTriangle className="w-5 h-5 shrink-0 text-siren-red print:text-black mt-1" />
              <div className="w-full">
                <p className="font-bold text-sm text-siren-red print:text-black mb-2">CRITICAL THREAT IDENTIFIED</p>
                <p className="text-xs sm:text-sm text-siren-green/90 print:text-black leading-relaxed">
                  Account <span className="font-mono bg-black/30 px-2 py-1 rounded">{reportData.accountNumber}</span> successfully extracted. Law enforcement notified.
                </p>
              </div>
            </div>
          </motion.div>

          {/* COLLAPSIBLE SECTIONS */}
          <div className="space-y-3 print:space-y-2">
            {/* QUICK STATS */}
            <motion.div
              className="border border-siren-green/30 rounded-lg overflow-hidden bg-black/50 print:bg-gray-50 print:border-black/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <button
                onClick={() => setExpandedSection(expandedSection === "stats" ? null : "stats")}
                className="w-full px-4 sm:px-5 py-3 sm:py-4 flex items-center justify-between hover:bg-black/60 transition-colors print:bg-white print:hover:bg-white"
              >
                <span className="text-sm sm:text-base font-bold text-siren-green print:text-black">INCIDENT SUMMARY</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${expandedSection === "stats" ? "rotate-180" : ""} print:hidden`} />
              </button>
              
              {(expandedSection === "stats" || typeof window === "undefined") && (
                <div className="px-4 sm:px-5 py-3 sm:py-4 border-t border-siren-green/20 print:border-black/10">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    {[
                      { label: "Phone", value: reportData.phoneNumber },
                      { label: "Duration", value: reportData.duration },
                      { label: "Risk Score", value: `${reportData.riskScore}%` },
                      { label: "Status", value: "INTERCEPTED" },
                    ].map((item, i) => (
                      <div key={i} className="text-center print:text-left">
                        <p className="text-[10px] sm:text-xs text-siren-green/60 print:text-black/60 mb-1 uppercase">
                          {item.label}
                        </p>
                        <p className="text-xs sm:text-sm font-mono font-bold text-siren-green print:text-black break-all">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* LOCATION & DETAILS */}
            <motion.div
              className="border border-siren-green/30 rounded-lg overflow-hidden bg-black/50 print:bg-gray-50 print:border-black/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <button
                onClick={() => setExpandedSection(expandedSection === "location" ? null : "location")}
                className="w-full px-4 sm:px-5 py-3 sm:py-4 flex items-center justify-between hover:bg-black/60 transition-colors print:bg-white print:hover:bg-white"
              >
                <span className="text-sm sm:text-base font-bold text-siren-green print:text-black">TARGET INTELLIGENCE</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${expandedSection === "location" ? "rotate-180" : ""} print:hidden`} />
              </button>
              
              {(expandedSection === "location" || typeof window === "undefined") && (
                <div className="px-4 sm:px-5 py-3 sm:py-4 border-t border-siren-green/20 print:border-black/10 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-siren-green/60 print:text-black/60 mb-1">Extracted Account</p>
                      <p className="font-mono text-sm font-bold text-siren-green print:text-black">{reportData.accountNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs text-siren-green/60 print:text-black/60 mb-1">Location</p>
                      <p className="text-sm text-siren-green print:text-black">{reportData.city}, {reportData.country}</p>
                    </div>
                    <div>
                      <p className="text-xs text-siren-green/60 print:text-black/60 mb-1">Coordinates</p>
                      <p className="font-mono text-sm text-siren-green print:text-black">{reportData.latitude}°N, {reportData.longitude}°E</p>
                    </div>
                    <div>
                      <p className="text-xs text-siren-green/60 print:text-black/60 mb-1">Extraction Time</p>
                      <p className="font-mono text-sm text-siren-green print:text-black">{reportData.extractedAt}</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* TRANSCRIPT */}
            <motion.div
              className="border border-siren-green/30 rounded-lg overflow-hidden bg-black/50 print:bg-gray-50 print:border-black/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <button
                onClick={() => setExpandedSection(expandedSection === "transcript" ? null : "transcript")}
                className="w-full px-4 sm:px-5 py-3 sm:py-4 flex items-center justify-between hover:bg-black/60 transition-colors print:bg-white print:hover:bg-white"
              >
                <span className="text-sm sm:text-base font-bold text-siren-green print:text-black">CALL TRANSCRIPT</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${expandedSection === "transcript" ? "rotate-180" : ""} print:hidden`} />
              </button>
              
              {(expandedSection === "transcript" || typeof window === "undefined") && (
                <div className="px-4 sm:px-5 py-3 sm:py-4 border-t border-siren-green/20 print:border-black/10 max-h-64 overflow-y-auto space-y-2 print:max-h-none print:overflow-visible print:space-y-1">
                  {reportData.transcript.map((line: Transcript, i: number) => (
                    <div
                      key={i}
                      className={`text-xs sm:text-sm p-2 rounded border-l-2 ${
                        line.sender === "AI"
                          ? "border-blue-500 bg-blue-950/30 text-blue-100 print:bg-blue-50 print:text-black print:border-blue-300"
                          : "border-red-500 bg-red-950/30 text-red-100 print:bg-red-50 print:text-black print:border-red-300"
                      }`}
                    >
                      <div className="flex gap-2 mb-1 items-center">
                        <span className="font-bold text-[10px] uppercase text-inherit">{line.sender}</span>
                        <span className="text-[10px] opacity-60 print:text-black/60">{line.time}</span>
                      </div>
                      <p className="text-xs leading-relaxed">{line.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* FORENSIC DETAILS */}
            <motion.div
              className="border border-siren-green/30 rounded-lg overflow-hidden bg-black/50 print:bg-gray-50 print:border-black/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <button
                onClick={() => setExpandedSection(expandedSection === "forensic" ? null : "forensic")}
                className="w-full px-4 sm:px-5 py-3 sm:py-4 flex items-center justify-between hover:bg-black/60 transition-colors print:bg-white print:hover:bg-white"
              >
                <span className="text-sm sm:text-base font-bold text-siren-green print:text-black">FORENSIC ANALYSIS</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${expandedSection === "forensic" ? "rotate-180" : ""} print:hidden`} />
              </button>
              
              {(expandedSection === "forensic" || typeof window === "undefined") && (
                <div className="px-4 sm:px-5 py-3 sm:py-4 border-t border-siren-green/20 print:border-black/10 space-y-3">
                  {[
                    { title: "Pattern Match", result: "98% confidence to known scam", status: "DETECTED" },
                    { title: "Voice Analysis", result: "High stress indicators detected", status: "CONFIRMED" },
                    { title: "Account Extraction", result: "Successfully captured via social engineering", status: "SUCCESS" },
                    { title: "Case Linking", result: "Linked to 5 prior investigations", status: "LINKED" },
                  ].map((item, i) => (
                    <div key={i} className="border-l-2 border-siren-green/40 pl-3 print:border-black/20">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <p className="text-xs text-siren-green/70 print:text-black/70 font-medium">{item.title}</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded shrink-0 font-bold ${
                          item.status === "DETECTED" ? "bg-red-950/50 text-red-400" :
                          item.status === "SUCCESS" ? "bg-green-950/50 text-green-400" :
                          "bg-blue-950/50 text-blue-400"
                        } print:bg-gray-200 print:text-black`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-xs text-siren-green/90 print:text-black">{item.result}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* ACTIONS FOOTER */}
          <motion.div
            className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 print:hidden border-t border-siren-green/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <button
              onClick={handleDownloadPDF}
              disabled={isExporting}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-siren-green text-siren-green hover:bg-siren-green/20 disabled:opacity-50 transition-all text-sm font-bold uppercase"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? "Exporting..." : "Download PDF"}</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-siren-green text-siren-green hover:bg-siren-green/20 transition-all text-sm font-bold uppercase"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
            <button
              onClick={handleShare}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-siren-green text-siren-green hover:bg-siren-green/20 transition-all text-sm font-bold uppercase"
            >
              <Share2 className="w-4 h-4" />
              <span>Copy Report</span>
            </button>
          </motion.div>
        </div>

        {/* PRINT FOOTER */}
        <div className="hidden print:block border-t border-black/20 mt-8 pt-4 px-4 py-2 max-w-5xl mx-auto">
          <p className="text-xs text-black/60">Report ID: {caseId || "SIREN-LOADING"}</p>
          {typeof window !== 'undefined' && (
            <p className="text-xs text-black/60">Generated: {new Date().toLocaleString()}</p>
          )}
          <p className="text-xs text-black/60 mt-2">Authorized Law Enforcement Use Only - Confidential</p>
        </div>
      </div>
    </main>
  );
}
