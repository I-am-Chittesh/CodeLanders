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
    <html lang="en" className="dark h-screen overflow-hidden">
      <body className="h-screen w-screen bg-black text-green-500 font-mono relative selection:bg-green-900 selection:text-white overflow-hidden">
        <div className="scanline fixed inset-0 pointer-events-none z-50 mix-blend-overlay opacity-20"></div>
        <div className="h-screen w-screen overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}