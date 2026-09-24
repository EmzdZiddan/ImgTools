import React from 'react';
import { Trash2, FileImage, X } from 'lucide-react';
import type { UploadedImage } from '../types';
import { formatBytes } from '../utils/formatters';

interface ImageListProps {
  images: UploadedImage[];
  onRemoveImage: (id: string) => void;
  onClearAll: () => void;
  disabled?: boolean;
}

export const ImageList: React.FC<ImageListProps> = ({
  images,
  onRemoveImage,
  onClearAll,
  disabled = false,
}) => {
  if (images.length === 0) return null;

  return (
    <div className="w-full bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <FileImage className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-semibold text-slate-800">
            Selected Images
          </span>
          <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
            {images.length}
          </span>
        </div>
        <button
          type="button"
          onClick={onClearAll}
          disabled={disabled}
          className="text-xs font-semibold text-slate-500 hover:text-red-600 disabled:opacity-50 transition-colors flex items-center gap-1.5 cursor-pointer py-1 px-2 rounded-lg hover:bg-red-50"
          title="Clear all selected images"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear all</span>
        </button>
      </div>

      <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
        {images.map((img) => (
          <div
            key={img.id}
            className="flex items-center justify-between px-5 py-3 hover:bg-slate-50/80 transition-colors"
          >
            <div className="flex items-center gap-3.5 min-w-0 flex-1 mr-3">
              {/* Thumbnail */}
              <div className="w-11 h-11 rounded-xl border border-slate-200 bg-slate-100 shrink-0 overflow-hidden flex items-center justify-center shadow-2xs">
                {img.previewUrl ? (
                  <img
                    src={img.previewUrl}
                    alt={img.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FileImage className="w-5 h-5 text-slate-400" />
                )}
              </div>

              {/* Filename & Info */}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900 truncate" title={img.name}>
                  {img.name}
                </p>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mt-0.5">
                  <span className="font-medium text-slate-600">{formatBytes(img.size)}</span>
                  {img.width && img.height && (
                    <>
                      <span className="text-slate-300">•</span>
                      <span>
                        {img.width} × {img.height}
                      </span>
                    </>
                  )}
                  {img.errorMessage && (
                    <span className="text-red-600 truncate font-sans">({img.errorMessage})</span>
                  )}
                </div>
              </div>
            </div>

            {/* Remove button */}
            <button
              type="button"
              onClick={() => onRemoveImage(img.id)}
              disabled={disabled}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors cursor-pointer"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
