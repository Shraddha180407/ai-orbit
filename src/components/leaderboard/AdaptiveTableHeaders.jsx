import React from 'react';

export default function AdaptiveTableHeaders({ category = 'All', entityType = 'all' }) {
  // Determine relevant column headings based on active category
  const isCreative = 
    category === 'Image Generation' || 
    category === 'Video Editing' || 
    category === 'Image' || 
    category === 'Video' ||
    category === 'Design';
  const isVoice = 
    category === 'Audio & Voice' || 
    category === 'Audio / Voice' || 
    category === 'Voice / Audio';
  const isCoding = 
    category === 'Code Assistant' || 
    category === 'Coding' || 
    category === 'Coding / Developer' ||
    category === 'AI Agents';
  const isReasoning = 
    category === 'Reasoning';
  const isEmbeddings = 
    category === 'Embeddings';
  const isProductivity = 
    category === 'Productivity' || 
    category === 'Research' || 
    category === 'Writing' || 
    category === 'Marketing' || 
    category === 'Automation' ||
    category === 'Translation';

  let metric1Label = 'Arena Elo';
  let metric2Label = 'Coding Score';
  let metric3Label = 'Speed (tok/s)';

  // If entityType is dedicated to tools, adapt headers specifically for developer tools & applications
  if (entityType === 'tools') {
    if (isCreative) {
      metric1Label = 'Visual Rating';
      metric2Label = 'Render Time';
      metric3Label = 'Resolution';
    } else if (isVoice) {
      metric1Label = 'Voice Quality';
      metric2Label = 'Stream Latency';
      metric3Label = 'Languages';
    } else if (isCoding) {
      metric1Label = 'Tool Rating';
      metric2Label = 'Edit / SWE Score';
      metric3Label = 'Scale & Flow';
    } else {
      metric1Label = 'Tool Rating';
      metric2Label = 'Key Benchmark';
      metric3Label = 'Scale / Latency';
    }
  } else {
    if (isCreative) {
      metric1Label = 'Visual Elo';
      metric2Label = 'Render Time';
      metric3Label = 'Resolution';
    } else if (isVoice) {
      metric1Label = 'Voice MOS';
      metric2Label = 'Stream Latency';
      metric3Label = 'Languages';
    } else if (isCoding) {
      metric1Label = 'Arena Elo';
      metric2Label = 'Coding Score';
      metric3Label = 'Speed (tok/s)';
    } else if (isReasoning) {
      metric1Label = 'Arena Elo';
      metric2Label = 'Math Score';
      metric3Label = 'Speed (tok/s)';
    } else if (isEmbeddings) {
      metric1Label = 'MTEB Score';
      metric2Label = 'Dimensions';
      metric3Label = 'Context Window';
    } else if (isProductivity) {
      metric1Label = 'Quality Score';
      metric2Label = 'Benchmark';
      metric3Label = 'Monthly Visits';
    }
  }

  const nameColHeader = entityType === 'tools' ? 'AI Tool' : entityType === 'models' ? 'Foundation Model' : 'Model / Tool';

  return (
    <tr className="bg-[#16161c] border-b border-[#232326] text-[#71717A] uppercase font-semibold text-[11px] tracking-wider">
      <th className="py-2.5 px-3.5 w-16 text-center">
        <span>Rank</span>
      </th>
      <th className="py-2.5 px-3.5">{nameColHeader}</th>
      <th className="py-2.5 px-3.5">{metric1Label}</th>
      <th className="py-2.5 px-3.5">{metric2Label}</th>
      <th className="py-2.5 px-3.5">{metric3Label}</th>
      <th className="py-2.5 px-3.5">Pricing</th>
      <th className="py-2.5 px-3.5">Category</th>
      <th className="py-2.5 px-3.5 text-right">Actions</th>
    </tr>
  );
}
