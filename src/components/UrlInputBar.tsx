import React, { useState } from 'react';
import { Search, Clipboard, X, Sparkles, Film, Music, Flame, Zap } from 'lucide-react';

interface UrlInputBarProps {
  onExtract: (url: string) => void;
  isLoading: boolean;
  lang: 'hi' | 'en';
}

const SAMPLE_VIDEOS = [
  {
    label: '🎵 Music / Viral Song',
    url: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk', // Despacito
    tag: '4K / 1080p',
  },
  {
    label: '🚀 Tech & AI Review',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    tag: 'Full HD',
  },
  {
    label: '📱 YouTube Shorts',
    url: 'https://www.youtube.com/shorts/3i_oWJzHjG8',
    tag: 'Shorts',
  },
  {
    label: '🎬 Hindi Creator Guide',
    url: 'https://www.youtube.com/watch?v=L_LUpnjgPso',
    tag: 'Trending',
  },
];

export const UrlInputBar: React.FC<UrlInputBarProps> = ({ onExtract, isLoading, lang }) => {
  const [inputUrl, setInputUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;
    onExtract(inputUrl.trim());
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputUrl(text);
        onExtract(text);
      }
    } catch (err) {
      console.warn('Clipboard read failed:', err);
    }
  };

  const handleSelectSample = (url: string) => {
    setInputUrl(url);
    onExtract(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Hero Headline */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold mb-4">
          <Zap className="w-3.5 h-3.5 fill-red-400" />
          <span>
            {lang === 'hi'
              ? 'फुल एचडी वीडियो डाउनलोड • थंबनेल • छुपे हुए कीवर्ड्स • स्टूडियो री-अपलोड'
              : 'Full HD Video • HD Thumbnails • Hidden Keywords • Studio Direct Re-upload'}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight sm:leading-none mb-3">
          {lang === 'hi' ? (
            <>
              YouTube Video Link <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-amber-400">यहाँ डालें 🔗</span>
            </>
          ) : (
            <>
              Download YouTube Video in <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-amber-400">Full HD & Tags</span>
            </>
          )}
        </h1>

        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
          {lang === 'hi'
            ? 'किसी भी यूट्यूब वीडियो का लिंक डालें और पाएँ 1080p वीडियो, ओरिजिनल थंबनेल, टाइटल, डिस्क्रिप्शन और वीडियो में इस्तेमाल किए गए सभी सीक्रेट कीवर्ड्स और हैशटैग्स। डायरेक्ट अपने चैनल पर भी अपलोड करें!'
            : 'Paste any YouTube link to instantly download 1080p MP4, original HD thumbnails, description, and copy all hidden tags & keywords used by the creator.'}
        </p>
      </div>

      {/* Main Search Input Form */}
      <form onSubmit={handleSubmit} className="relative group">
        <div className="relative flex items-center bg-[#111827] border-2 border-slate-700/80 hover:border-red-500/60 focus-within:border-red-500 rounded-2xl shadow-2xl shadow-black/60 transition-all p-2 sm:p-2.5">
          {/* Search Icon */}
          <div className="pl-3 pr-2 text-slate-400 group-focus-within:text-red-500 transition-colors">
            <Search className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>

          {/* Text Input */}
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder={
              lang === 'hi'
                ? 'YouTube वीडियो का लिंक यहाँ पेस्ट करें... (उदा. https://youtube.com/watch?v=...)'
                : 'Paste YouTube video or Shorts link here... (e.g. https://youtu.be/...)'
            }
            className="w-full bg-transparent border-none focus:outline-none text-white text-sm sm:text-base placeholder-slate-500 px-2 font-medium"
            disabled={isLoading}
          />

          {/* Actions inside Input */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 pr-1">
            {inputUrl && (
              <button
                type="button"
                onClick={() => setInputUrl('')}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Clear"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={handlePaste}
              className="hidden sm:flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-300 hover:text-white border border-slate-700 transition-all"
              title="Paste from clipboard"
            >
              <Clipboard className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'पेस्ट करें' : 'Paste'}</span>
            </button>

            <button
              type="submit"
              disabled={isLoading || !inputUrl.trim()}
              className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm shadow-lg shadow-red-600/30 hover:shadow-red-600/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="hidden sm:inline">
                    {lang === 'hi' ? 'खोज रहे हैं...' : 'Extracting...'}
                  </span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{lang === 'hi' ? 'डिटेल्स निकालें ⚡' : 'Get Video ⚡'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Preset Demo Videos for Quick Testing */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
        <span className="text-slate-500 font-medium flex items-center gap-1">
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          {lang === 'hi' ? 'त्वरित टेस्ट करें:' : 'Try Sample:'}
        </span>
        {SAMPLE_VIDEOS.map((sample, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSelectSample(sample.url)}
            className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 hover:text-white transition-all text-xs cursor-pointer group"
          >
            <span>{sample.label}</span>
            <span className="text-[10px] bg-red-500/20 text-red-300 px-1.5 py-0.2 rounded-md font-semibold">
              {sample.tag}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
