import React from 'react';
import { Download, CheckCircle2, Archive, ArrowRight, RotateCcw } from 'lucide-react';
import type { ConvertedResult } from '../types';
import { formatBytes, formatPercentage } from '../utils/formatters';
import { downloadBlob, downloadAllAsZip } from '../utils/zipHelper';

interface ConversionResultsProps {
  results: ConvertedResult[];
  onReset: () => void;
}

export const ConversionResults: React.FC<ConversionResultsProps> = ({
  results,
  onReset,
}) => {
  if (results.length === 0) return null;

  const totalOriginalSize = results.reduce((acc, curr) => acc + curr.originalSize, 0);
  const totalWebpSize = results.reduce((acc, curr) => acc + curr.webpSize, 0);
  const totalReduction =
    totalOriginalSize > 0
      ? ((totalOriginalSize - totalWebpSize) / totalOriginalSize) * 100
      : 0;

  const handleDownloadSingle = (item: ConvertedResult) => {
    downloadBlob(item.blob, item.webpFileName);
  };

  const handleDownloadAll = () => {
    downloadAllAsZip(results);
  };

  return (
    <div className="w-full bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs space-y-0">
      {/* Header and Summary stats */}
      <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span className="text-sm font-bold text-slate-900">
            Conversion Complete ({results.length} {results.length === 1 ? 'file' : 'files'})
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Summary badge */}
          <div className="flex items-center gap-1.5 text-xs font-mono bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 shadow-2xs">
            <span>{formatBytes(totalOriginalSize)}</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-bold text-slate-900">{formatBytes(totalWebpSize)}</span>
            <span
              className={`ml-1.5 px-2 py-0.5 rounded text-[11px] font-extrabold ${
                totalReduction >= 0
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : 'bg-slate-200 text-slate-800'
              }`}
            >
              {formatPercentage(totalReduction)}
            </span>
          </div>

          {results.length > 1 && (
            <button
              type="button"
              onClick={handleDownloadAll}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors cursor-pointer shadow-sm shadow-blue-500/20"
            >
              <Archive className="w-4 h-4" />
              <span>Download All (.zip)</span>
            </button>
          )}

          <button
            type="button"
            onClick={onReset}
            className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Convert more images"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Results List */}
      <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
        {results.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-4 hover:bg-slate-50/70 transition-colors"
          >
            <div className="flex items-center gap-3.5 min-w-0 flex-1 mr-3">
              {/* WebP preview */}
              <div className="w-12 h-12 rounded-xl border border-slate-200 bg-slate-100 shrink-0 overflow-hidden flex items-center justify-center shadow-2xs">
                <img
                  src={item.previewUrl}
                  alt={item.webpFileName}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Details */}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900 truncate" title={item.webpFileName}>
                  {item.webpFileName}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-500 mt-0.5">
                  <span className="line-through text-slate-400">
                    {formatBytes(item.originalSize)}
                  </span>
                  <span>→</span>
                  <span className="font-bold text-slate-800">
                    {formatBytes(item.webpSize)}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      item.reductionPercentage >= 0
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {formatPercentage(item.reductionPercentage)}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span>
                    {item.width} × {item.height}
                  </span>
                </div>
              </div>
            </div>

            {/* Individual Download Button */}
            <button
              type="button"
              onClick={() => handleDownloadSingle(item)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 text-slate-800 rounded-lg border border-slate-200/90 transition-all cursor-pointer shrink-0"
              title={`Download ${item.webpFileName}`}
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
