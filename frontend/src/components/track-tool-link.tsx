'use client';
import { API_URL } from '@/lib/api';

import ExternalLink from 'lucide-react/dist/esm/icons/external-link';

export function TrackToolLink({ 
  toolId, 
  toolName, 
  url 
}: { 
  toolId: string; 
  toolName: string; 
  url: string;
}) {
  const handleClick = () => {
    // Fire and forget the analytics hit
    fetch(`${API_URL}/api/history`, { credentials: 'include', 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'CLICK_TOOL',
        entity: toolName,
        entityId: toolId,
      }),
    }).catch(console.error);
  };

  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer" 
      onClick={handleClick}
      className="inline-flex items-center justify-center h-7 w-7 p-0 text-[#8A8F98] hover:text-white hover:bg-neutral-800/50 rounded-full transition-colors"
    >
      <ExternalLink className="h-3.5 w-3.5" />
    </a>
  );
}
