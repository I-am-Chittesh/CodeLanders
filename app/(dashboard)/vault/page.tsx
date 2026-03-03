"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Download, Printer, Share2, AlertTriangle, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

interface Transcript {
  time: string;
  sender: "AI" | "TARGET";
  text: string;
}

export default function VaultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const phoneNumber = searchParams.get("phone") || "+91 XXXX XXXX";
  const [caseId, setCaseId] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>("threat");
  const [isAlertTriggering, setIsAlertTriggering] = useState(false);
  const [alertResponse, setAlertResponse] = useState<string>("");

  // Generate caseId and set date on client only to avoid hydration mismatch
  useEffect(() => {
    setCaseId(`SIREN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`);
    setCurrentDate(new Date().toLocaleString());
  }, []);

  const reportData = {
    phoneNumber,
    accountNumber: "987654321098",
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

  // 🚨 RED ALERT TRIGGER - Call the Bank Manager
  const handleRedAlert = async () => {
    try {
      setIsAlertTriggering(true);
      setAlertResponse("Initiating RED ALERT...");

      const response = await fetch("/api/trigger-alert", {
        method: "GET",
      });

      const data = await response.json();

      if (response.ok) {
        setAlertResponse(
          `✅ ALERT SENT! Call SID: ${data.callSid.substring(0, 8)}... | Status: ${data.status}`
        );
        console.log("🚨 RED ALERT triggered:", data);
      } else {
        setAlertResponse(
          `❌ ${data.error}: ${data.message || data.solution}`
        );
        console.error("Alert error:", data);
      }
    } catch (error) {
      setAlertResponse(`❌ Connection error: ${String(error)}`);
      console.error("Failed to trigger alert:", error);
    } finally {
      setIsAlertTriggering(false);
    }
  };

  return (
    <main className="h-screen w-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden flex flex-col print:bg-white print:text-black">
      {/* ANIMATED BACKGROUND - PREMIUM */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 print:hidden">
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{ x: [0, 50, -30], y: [0, 30, -50] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-10 right-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"
          animate={{ x: [0, -40, 30], y: [0, -30, 50] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 right-1/4 w-72 h-72 bg-pink-500/5 rounded-full blur-3xl"
          animate={{ x: [-50, 50, -30], y: [50, -30, 50] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 w-full flex-1 overflow-y-auto max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* STICKY HEADER */}
        <motion.header 
          className="sticky top-0 backdrop-blur-2xl bg-gradient-to-br from-purple-900/30 via-slate-800/30 to-indigo-900/30 border-b border-purple-500/30 border-t-purple-400/50 px-4 sm:px-6 py-6 sm:py-8 z-20 print:static print:bg-white print:border-black/20 print:py-4 rounded-b-2xl print:rounded-none"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-6">
              <div>
                <motion.h1 
                  className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-purple-300 via-pink-300 to-purple-400 bg-clip-text text-transparent tracking-tighter"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                >
                  FORENSIC REPORT
                </motion.h1>
                <motion.p 
                  className="text-purple-300/70 text-base uppercase tracking-widest font-semibold mt-3 print:text-black/60 print:text-xs"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  🔐 Evidence Vault - Authorized Access Only
                </motion.p>
              </div>
              <div className="text-right space-y-2 print:hidden">
                <p className="text-slate-300 font-mono font-bold text-lg">{caseId || "SIREN-LOADING"}</p>
                {currentDate && <p className="text-slate-400/70 text-xs">{currentDate}</p>}
              </div>
            </div>
            
            {/* RED ALERT BUTTON */}
            <div className="print:hidden">
              <motion.button
                onClick={handleRedAlert}
                disabled={isAlertTriggering}
                className="w-full px-6 py-3 font-bold uppercase tracking-widest rounded-xl transition-all bg-gradient-to-r from-red-600 to-orange-600 border border-red-400/50 text-white hover:shadow-lg hover:shadow-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                whileHover={{ scale: !isAlertTriggering ? 1.02 : 1 }}
                whileTap={{ scale: !isAlertTriggering ? 0.98 : 1 }}
              >
                {isAlertTriggering ? "🔴 CALLING MANAGER..." : "🚨 RED ALERT - CALL MANAGER"}
              </motion.button>
              {alertResponse && (
                <motion.p
                  className="text-xs mt-3 p-3 border border-red-500/40 bg-red-900/20 rounded-lg text-red-400 backdrop-blur-sm text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {alertResponse}
                </motion.p>
              )}
            </div>
          </div>
        </motion.header>

        {/* MAIN CONTENT */}
        <div className="w-screen px-4 sm:px-6 py-6 sm:py-8 space-y-6 print:p-4 print:space-y-4">
          
          {/* THREAT ALERT - ALWAYS VISIBLE */}
          <motion.div
            className="backdrop-blur-xl bg-gradient-to-br from-red-900/25 via-red-800/20 to-red-900/20 border border-red-500/40 p-5 sm:p-6 rounded-2xl print:bg-red-50 print:border-red-300 print:p-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex gap-4 items-start">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <AlertTriangle className="w-6 h-6 shrink-0 text-red-400 print:text-black mt-1" />
              </motion.div>
              <div className="w-full">
                <p className="font-bold text-base text-red-300 print:text-black mb-2">🚨 CRITICAL THREAT IDENTIFIED</p>
                <p className="text-sm text-slate-300/80 print:text-black leading-relaxed">
                  Account <span className="font-mono bg-black/30 px-3 py-1 rounded border border-slate-600/20 text-slate-300">{reportData.accountNumber}</span> successfully extracted during forensic analysis. Law enforcement has been notified.
                </p>
              </div>
            </div>
          </motion.div>

          {/* COLLAPSIBLE SECTIONS */}
          <div className="space-y-4 print:space-y-3">
            {/* QUICK STATS */}
            <motion.div
              className="backdrop-blur-xl bg-gradient-to-br from-slate-800/40 via-slate-700/40 to-slate-900/30 border border-slate-600/30 rounded-2xl overflow-hidden print:bg-gray-50 print:border-black/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <button
                onClick={() => setExpandedSection(expandedSection === "stats" ? null : "stats")}
                className="w-full px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between hover:bg-slate-700/20 transition-colors print:bg-white print:hover:bg-gray-50"
              >
                <span className="text-base sm:text-lg font-bold text-slate-200 print:text-black">📊 INCIDENT SUMMARY</span>
                <ChevronDown className={`w-5 h-5 text-slate-300 transition-transform print:text-black ${expandedSection === "stats" ? "rotate-180" : ""} print:hidden`} />
              </button>
              
              {expandedSection === "stats" && (
                <div className="px-5 sm:px-6 py-4 sm:py-5 border-t border-slate-600/30 print:border-black/10">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { label: "Phone", value: reportData.phoneNumber },
                      { label: "Duration", value: reportData.duration },
                      { label: "Risk Score", value: `${reportData.riskScore}%` },
                      { label: "Status", value: "INTERCEPTED" },
                    ].map((item, i) => (
                      <div key={i} className="text-center print:text-left">
                        <p className="text-xs text-slate-400/60 print:text-black/60 mb-2 uppercase tracking-widest font-semibold">
                          {item.label}
                        </p>
                        <p className="text-sm font-mono font-bold text-slate-200 print:text-black break-all">
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
              className="backdrop-blur-xl bg-gradient-to-br from-slate-800/40 via-slate-700/40 to-slate-900/30 border border-slate-600/30 rounded-2xl overflow-hidden print:bg-gray-50 print:border-black/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <button
                onClick={() => setExpandedSection(expandedSection === "location" ? null : "location")}
                className="w-full px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between hover:bg-slate-700/20 transition-colors print:bg-white print:hover:bg-gray-50"
              >
                <span className="text-base sm:text-lg font-bold text-slate-200 print:text-black">🎯 TARGET INTELLIGENCE</span>
                <ChevronDown className={`w-5 h-5 text-slate-300 transition-transform print:text-black ${expandedSection === "location" ? "rotate-180" : ""} print:hidden`} />
              </button>
              
              {expandedSection === "location" && (
                <div className="px-5 sm:px-6 py-4 sm:py-5 border-t border-slate-600/30 print:border-black/10 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs text-slate-400/60 print:text-black/60 mb-2 uppercase tracking-widest font-semibold">Extracted Account</p>
                      <p className="font-mono text-sm font-bold text-slate-200 print:text-black">{reportData.accountNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400/60 print:text-black/60 mb-2 uppercase tracking-widest font-semibold">Location</p>
                      <p className="text-sm text-slate-200 print:text-black">{reportData.city}, {reportData.country}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400/60 print:text-black/60 mb-2 uppercase tracking-widest font-semibold">Coordinates</p>
                      <p className="font-mono text-sm text-slate-200 print:text-black">{reportData.latitude}°N, {reportData.longitude}°E</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400/60 print:text-black/60 mb-2 uppercase tracking-widest font-semibold">Extraction Time</p>
                      <p className="font-mono text-sm text-slate-200 print:text-black">{currentDate || "Loading..."}</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* TRANSCRIPT */}
            <motion.div
              className="backdrop-blur-xl bg-gradient-to-br from-slate-800/40 via-slate-700/40 to-slate-900/30 border border-slate-600/30 rounded-2xl overflow-hidden print:bg-gray-50 print:border-black/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <button
                onClick={() => setExpandedSection(expandedSection === "transcript" ? null : "transcript")}
                className="w-full px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between hover:bg-slate-700/20 transition-colors print:bg-white print:hover:bg-gray-50"
              >
                <span className="text-base sm:text-lg font-bold text-slate-200 print:text-black">🎙️ CALL TRANSCRIPT</span>
                <ChevronDown className={`w-5 h-5 text-slate-300 transition-transform print:text-black ${expandedSection === "transcript" ? "rotate-180" : ""} print:hidden`} />
              </button>
              
              {expandedSection === "transcript" && (
                <div className="px-5 sm:px-6 py-4 sm:py-5 border-t border-slate-600/30 print:border-black/10 max-h-96 overflow-y-auto space-y-3 print:max-h-none print:overflow-visible print:space-y-2">
                  {reportData.transcript.map((line: Transcript, i: number) => (
                    <div
                      key={i}
                      className={`text-xs sm:text-sm p-3 rounded-lg border-l-4 backdrop-blur-sm ${
                        line.sender === "AI"
                          ? "border-blue-500 bg-blue-900/20 text-blue-300 print:bg-blue-50 print:text-black print:border-blue-300"
                          : "border-red-500 bg-red-900/20 text-red-300 print:bg-red-50 print:text-black print:border-red-300"
                      }`}
                    >
                      <div className="flex gap-3 mb-2 items-center">
                        <span className="font-bold text-[10px] uppercase text-inherit px-2 py-1 bg-black/30 rounded print:bg-gray-200 print:text-black">{line.sender}</span>
                        <span className="text-[10px] opacity-50 print:text-black/60 font-mono">{line.time}</span>
                      </div>
                      <p className="text-xs leading-relaxed">{line.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* FORENSIC DETAILS */}
            <motion.div
              className="backdrop-blur-xl bg-gradient-to-br from-slate-800/40 via-slate-700/40 to-slate-900/30 border border-slate-600/30 rounded-2xl overflow-hidden print:bg-gray-50 print:border-black/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <button
                onClick={() => setExpandedSection(expandedSection === "forensic" ? null : "forensic")}
                className="w-full px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between hover:bg-slate-700/20 transition-colors print:bg-white print:hover:bg-gray-50"
              >
                <span className="text-base sm:text-lg font-bold text-slate-200 print:text-black">🔬 FORENSIC ANALYSIS</span>
                <ChevronDown className={`w-5 h-5 text-slate-300 transition-transform print:text-black ${expandedSection === "forensic" ? "rotate-180" : ""} print:hidden`} />
              </button>
              
              {expandedSection === "forensic" && (
                <div className="px-5 sm:px-6 py-4 sm:py-5 border-t border-slate-600/30 print:border-black/10 space-y-4">
                  {[
                    { title: "Pattern Match", result: "98% confidence to known scam", status: "DETECTED" },
                    { title: "Voice Analysis", result: "High stress indicators detected", status: "CONFIRMED" },
                    { title: "Account Extraction", result: "Successfully captured via social engineering", status: "SUCCESS" },
                    { title: "Case Linking", result: "Linked to 5 prior investigations", status: "LINKED" },
                  ].map((item, i) => (
                    <div key={i} className="border-l-2 border-slate-600/40 pl-4 print:border-black/20">
                      <div className="flex justify-between items-start gap-3 mb-2">
                        <p className="text-sm text-slate-300/80 print:text-black/80 font-medium">{item.title}</p>
                        <span className={`text-[10px] px-3 py-1 rounded-lg shrink-0 font-bold uppercase tracking-widest ${
                          item.status === "DETECTED" ? "bg-red-900/30 border border-red-500/40 text-red-400" :
                          item.status === "SUCCESS" ? "bg-green-900/30 border border-green-500/40 text-green-400" :
                          "bg-blue-900/30 border border-blue-500/40 text-blue-400"
                        } print:bg-gray-200 print:text-black print:border-black/20`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300/70 print:text-black/70 leading-relaxed">{item.result}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* ACTIONS FOOTER */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 print:hidden border-t border-slate-600/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <motion.button
              onClick={handleDownloadPDF}
              disabled={isExporting}
              className="flex items-center justify-center gap-2 px-4 py-3 font-bold uppercase tracking-widest rounded-xl transition-all bg-gradient-to-r from-slate-700 to-slate-600 border border-slate-600/50 text-white hover:shadow-lg hover:shadow-slate-900/30 disabled:opacity-50 text-sm"
              whileHover={{ scale: !isExporting ? 1.02 : 1 }}
              whileTap={{ scale: !isExporting ? 0.98 : 1 }}
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? "Exporting..." : "Download PDF"}</span>
            </motion.button>
            <motion.button
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 px-4 py-3 font-bold uppercase tracking-widest rounded-xl transition-all bg-gradient-to-r from-slate-700 to-slate-600 border border-slate-600/50 text-white hover:shadow-lg hover:shadow-slate-900/30 text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </motion.button>
            <motion.button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 px-4 py-3 font-bold uppercase tracking-widest rounded-xl transition-all bg-gradient-to-r from-slate-700 to-slate-600 border border-slate-600/50 text-white hover:shadow-lg hover:shadow-slate-900/30 text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Share2 className="w-4 h-4" />
              <span>Copy Report</span>
            </motion.button>
          </motion.div>
        </div>

        {/* PAGE NAVIGATION */}
        <motion.div
          className="backdrop-blur-xl bg-gradient-to-br from-slate-800/40 via-slate-700/40 to-slate-900/30 border border-slate-600/30 rounded-2xl p-4 sm:p-5 mb-6 w-full print:hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400/60 font-mono">PAGE 3 / 3 - VAULT (FINAL REPORT)</div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <motion.button
                onClick={() => router.push(`/sting?phone=${encodeURIComponent(phoneNumber)}`)}
                className="flex items-center justify-center gap-2 px-6 py-3 font-bold uppercase tracking-widest rounded-xl bg-gradient-to-r from-slate-700 to-slate-600 border border-slate-600/50 text-white hover:shadow-lg hover:shadow-slate-900/30 transition-all text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft className="w-4 h-4" />
                GO TO STING
              </motion.button>
              <motion.button
                onClick={() => router.push("/lure")}
                className="flex items-center justify-center gap-2 px-6 py-3 font-bold uppercase tracking-widest rounded-xl bg-gradient-to-r from-slate-700 to-slate-600 border border-slate-600/50 text-white hover:shadow-lg hover:shadow-slate-900/30 transition-all text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft className="w-4 h-4" />
                GO TO LURE
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* PRINT FOOTER */}
        <div className="hidden print:block border-t border-black/20 mt-8 pt-4 px-4 py-2 max-w-7xl mx-auto">
          <p className="text-xs text-black/60">Report ID: {caseId || "SIREN-LOADING"}</p>
          {currentDate && <p className="text-xs text-black/60">Generated: {currentDate}</p>}
          <p className="text-xs text-black/60 mt-2">Authorized Law Enforcement Use Only - Confidential</p>
        </div>
      </div>
    </main>
  );
}
