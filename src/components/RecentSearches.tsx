import React from 'react';
import { History, Trash2, ArrowRight } from 'lucide-react';
import { VideoMetadata } from '../types';

interface RecentSearchesProps {
  history: VideoMetadata[];
  onSelectVideo: (video: VideoMetadata) => void;
  onClearHistory: () => void;
  lang: 'hi' | 'en';
}

export const RecentSearches: React.FC<RecentSearchesProps> = ({
  history,
  onSelectVideo,
  onClearHistory,
  lang,
}) => {
  if (history.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mt-6 bg-[#111827]/60 border border-slate-800 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800/80">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-300">
          <History className="w-4 h-4 text-slate-400" />
          <span>{lang === 'hi' ? 'हाल ही में निकाले गए वीडियो (इतिहास)' : 'Recently Extracted Videos'}</span>
        </div>
        <button
          onClick={onClearHistory}
          className="text-xs text-slate-500 hover:text-rose-400 flex items-center space-x-1 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{lang === 'hi' ? 'इतिहास साफ़ करें' : 'Clear'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
        {history.slice(0, 6).map((item) => (
          <button
            key={item.videoId}
            onClick={() => onSelectVideo(item)}
            className="flex items-center space-x-2.5 p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-left transition-all group cursor-pointer"
          >
            <img
              src={item.thumbnails.mq || item.thumbnails.hq}
              alt={item.title}
              className="w-14 h-10 object-cover rounded-lg flex-shrink-0 bg-black"
            />
            <div className="min-w-0 flex-1">
              <h5 className="text-xs font-semibold text-slate-200 group-hover:text-white truncate">
                {item.title}
              </h5>
              <p className="text-[10px] text-slate-400 truncate">{item.channelTitle}</p>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-red-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
};
