import React, { useState } from 'react';
import { TOPOLOGY_NODES } from '../../data/learnData';

export default function InteractiveTopologyMap({ onOpenLesson }) {
  const [selectedNode, setSelectedNode] = useState(TOPOLOGY_NODES.agents);

  return (
    <div className="relative bg-[#09090D]/90 border border-[#161622] rounded-3xl p-5 shadow-2xl overflow-hidden group">
      {/* Topology Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#161622]/80 text-xs font-mono">
        <div className="flex items-center gap-2 text-white font-medium">
          <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-ping"></span>
          <span>Interactive Knowledge Topology</span>
        </div>
        <span className="text-[#8E8EA0] text-[11px]">Hover / click nodes to inspect</span>
      </div>

      {/* SVG Topology Graph */}
      <div className="relative h-[340px] w-full flex items-center justify-center">
        <svg className="w-full h-full" id="topologySvg" viewBox="0 0 460 340">
          <defs>
            <linearGradient id="gradVioletCyan" x1="0%" x2="100%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="#6E56CF" />
              <stop offset="100%" stopColor="#00E5FF" />
            </linearGradient>
            <linearGradient id="gradAmber" x1="0%" x2="100%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="#F5A623" />
              <stop offset="100%" stopColor="#FF5722" />
            </linearGradient>
            <radialGradient cx="50%" cy="50%" id="nodeGlow" r="50%">
              <stop offset="0%" stopColor="#6E56CF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#6E56CF" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Connection Lines (Underlay) */}
          <g stroke="#1D1D2B" strokeWidth="2">
            <line x1="230" x2="100" y1="170" y2="80" />
            <line x1="230" x2="360" y1="170" y2="70" />
            <line x1="230" x2="110" y1="170" y2="260" />
            <line x1="230" x2="350" y1="170" y2="250" />
            <line x1="100" x2="40" y1="80" y2="150" />
            <line x1="360" x2="410" y1="70" y2="140" />
          </g>

          {/* Pulsing Signal Beams Along Edges */}
          <g fill="none">
            <line className="signal-beam" stroke="url(#gradVioletCyan)" strokeWidth="2" x1="230" x2="100" y1="170" y2="80" />
            <line className="signal-beam-fast" stroke="#00E5FF" strokeWidth="2" x1="230" x2="360" y1="170" y2="70" />
            <line className="signal-beam" stroke="#10B981" strokeWidth="2" x1="230" x2="110" y1="170" y2="260" />
            <line className="signal-beam-fast" stroke="#F5A623" strokeWidth="2" x1="230" x2="350" y1="170" y2="250" />
          </g>

          {/* Peripheral Leaf Nodes */}
          <g 
            className="topo-node" 
            onClick={() => setSelectedNode(TOPOLOGY_NODES.mcp)}
            role="button"
            tabIndex={0}
          >
            <circle cx="40" cy="150" fill="#09090D" r="10" stroke="#6E56CF" strokeWidth="1.5" />
            <text fill="#A1A1B5" fontFamily="JetBrains Mono" fontSize="9" textAnchor="middle" x="40" y="174">MCP</text>
          </g>

          <g 
            className="topo-node" 
            onClick={() => setSelectedNode(TOPOLOGY_NODES.cuda)}
            role="button"
            tabIndex={0}
          >
            <circle cx="410" cy="140" fill="#09090D" r="10" stroke="#F5A623" strokeWidth="1.5" />
            <text fill="#A1A1B5" fontFamily="JetBrains Mono" fontSize="9" textAnchor="middle" x="410" y="164">CUDA</text>
          </g>

          {/* Main Skill Cluster Nodes */}
          {/* Center: Core AI Orbit Engine */}
          <g 
            className="topo-node" 
            onClick={() => setSelectedNode(TOPOLOGY_NODES.hub)}
            role="button"
            tabIndex={0}
          >
            <circle cx="230" cy="170" fill="url(#nodeGlow)" opacity="0.4" r="38" />
            <circle cx="230" cy="170" fill="#09090D" r="24" stroke="#6E56CF" strokeWidth="2" />
            <circle cx="230" cy="170" fill="#6E56CF" r="8" />
            <text fill="#FFFFFF" fontFamily="JetBrains Mono" fontSize="10" fontWeight="bold" textAnchor="middle" x="230" y="206">ORBIT HUB</text>
          </g>

          {/* Node 1: Autonomous Agents (Top Left) */}
          <g 
            className="topo-node" 
            onClick={() => setSelectedNode(TOPOLOGY_NODES.agents)}
            role="button"
            tabIndex={0}
          >
            <circle cx="100" cy="80" fill="#09090D" r="22" stroke="#6E56CF" strokeWidth="2" />
            <circle cx="100" cy="80" fill="#6E56CF" r="7" />
            <circle cx="100" cy="80" fill="none" opacity="0.6" r="28" stroke="#6E56CF" strokeDasharray="3 3" />
            <text fill="#C4B5FD" fontFamily="JetBrains Mono" fontSize="10" fontWeight="600" textAnchor="middle" x="100" y="116">Agents</text>
          </g>

          {/* Node 2: LLM Inference & Systems (Top Right) */}
          <g 
            className="topo-node" 
            onClick={() => setSelectedNode(TOPOLOGY_NODES.inference)}
            role="button"
            tabIndex={0}
          >
            <circle cx="360" cy="70" fill="#09090D" r="22" stroke="#F5A623" strokeWidth="2" />
            <circle cx="360" cy="70" fill="#F5A623" r="7" />
            <text fill="#FBBF24" fontFamily="JetBrains Mono" fontSize="10" fontWeight="600" textAnchor="middle" x="360" y="106">Inference</text>
          </g>

          {/* Node 3: Multimodal & Vision (Bottom Left) */}
          <g 
            className="topo-node" 
            onClick={() => setSelectedNode(TOPOLOGY_NODES.multimodal)}
            role="button"
            tabIndex={0}
          >
            <circle cx="110" cy="260" fill="#09090D" r="20" stroke="#10B981" strokeWidth="2" />
            <circle cx="110" cy="260" fill="#10B981" r="6" />
            <text fill="#34D399" fontFamily="JetBrains Mono" fontSize="10" fontWeight="600" textAnchor="middle" x="110" y="294">Multimodal</text>
          </g>

          {/* Node 4: Embodied Robotics (Bottom Right) */}
          <g 
            className="topo-node" 
            onClick={() => setSelectedNode(TOPOLOGY_NODES.robotics)}
            role="button"
            tabIndex={0}
          >
            <circle cx="350" cy="250" fill="#09090D" r="20" stroke="#00E5FF" strokeWidth="2" />
            <circle cx="350" cy="250" fill="#00E5FF" r="6" />
            <text fill="#67E8F9" fontFamily="JetBrains Mono" fontSize="10" fontWeight="600" textAnchor="middle" x="350" y="284">Robotics</text>
          </g>
        </svg>
      </div>

      {/* Topology Inspector Box */}
      <div className="mt-2 p-3 bg-[#13131C] border border-[#161622] rounded-xl flex items-center justify-between gap-2">
        <div className="space-y-0.5 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-white truncate">
              {selectedNode.title}
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#6E56CF]/20 text-[#C4B5FD] shrink-0">
              {selectedNode.badge}
            </span>
          </div>
          <p className="text-[11px] text-[#8E8EA0] line-clamp-1 font-sans">
            {selectedNode.desc}
          </p>
        </div>
        <button 
          className="px-3 py-1.5 rounded-lg bg-[#6E56CF]/20 hover:bg-[#6E56CF] text-white text-[11px] font-mono shrink-0 transition-colors cursor-pointer"
          onClick={() => onOpenLesson(selectedNode.lessonId)}
        >
          Launch Node →
        </button>
      </div>

      {/* Dossier Index Matrix (Live Telemetry) */}
      <div className="mt-3 p-4 bg-[#13131C]/90 border border-[#161622]/80 rounded-xl space-y-3 font-mono">
        <div className="flex items-center justify-between text-xs pb-2 border-b border-[#161622]/70">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-wider text-white uppercase">DOSSIER INDEX MATRIX</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>LIVE TELEMETRY</span>
          </div>
        </div>

        <div className="space-y-1.5 text-[11px]">
          <div className="flex items-center justify-between">
            <span className="text-[#8E8EA0]">ACTIVE DISCIPLINE:</span>
            <span className="font-bold text-white">Agentic AI <span className="text-[#6E56CF] text-[10px] font-normal">(Level 03)</span></span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#8E8EA0]">UNLOCKED KERNELS:</span>
            <span className="font-bold text-[#00E5FF]">18 / 24 Modules</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#8E8EA0]">PRODUCTION BENCHMARK:</span>
            <span className="font-bold text-[#F5A623]">P99 84ms Latency</span>
          </div>
        </div>

        <div className="pt-2 border-t border-[#161622]/60 flex items-center justify-between text-[10px]">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <span className="text-[#6E56CF] font-semibold">Prompt</span>
            <span className="text-zinc-600">→</span>
            <span className="px-2 py-0.5 rounded bg-[#09090D] border border-[#161622] text-white font-medium">ReAct Checkpoint</span>
            <span className="text-zinc-600">→</span>
            <span className="text-emerald-400 font-semibold">Tool Execution</span>
          </div>
        </div>
      </div>
    </div>
  );
}
