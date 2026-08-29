import React from 'react';
import { Download } from 'lucide-react';
import { useTranslation } from '../i18n';

interface DownloadAllProps {
  onDownloadAll: () => void;
  count: number;
}

export function DownloadAll({ onDownloadAll, count }: DownloadAllProps) {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={onDownloadAll}
      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 hover:scale-[1.01] transition-all duration-150 font-semibold shadow-md"
    >
      <Download className="w-5 h-5" />
      {t.downloadAllCount(count)}
    </button>
  );
}