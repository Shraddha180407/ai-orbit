import type { Metadata } from "next";
import "./globals.css";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: {
    default: "The AI Signal — Discover the AI Ecosystem",
    template: "%s | The AI Signal",
  },
  description:
    "Discover, compare, and explore the best AI tools, companies, models, and repositories in the global ecosystem.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth">
      <body className="font-sans">
        <ReactQueryProvider>
          <main className="relative flex flex-col min-h-screen w-full">
            {children}
            <Toaster />
          </main>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
