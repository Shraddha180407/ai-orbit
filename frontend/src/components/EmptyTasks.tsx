import React from "react";
import Inbox from 'lucide-react/dist/esm/icons/inbox';

type EmptyTasksProps = {
  message?: string;
};

export function EmptyTasks({ message }: EmptyTasksProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 rounded-2xl bg-gradient-to-b from-[#131316]/50 to-[#0D0D10]/50 ring-1 ring-[#232326]/70">
      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#18181C] to-[#0A0A0C] ring-1 ring-[#232326]/70 flex items-center justify-center mb-4">
        <Inbox className="h-5 w-5 text-[#71717A]" aria-hidden="true" />
      </div>
      <p className="text-white text-sm font-semibold">No Tasks Found</p>
      <p className="text-[#A1A1AA] text-xs mt-1.5 max-w-xs">
        {message || "Try adjusting your search or filters to find what you're looking for."}
      </p>
    </div>
  );
}