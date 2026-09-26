import React, { useState } from 'react';
import { X, Send, CheckCircle, Sparkles, Building, Mail, User, ShieldCheck } from 'lucide-react';

export default function InquiryModal({ isOpen, onClose, selectedRobot = null }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    fleetSize: '1-5 Units (Evaluation Pilot)',
    industry: 'Automotive & Heavy Manufacturing',
    notes: ''
  });

  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      // Auto close after 3 seconds if needed
    }, 3000);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl border border-[#27272a] bg-[#111114] shadow-2xl p-6 sm:p-8 my-auto text-white">
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg border border-[#232326] bg-[#16161a] flex items-center justify-center text-[#A1A1AA] hover:text-white transition-colors"
        >
          <X size={16} />
        </button>

        {submitted ? (
          <div className="py-8 text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center text-[#34D399] mb-4">
              <CheckCircle size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Request Transmitted Successfully</h3>
            <p className="text-sm text-[#A1A1AA] max-w-sm mb-6 leading-relaxed">
              Your consultation request for <strong className="text-white">{selectedRobot ? selectedRobot.name : "AI Orbit Robotics Fleet"}</strong> has been logged. An enterprise deployment specialist will follow up within 24 business hours with certified CAD models and pricing sheets.
            </p>
            <button
              onClick={handleResetAndClose}
              className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-[#6E56CF] text-white hover:bg-[#7C66DC] transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            {/* Modal Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#6E56CF]/20 text-[#C4B5FD] border border-[#6E56CF]/40">
                  <Sparkles size={11} /> Enterprise Fleet Inquiries
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-white tracking-tight">
                Request Quote &amp; Technical Dossier
              </h3>
              <p className="text-xs text-[#A1A1AA] mt-1">
                {selectedRobot ? (
                  <>Direct procurement inquiry for <span className="text-white font-semibold">{selectedRobot.name}</span> by {selectedRobot.manufacturer}.</>
                ) : (
                  <>Inquire about multi-agent fleet deployments across industrial or commercial facilities.</>
                )}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="inquiry-name-input" className="block text-[#A1A1AA] font-medium mb-1">Full Name *</label>
                  <input
                    id="inquiry-name-input"
                    name="name"
                    type="text"
                    required
                    placeholder="e.g. Dr. Alex Vance"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-[#232326] bg-[#16161c] px-3 py-2 text-white placeholder:text-[#52525B] focus:border-[#6E56CF] focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="inquiry-email-input" className="block text-[#A1A1AA] font-medium mb-1">Work Email *</label>
                  <input
                    id="inquiry-email-input"
                    name="email"
                    type="email"
                    required
                    placeholder="alex@enterprise.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-[#232326] bg-[#16161c] px-3 py-2 text-white placeholder:text-[#52525B] focus:border-[#6E56CF] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="inquiry-company-input" className="block text-[#A1A1AA] font-medium mb-1">Company / Organization *</label>
                  <input
                    id="inquiry-company-input"
                    name="company"
                    type="text"
                    required
                    placeholder="e.g. BMW Robotics Hub"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full rounded-xl border border-[#232326] bg-[#16161c] px-3 py-2 text-white placeholder:text-[#52525B] focus:border-[#6E56CF] focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="inquiry-fleet-select" className="block text-[#A1A1AA] font-medium mb-1">Fleet Scope</label>
                  <select
                    id="inquiry-fleet-select"
                    name="fleetSize"
                    value={formData.fleetSize}
                    onChange={(e) => setFormData({ ...formData, fleetSize: e.target.value })}
                    className="w-full rounded-xl border border-[#232326] bg-[#16161c] px-3 py-2 text-white focus:border-[#6E56CF] focus:outline-none cursor-pointer"
                  >
                    <option value="1-5 Units (Evaluation Pilot)">1-5 Units (Evaluation Pilot)</option>
                    <option value="6-20 Units (Facility Rollout)">6-20 Units (Facility Rollout)</option>
                    <option value="20+ Units (Enterprise Global Fleet)">20+ Units (Enterprise Global Fleet)</option>
                    <option value="Academic Research Grant">Academic Research Grant</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="inquiry-industry-select" className="block text-[#A1A1AA] font-medium mb-1">Target Application &amp; Industry</label>
                <select
                  id="inquiry-industry-select"
                  name="industry"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full rounded-xl border border-[#232326] bg-[#16161c] px-3 py-2 text-white focus:border-[#6E56CF] focus:outline-none cursor-pointer"
                >
                  <option value="Automotive & Heavy Manufacturing">Automotive &amp; Heavy Manufacturing</option>
                  <option value="Logistics, Warehousing & Fulfillment">Logistics, Warehousing &amp; Fulfillment</option>
                  <option value="Electronics Assembly & Inspection">Electronics Assembly &amp; Inspection</option>
                  <option value="Hazardous & Substation Inspection">Hazardous &amp; Substation Inspection</option>
                  <option value="Academic Robotics Research">Academic Robotics Research</option>
                </select>
              </div>

              <div>
                <label htmlFor="inquiry-notes-textarea" className="block text-[#A1A1AA] font-medium mb-1">Deployment Requirements / Notes</label>
                <textarea
                  id="inquiry-notes-textarea"
                  name="notes"
                  rows={3}
                  placeholder="Outline your cycle time requirements, payload constraints, or ROS 2 integration needs..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full rounded-xl border border-[#232326] bg-[#16161c] p-3 text-white placeholder:text-[#52525B] focus:border-[#6E56CF] focus:outline-none resize-none"
                ></textarea>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-[#71717A] flex items-center gap-1">
                  <ShieldCheck size={12} className="text-[#10B981]" /> Encrypted NDA Protected
                </span>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-semibold text-white bg-[#6E56CF] hover:bg-[#7C66DC] active:scale-95 transition-all shadow-md shadow-[#6E56CF]/20 cursor-pointer"
                >
                  <Send size={13} />
                  <span>Transmit Inquiry</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
