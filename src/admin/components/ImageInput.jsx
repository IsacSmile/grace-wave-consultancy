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
    <div className="space-y-3">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-slate-700">{label}</label>
          <span className="text-[11px] text-slate-400">Rec: {recommendedDimensions}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
        {/* Thumbnail Preview Card */}
        <div
          className={`relative w-28 sm:w-32 ${aspectRatio} rounded-lg overflow-hidden bg-slate-200 border border-slate-300 shadow-2xs shrink-0 flex items-center justify-center`}
        >
          {currentDisplay ? (
            <img
              src={currentDisplay}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageIcon className="w-8 h-8 text-slate-400" />
          )}

          {isProcessing && (
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center text-white text-[11px] font-medium">
              <span className="animate-pulse">Optimizing...</span>
            </div>
          )}

          {isCustomized && (
            <span className="absolute top-1 right-1 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
              Custom
            </span>
          )}
        </div>

        {/* Controls Column */}
        <div className="flex-1 w-full space-y-3">
          {/* Mode Switcher Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMode('upload')}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                mode === 'upload'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Upload className="w-3 h-3 inline mr-1" />
              Upload Image
            </button>
            <button
              type="button"
              onClick={() => setMode('url')}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                mode === 'url'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <LinkIcon className="w-3 h-3 inline mr-1" />
              Image URL
            </button>
          </div>

          {/* Upload Input */}
          {mode === 'upload' ? (
            <div>
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
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-800 bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-50 cursor-pointer transition-colors shadow-2xs"
              >
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                <span>Choose photo from computer...</span>
              </label>
              <p className="text-[11px] text-slate-500 mt-1.5">
                Automatically compressed to high-efficiency WebP format for fast loading.
              </p>
            </div>
          ) : (
            <div>
              <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="https://example.com/photo.webp or /assets/..."
                className="w-full h-9 px-3 rounded-xl text-xs bg-white border border-slate-200 text-slate-800 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-2xs"
              />
              <p className="text-[11px] text-slate-500 mt-1">
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
                className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-medium cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to default image</span>
              </button>
            </div>
          )}

          {uploadError && (
            <div className="flex items-center gap-1.5 text-xs text-rose-600">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

