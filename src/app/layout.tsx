import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SecureMind AI — Predictive Employee Behavior Intelligence Platform",
  description: "Predict. Prevent. Protect. Proactive banking security through AI-powered digital twins.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#F8FAFC] text-[#1E293B] font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
