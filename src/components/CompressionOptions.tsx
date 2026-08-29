import React from 'react';
import type { OutputType, CompressionOptions } from '../types';
import { useTranslation } from '../i18n';

interface CompressionOptionsProps {
  options: CompressionOptions;
  outputType: OutputType;
  onOptionsChange: (options: CompressionOptions) => void;
  onOutputTypeChange: (type: OutputType) => void;
}

export function CompressionOptions({
  options,
  outputType,
  onOptionsChange,
  onOutputTypeChange,
}: CompressionOptionsProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-3">
          {t.outputFormat}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {(['avif', 'jpeg', 'jxl', 'png', 'webp'] as const).map((format) => {
            const active = outputType === format;
            return (
              <button
                key={format}
                type="button"
                className={`px-4 py-2.5 rounded-lg text-sm font-semibold uppercase tracking-wide transition-all duration-150 ${
                  active
                    ? 'bg-gradient-to-br from-slate-900 to-slate-700 text-white shadow-md shadow-slate-900/20 scale-[1.02]'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
                onClick={() => onOutputTypeChange(format)}
              >
                {format}
              </button>
            );
          })}
        </div>
      </div>

      {outputType !== 'png' && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-semibold text-slate-700">
              {t.qualityLabel(options.quality)}
            </label>
            <span className="text-xs text-slate-400 font-medium">
              {options.quality < 40
                ? 'Smallest'
                : options.quality > 75
                ? 'Highest'
                : 'Balanced'}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            value={options.quality}
            onChange={(e) =>
              onOptionsChange({ quality: Number(e.target.value) })
            }
            className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-orange-500"
            style={{
              background: `linear-gradient(to right, #f97316 0%, #f97316 ${options.quality}%, #e2e8f0 ${options.quality}%, #e2e8f0 100%)`,
            }}
          />
          <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
            <span>1%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      )}
    </div>
  );
}