import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SIREN // ACTIVE DEFENSE",
  description: "Forensic Voice AI Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-black text-green-500 font-mono min-h-screen selection:bg-green-900 selection:text-white">
        <div className="scanline absolute inset-0 pointer-events-none z-50 mix-blend-overlay opacity-20"></div>
        {children}
      </body>
    </html>
  );
}