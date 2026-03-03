"use client";

import { Suspense } from "react";
import StingPageContent from "./content.tsx";

export default function StingPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <StingPageContent />
    </Suspense>
  );
}