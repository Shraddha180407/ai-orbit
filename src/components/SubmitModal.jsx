import React, { useState } from 'react';
import { X, Send, Bot, CheckCircle, Sparkles } from 'lucide-react';

export default function SubmitModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    robotName: '',
    manufacturer: '',
    category: 'Humanoid Bipedal',
    payload: '',
    runTime: '',
    pricing: '',
    websiteUrl: '',
    description: ''
  });

  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl border border-[#27272a] bg-[#111114] shadow-2xl p-6 sm:p-8 my-auto text-white">
        <button
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg border border-[#232326] bg-[#16161a] flex items-center justify-center text-[#A1A1AA] hover:text-white"
        >
          <X size={16} />
        </button>

        {submitted ? (
          <div className="py-8 text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center text-[#34D399] mb-4">
              <CheckCircle size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Platform Submitted for Indexing</h3>
            <p className="text-sm text-[#A1A1AA] max-w-sm mb-6 leading-relaxed">
              Thank you for contributing <strong className="text-white">{formData.robotName}</strong> to the AI Orbit robotics directory. Our hardware verification team will review your kinematics documentation and publish your listing within 48 hours.
            </p>
            <button
              onClick={handleResetAndClose}
              className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-[#6E56CF] text-white hover:bg-[#7C66DC]"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#6E56CF]/20 text-[#C4B5FD] border border-[#6E56CF]/40 mb-2">
                <Sparkles size={11} /> Community &amp; Manufacturer Submissions
              </span>
              <h3 className="text-xl font-extrabold text-white tracking-tight">
                Submit a Robotic Agent
              </h3>
              <p className="text-xs text-[#A1A1AA] mt-1">
                List your humanoid, quadruped, or autonomous hardware platform on the global AI Orbit index.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A1A1AA] font-medium mb-1">Platform Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Atlas All-Electric"
                    value={formData.robotName}
                    onChange={(e) => setFormData({ ...formData, robotName: e.target.value })}
                    className="w-full rounded-xl border border-[#232326] bg-[#16161c] px-3 py-2 text-white placeholder:text-[#52525B] focus:border-[#6E56CF] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#A1A1AA] font-medium mb-1">Manufacturer / Lab *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Boston Dynamics"
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    className="w-full rounded-xl border border-[#232326] bg-[#16161c] px-3 py-2 text-white placeholder:text-[#52525B] focus:border-[#6E56CF] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A1A1AA] font-medium mb-1">Locomotion Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-xl border border-[#232326] bg-[#16161c] px-3 py-2 text-white focus:border-[#6E56CF] focus:outline-none"
                  >
                    <option value="Humanoid Bipedal">Humanoid Bipedal</option>
                    <option value="Quadruped">Quadruped</option>
                    <option value="Wheeled Humanoid">Wheeled Humanoid</option>
                    <option value="Collaborative Arm / Mobile">Collaborative Arm / Mobile</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#A1A1AA] font-medium mb-1">Payload (kg)</label>
                  <input
                    type="text"
                    placeholder="e.g. 20 kg"
                    value={formData.payload}
                    onChange={(e) => setFormData({ ...formData, payload: e.target.value })}
                    className="w-full rounded-xl border border-[#232326] bg-[#16161c] px-3 py-2 text-white placeholder:text-[#52525B] focus:border-[#6E56CF] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#A1A1AA] font-medium mb-1">Official Website / Documentation URL</label>
                <input
                  type="url"
                  placeholder="https://manufacturer.com/robot"
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                  className="w-full rounded-xl border border-[#232326] bg-[#16161c] px-3 py-2 text-white placeholder:text-[#52525B] focus:border-[#6E56CF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#A1A1AA] font-medium mb-1">Short Description &amp; Actuation Notes</label>
                <textarea
                  rows={3}
                  placeholder="Describe joint actuators, sensor suite, battery life, and target industrial application..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border border-[#232326] bg-[#16161c] p-3 text-white placeholder:text-[#52525B] focus:border-[#6E56CF] focus:outline-none resize-none"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-semibold text-white bg-[#6E56CF] hover:bg-[#7C66DC] active:scale-95 transition-all shadow-md shadow-[#6E56CF]/20"
                >
                  <Send size={13} />
                  <span>Submit for Review</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
