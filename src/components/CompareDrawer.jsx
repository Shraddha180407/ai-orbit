import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  X, 
  GitCompare, 
  ArrowRight, 
  Check, 
  Trash2, 
  Maximize2,
  Layers,
  Battery,
  Weight,
  Cpu,
  Zap,
  DollarSign
} from 'lucide-react';

export default function CompareDrawer({ 
  selectedRobots = [], 
  onRemoveRobot, 
  onClearAll,
  isOpen,
  onClose
}) {
  const [activeModal, setActiveModal] = useState(false);

  if (selectedRobots.length === 0) return null;

  return (
    <>
      {/* Floating Bottom Dock */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl">
        <div className="flex items-center justify-between gap-3 p-2.5 sm:p-3 rounded-2xl border border-[#3b3b44] bg-[#131316]/95 backdrop-blur-xl shadow-2xl shadow-[#6E56CF]/20 text-white">
          {/* Left: Selected previews */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#6E56CF]/20 text-[#C4B5FD] text-xs font-semibold shrink-0">
              <GitCompare size={14} />
              <span>{selectedRobots.length}/3 Selected</span>
            </div>

            {selectedRobots.map((robot) => (
              <div
                key={robot.id}
                className="flex items-center gap-2 px-2 py-1 rounded-lg bg-[#1a1a20] border border-[#27272e] shrink-0"
              >
                <img
                  src={robot.media.primaryImage}
                  alt={robot.name}
                  className="w-6 h-6 rounded-md object-cover"
                />
                <span className="text-xs font-medium text-[#E4E4E7] max-w-[100px] sm:max-w-[130px] truncate">
                  {robot.name}
                </span>
                <button
                  onClick={() => onRemoveRobot(robot.id)}
                  className="text-[#71717A] hover:text-white transition-colors cursor-pointer"
                  title="Remove from compare"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onClearAll}
              className="text-[#71717A] hover:text-white text-xs px-2 py-1 transition-colors cursor-pointer hidden sm:block"
            >
              Clear
            </button>

            <button
              onClick={() => setActiveModal(true)}
              disabled={selectedRobots.length < 2}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-md cursor-pointer ${
                selectedRobots.length >= 2
                  ? 'bg-[#6E56CF] hover:bg-[#7C66DC] text-white shadow-[#6E56CF]/30 active:scale-95'
                  : 'bg-[#232326] text-[#71717A] cursor-not-allowed'
              }`}
            >
              <span>Compare Specs</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison Full Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-5xl rounded-2xl border border-[#27272a] bg-[#111114] shadow-2xl p-4 sm:p-6 my-auto text-white">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#232326]">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#6E56CF]/20 text-[#A78BFA]">
                  <GitCompare size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Direct Side-by-Side Comparison</h3>
                  <p className="text-xs text-[#A1A1AA]">
                    Comparing {selectedRobots.length} robotic agents across mechanics, compute, actuation, and commercial readiness.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(false)}
                className="w-8 h-8 rounded-lg border border-[#232326] bg-[#16161a] flex items-center justify-center text-[#A1A1AA] hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Comparison Matrix Table */}
            <div className="mt-4 overflow-x-auto scrollbar-none">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#232326]">
                    <th className="p-3 text-[11px] uppercase tracking-wider text-[#71717A] font-semibold w-1/4">
                      Specification
                    </th>
                    {selectedRobots.map((r) => (
                      <th key={r.id} className="p-3 w-1/3">
                        <div className="flex flex-col gap-2">
                          <img
                            src={r.media.primaryImage}
                            alt={r.name}
                            className="w-full h-28 object-cover rounded-xl border border-[#232326]"
                          />
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm text-white">{r.name}</span>
                            <button
                              onClick={() => onRemoveRobot(r.id)}
                              className="text-[#71717A] hover:text-red-400 p-1"
                              title="Remove"
                            >
                              <X size={12} />
                            </button>
                          </div>
                          <span className="text-[11px] text-[#A1A1AA] font-mono">{r.manufacturer}</span>
                          <span className="text-[12px] font-bold text-[#A78BFA]">{r.pricing.startingPrice}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1F1F24] text-[#E4E4E7]">
                  <tr>
                    <td className="p-3 text-[#71717A] font-medium">Category</td>
                    {selectedRobots.map((r) => (
                      <td key={r.id} className="p-3 font-semibold text-white">{r.category}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-[#71717A] font-medium">Locomotion Mode</td>
                    {selectedRobots.map((r) => (
                      <td key={r.id} className="p-3">{r.locomotion}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-[#71717A] font-medium">Deployment Status</td>
                    {selectedRobots.map((r) => (
                      <td key={r.id} className="p-3">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#10B981]/20 text-[#34D399]">
                          {r.status}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-[#71717A] font-medium">Payload Capacity</td>
                    {selectedRobots.map((r) => (
                      <td key={r.id} className="p-3 font-mono font-bold text-white">{r.specs.payload}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-[#71717A] font-medium">Continuous Run Time</td>
                    {selectedRobots.map((r) => (
                      <td key={r.id} className="p-3 font-mono">{r.specs.runTime}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-[#71717A] font-medium">Degrees of Freedom</td>
                    {selectedRobots.map((r) => (
                      <td key={r.id} className="p-3 font-mono font-bold text-[#A78BFA]">{r.specs.dof}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-[#71717A] font-medium">Walking / Sprint Speed</td>
                    {selectedRobots.map((r) => (
                      <td key={r.id} className="p-3 font-mono">{r.specs.speed}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-[#71717A] font-medium">Height &amp; Weight</td>
                    {selectedRobots.map((r) => (
                      <td key={r.id} className="p-3">{r.specs.height} / {r.specs.weight}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-[#71717A] font-medium">Compute Platform</td>
                    {selectedRobots.map((r) => (
                      <td key={r.id} className="p-3 text-[11px]">{r.specs.compute}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-[#71717A] font-medium">Actuator Architecture</td>
                    {selectedRobots.map((r) => (
                      <td key={r.id} className="p-3 text-[11px]">{r.specs.actuatorType}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-[#71717A] font-medium">Sensory Suite</td>
                    {selectedRobots.map((r) => (
                      <td key={r.id} className="p-3 text-[11px]">{r.specs.sensors}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-[#71717A] font-medium">Ingress Protection</td>
                    {selectedRobots.map((r) => (
                      <td key={r.id} className="p-3 font-mono">{r.specs.ipRating}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-[#71717A] font-medium">Target Industries</td>
                    {selectedRobots.map((r) => (
                      <td key={r.id} className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {r.targetIndustries.slice(0, 2).map((ind, idx) => (
                            <span key={idx} className="text-[10px] bg-[#1a1a20] px-1.5 py-0.5 rounded text-[#A1A1AA]">
                              {ind}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Modal Bottom Actions */}
            <div className="mt-6 pt-4 border-t border-[#232326] flex items-center justify-between">
              <button
                onClick={onClearAll}
                className="text-xs text-[#71717A] hover:text-white"
              >
                Clear all selections
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#232326] text-white hover:bg-[#2e2e33]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
