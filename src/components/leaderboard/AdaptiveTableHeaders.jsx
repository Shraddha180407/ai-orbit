import React from 'react';

export default function AdaptiveTableHeaders({ category = 'All' }) {
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
  let metric2Label = 'Coding / Bench';
  let metric3Label = 'Speed / Latency';

  if (isCreative) {
    metric1Label = 'Visual Elo';
    metric2Label = 'Render Time';
    metric3Label = 'Resolution';
  } else if (isVoice) {
    metric1Label = 'Voice MOS';
    metric2Label = 'Stream Latency';
    metric3Label = 'Languages';
  } else if (isCoding) {
    metric1Label = 'Arena Elo / Rating';
    metric2Label = 'SWE-bench / Pass@1';
    metric3Label = 'Speed / Indexing';
  } else if (isReasoning) {
    metric1Label = 'Arena Elo';
    metric2Label = 'AIME / MATH-500';
    metric3Label = 'Thinking Speed';
  } else if (isEmbeddings) {
    metric1Label = 'MTEB Score';
    metric2Label = 'Dimensions';
    metric3Label = 'Context Window';
  } else if (isProductivity) {
    metric1Label = 'Quality / Score';
    metric2Label = 'Evaluation Benchmark';
    metric3Label = 'Monthly Visits';
  }

  return (
    <tr className="bg-[#16161c] border-b border-[#232326] text-[#71717A] uppercase font-semibold text-[11px] tracking-wider">
      <th className="p-3.5 w-20 text-center">
        <div>Rank</div>
        <div className="text-[9px] text-[#71717A] lowercase font-normal tracking-normal">ai orbit score</div>
      </th>
      <th className="p-3.5">Model / Tool</th>
      <th className="p-3.5">{metric1Label}</th>
      <th className="p-3.5">{metric2Label}</th>
      <th className="p-3.5">{metric3Label}</th>
      <th className="p-3.5">Pricing</th>
      <th className="p-3.5">Category</th>
      <th className="p-3.5 text-right">Actions</th>
    </tr>
  );
}
