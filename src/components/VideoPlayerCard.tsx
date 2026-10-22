import React, { useState } from 'react';
import {
  Play,
  Copy,
  Check,
  Eye,
  Clock,
  Calendar,
  ExternalLink,
  Download,
  Share2,
  UploadCloud,
  Hash,
  Sparkles,
} from 'lucide-react';
import { VideoMetadata } from '../types';

interface VideoPlayerCardProps {
  video: VideoMetadata;
  onOpenUploadModal: () => void;
  onScrollToSection: (sectionId: string) => void;
  lang: 'hi' | 'en';
}

export const VideoPlayerCard: React.FC<VideoPlayerCardProps> = ({
  video,
  onOpenUploadModal,
  onScrollToSection,
  lang,
}) => {
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleCopyTitle = () => {
    navigator.clipboard.writeText(video.title);
    setCopiedTitle(true);
    setTimeout(() => setCopiedTitle(false), 2000);
  };

  return (
    <div className="w-full bg-[#111827]/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start relative z-10">
        {/* Left Column: Video Preview / Embed */}
        <div className="lg:col-span-5 w-full">
          <div className="relative rounded-2xl overflow-hidden aspect-video bg-black/80 border border-slate-800 shadow-xl group">
            {isPlaying ? (
              <iframe
                src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1`}
                title={video.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="relative w-full h-full cursor-pointer" onClick={() => setIsPlaying(true)}>
                <img
                  src={video.thumbnails.maxres || video.thumbnails.hq}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    // Fallback to hq if maxres is 404
                    (e.target as HTMLImageElement).src = video.thumbnails.hq;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-2xl shadow-red-600/50 group-hover:scale-110 transition-transform">
                    <Play className="w-7 h-7 fill-white translate-x-0.5" />
                  </div>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-black/80 backdrop-blur-md text-white text-xs font-semibold flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-red-400" />
                  <span>{video.durationFormatted}</span>
                </div>

                {/* 1080p Full HD Badge */}
                <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md bg-red-600/90 backdrop-blur-md text-white text-[11px] font-black uppercase tracking-wider">
                  Full HD 1080p
                </div>
              </div>
            )}
          </div>

          {/* Quick stats row */}
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              {video.viewCountFormatted} {lang === 'hi' ? 'व्यूज' : 'views'}
            </span>
            <span className="flex items-center gap-1">
              <Hash className="w-3.5 h-3.5 text-slate-500" />
              {video.keywords?.length || 0} {lang === 'hi' ? 'कीवर्ड्स मिले' : 'Keywords'}
            </span>
            <a
              href={video.watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-slate-400 hover:text-red-400 transition-colors"
            >
              <span>{lang === 'hi' ? 'यूट्यूब पर देखें' : 'Watch on YouTube'}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Right Column: Title, Channel, & Primary Action Buttons */}
        <div className="lg:col-span-7 flex flex-col justify-between h-full">
          <div>
            {/* Channel Info Row */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <a
                  href={video.channelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>{video.channelTitle}</span>
                  <span className="w-3.5 h-3.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] flex items-center justify-center">
                    ✓
                  </span>
                </a>
              </div>

              {video.publishDate && (
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{video.publishDate}</span>
                </div>
              )}
            </div>

            {/* Video Title Header with Copy Button */}
            <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 mb-4 group hover:border-slate-700 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-base sm:text-xl font-bold text-white leading-snug">
                  {video.title}
                </h2>
                <button
                  onClick={handleCopyTitle}
                  className="flex-shrink-0 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all active:scale-90"
                  title="Copy Title"
                >
                  {copiedTitle ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-slate-400" />
                  )}
                </button>
              </div>

              <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500">
                <span>
                  {lang === 'hi' ? 'टाइटल की लंबाई:' : 'Title length:'}{' '}
                  <strong className="text-slate-300">{video.title.length}</strong> / 100
                </span>
                {copiedTitle && (
                  <span className="text-emerald-400 font-semibold animate-pulse">
                    {lang === 'hi' ? 'टाइटल कॉपी हो गया! ✓' : 'Title copied! ✓'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Primary Action Button Grid (Key requirement: Download full HD, get thumbnails, copy tags, and Studio re-upload) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            {/* 1. Download Video */}
            <button
              onClick={() => onScrollToSection('download-section')}
              className="flex items-center justify-center space-x-2.5 px-4 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm shadow-xl shadow-red-600/30 hover:shadow-red-600/50 transition-all cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>{lang === 'hi' ? 'Full HD वीडियो डाउनलोड करें' : 'Download Full HD Video'}</span>
            </button>

            {/* 2. Direct Studio Upload */}
            <button
              onClick={onOpenUploadModal}
              className="flex items-center justify-center space-x-2.5 px-4 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/25 hover:shadow-emerald-600/40 transition-all cursor-pointer active:scale-95"
            >
              <UploadCloud className="w-4 h-4" />
              <span>{lang === 'hi' ? 'अपने चैनल पर अपलोड करें' : 'Upload to My Channel'}</span>
            </button>

            {/* 3. Jump to Thumbnails */}
            <button
              onClick={() => onScrollToSection('thumbnail-section')}
              className="flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition-all cursor-pointer"
            >
              <span>🖼️ {lang === 'hi' ? 'HD थंबनेल डाउनलोड' : 'HD Thumbnails'}</span>
            </button>

            {/* 4. Jump to Tags & Keywords */}
            <button
              onClick={() => onScrollToSection('keywords-section')}
              className="flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition-all cursor-pointer"
            >
              <span>🏷️ {lang === 'hi' ? 'सभी कीवर्ड्स कॉपी करें' : 'Copy Hidden Tags'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
