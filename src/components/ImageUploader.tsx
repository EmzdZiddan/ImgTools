import React, { useCallback, useRef, useState, useEffect } from 'react';
import { UploadCloud, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { ACCEPT_STRING, isSupportedImage } from '../utils/formatters';

interface ImageUploaderProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onFilesSelected,
  disabled = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (fileList: FileList | File[]) => {
      setErrorMessage(null);
      const rawFiles = Array.from(fileList);
      if (rawFiles.length === 0) return;

      const validFiles: File[] = [];
      const invalidNames: string[] = [];

      for (const file of rawFiles) {
        if (isSupportedImage(file)) {
          validFiles.push(file);
        } else {
          invalidNames.push(file.name);
        }
      }

      if (invalidNames.length > 0) {
        setErrorMessage(
          `Skipped ${invalidNames.length} unsupported file(s): ${invalidNames.slice(0, 3).join(', ')}${
            invalidNames.length > 3 ? '...' : ''
          }`
        );
      }

      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
    },
    [onFilesSelected]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (disabled) return;
      if (e.clipboardData && e.clipboardData.items) {
        const pastedFiles: File[] = [];
        for (let i = 0; i < e.clipboardData.items.length; i++) {
          const item = e.clipboardData.items[i];
          if (item.type.indexOf('image') !== -1) {
            const file = item.getAsFile();
            if (file) {
              pastedFiles.push(file);
            }
          }
        }
        if (pastedFiles.length > 0) {
          handleFiles(pastedFiles);
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [disabled, handleFiles]);

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        className={`group relative border-2 border-dashed rounded-2xl p-8 sm:p-12 transition-all duration-200 text-center cursor-pointer select-none outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${
          isDragOver
            ? 'border-blue-500 bg-blue-50/70 scale-[0.995] shadow-md shadow-blue-500/10'
            : 'border-slate-300 bg-white hover:border-blue-400 hover:bg-slate-50/60 shadow-xs'
        } ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ACCEPT_STRING}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled}
          id="file-upload-input"
        />

        <div className="flex flex-col items-center justify-center space-y-3.5">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200 ${
              isDragOver
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-md group-hover:shadow-blue-500/20'
            }`}
          >
            {isDragOver ? (
              <UploadCloud className="w-7 h-7 animate-bounce" />
            ) : (
              <ImageIcon className="w-7 h-7" />
            )}
          </div>

          <div className="space-y-1">
            <p className="text-base sm:text-lg font-semibold text-slate-900">
              <span className="text-blue-600 underline underline-offset-4 decoration-blue-300 group-hover:decoration-blue-600 transition-colors">
                Drop images here
              </span>{' '}
              or choose files
            </p>
            <p className="text-sm text-slate-500">
              Paste from clipboard or drag & drop multiple files
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold">
            {['PNG', 'JPG / JPEG', 'HEIC', 'AVIF', 'GIF'].map((fmt) => (
              <span
                key={fmt}
                className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-mono tracking-tight shadow-2xs"
              >
                {fmt}
              </span>
            ))}
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="mt-3.5 flex items-start gap-2.5 p-3.5 text-sm rounded-xl border border-amber-200 bg-amber-50 text-amber-900 shadow-2xs">
          <AlertCircle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
