"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface AudioWaveformProps {
  isActive?: boolean;
  intensity?: number; // 0-100, controls amplitude
}

export default function AudioWaveform({ isActive = true, intensity = 50 }: AudioWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let dataArray: Uint8Array = new Uint8Array(128);
    let offset = 0;

    const animate = () => {
      // Clear canvas
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid background
      ctx.strokeStyle = "rgba(34, 197, 94, 0.1)";
      ctx.lineWidth = 0.5;
      const gridSize = 20;
      for (let i = 0; i < canvas.width; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Simulate audio data with animated sine wave
      if (isActive) {
        for (let i = 0; i < dataArray.length; i++) {
          const frequency = (i / dataArray.length) * Math.PI * 2;
          const amplitude = Math.sin(offset * 0.02 + frequency) * (intensity / 100) * 100 + 50;
          dataArray[i] = Math.max(0, Math.min(255, amplitude));
        }
        offset++;
      } else {
        dataArray.fill(128); // Flat line when inactive
      }

      // Draw waveform
      const barWidth = canvas.width / dataArray.length;
      ctx.fillStyle = isActive ? "rgba(34, 197, 94, 0.8)" : "rgba(34, 197, 94, 0.3)";
      ctx.shadowColor = isActive ? "rgba(34, 197, 94, 0.6)" : "transparent";
      ctx.shadowBlur = isActive ? 15 : 0;

      for (let i = 0; i < dataArray.length; i++) {
        const barHeight = (dataArray[i] / 255) * (canvas.height * 0.7);
        const x = i * barWidth;
        const y = canvas.height / 2 - barHeight / 2;

        ctx.fillRect(x, y, barWidth - 1, barHeight);
      }

      // Draw center line
      ctx.strokeStyle = "rgba(34, 197, 94, 0.3)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationId);
  }, [isActive, intensity]);

  return (
    <div className="relative w-full h-full bg-black border-2 border-siren-green/50 rounded-lg overflow-hidden shadow-[0_0_30px_rgba(34,197,94,0.2)]">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-siren-green/10 border-b border-siren-green/30 flex items-center px-4 justify-between z-20">
        <span className="text-xs font-mono text-siren-green tracking-widest">AUDIO_STREAM_ANALYSIS</span>
        <div className="flex items-center gap-2">
          {isActive && (
            <>
              <motion.div
                className="w-2 h-2 rounded-full bg-red-500"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <span className="text-[10px] text-red-500 font-mono">LIVE</span>
            </>
          )}
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        className="absolute inset-0 top-8 w-full h-[calc(100%-32px)]"
      />

      {/* Footer Info */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-siren-green/5 border-t border-siren-green/20 flex items-center px-4 z-20 text-[10px] font-mono text-siren-green/60">
        <span>Frequency Range: 20Hz - 20kHz | Real-time Monitoring Active</span>
      </div>
    </div>
  );
}
