import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import type { ConversionSettings as SettingsType } from '../types';

interface ConversionSettingsProps {
  settings: SettingsType;
  onChange: (newSettings: SettingsType) => void;
  disabled?: boolean;
}

export const ConversionSettings: React.FC<ConversionSettingsProps> = ({
  settings,
  onChange,
  disabled = false,
}) => {
  const handleQualityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    onChange({
      ...settings,
      quality: isNaN(val) ? 80 : Math.min(100, Math.max(10, val)),
    });
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.trim();
    if (val === '') {
      onChange({
        ...settings,
        outputWidth: undefined,
      });
    } else {
      const num = parseInt(val, 10);
      onChange({
        ...settings,
        outputWidth: isNaN(num) || num <= 0 ? undefined : num,
      });
    }
  };

  const handleRatioToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...settings,
      maintainAspectRatio: e.target.checked,
    });
  };

  return (
    <div className="w-full bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3.5">
        <SlidersHorizontal className="w-4 h-4 text-blue-600" />
        <h2 className="text-xs font-bold text-slate-700 tracking-wider uppercase">
          Conversion Settings
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Quality Slider */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="quality-slider"
              className="text-sm font-semibold text-slate-800"
            >
              WebP Quality
            </label>
            <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
              {settings.quality}%
            </span>
          </div>
          <input
            id="quality-slider"
            type="range"
            min="10"
            max="100"
            step="1"
            value={settings.quality}
            onChange={handleQualityChange}
            disabled={disabled}
            className="w-full cursor-pointer disabled:opacity-50"
          />
          <div className="flex justify-between text-xs text-slate-400 font-mono">
            <span>Small (10%)</span>
            <span>Balanced (80%)</span>
            <span>Max (100%)</span>
          </div>
        </div>

        {/* Output Width (Optional) & Maintain Aspect Ratio */}
        <div className="space-y-3">
          <label
            htmlFor="output-width"
            className="text-sm font-semibold text-slate-800 block"
          >
            Output Width <span className="text-slate-400 font-normal text-xs">(optional px)</span>
          </label>
          <div className="flex items-center gap-3">
            <input
              id="output-width"
              type="number"
              min="1"
              max="16384"
              placeholder="Original width"
              value={settings.outputWidth ?? ''}
              onChange={handleWidthChange}
              disabled={disabled}
              className="w-full text-sm font-mono px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all disabled:opacity-50"
            />
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer pt-0.5 select-none">
            <input
              type="checkbox"
              checked={settings.maintainAspectRatio}
              onChange={handleRatioToggle}
              disabled={disabled}
              className="rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4 cursor-pointer accent-blue-600 disabled:opacity-50"
            />
            <span className="text-xs sm:text-sm text-slate-700 font-medium">Maintain aspect ratio</span>
          </label>
        </div>
      </div>
    </div>
  );
};
