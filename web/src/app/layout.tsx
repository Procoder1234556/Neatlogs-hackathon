import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ProspectForge — Autonomous B2B Prospecting Agent",
  description: "Autonomous B2B research & verified outreach agent powered by neatlogs, Crustdata, Entire & cfo.ai.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#ECEEF6] text-[#14161C]">
        {children}
      </body>
    </html>
  );
}
