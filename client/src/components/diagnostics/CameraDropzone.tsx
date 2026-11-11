import React, { useRef, useState } from 'react';
import { Camera, Upload, AlertCircle, X, Image as ImageIcon } from 'lucide-react';

interface CameraDropzoneProps {
  onImageSelected: (file: File | null) => void;
  selectedFile: File | null;
}

export const CameraDropzone: React.FC<CameraDropzoneProps> = ({ onImageSelected, selectedFile }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setErrorMsg(null);

    // Validate size (8MB max)
    if (file.size > 8 * 1024 * 1024) {
      setErrorMsg('Image size exceeds 8 MB. Please choose a smaller photo.');
      return;
    }

    // Validate type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setErrorMsg('Unsupported format. Please upload JPEG, PNG, or WebP images.');
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onImageSelected(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleClear = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    onImageSelected(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleInputChange}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleInputChange}
        className="hidden"
      />

      {errorMsg && (
        <div className="flex items-center space-x-2 text-rose-700 bg-rose-50 p-3 rounded-lg border border-rose-200 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {previewUrl ? (
        <div className="relative rounded-xl overflow-hidden border-2 border-agri-500 bg-slate-900 group">
          <img
            src={previewUrl}
            alt="Selected plant foliage"
            className="w-full h-64 object-contain bg-slate-950"
          />
          <div className="absolute top-2 right-2">
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 bg-black/60 hover:bg-black/90 text-white rounded-full transition-all shadow-md"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-xs text-white text-xs px-3 py-1.5 rounded-lg flex items-center justify-between">
            <span className="truncate">{selectedFile?.name}</span>
            <span className="font-mono text-[10px] shrink-0 ml-2">
              {((selectedFile?.size || 0) / (1024 * 1024)).toFixed(2)} MB
            </span>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleFile(e.dataTransfer.files[0]);
            }
          }}
          className="border-2 border-dashed border-slate-300 hover:border-agri-500 rounded-xl p-6 text-center bg-slate-50/50 hover:bg-agri-50/30 transition-all cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-12 h-12 mx-auto rounded-full bg-agri-100 flex items-center justify-center text-agri-700 mb-3 shadow-inner">
            <ImageIcon className="w-6 h-6" />
          </div>

          <p className="text-sm font-semibold text-slate-800">
            Click to upload leaf or plant photograph
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Supports JPEG, PNG, WebP up to 8 MB
          </p>

          <div className="flex items-center justify-center space-x-3 mt-4 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:border-agri-500 text-slate-700 rounded-lg text-xs font-semibold shadow-xs"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span>Browse Files</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                cameraInputRef.current?.click();
              }}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-agri-600 hover:bg-agri-700 text-white rounded-lg text-xs font-semibold shadow-xs"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Take Photo</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

