import React, { useCallback, useState } from 'react';
import { Upload, FileImage } from 'lucide-react';
import type { ImageFile } from '../types';
import { useTranslation } from '../i18n';

interface DropZoneProps {
  onFilesDrop: (files: ImageFile[]) => void;
}

export function DropZone({ onFilesDrop }: DropZoneProps) {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files)
        .filter(
          (file) =>
            file.type.startsWith('image/') ||
            file.name.toLowerCase().endsWith('jxl')
        )
        .map((file) => ({
          id: crypto.randomUUID(),
          file,
          status: 'pending' as const,
          originalSize: file.size,
        }));
      onFilesDrop(files);
    },
    [onFilesDrop]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])
        .filter(
          (file) =>
            file.type.startsWith('image/') ||
            file.name.toLowerCase().endsWith('jxl')
        )
        .map((file) => ({
          id: crypto.randomUUID(),
          file,
          status: 'pending' as const,
          originalSize: file.size,
        }));
      onFilesDrop(files);
      e.target.value = '';
    },
    [onFilesDrop]
  );

  return (
    <div
      className={`relative rounded-xl border-2 border-dashed transition-all duration-200 ${
        isDragging
          ? 'border-orange-500 bg-orange-50/70 scale-[1.01]'
          : 'border-slate-300 bg-slate-50/60 hover:border-orange-400 hover:bg-orange-50/30'
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        type="file"
        id="fileInput"
        className="hidden"
        multiple
        accept="image/*,.jxl"
        onChange={handleFileInput}
      />
      <label
        htmlFor="fileInput"
        className="cursor-pointer flex flex-col items-center gap-3 py-12 px-4"
      >
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
            isDragging
              ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
              : 'bg-white text-orange-500 shadow-md border border-slate-200'
          }`}
        >
          {isDragging ? (
            <FileImage className="w-7 h-7" />
          ) : (
            <Upload className="w-7 h-7" />
          )}
        </div>
        <div className="text-center">
          <p className="text-base font-semibold text-slate-800">
            {t.dropTitle}
          </p>
          <p className="text-sm text-slate-500 mt-1">{t.dropSubtitle}</p>
        </div>
      </label>
    </div>
  );
}