import React, { useState } from 'react';
import { Image, Download, ExternalLink, Sparkles, Check, ZoomIn } from 'lucide-react';
import { VideoMetadata } from '../types';
import { getThumbnailDownloadUrl } from '../services/api';

interface ThumbnailGalleryProps {
  video: VideoMetadata;
  lang: 'hi' | 'en';
}

export const ThumbnailGallery: React.FC<ThumbnailGalleryProps> = ({ video, lang }) => {
  const [downloadingQuality, setDownloadingQuality] = useState<string | null>(null);
  const [previewModalUrl, setPreviewModalUrl] = useState<string | null>(null);

  const thumbnailTiers = [
    {
      label: 'Ultra HD 1080p (MaxRes)',
      resolution: '1920 × 1080',
      key: 'maxres',
      url: video.thumbnails.maxres,
      tag: 'Best Quality',
      recommended: true,
    },
    {
      label: 'Standard Definition (SD)',
      resolution: '640 × 480',
      key: 'sd',
      url: video.thumbnails.sd,
      tag: 'SD Quality',
      recommended: false,
    },
    {
      label: 'High Quality (HQ)',
      resolution: '480 × 360',
      key: 'hq',
      url: video.thumbnails.hq,
      tag: 'HQ',
      recommended: false,
    },
    {
      label: 'Medium Quality (MQ)',
      resolution: '320 × 180',
      key: 'mq',
      url: video.thumbnails.mq,
      tag: 'Compact',
      recommended: false,
    },
  ];

  const handleDownload = (key: string) => {
    setDownloadingQuality(key);
    const downloadUrl = getThumbnailDownloadUrl(video.videoId, key, video.title);

    // Create an invisible anchor tag to trigger browser download
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `${video.videoId}_thumbnail_${key}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => {
      setDownloadingQuality(null);
    }, 1500);
  };

  return (
    <section id="thumbnail-section" className="w-full bg-[#111827]/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Image className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              {lang === 'hi' ? 'एचडी थंबनेल डाउनलोड' : 'HD Thumbnails Download'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {lang === 'hi'
              ? 'यूट्यूब का असली 1080p हाई-रिज़ॉल्यूशन थंबनेल सीधे जेपीजी (JPG) में डाउनलोड करें।'
              : 'Directly download the original Full HD (1920x1080) YouTube thumbnail in pristine JPG format.'}
          </p>
        </div>

        <button
          onClick={() => handleDownload('maxres')}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-slate-950" />
          <span>{lang === 'hi' ? '1080p थंबनेल तुरंत सेव करें' : 'Download 1080p Thumbnail'}</span>
        </button>
      </div>

      {/* Grid of thumbnails */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {thumbnailTiers.map((tier) => (
          <div
            key={tier.key}
            className={`rounded-2xl border p-3 flex flex-col justify-between transition-all group ${
              tier.recommended
                ? 'bg-gradient-to-b from-amber-950/20 to-slate-900 border-amber-500/40 shadow-lg shadow-amber-500/10'
                : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              {/* Image Container */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black/60 mb-3 border border-slate-800">
                <img
                  src={tier.url}
                  alt={tier.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // Fallback to hq if maxres is unavailable
                    (e.target as HTMLImageElement).src = video.thumbnails.hq;
                  }}
                />
                <button
                  type="button"
                  onClick={() => setPreviewModalUrl(tier.url)}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                  title="Zoom preview"
                >
                  <div className="p-2 rounded-full bg-black/70 backdrop-blur-md">
                    <ZoomIn className="w-5 h-5 text-white" />
                  </div>
                </button>

                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-mono text-white">
                  {tier.resolution}
                </div>
              </div>

              {/* Title & Tag */}
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xs font-bold text-white truncate">{tier.label}</h3>
                {tier.recommended && (
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    4K/HD
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mb-3">{tier.resolution} Pixels JPG</p>
            </div>

            {/* Download Button */}
            <button
              onClick={() => handleDownload(tier.key)}
              disabled={downloadingQuality === tier.key}
              className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer active:scale-95 ${
                tier.recommended
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              {downloadingQuality === tier.key ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
                  <span>{lang === 'hi' ? 'सेव हो रहा है...' : 'Saving...'}</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>{lang === 'hi' ? 'डाउनलोड करें' : 'Download'}</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Lightbox / Zoom Modal */}
      {previewModalUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPreviewModalUrl(null)}
        >
          <div className="max-w-4xl w-full bg-slate-900 border border-slate-700 rounded-3xl p-4 shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <span className="text-sm font-bold text-white">Full Thumbnail Preview</span>
              <button
                onClick={() => setPreviewModalUrl(null)}
                className="text-slate-400 hover:text-white px-3 py-1 rounded-lg bg-slate-800 text-xs font-semibold"
              >
                Close ✕
              </button>
            </div>
            <img
              src={previewModalUrl}
              alt="Thumbnail Full Preview"
              className="w-full h-auto rounded-2xl max-h-[75vh] object-contain mx-auto"
            />
          </div>
        </div>
      )}
    </section>
  );
};
