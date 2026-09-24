import React from 'react';
import { Layers } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-20 px-4 sm:px-6 py-4 shadow-xs">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-500/25">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
              Image to WebP
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 leading-tight">
              Convert images to WebP directly in your browser.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
