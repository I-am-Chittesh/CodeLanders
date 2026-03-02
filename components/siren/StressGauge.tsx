"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StressGaugeProps {
  level: number; // 0 to 100
}

export default function StressGauge({ level }: StressGaugeProps) {
  // Determine color based on stress level
  const getColor = (lvl: number) => {
    if (lvl < 30) return "bg-green-500";
    if (lvl < 70) return "bg-yellow-500";
    return "bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.6)]";
  };

  return (
    <div className="w-full bg-black/90 border border-gray-800 p-4 rounded-lg">
      <div className="flex justify-between items-end mb-2">
        <span className="text-xs font-mono text-gray-400">TARGET_STRESS_LEVEL</span>
        <span className="text-2xl font-bold font-mono text-white">{level}%</span>
      </div>
      
      {/* The Bar Container */}
      <div className="h-4 w-full bg-gray-900 rounded-full overflow-hidden border border-gray-800 relative">
        {/* Grid lines overlay */}
        <div className="absolute inset-0 z-10 grid grid-cols-10 pointer-events-none">
            {[...Array(10)].map((_, i) => (
                <div key={i} className="border-r border-black/40 h-full"></div>
            ))}
        </div>

        {/* The Fill Animation */}
        <motion.div 
          className={cn("h-full transition-colors duration-500", getColor(level))}
          initial={{ width: 0 }}
          animate={{ width: `${level}%` }}
          transition={{ type: "spring", stiffness: 50 }}
        />
      </div>

      <div className="flex justify-between mt-2 text-[10px] text-gray-500 font-mono">
        <span>CALM</span>
        <span>AGITATED</span>
        <span>PANIC</span>
      </div>
    </div>
  );
}