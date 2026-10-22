import React from 'react';
import { Youtube, Radio, CheckCircle, ExternalLink, Globe } from 'lucide-react';
import { ChannelProfile } from '../types';

interface HeaderProps {
  channel: ChannelProfile | null;
  onOpenConnectModal: () => void;
  lang: 'hi' | 'en';
  onToggleLang: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  channel,
  onOpenConnectModal,
  lang,
  onToggleLang,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#0b0f17]/85 border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <div className="relative group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 via-red-500 to-rose-400 flex items-center justify-center shadow-lg shadow-red-500/25 group-hover:scale-105 transition-transform">
              <Youtube className="w-6 h-6 text-white fill-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0b0f17]"></div>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
                TubeStudio <span className="text-red-500 font-black">PRO</span>
              </span>
              <span className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20 rounded-md">
                HD & Studio Uploader
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              {lang === 'hi'
                ? 'यूट्यूब वीडियो, थंबनेल, टैग्स डाउनलोडर और डायरेक्ट चैनल अपलोडर'
                : 'YouTube HD Video, Tags & Thumbnail Downloader with Direct Studio Upload'}
            </p>
          </div>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center space-x-3">
          {/* Language Toggle Button */}
          <button
            onClick={onToggleLang}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/60 text-xs font-medium text-slate-300 hover:text-white transition-colors"
            title={lang === 'hi' ? 'Switch to English' : 'हिंदी में बदलें'}
          >
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span>{lang === 'hi' ? 'हिन्दी (Active)' : 'English'}</span>
          </button>

          {/* YouTube Studio Connected Badge / Connect Button */}
          {channel ? (
            <button
              onClick={onOpenConnectModal}
              className="flex items-center space-x-2.5 px-3.5 py-1.5 rounded-xl bg-red-500/10 border border-red-500/30 hover:border-red-500/60 hover:bg-red-500/20 transition-all group"
            >
              <div className="relative">
                {channel.avatar ? (
                  <img
                    src={channel.avatar}
                    alt={channel.title}
                    className="w-7 h-7 rounded-full object-cover border border-red-500/50"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold">
                    {channel.title.charAt(0)}
                  </div>
                )}
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-[#0b0f17]"></span>
              </div>
              <div className="text-left hidden sm:block">
                <div className="flex items-center space-x-1">
                  <span className="text-xs font-semibold text-white group-hover:text-red-400 transition-colors max-w-[120px] truncate">
                    {channel.title}
                  </span>
                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                </div>
                <span className="text-[10px] text-slate-400">
                  {lang === 'hi' ? 'स्टूडियो लिंक्ड' : 'Studio Linked'}
                </span>
              </div>
            </button>
          ) : (
            <button
              onClick={onOpenConnectModal}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-semibold shadow-lg shadow-red-600/20 hover:shadow-red-600/40 transition-all active:scale-95"
            >
              <Radio className="w-3.5 h-3.5 animate-pulse text-white" />
              <span>{lang === 'hi' ? 'YouTube Studio लिंक करें' : 'Link YouTube Studio'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
