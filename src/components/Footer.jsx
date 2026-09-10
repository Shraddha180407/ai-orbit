import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from './BrandLogo';
import { ArrowUp, Sparkles, MessageSquare } from 'lucide-react';

export default function Footer() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let offset = 0;

    const resize = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      }
    };
    resize();
    window.addEventListener('resize', resize);

    const message = "AI ORBIT • THE HOME OF EVERYTHING AI • BENCHMARK EVALUATION • AUTONOMOUS AGENTS • ROBOTICS • ";
    const dotSpacing = 14;
    const dotRadius = 1.6;

    const render = () => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const rows = Math.floor(canvas.height / dotSpacing);
      const cols = Math.floor(canvas.width / dotSpacing);

      // Draw background ambient LED dot-matrix
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * dotSpacing + dotSpacing / 2;
          const y = r * dotSpacing + dotSpacing / 2;
          ctx.beginPath();
          ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
          ctx.fillStyle = '#141418';
          ctx.fill();
        }
      }

      // Draw glowing marquee text
      offset -= 0.7;
      ctx.font = 'bold 24px "JetBrains Mono", monospace';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';

      const totalWidth = 1400;
      const textX = (offset % totalWidth);

      ctx.shadowBlur = 10;
      ctx.shadowColor = '#6E56CF';
      ctx.fillText(message, textX, canvas.height / 2);
      ctx.fillText(message, textX + totalWidth, canvas.height / 2);
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-black text-white pt-0 pb-8 font-sans selection:bg-[#6E56CF]/30 border-t border-[#1C1C1F]">
      {/* Signature Animated LED Dot-Matrix Display matching original aiorbit.club */}
      <section 
        aria-label="AI Orbit LED display" 
        className="w-full bg-black border-b border-[#1C1C1F] overflow-hidden" 
        style={{ height: 'clamp(90px, 12vw, 160px)' }}
      >
        <canvas ref={canvasRef} className="block w-full h-full" />
      </section>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 pt-10 sm:pt-14">
        <div className="flex flex-col lg:flex-row justify-between gap-10 lg:gap-16 pb-12">
          {/* Brand Col */}
          <div className="w-full lg:w-[380px] shrink-0">
            <Link to="/" className="flex items-center mb-3 group w-fit">
              <BrandLogo size="lg" />
            </Link>
            <p className="text-[14px] font-medium text-[#E4E4E7] mb-2">The Home of Everything AI.</p>
            <p className="text-[13px] leading-relaxed text-[#A1A1AA] mb-6 max-w-[340px]">
              Discover, compare, and explore the cutting-edge humanoid agents, robotics hardware, foundation models, and business AI tools shaping the global ecosystem.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {/* X / Twitter */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg border border-[#232326] bg-[#131316] flex items-center justify-center text-[#A1A1AA] hover:text-white hover:border-[#3f3f46] hover:bg-[#1a1a20] transition-all"
                aria-label="X (Twitter)"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"></path>
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg border border-[#232326] bg-[#131316] flex items-center justify-center text-[#A1A1AA] hover:text-white hover:border-[#3f3f46] hover:bg-[#1a1a20] transition-all"
                aria-label="LinkedIn"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
                </svg>
              </a>

              {/* Discord */}
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg border border-[#232326] bg-[#131316] flex items-center justify-center text-[#A1A1AA] hover:text-white hover:border-[#3f3f46] hover:bg-[#1a1a20] transition-all"
                aria-label="Discord"
              >
                <MessageSquare size={15} />
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg border border-[#232326] bg-[#131316] flex items-center justify-center text-[#A1A1AA] hover:text-white hover:border-[#3f3f46] hover:bg-[#1a1a20] transition-all"
                aria-label="YouTube"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path>
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg border border-[#232326] bg-[#131316] flex items-center justify-center text-[#A1A1AA] hover:text-white hover:border-[#3f3f46] hover:bg-[#1a1a20] transition-all"
                aria-label="Instagram"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm3.98-10.169a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* 4 Link Columns matching AI Orbit */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-6">
            <div>
              <div className="mb-4">
                <h4 className="text-[11px] font-bold text-white tracking-[0.08em] uppercase mb-2">EXPLORE</h4>
                <div className="h-px w-12 bg-[#3f3f46]"></div>
              </div>
              <ul className="space-y-2.5 text-[13px]">
                <li><Link to="/" className="text-[#A1A1AA] hover:text-white transition-colors">AI Robots</Link></li>
                <li><Link to="/business" className="text-[#A1A1AA] hover:text-white transition-colors">Business AI</Link></li>
                <li><Link to="/leaderboard" className="text-[#A1A1AA] hover:text-white transition-colors">Leaderboard</Link></li>
                <li><Link to="/companies" className="text-[#A1A1AA] hover:text-white transition-colors">AI Companies</Link></li>
                <li><Link to="/learn" className="text-[#A1A1AA] hover:text-white transition-colors">AI Academy</Link></li>
              </ul>
            </div>

            <div>
              <div className="mb-4">
                <h4 className="text-[11px] font-bold text-white tracking-[0.08em] uppercase mb-2">ROBOTICS SPECS</h4>
                <div className="h-px w-12 bg-[#3f3f46]"></div>
              </div>
              <ul className="space-y-2.5 text-[13px]">
                <li><span className="text-[#A1A1AA] hover:text-white transition-colors cursor-pointer">Bipedal Humanoids</span></li>
                <li><span className="text-[#A1A1AA] hover:text-white transition-colors cursor-pointer">Quadruped Platforms</span></li>
                <li><span className="text-[#A1A1AA] hover:text-white transition-colors cursor-pointer">Wheeled Agents</span></li>
                <li><span className="text-[#A1A1AA] hover:text-white transition-colors cursor-pointer">Bimanual Manipulators</span></li>
                <li><span className="text-[#A1A1AA] hover:text-white transition-colors cursor-pointer">Actuators & Sensors</span></li>
              </ul>
            </div>

            <div>
              <div className="mb-4">
                <h4 className="text-[11px] font-bold text-white tracking-[0.08em] uppercase mb-2">ECOSYSTEM</h4>
                <div className="h-px w-12 bg-[#3f3f46]"></div>
              </div>
              <ul className="space-y-2.5 text-[13px]">
                <li><Link to="/tasks" className="text-[#A1A1AA] hover:text-white transition-colors">Task Finder</Link></li>
                <li><span className="text-[#A1A1AA] hover:text-white transition-colors cursor-pointer">MCP Directory</span></li>
                <li><span className="text-[#A1A1AA] hover:text-white transition-colors cursor-pointer">ROS 2 Bridges</span></li>
                <li><span className="text-[#A1A1AA] hover:text-white transition-colors cursor-pointer">Submit AI Robot</span></li>
                <li><span className="text-[#A1A1AA] hover:text-white transition-colors cursor-pointer">Advertise With Us</span></li>
              </ul>
            </div>

            <div>
              <div className="mb-4">
                <h4 className="text-[11px] font-bold text-white tracking-[0.08em] uppercase mb-2">COMPANY</h4>
                <div className="h-px w-12 bg-[#3f3f46]"></div>
              </div>
              <ul className="space-y-2.5 text-[13px]">
                <li><span className="text-[#A1A1AA] hover:text-white transition-colors cursor-pointer">About AI Orbit</span></li>
                <li><span className="text-[#A1A1AA] hover:text-white transition-colors cursor-pointer">Contact & Support</span></li>
                <li><span className="text-[#A1A1AA] hover:text-white transition-colors cursor-pointer">Press Kit</span></li>
                <li><span className="text-[#A1A1AA] hover:text-white transition-colors cursor-pointer">Privacy Policy</span></li>
                <li><span className="text-[#A1A1AA] hover:text-white transition-colors cursor-pointer">Terms of Service</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom copyright and Scroll to Top */}
        <div className="pt-6 border-t border-[#27272A] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[13px] text-[#71717A] text-center sm:text-left">
            © 2026 AI Orbit Inc. All rights reserved. The Home of Everything AI.
          </p>
          <button
            onClick={scrollToTop}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#3F3F46] bg-[#131316] hover:bg-white/10 hover:border-white/20 active:scale-95 transition-all text-white cursor-pointer"
            aria-label="Scroll to top"
            title="Back to top"
          >
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
}
