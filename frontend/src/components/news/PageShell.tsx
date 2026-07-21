import type { ReactNode } from "react";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="news-scope" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-base)" }}>
      <main
        className="px-4 pt-6 pb-16 md:px-6 md:pt-8 md:pb-20 lg:px-8 lg:pt-11 lg:pb-24"
        style={{ flex: 1, width: "100%", maxWidth: 1280, margin: "0 auto" }}
      >
        {children}
      </main>
    </div>
  );
}
