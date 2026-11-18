import React, { useRef, useState } from 'react';
import { Upload, X, RotateCcw, Image as ImageIcon, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { optimizeImage } from '../../utils/imageOptimizer';

/**
 * Reusable image upload & URL input control for the Admin CMS
 * Allows uploading from disk (with auto client-side WebP compression)
 * OR entering a hosted image URL.
 */
export function ImageInput({
  label,
  value,
  onChange,
  defaultPreview,
  recommendedDimensions = '800x1000px',
  aspectRatio = 'aspect-[4/5]',
}) {
  const fileInputRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [mode, setMode] = useState('upload'); // 'upload' | 'url'

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate mime type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    // Size warning for files over 15MB
    if (file.size > 15 * 1024 * 1024) {
      setUploadError('File size is very large. Please choose an image under 15MB.');
      return;
    }

    setIsProcessing(true);
    setUploadError(null);

    try {
      // Compress and optimize image to WebP under 1200px
      const optimizedDataUrl = await optimizeImage(file, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.85,
      });

      onChange(optimizedDataUrl);
    } catch (err) {
      console.error('Image optimization failed:', err);
      setUploadError('Failed to process image. You can try another file or enter an image URL.');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClear = () => {
    onChange('');
    setUploadError(null);
  };

  const currentDisplay = value || defaultPreview;
  const isCustomized = Boolean(value);

  return (
    <div className="space-y-3.5">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs sm:text-sm font-semibold text-slate-700">{label}</label>
          <span className="text-xs text-slate-400">Rec: {recommendedDimensions}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start gap-6 p-5 sm:p-6 rounded-2xl bg-slate-50/80 border border-slate-200 shadow-2xs">
        {/* Thumbnail Preview Card */}
        <div
          className={`relative w-32 sm:w-44 ${aspectRatio} rounded-xl overflow-hidden bg-slate-200 border border-slate-300 shadow-2xs shrink-0 flex items-center justify-center`}
        >
          {currentDisplay ? (
            <img
              src={currentDisplay}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageIcon className="w-10 h-10 text-slate-400" />
          )}

          {isProcessing && (
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center text-white text-xs font-medium">
              <span className="animate-pulse">Optimizing...</span>
            </div>
          )}

          {isCustomized && (
            <span className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
              Custom
            </span>
          )}
        </div>

        {/* Controls Column */}
        <div className="flex-1 w-full space-y-4">
          {/* Mode Switcher Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMode('upload')}
              className={`px-3.5 py-1.5 text-xs rounded-xl font-semibold transition-all cursor-pointer ${
                mode === 'upload'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Upload className="w-3.5 h-3.5 inline mr-1.5" />
              Upload Image
            </button>
            <button
              type="button"
              onClick={() => setMode('url')}
              className={`px-3.5 py-1.5 text-xs rounded-xl font-semibold transition-all cursor-pointer ${
                mode === 'url'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5 inline mr-1.5" />
              Image URL
            </button>
          </div>

          {/* Upload Input */}
          {mode === 'upload' ? (
            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp, image/svg+xml"
                onChange={handleFileChange}
                className="hidden"
                id={`file-input-${label || 'img'}`}
              />
              <label
                htmlFor={`file-input-${label || 'img'}`}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-50 cursor-pointer transition-colors shadow-2xs"
              >
                <Upload className="w-4 h-4 text-slate-500" />
                <span>Choose photo from computer...</span>
              </label>
              <p className="text-xs text-slate-500">
                Automatically compressed to high-efficiency WebP format for fast loading.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="https://example.com/photo.webp or /assets/..."
                className="w-full h-11 px-4 rounded-xl text-sm bg-white border border-slate-200 text-slate-800 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-2xs"
              />
              <p className="text-xs text-slate-500">
                Enter an external URL or an asset path.
              </p>
            </div>
          )}

          {/* Reset / Clear Actions */}
          {isCustomized && (
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to default image</span>
              </button>
            </div>
          )}

          {uploadError && (
            <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

