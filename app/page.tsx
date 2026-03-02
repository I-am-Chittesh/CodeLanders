'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background Grid Effect */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 pointer-events-none" />

      {/* Hero Section */}
      <div className="z-10 max-w-2xl text-center space-y-8">
        
        {/* Logo */}
        <div className="flex items-center justify-center space-x-3">
          <ShieldAlert className="w-10 h-10 text-red-600" />
          <h1 className="text-5xl font-bold tracking-tighter">
            <span className="text-gray-200">SIREN</span>
            <span className="text-red-600 ml-3">PROTOCOL</span>
          </h1>
        </div>

        {/* Tagline */}
        <p className="text-gray-400 text-lg font-light">
          Semantic Interaction & Response for Extracting Nodes
        </p>

        {/* Description */}
        <p className="text-gray-500 text-sm leading-relaxed">
          An autonomous forensic voice AI designed for Banks and Law Enforcement. 
          Instead of passively blocking scams, SIREN engages fraudsters to extract 
          money-laundering accounts and generate actionable intelligence.
        </p>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 py-8 text-sm">
          <div className="p-4 bg-gray-900/50 rounded border border-gray-800">
            <p className="text-gray-400">Real-Time Voice</p>
            <p className="text-green-400">Sub-100ms Latency</p>
          </div>
          <div className="p-4 bg-gray-900/50 rounded border border-gray-800">
            <p className="text-gray-400">Vector Intelligence</p>
            <p className="text-green-400">Pattern Detection</p>
          </div>
          <div className="p-4 bg-gray-900/50 rounded border border-gray-800">
            <p className="text-gray-400">Autonomous Dispatch</p>
            <p className="text-green-400">Police Integration</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link
            href="/lure"
            className="px-8 py-3 bg-red-600 hover:bg-red-700 rounded font-semibold flex items-center justify-center space-x-2 transition"
          >
            <span>Access Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/vault"
            className="px-8 py-3 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded font-semibold transition"
          >
            View Evidence Vault
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 text-center text-gray-600 text-xs z-10">
        <p>SIREN v1.0 • Geminathon © 2026</p>
        <p>CodeLanders • VIT</p>
      </div>
    </main>
  );
}
