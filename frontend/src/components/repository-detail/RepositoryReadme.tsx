'use client';

import React from "react";

interface RepositoryReadmeProps {
  readmeHtml?: string;
  repoOwner?: string;
  repoName?: string;
  repoDefaultBranch?: string;
}

export function preprocessReadmeHtml(
  html: string,
  owner: string,
  name: string,
  defaultBranch?: string
): string {
  if (!html) return "";
  const branch = defaultBranch || "main";
  const rawBase = `https://raw.githubusercontent.com/${owner}/${name}/${branch}`;
  const githubBase = `https://github.com/${owner}/${name}/blob/${branch}`;

  // 1. Rewrite relative img src: src="path" (excluding absolute protocols and data URLs)
  let processed = html.replace(
    /(<img\b[^>]*?\bsrc=["'])(?!https?:\/\/|data:|:\/\/)([^"']+)(["'])/gi,
    (match, p1, p2, p3) => {
      const relativePath = p2.startsWith("/") ? p2 : `/${p2}`;
      return `${p1}${rawBase}${relativePath}${p3}`;
    }
  );

  // 2. Rewrite relative srcset attributes: srcset="path"
  processed = processed.replace(
    /(<source\b[^>]*?\bsrcset=["'])(?!https?:\/\/|data:|:\/\/)([^"']+)(["'])/gi,
    (match, p1, p2, p3) => {
      const relativePath = p2.startsWith("/") ? p2 : `/${p2}`;
      return `${p1}${rawBase}${relativePath}${p3}`;
    }
  );

  processed = processed.replace(
    /(<img\b[^>]*?\bsrcset=["'])(?!https?:\/\/|data:|:\/\/)([^"']+)(["'])/gi,
    (match, p1, p2, p3) => {
      const relativePath = p2.startsWith("/") ? p2 : `/${p2}`;
      return `${p1}${rawBase}${relativePath}${p3}`;
    }
  );

  // 3. Rewrite relative link href: href="path" (excluding absolute protocols and hashes)
  processed = processed.replace(
    /(<a\b[^>]*?\bhref=["'])(?!https?:\/\/|data:|:\/\/|#)([^"']+)(["'])/gi,
    (match, p1, p2, p3) => {
      const relativePath = p2.startsWith("/") ? p2 : `/${p2}`;
      return `${p1}${githubBase}${relativePath}${p3} target="_blank" rel="noopener noreferrer"`;
    }
  );

  // 4. Ensure all external links open in new tabs with secure headers
  processed = processed.replace(
    /(<a\b[^>]*?\bhref=["'])(https?:\/\/|\/\/)([^"']+)(["'])([^>]*)/gi,
    (match, p1, p2, p3, p4, p5) => {
      if (p5.includes("target=")) return match;
      return `${p1}${p2}${p3}${p4} target="_blank" rel="noopener noreferrer"${p5}`;
    }
  );

  return processed;
}

export function RepositoryReadme({ readmeHtml, repoOwner, repoName, repoDefaultBranch }: RepositoryReadmeProps) {
  if (!readmeHtml || readmeHtml.trim() === "") {
    return (
      <section className="relative z-10 rounded-xl border border-white/[0.08] bg-[#131316] p-6 md:p-8 shadow-md">
        <h2 className="text-lg font-bold text-white mb-4">README</h2>
        <p className="text-sm text-white/40">README is not available for this repository.</p>
      </section>
    );
  }

  // Preprocess HTML string before rendering to prevent preload scanners from requesting relative paths
  const processedHtml = (repoOwner && repoName)
    ? preprocessReadmeHtml(readmeHtml, repoOwner, repoName, repoDefaultBranch)
    : readmeHtml;

  return (
    <section className="relative z-10 rounded-xl border border-white/[0.08] bg-[#131316] p-6 md:p-8 shadow-md">
      <h2 className="text-lg font-bold text-white mb-6 border-b border-white/10 pb-4">README</h2>
      
      <div 
        className="readme-content"
        dangerouslySetInnerHTML={{ __html: processedHtml }}
      />

      <style jsx global>{`
        .readme-content {
          color: rgba(255, 255, 255, 0.75);
          line-height: 1.65;
          font-size: 0.875rem; /* 14px */
        }
        
        /* Left-align all elements that use align="center" placeholders */
        .readme-content [align="center"],
        .readme-content div[align="center"] {
          text-align: left !important;
        }

        .readme-content h1,
        .readme-content h2,
        .readme-content h3,
        .readme-content h4,
        .readme-content h5,
        .readme-content h6 {
          color: #ffffff;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 0.875rem;
          line-height: 1.3;
        }
        .readme-content h1 { font-size: 1.625rem; border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 0.5rem; }
        .readme-content h2 { font-size: 1.375rem; border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 0.5rem; }
        .readme-content h3 { font-size: 1.2rem; }
        .readme-content h4 { font-size: 1.05rem; }
        .readme-content h5 { font-size: 0.95rem; }
        .readme-content h6 { font-size: 0.875rem; color: rgba(255, 255, 255, 0.55); }

        .readme-content p {
          margin-top: 0rem;
          margin-bottom: 1.25rem;
        }

        .readme-content a {
          color: #3b82f6;
          text-decoration: none;
          transition: color 0.15s ease-in-out;
        }
        .readme-content a:hover {
          color: #60a5fa;
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .readme-content ul,
        .readme-content ol {
          margin-top: 0;
          margin-bottom: 1.25rem;
          padding-left: 1.75rem;
        }
        .readme-content ul {
          list-style-type: disc;
        }
        .readme-content ol {
          list-style-type: decimal;
        }
        .readme-content li {
          margin-top: 0.35rem;
          margin-bottom: 0.35rem;
        }

        .readme-content blockquote {
          margin: 1.25rem 0;
          padding: 0.25rem 1.25rem;
          color: rgba(255, 255, 255, 0.55);
          background-color: rgba(255, 255, 255, 0.02);
          border-left: 4px solid #3b82f6;
          border-radius: 0 0.375rem 0.375rem 0;
        }

        .readme-content pre {
          margin-top: 1.25rem;
          margin-bottom: 1.25rem;
          padding: 1.25rem;
          overflow-x: auto;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 0.8125rem;
          background-color: rgba(0, 0, 0, 0.45);
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
          margin-top: 1.25rem;
          margin-bottom: 1.25rem;
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
          padding: 8px 14px;
          border: 1px solid rgba(255, 255, 255, 0.12);
        }
        .readme-content th {
          font-weight: 600;
          color: #ffffff;
          background-color: rgba(255, 255, 255, 0.04);
        }

        .readme-content img {
          max-width: 100%;
          box-sizing: border-box;
          background-color: transparent;
          border-radius: 0.5rem;
          height: auto;
          margin: 1rem 0;
        }

        .readme-content hr {
          height: 0.25em;
          padding: 0;
          margin: 28px 0;
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
