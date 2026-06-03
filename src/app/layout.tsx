import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ResolveIQ — AI Customer Support Copilot",
  description: "Enterprise SaaS dashboard providing support agents with real-time AI ticket summarization, category classification, suggested responses, and escalation recommendations.",
};

export default function RootLayout({
  children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <html lang="en" className="h-full scroll-smooth" suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900 antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
