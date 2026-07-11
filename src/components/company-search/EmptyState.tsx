import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center space-y-2">
      <AlertCircle className="h-5 w-5 text-neutral-500" />
      <p className="text-xs font-semibold text-neutral-400">No matching companies found</p>
      <p className="text-[10px] text-neutral-600 max-w-[200px]">
        Double check spelling or try searching for another global company name or ticker.
      </p>
    </div>
  );
}
