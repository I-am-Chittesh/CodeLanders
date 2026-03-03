"use client";

import { Suspense } from "react";
import VaultPageContent from "./content";

export default function VaultPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <VaultPageContent />
    </Suspense>
  );
}
