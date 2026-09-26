import React, { useState } from 'react';
import { Layers, Search, ArrowUpRight, CheckCircle2, Cpu, Wrench, Sparkles } from 'lucide-react';

export default function TasksPage() {
  const [search, setSearch] = useState('');

  const taskCategories = [
    {
      title: 'Automate High-Precision Manufacturing & Assembly',
      tools: ['Figure 02', 'Unitree G1', 'Boston Dynamics Atlas'],
      department: 'Industrial Robotics',
      complexity: 'Enterprise Grade',
      steps: [
        'Deploy ROS 2 Isaac Sim digital twin of workcell',
        'Train neural visuomotor policy on 500 demonstrated assemblies',
        'Configure real-time joint torque safety envelope',
        'Integrate automated optical inspection camera feedback'
      ]
    },
    {
      title: 'Autonomous Perimeter & Hazardous Site Inspection',
      tools: ['Spot Enterprise', 'Unitree B2', 'Livox Mid-360'],
      department: 'Facility & Safety',
      complexity: 'Automated Routine',
      steps: [
        'Survey facility layout with 3D spherical LiDAR',
        'Mark thermal gauge waypoints & gas sensor sniff zones',
        'Schedule self-docking autonomous patrol routines every 4 hours',
        'Stream real-time alerts to central command dashboard'
      ]
    },
    {
      title: 'Humanoid Warehouse Tote Picking & Conveyor Loading',
      tools: ['Digit v4', 'Agility Arc Fleet OS', 'AMR Fleet'],
      department: 'Logistics & 3PL',
      complexity: 'High Throughput',
      steps: [
        'Connect WMS warehouse management system API',
        'Map aisle navigation without physical fiducial markers',
        'Set up automated conveyor transfer handoff zone',
        'Execute continuous 2-shift tote retrieval cycles'
      ]
    }
  ];

  const filtered = taskCategories.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase()) || 
    t.tools.some(tool => tool.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#6E56CF]/30 pb-16">
      <div className="border-b border-[#1C1C1F] bg-[#09090b] py-10 sm:py-14 px-4 sm:px-8">
        <div className="mx-auto max-w-[1440px]">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#00E5FF] bg-[#00E5FF]/15 px-3 py-1 rounded-full border border-[#00E5FF]/30 inline-block mb-3">
            AI Tasks &amp; Workflows
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
            Task-Driven AI Workflows
          </h1>
          <p className="text-sm sm:text-base text-[#A1A1AA] max-w-2xl leading-relaxed">
            Discover verified end-to-end task recipes, hardware-software stacks, and deployment playbooks for every physical AI scenario.
          </p>
          <div className="mt-6 max-w-md relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717A]" />
            <input
              id="tasks-page-search-input"
              name="tasksSearch"
              type="text"
              placeholder="Search tasks (e.g. assembly, inspection, picking)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#131316] border border-[#232326] text-xs text-white placeholder:text-[#71717A] focus:outline-none focus:border-[#6E56CF]"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 py-8">
        <div className="space-y-6">
          {filtered.map((task, idx) => (
            <div key={idx} className="p-6 rounded-2xl border border-[#232326] bg-[#111115]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-[#1F1F24]">
                <div>
                  <span className="text-[11px] font-mono text-[#A78BFA] uppercase font-semibold">{task.department}</span>
                  <h3 className="text-lg font-bold text-white mt-0.5">{task.title}</h3>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#1a1a20] border border-[#272730] text-[#E4E4E7] w-fit">
                  {task.complexity}
                </span>
              </div>

              <div className="mb-4">
                <span className="text-[11px] text-[#71717A] uppercase font-semibold block mb-2">Recommended Hardware / Tool Stack</span>
                <div className="flex flex-wrap gap-2">
                  {task.tools.map((t, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-[#16161c] border border-[#27272a] text-xs text-white font-medium">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] text-[#71717A] uppercase font-semibold block mb-2">Execution Playbook</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#A1A1AA]">
                  {task.steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-[#141418]">
                      <span className="font-mono text-[#6E56CF] font-bold">{i+1}.</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
