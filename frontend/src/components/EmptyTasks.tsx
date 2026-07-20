import React from "react";
import Inbox from 'lucide-react/dist/esm/icons/inbox';

export function EmptyTasks() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 border border-[#232326] bg-[#131316]/40 rounded-xl">
      <div className="h-12 w-12 rounded-full bg-[#18181C] border border-[#232326] flex items-center justify-center mb-4">
        <Inbox className="h-5 w-5 text-[#71717A]" aria-hidden="true" />
      </div>
      <p className="text-white text-sm font-semibold">No Tasks Found</p>
      <p className="text-[#A1A1AA] text-xs mt-1.5 max-w-xs">
        Try adjusting your search or filters to find what you&apos;re looking for.
      </p>
    </div>
  );
}