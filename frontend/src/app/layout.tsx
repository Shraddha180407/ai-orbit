import type { Metadata, Viewport } from "next";
import "./globals.css";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";
import { Toaster } from "@/components/ui/toaster";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: {
    default: "AI Orbit — Discover the AI Ecosystem",
    template: "%s | AI Orbit",
  },
  description:
    "Discover, compare, and explore the best AI tools, companies, models, and repositories in the global ecosystem.",
};

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth">
      <body className="font-sans bg-black text-white selection:bg-white/30">
        <ReactQueryProvider>
          <main className="relative flex flex-col min-h-screen w-full max-w-full overflow-x-clip">
            <Header />
            <div className="flex-1 flex flex-col w-full max-w-full overflow-x-clip">
              {children}
            </div>
            <Footer />
            <Toaster />
          </main>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
