import React from 'react';
import { Link } from 'react-router-dom';
import { 
  X, 
  ExternalLink, 
  Weight, 
  Battery, 
  Layers, 
  Cpu, 
  Star, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Building
} from 'lucide-react';

export default function QuickViewModal({ robot, isOpen, onClose, onOpenInquiry }) {
  if (!isOpen || !robot) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl border border-[#27272a] bg-[#111114] shadow-2xl p-5 sm:p-7 my-auto text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg border border-[#232326] bg-[#16161a] flex items-center justify-center text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Left: Image & Fast Specs */}
          <div>
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#0A0A0D] border border-[#232326] mb-3">
              <img
                src={robot.media.primaryImage}
                alt={robot.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                  {robot.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center p-2.5 rounded-xl bg-[#16161c] border border-[#232326]">
              <div>
                <span className="text-[10px] uppercase font-semibold text-[#71717A] block">Payload</span>
                <span className="text-[12px] font-bold text-white font-mono mt-0.5 block">{robot.specs.payload}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-[#71717A] block">Run-Time</span>
                <span className="text-[12px] font-bold text-white font-mono mt-0.5 block">{robot.specs.runTime.split(' ')[0]} {robot.specs.runTime.split(' ')[1]}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-[#71717A] block">Mobility</span>
                <span className="text-[12px] font-bold text-[#A78BFA] font-mono mt-0.5 block">{robot.specs.dof.split(' ')[0]}</span>
              </div>
            </div>
          </div>

          {/* Right: Detailed Content */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-xs text-[#A1A1AA] mb-1">
              <span className="font-semibold text-white uppercase tracking-wider">{robot.manufacturer}</span>
              <span>•</span>
              <span>{robot.manufacturerCountry}</span>
              <span>•</span>
              <div className="flex items-center gap-1 text-[#F5A623]">
                <Star size={12} className="fill-[#F5A623]" />
                <span className="font-mono text-white">{robot.rating}</span>
              </div>
            </div>

            <h2 className="text-2xl font-extrabold text-white tracking-tight mb-2">
              {robot.name}
            </h2>

            <p className="text-[13px] text-[#A1A1AA] leading-relaxed mb-4">
              {robot.tagLine}
            </p>

            {/* Key Capabilities list */}
            <div className="mb-4">
              <span className="text-[11px] uppercase font-semibold text-[#71717A] tracking-wider block mb-2">
                Core Capabilities
              </span>
              <ul className="space-y-1.5 text-xs text-[#E4E4E7]">
                {robot.capabilities.slice(0, 4).map((cap, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 size={13} className="text-[#6E56CF] mt-0.5 shrink-0" />
                    <span>{cap}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Enterprise Partner Badge */}
            {robot.deploymentCases.length > 0 && (
              <div className="p-2.5 rounded-xl bg-[#16161c] border border-[#232326] mb-4">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#A78BFA] mb-1">
                  <Building size={12} />
                  <span>Deployment Case: {robot.deploymentCases[0].partner}</span>
                </div>
                <p className="text-[11.5px] text-[#A1A1AA] leading-tight">
                  {robot.deploymentCases[0].useCase}
                </p>
              </div>
            )}

            {/* Price & Actions */}
            <div className="mt-auto pt-4 border-t border-[#232326] flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-semibold text-[#71717A] block">Starting At</span>
                <span className="text-lg font-bold text-white font-mono">{robot.pricing.startingPrice}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onClose();
                    onOpenInquiry(robot);
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#1F1F24] text-white hover:bg-[#282830] transition-colors"
                >
                  Request Quote
                </button>
                <Link
                  to={`/robots/${robot.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-semibold bg-[#6E56CF] hover:bg-[#7C66DC] text-white shadow-md shadow-[#6E56CF]/20"
                >
                  <span>Full Spec Page</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
