"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Mic, ArrowRight, AlertCircle, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const SCAMMER_DETAILS = [
  { label: "Name", value: "Rajesh Kumar" },
  { label: "Phone", value: "+91 98765 43210" },
  { label: "Location", value: "Mumbai, India" },
  { label: "Account", value: "HDFC****5678" },
  { label: "Amount", value: "$2,500 USD" },
  { label: "Fraud Type", value: "Bank Refund Scam" },
  { label: "Risk Level", value: "CRITICAL" },
  { label: "Pattern Match", value: "94.7% Confidence" },
];

export default function LurePage() {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [displayedDetails, setDisplayedDetails] = useState<typeof SCAMMER_DETAILS>([]);
  const [countdownSeconds, setCountdownSeconds] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("+91 98765 43210");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      if (mainRef.current) {
        const scrollHeight = mainRef.current.scrollHeight;
        const scrollTop = mainRef.current.scrollTop;
        const clientHeight = mainRef.current.clientHeight;
        
        // Show button if there's more content to scroll
        setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100);
      }
    };

    const element = mainRef.current;
    element?.addEventListener("scroll", handleScroll);
    
    // Initial check
    setTimeout(handleScroll, 500);

    return () => element?.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll down function
  const scrollDown = () => {
    if (mainRef.current) {
      const scrollAmount = mainRef.current.clientHeight * 0.8;
      mainRef.current.scrollBy({
        top: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Start recording and reveal details
  const handleStartRecording = () => {
    setIsRecording(true);
    setDisplayedDetails([]);
    setCountdownSeconds(10);

    // Reveal details one by one
    SCAMMER_DETAILS.forEach((detail, index) => {
      setTimeout(() => {
        setDisplayedDetails((prev) => [...prev, detail]);
      }, index * 400);
    });

    // Auto-redirect to STING after 10 seconds
    setTimeout(() => {
      router.push(`/sting?phone=${encodeURIComponent(phoneNumber)}`);
    }, 10000);
  };

  // Countdown timer
  useEffect(() => {
    if (countdownSeconds > 0) {
      const timer = setTimeout(() => {
        setCountdownSeconds(countdownSeconds - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdownSeconds]);

  const handleManualRedirect = () => {
    router.push(`/sting?phone=${encodeURIComponent(phoneNumber)}`);
  };

  return (
    <main ref={mainRef} className="w-full min-h-screen bg-gradient-to-br from-slate-950 via-cyan-950/20 to-slate-950 relative overflow-x-hidden overflow-y-auto">
      {/* ANIMATED BACKGROUND */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
          animate={{ x: [0, 50, -30], y: [0, 30, -50] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-10 right-20 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl"
          animate={{ x: [0, -40, 30], y: [0, -30, 50] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* SCROLLABLE CONTENT WRAPPER */}
      <div className="relative z-20 w-full max-w-3xl px-4 sm:px-6 py-8 sm:py-16 mx-auto">
        
        {/* TOP SECTION - HEADER */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-4">
            <h1 className="text-5xl sm:text-6xl font-black tracking-tighter mb-3">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                SIREN
              </span>
            </h1>
            <p className="text-cyan-300/60 text-sm uppercase tracking-widest font-semibold">
              Forensic Voice AI Engagement System
            </p>
          </div>
        </motion.div>

        {/* MAIN CARD - CENTERED */}
        <motion.div
          className="backdrop-blur-xl bg-gradient-to-br from-cyan-900/25 via-blue-900/25 to-slate-900/25 border border-cyan-500/40 rounded-3xl p-8 sm:p-10 md:p-14 shadow-2xl shadow-cyan-500/10"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          {/* PRE-RECORDING STATE */}
          {!isRecording ? (
            <motion.div className="space-y-8 text-center">
              

              {/* TITLE */}
              <div className="space-y-3">
                <h2 className="text-3xl sm:text-4xl font-black text-white">
                  OPERATION: LURE
                </h2>
                <p className="text-cyan-300/70 text-sm leading-relaxed max-w-lg mx-auto">
                  Engage voice AI to analyze and document suspected scammer behavior. Full conversation forensically logged.
                </p>
              </div>

              {/* START BUTTON */}
              <motion.button
                onClick={handleStartRecording}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black uppercase tracking-widest py-6 sm:py-7 px-8 rounded-2xl text-base sm:text-lg flex items-center justify-center gap-3 transition-all shadow-xl shadow-cyan-500/40 mx-auto max-w-sm"
                whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(34, 211, 238, 0.6)" }}
                whileTap={{ scale: 0.97 }}
              >
                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.6, repeat: Infinity }}>
                  <Mic className="w-6 h-6" />
                </motion.div>
                START RECORDING
              </motion.button>

              {/* INFO BOX */}
              <motion.div
                className="p-4 sm:p-5 bg-gradient-to-br from-cyan-900/30 to-blue-900/20 border border-cyan-500/20 rounded-xl text-center text-sm text-cyan-300/80 backdrop-blur-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p className="leading-relaxed">Clicking will activate voice AI engagement mode and begin forensic conversation logging</p>
              </motion.div>
            </motion.div>

          ) : (
            /* RECORDING/DETAILS STATE */
            <motion.div className="space-y-8">
              

              {/* TITLE */}
              <div className="text-center space-y-2 pb-6 border-b border-cyan-500/20">
                <h2 className="text-2xl sm:text-3xl font-black text-cyan-300">
                  SCAMMER PROFILE DETECTED
                </h2>
                <p className="text-cyan-300/60 text-sm">Details revealing in real-time...</p>
              </div>

              {/* DETAILS GRID - IMPROVED SPACING */}
              {displayedDetails.length > 0 && (
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    {displayedDetails.map((detail, idx) => (
                      <motion.div
                        key={idx}
                        className={`p-5 rounded-2xl border backdrop-blur-sm transition-all ${
                          detail.label === "Risk Level"
                            ? "bg-gradient-to-br from-red-900/30 to-orange-900/20 border-red-500/40 shadow-lg shadow-red-500/10"
                            : detail.label === "Fraud Type"
                            ? "bg-gradient-to-br from-orange-900/30 to-red-900/20 border-orange-500/40 shadow-lg shadow-orange-500/10"
                            : "bg-gradient-to-br from-cyan-900/30 to-blue-900/20 border-cyan-500/40 shadow-lg shadow-cyan-500/10"
                        }`}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                      >
                        <p className="text-xs uppercase tracking-widest font-bold text-cyan-400/70 mb-1.5">
                          {detail.label}
                        </p>
                        <p
                          className={`font-bold text-base ${
                            detail.label === "Risk Level"
                              ? "text-red-400"
                              : detail.label === "Fraud Type"
                              ? "text-orange-400"
                              : "text-cyan-300"
                          }`}
                        >
                          {detail.value}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* AUTO-REDIRECT COUNTDOWN - PROMINENT */}
              <motion.div
                className="p-6 sm:p-7 bg-gradient-to-r from-orange-900/40 via-red-900/30 to-orange-900/40 border border-orange-500/40 rounded-2xl backdrop-blur-sm space-y-4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.6, repeat: Infinity }}>
                    <AlertCircle className="w-5 h-5 text-orange-300" />
                  </motion.div>
                  <span className="text-orange-200 font-bold text-lg">
                    Automatic redirect in {countdownSeconds} second{countdownSeconds !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-orange-900/50 rounded-full overflow-hidden border border-orange-500/30">
                  <motion.div
                    className="h-full bg-gradient-to-r from-orange-400 via-red-400 to-orange-400"
                    initial={{ width: "100%" }}
                    animate={{ width: `${(countdownSeconds / 10) * 100}%` }}
                    transition={{ duration: 0.9, ease: "linear" }}
                  />
                </div>
              </motion.div>

              {/* MANUAL REDIRECT BUTTON */}
              <motion.button
                onClick={handleManualRedirect}
                className="w-full bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 hover:from-orange-500 hover:to-red-500 text-white font-black uppercase tracking-widest py-6 sm:py-7 px-8 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-orange-500/40"
                whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(249, 115, 22, 0.6)" }}
                whileTap={{ scale: 0.97 }}
              >
                PROCEED TO STING
                <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 0.6, repeat: Infinity }}>
                  <ArrowRight className="w-6 h-6" />
                </motion.div>
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        {/* BOTTOM SECTION - FOOTER */}
        <motion.div
          className="text-center mt-12 sm:mt-16 space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-cyan-400/50 text-xs uppercase tracking-widest font-semibold">
            Authorized Law Enforcement Use Only
          </p>
          <p className="text-cyan-400/30 text-xs">
            All conversations logged to conversation_log.txt
          </p>
        </motion.div>

        {/* PAGE NAVIGATION */}
        <motion.div
          className="backdrop-blur-xl bg-gradient-to-br from-cyan-900/25 via-blue-900/25 to-slate-900/25 border border-cyan-500/40 rounded-2xl p-4 sm:p-5 mb-6 w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-cyan-300/60 font-mono">PAGE 1 / 3 - LURE</div>
            <motion.button
              onClick={() => router.push(`/sting?phone=${encodeURIComponent(phoneNumber)}`)}
              className="px-6 py-3 font-bold uppercase tracking-widest rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 border border-cyan-400/50 text-white hover:shadow-lg hover:shadow-cyan-500/30 transition-all text-sm flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              NEXT PAGE
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* SCROLL DOWN BUTTON */}
      <motion.button
        onClick={scrollDown}
        className="fixed bottom-8 right-8 z-30 p-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-full shadow-lg shadow-cyan-500/40 transition-all"
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: showScrollButton ? 1 : 0,
          scale: showScrollButton ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(34, 211, 238, 0.8)" }}
        whileTap={{ scale: 0.9 }}
        disabled={!showScrollButton}
      >
        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </motion.button>
    </main>
  );
}