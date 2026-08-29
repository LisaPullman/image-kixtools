import React, { useState, useCallback } from 'react';
import { Image, Trash2, BookOpen, Sparkles } from 'lucide-react';
import { CompressionOptions } from './components/CompressionOptions';
import { DropZone } from './components/DropZone';
import { ImageList } from './components/ImageList';
import { DownloadAll } from './components/DownloadAll';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { FoxaiLogo } from './components/FoxaiLogo';
import { useImageQueue } from './hooks/useImageQueue';
import { DEFAULT_QUALITY_SETTINGS } from './utils/formatDefaults';
import { useTranslation } from './i18n';
import type { ImageFile, OutputType, CompressionOptions as CompressionOptionsType } from './types';

export function App() {
  const { lang, t } = useTranslation();
  const [images, setImages] = useState<ImageFile[]>([]);
  const [outputType, setOutputType] = useState<OutputType>('webp');
  const [options, setOptions] = useState<CompressionOptionsType>({
    quality: DEFAULT_QUALITY_SETTINGS.webp,
  });

  const { addToQueue } = useImageQueue(options, outputType, setImages);

  const handleOutputTypeChange = useCallback((type: OutputType) => {
    setOutputType(type);
    if (type !== 'png') {
      setOptions({ quality: DEFAULT_QUALITY_SETTINGS[type] });
    }
  }, []);

  const handleFilesDrop = useCallback((newImages: ImageFile[]) => {
    // First add all images to state
    setImages((prev) => [...prev, ...newImages]);

    // Use requestAnimationFrame to wait for render to complete
    requestAnimationFrame(() => {
      // Then add to queue after UI has updated
      newImages.forEach(image => addToQueue(image.id));
    });
  }, [addToQueue]);

  const handleRemoveImage = useCallback((id: string) => {
    setImages((prev) => {
      const image = prev.find(img => img.id === id);
      if (image?.preview) {
        URL.revokeObjectURL(image.preview);
      }
      return prev.filter(img => img.id !== id);
    });
  }, []);

  const handleClearAll = useCallback(() => {
    images.forEach(image => {
      if (image.preview) {
        URL.revokeObjectURL(image.preview);
      }
    });
    setImages([]);
  }, [images]);

  const handleDownloadAll = useCallback(async () => {
    const completedImages = images.filter((img) => img.status === "complete");

    for (const image of completedImages) {
      if (image.blob && image.outputType) {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(image.blob);
        link.download = `${image.file.name.split(".")[0]}.${image.outputType}`;
        link.click();
        URL.revokeObjectURL(link.href);
      }

      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }, [images]);

  const completedImages = images.filter(img => img.status === 'complete').length;
  const blogHref = lang === 'en' ? '/blog/' : '/zh-CN/blog/';

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background gradient layer */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(1200px 600px at 10% -10%, rgba(249,115,22,0.18), transparent 60%),' +
            'radial-gradient(900px 500px at 100% 0%, rgba(59,130,246,0.18), transparent 55%),' +
            'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
        }}
      />
      {/* Subtle grid overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(15,23,42,0.05) 1px, transparent 1px),' +
            'linear-gradient(90deg, rgba(15,23,42,0.05) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          maskImage:
            'radial-gradient(ellipse at center, black 60%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at center, black 60%, transparent 100%)',
        }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Top bar: foxai logo (left) + language switcher (right) */}
        <header className="flex items-center justify-between mb-10 sm:mb-14">
          <a
            href="/"
            className="inline-flex items-center group"
            aria-label="foxai"
          >
            <FoxaiLogo size={42} />
          </a>
          <LanguageSwitcher />
        </header>

        {/* Hero */}
        <section className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 backdrop-blur border border-slate-200 text-xs font-medium text-slate-600 mb-5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>100% in-browser · No upload · Privacy-first</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
              {t.brand}
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {t.tagline}
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-slate-500">
            {['AVIF', 'WebP', 'JPEG', 'JPEG XL', 'PNG'].map((fmt) => (
              <span
                key={fmt}
                className="px-2.5 py-1 rounded-md bg-white/80 border border-slate-200 shadow-sm"
              >
                {fmt}
              </span>
            ))}
          </div>
        </section>

        {/* Main card with all controls */}
        <main className="space-y-6">
          <div className="rounded-2xl bg-white/80 backdrop-blur border border-slate-200 shadow-xl shadow-slate-900/5 p-5 sm:p-7">
            <CompressionOptions
              options={options}
              outputType={outputType}
              onOptionsChange={setOptions}
              onOutputTypeChange={handleOutputTypeChange}
            />
            <div className="mt-5">
              <DropZone onFilesDrop={handleFilesDrop} />
            </div>

            {completedImages > 0 && (
              <div className="mt-5">
                <DownloadAll onDownloadAll={handleDownloadAll} count={completedImages} />
              </div>
            )}

            {images.length > 0 && (
              <div className="mt-5">
                <ImageList images={images} onRemove={handleRemoveImage} />
                <button
                  onClick={handleClearAll}
                  className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  {t.clearAll}
                </button>
              </div>
            )}
          </div>

          {/* Blog card */}
          <a
            href={blogHref}
            className="group flex items-center gap-4 p-5 bg-white/80 backdrop-blur rounded-2xl border border-slate-200 hover:border-orange-400 hover:shadow-lg hover:shadow-orange-500/10 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center flex-shrink-0 shadow-md shadow-orange-500/20">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-900">{t.blogCardTitle}</p>
              <p className="text-sm text-slate-500 mt-0.5">{t.blogCardDesc}</p>
            </div>
            <span className="text-sm font-medium text-orange-600 group-hover:translate-x-0.5 transition-transform whitespace-nowrap">
              {t.blogCardCta} →
            </span>
          </a>

          {/* Feature highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: Image, label: 'Multi-format' },
              { icon: Sparkles, label: 'AI-quality' },
              { icon: Trash2, label: 'Batch' },
              { icon: BookOpen, label: 'Guides' },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center justify-center gap-1.5 py-4 px-2 bg-white/70 backdrop-blur rounded-xl border border-slate-200 text-slate-600 text-xs font-medium"
              >
                <Icon className="w-4 h-4 text-slate-400" />
                {label}
              </div>
            ))}
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-14 pt-8 border-t border-slate-200/70">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
            <div className="inline-flex items-center gap-2">
              <FoxaiLogo size={22} showWordmark={false} />
              <span className="text-slate-400">·</span>
              <span>{t.footerBefore}</span>
              <a
                href="https://kixtools.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 hover:text-orange-700 hover:underline font-medium"
              >
                {t.footerLink}
              </a>
              <span>{t.footerAfter}</span>
            </div>
            <div className="text-xs text-slate-400">
              © {new Date().getFullYear()} foxai. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}