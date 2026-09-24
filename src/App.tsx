import { useState, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ImageList } from './components/ImageList';
import { ConversionSettings } from './components/ConversionSettings';
import { ConversionResults } from './components/ConversionResults';
import type { UploadedImage, ConversionSettings as SettingsType, ConvertedResult } from './types';
import { extractImageMetadata, convertToWebP } from './utils/imageConverter';
import { ArrowRight, Loader2, AlertCircle } from 'lucide-react';

export function App() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [settings, setSettings] = useState<SettingsType>({
    quality: 80,
    maintainAspectRatio: true,
  });
  const [results, setResults] = useState<ConvertedResult[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number }>({
    current: 0,
    total: 0,
  });
  const [conversionError, setConversionError] = useState<string | null>(null);

  const imagesRef = useRef(images);
  imagesRef.current = images;

  const handleFilesSelected = useCallback(async (newFiles: File[]) => {
    setConversionError(null);
    const newItems: UploadedImage[] = [];

    for (const file of newFiles) {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const { previewUrl, width, height } = await extractImageMetadata(file);

      newItems.push({
        id,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        previewUrl,
        width,
        height,
        status: 'idle',
      });
    }

    setImages((prev) => [...prev, ...newItems]);
  }, []);

  const handleRemoveImage = useCallback((id: string) => {
    setImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (target && target.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((img) => img.id !== id);
    });
  }, []);

  const handleClearAll = useCallback(() => {
    imagesRef.current.forEach((img) => {
      if (img.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(img.previewUrl);
      }
    });
    setImages([]);
    setConversionError(null);
  }, []);

  const handleResetResults = useCallback(() => {
    results.forEach((r) => {
      if (r.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(r.previewUrl);
      }
    });
    setResults([]);
    handleClearAll();
  }, [results, handleClearAll]);

  const handleConvert = async () => {
    if (images.length === 0 || isConverting) return;

    setIsConverting(true);
    setConversionError(null);
    setProgress({ current: 0, total: images.length });

    const newResults: ConvertedResult[] = [];
    const errors: string[] = [];

    for (let i = 0; i < images.length; i++) {
      const currentImage = images[i];
      setProgress({ current: i + 1, total: images.length });

      try {
        const result = await convertToWebP(currentImage, settings);
        newResults.push(result);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Conversion failed';
        errors.push(`${currentImage.name}: ${msg}`);
      }
    }

    setResults(newResults);
    setIsConverting(false);

    if (errors.length > 0) {
      setConversionError(
        `Failed to convert ${errors.length} file(s): ${errors.slice(0, 2).join('; ')}`
      );
    }
  };

  const hasFiles = images.length > 0;
  const hasResults = results.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/80 text-slate-900 bg-dot-pattern">
      <Header />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Error notification if any */}
        {conversionError && (
          <div className="flex items-start gap-3 p-4 text-sm rounded-xl border border-red-200 bg-red-50 text-red-900 shadow-2xs">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
            <span>{conversionError}</span>
          </div>
        )}

        {/* Dropzone */}
        <ImageUploader
          onFilesSelected={handleFilesSelected}
          disabled={isConverting}
        />

        {/* Queue List */}
        {hasFiles && (
          <ImageList
            images={images}
            onRemoveImage={handleRemoveImage}
            onClearAll={handleClearAll}
            disabled={isConverting}
          />
        )}

        {/* Settings */}
        {hasFiles && (
          <ConversionSettings
            settings={settings}
            onChange={setSettings}
            disabled={isConverting}
          />
        )}

        {/* Convert Action Button */}
        {hasFiles && (
          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={handleConvert}
              disabled={isConverting || !hasFiles}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-500/25 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isConverting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>
                    Converting ({progress.current}/{progress.total})...
                  </span>
                </>
              ) : (
                <>
                  <span>
                    Convert {images.length} {images.length === 1 ? 'image' : 'images'} to WebP
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}

        {/* Results Section */}
        {hasResults && (
          <div className="pt-2">
            <ConversionResults
              results={results}
              onReset={handleResetResults}
            />
          </div>
        )}
      </main>

      <footer className="py-6 text-center text-xs text-slate-400">
        Image to WebP
      </footer>
    </div>
  );
}

export default App;
