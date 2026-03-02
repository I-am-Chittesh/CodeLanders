"use client";

import { motion } from "framer-motion";
import { MapPin, AlertTriangle, Phone } from "lucide-react";

interface TargetIntelProps {
  phoneNumber: string;
  riskScore: number; // 0-100
  location?: {
    city: string;
    country: string;
    lat: number;
    lng: number;
  };
}

export default function TargetIntel({ phoneNumber, riskScore, location }: TargetIntelProps) {
  const getRiskColor = (score: number) => {
    if (score < 30) return "text-green-500";
    if (score < 70) return "text-yellow-500";
    return "text-red-500";
  };

  const getRiskBgColor = (score: number) => {
    if (score < 30) return "bg-green-950/30 border-green-500/50";
    if (score < 70) return "bg-yellow-950/30 border-yellow-500/50";
    return "bg-red-950/30 border-red-500/50";
  };

  const getRiskLabel = (score: number) => {
    if (score < 30) return "LOW";
    if (score < 70) return "MEDIUM";
    return "CRITICAL";
  };

  return (
    <div className="h-full flex flex-col gap-4">
      {/* TARGET PHONE */}
      <div className="bg-black/90 border border-siren-green/30 rounded-lg p-4 shadow-[0_0_30px_rgba(34,197,94,0.1)]">
        <div className="flex items-center gap-2 mb-3 text-siren-green text-xs font-mono tracking-widest">
          <Phone className="w-4 h-4" />
          TARGET_PHONE
        </div>
        <div className="text-2xl font-mono font-bold text-siren-green break-all">
          {phoneNumber}
        </div>
        <p className="text-[10px] text-siren-green/60 mt-2 font-mono">
          {new Date().toLocaleString()}
        </p>
      </div>

      {/* RISK SCORE GAUGE */}
      <motion.div
        className={`bg-black/90 border-2 rounded-lg p-4 shadow-[0_0_30px_rgba(34,197,94,0.1)] ${getRiskBgColor(riskScore)}`}
        animate={{
          borderColor: riskScore > 70 ? "rgba(239, 68, 68, 0.5)" : "rgba(34, 197, 94, 0.3)",
        }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono text-siren-green tracking-widest">RISK_SCORE</span>
          <motion.span
            className={`text-2xl font-mono font-bold ${getRiskColor(riskScore)}`}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
          >
            {riskScore}%
          </motion.span>
        </div>

        {/* Risk Bar */}
        <div className="relative h-3 bg-black/50 rounded-full overflow-hidden border border-gray-700 mb-3">
          <motion.div
            className={`h-full transition-colors duration-500 ${
              riskScore < 30
                ? "bg-green-500"
                : riskScore < 70
                ? "bg-yellow-500"
                : "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]"
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${riskScore}%` }}
            transition={{ type: "spring", stiffness: 30 }}
          />
        </div>

        <div className="flex justify-between text-[10px] font-mono text-gray-600 mb-2">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>

        <div className="text-center">
          <span className={`text-sm font-mono font-bold tracking-widest ${getRiskColor(riskScore)}`}>
            {getRiskLabel(riskScore)} THREAT LEVEL
          </span>
        </div>
      </motion.div>

      {/* LOCATION DATA */}
      <div className="bg-black/90 border border-siren-green/30 rounded-lg p-4 shadow-[0_0_30px_rgba(34,197,94,0.1)] flex-1">
        <div className="flex items-center gap-2 mb-3 text-siren-green text-xs font-mono tracking-widest">
          <MapPin className="w-4 h-4" />
          LOCATION_DATA
        </div>

        {location ? (
          <>
            <div className="space-y-2 mb-4">
              <div className="bg-siren-dark border border-siren-green/20 rounded p-2">
                <p className="text-[10px] text-siren-green/60 font-mono mb-1">CITY</p>
                <p className="text-sm text-siren-green font-mono font-bold">{location.city}</p>
              </div>
              <div className="bg-siren-dark border border-siren-green/20 rounded p-2">
                <p className="text-[10px] text-siren-green/60 font-mono mb-1">COUNTRY</p>
                <p className="text-sm text-siren-green font-mono font-bold">{location.country}</p>
              </div>
            </div>

            {/* Mini Map Simulation */}
            <div className="relative w-full h-32 bg-black border border-siren-green/20 rounded overflow-hidden">
              <div className="w-full h-full relative">
                {/* Grid */}
                <svg className="absolute inset-0 w-full h-full opacity-10" preserveAspectRatio="none">
                  <defs>
                    <pattern
                      id="grid"
                      width="10"
                      height="10"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 10 0 L 0 0 0 10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="0.5"
                        className="text-siren-green"
                      />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>

                {/* Target Pin */}
                <motion.div
                  className="absolute w-3 h-3 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.8)]"
                  style={{
                    top: `${((location.lat + 90) / 180) * 100}%`,
                    left: `${((location.lng + 180) / 360) * 100}%`,
                  }}
                  animate={{
                    scale: [1, 1.3, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                />

                {/* Coordinates */}
                <div className="absolute bottom-1 left-1 text-[8px] font-mono text-siren-green/40">
                  {location.lat.toFixed(2)}°N, {location.lng.toFixed(2)}°E
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center opacity-30 text-center">
            <p className="text-xs font-mono text-siren-green">LOCATION DATA UNAVAILABLE</p>
          </div>
        )}
      </div>
    </div>
  );
}
