import React from 'react';
import { X, CheckCircle, AlertCircle, Loader2, Download } from 'lucide-react';
import type { ImageFile } from '../types';
import { formatFileSize } from '../utils/imageProcessing';
import { downloadImage } from '../utils/download';
import { useTranslation } from '../i18n';

interface ImageListProps {
  images: ImageFile[];
  onRemove: (id: string) => void;
}

export function ImageList({ images, onRemove }: ImageListProps) {
  const { t } = useTranslation();

  if (images.length === 0) return null;

  return (
    <div className="space-y-2.5">
      {images.map((image) => (
        <div
          key={image.id}
          className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 hover:border-slate-300 hover:shadow-sm transition-all"
        >
          {image.preview && (
            <img
              src={image.preview}
              alt={image.file.name}
              className="w-14 h-14 object-cover rounded-lg border border-slate-200"
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-800 truncate">
                {image.file.name}
              </p>
              <div className="flex items-center gap-1">
                {image.status === 'complete' && (
                  <button
                    type="button"
                    onClick={() => downloadImage(image)}
                    className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                    title={t.download}
                  >
                    <Download className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onRemove(image.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  title={t.remove}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs">
              {image.status === 'pending' && (
                <span className="text-slate-500">{t.statusPending}</span>
              )}
              {image.status === 'processing' && (
                <span className="flex items-center gap-1.5 text-orange-600">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  {t.statusProcessing}
                </span>
              )}
              {image.status === 'complete' && (
                <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                  <CheckCircle className="w-3.5 h-3.5" />
                  {t.statusComplete}
                </span>
              )}
              {image.status === 'error' && (
                <span className="flex items-center gap-1.5 text-red-600">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {image.error || t.statusError}
                </span>
              )}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              {formatFileSize(image.originalSize)}
              {image.compressedSize && (
                <>
                  {' → '}
                  <span className="text-slate-700 font-medium">
                    {formatFileSize(image.compressedSize)}
                  </span>{' '}
                  <span className="text-emerald-600 font-semibold">
                    ({t.smaller(
                      Math.round(
                        ((image.originalSize - image.compressedSize) /
                          image.originalSize) *
                          100
                      )
                    )})
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}