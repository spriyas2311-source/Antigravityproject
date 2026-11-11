import React from 'react';
import { Sprout } from 'lucide-react';

export const LoadingSpinner: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-agri-200 border-t-agri-600 rounded-full animate-spin"></div>
        <Sprout className="w-5 h-5 text-agri-700 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      </div>
      <p className="text-sm font-medium text-slate-600 text-center max-w-sm">{message}</p>
    </div>
  );
};

