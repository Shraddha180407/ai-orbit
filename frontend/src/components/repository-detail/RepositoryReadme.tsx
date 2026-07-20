'use client';

import React, { useEffect, useRef } from "react";

interface RepositoryReadmeProps {
  readmeHtml?: string;
}

export function RepositoryReadme({ readmeHtml }: RepositoryReadmeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !readmeHtml) return;
    
    // Intercept outbound links inside the injected HTML to open safely in new tabs
    const links = containerRef.current.getElementsByTagName("a");
    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      const href = link.getAttribute("href");
      if (href && (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("//"))) {
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
      }
    }
  }, [readmeHtml]);

  if (!readmeHtml || readmeHtml.trim() === "") {
    return (
      <section className="relative z-10 rounded-xl border border-white/[0.08] bg-[#131316] p-6 md:p-8 shadow-md">
        <h2 className="text-lg font-bold text-white mb-4">README</h2>
        <p className="text-sm text-white/40">README is not available for this repository.</p>
      </section>
    );
  }

  return (
    <section className="relative z-10 rounded-xl border border-white/[0.08] bg-[#131316] p-6 md:p-8 shadow-md">
      <h2 className="text-lg font-bold text-white mb-6 border-b border-white/10 pb-4">README</h2>
      
      <div 
        ref={containerRef}
        className="readme-content"
        dangerouslySetInnerHTML={{ __html: readmeHtml }}
      />

      <style jsx global>{`
        .readme-content {
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.625;
          font-size: 0.875rem; /* 14px */
        }
        .readme-content h1,
        .readme-content h2,
        .readme-content h3,
        .readme-content h4,
        .readme-content h5,
        .readme-content h6 {
          color: #ffffff;
          font-weight: 700;
          margin-top: 1.75rem;
          margin-bottom: 0.75rem;
          line-height: 1.35;
        }
        .readme-content h1 { font-size: 1.5rem; border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 0.375rem; }
        .readme-content h2 { font-size: 1.25rem; border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 0.375rem; }
        .readme-content h3 { font-size: 1.125rem; }
        .readme-content h4 { font-size: 1rem; }
        .readme-content h5 { font-size: 0.875rem; }
        .readme-content h6 { font-size: 0.875rem; color: rgba(255, 255, 255, 0.5); }

        .readme-content p {
          margin-top: 0rem;
          margin-bottom: 1rem;
        }

        .readme-content a {
          color: #60a5fa;
          text-decoration: underline;
          text-underline-offset: 2px;
          transition: color 0.2s ease;
        }
        .readme-content a:hover {
          color: #93c5fd;
        }

        .readme-content ul,
        .readme-content ol {
          margin-top: 0;
          margin-bottom: 1rem;
          padding-left: 1.5rem;
        }
        .readme-content ul {
          list-style-type: disc;
        }
        .readme-content ol {
          list-style-type: decimal;
        }
        .readme-content li {
          margin-top: 0.25rem;
          margin-bottom: 0.25rem;
        }

        .readme-content blockquote {
          margin: 1rem 0;
          padding: 0 1rem;
          color: rgba(255, 255, 255, 0.5);
          border-left: 4px solid rgba(255, 255, 255, 0.15);
        }

        .readme-content pre {
          margin-top: 1rem;
          margin-bottom: 1rem;
          padding: 1rem;
          overflow-x: auto;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 0.8125rem;
          background-color: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 0.5rem;
          white-space: pre;
          word-wrap: normal;
        }
        .readme-content code {
          padding: 0.2em 0.4em;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 0.8125rem;
          background-color: rgba(255, 255, 255, 0.08);
          border-radius: 0.25rem;
          color: #e2e8f0;
        }
        .readme-content pre code {
          padding: 0;
          font-size: inherit;
          color: inherit;
          background-color: transparent;
          border-radius: 0;
        }

        .readme-content table {
          display: block;
          width: 100%;
          max-width: 100%;
          overflow-x: auto;
          margin-top: 1rem;
          margin-bottom: 1rem;
          border-collapse: collapse;
        }
        .readme-content tr {
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          background-color: transparent;
        }
        .readme-content tr:nth-child(2n) {
          background-color: rgba(255, 255, 255, 0.02);
        }
        .readme-content th,
        .readme-content td {
          padding: 6px 13px;
          border: 1px solid rgba(255, 255, 255, 0.12);
        }
        .readme-content th {
          font-weight: 600;
          color: #ffffff;
        }

        .readme-content img {
          max-width: 100%;
          box-sizing: border-box;
          background-color: transparent;
          border-radius: 0.375rem;
          height: auto;
        }

        .readme-content hr {
          height: 0.25em;
          padding: 0;
          margin: 24px 0;
          background-color: rgba(255, 255, 255, 0.08);
          border: 0;
        }

        .readme-content strong {
          color: #ffffff;
          font-weight: 600;
        }
        .readme-content em {
          font-style: italic;
        }
      `}</style>
    </section>
  );
}
