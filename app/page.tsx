"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to LURE page on mount
    router.push("/lure");
  }, [router]);

  return null;
}