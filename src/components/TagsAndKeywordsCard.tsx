import React, { useState } from 'react';
import { Tag, Hash, Copy, Check, Info, Sparkles, Filter } from 'lucide-react';
import { VideoMetadata } from '../types';

interface TagsAndKeywordsCardProps {
  video: VideoMetadata;
  lang: 'hi' | 'en';
}

export const TagsAndKeywordsCard: React.FC<TagsAndKeywordsCardProps> = ({ video, lang }) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [copiedSingleTag, setCopiedSingleTag] = useState<string | null>(null);
  const [tagFilter, setTagFilter] = useState<string>('');

  const keywords = video.keywords || [];
  const hashtags = video.hashtags || [];

  // YouTube Studio has a 500 characters limit for tags box
  const commaSeparatedKeywords = keywords.join(', ');
  const totalCharacters = commaSeparatedKeywords.length;

  const handleCopyAllKeywords = () => {
    navigator.clipboard.writeText(commaSeparatedKeywords);
    setCopiedType('keywords');
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleCopyAllHashtags = () => {
    const hashText = hashtags.map((h) => `#${h}`).join(' ');
    navigator.clipboard.writeText(hashText);
    setCopiedType('hashtags');
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleCopySingle = (tag: string) => {
    navigator.clipboard.writeText(tag);
    setCopiedSingleTag(tag);
    setTimeout(() => setCopiedSingleTag(null), 1500);
  };

  const filteredKeywords = keywords.filter((k) =>
    k.toLowerCase().includes(tagFilter.toLowerCase())
  );

  return (
    <section id="keywords-section" className="w-full bg-[#111827]/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Tag className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              {lang === 'hi' ? 'वीडियो के कीवर्ड्स और हैशटैग्स' : 'Keywords & Hashtags Used in Video'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {lang === 'hi'
              ? 'इस वीडियो के ओरिजिनल क्रिएटर ने जो गुप्त कीवर्ड्स और टैग्स YouTube Studio में लगाए थे, वो यहाँ नीचे हैं। सीधे कॉपी करके अपने वीडियो में लगाएँ!'
              : 'The hidden creator tags and keywords configured inside YouTube Studio for this video. Copy directly to rank higher!'}
          </p>
        </div>

        {/* Quick Copy Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {keywords.length > 0 && (
            <button
              onClick={handleCopyAllKeywords}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all cursor-pointer active:scale-95"
            >
              {copiedType === 'keywords' ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>{lang === 'hi' ? 'सभी कीवर्ड्स कॉपी हो गए! ✓' : 'All Tags Copied! ✓'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>{lang === 'hi' ? 'YouTube Studio टैग्स कॉपी करें' : 'Copy All Tags (Studio)'}</span>
                </>
              )}
            </button>
          )}

          {hashtags.length > 0 && (
            <button
              onClick={handleCopyAllHashtags}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-all cursor-pointer active:scale-95"
            >
              {copiedType === 'hashtags' ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{lang === 'hi' ? 'हैशटैग कॉपी हुए!' : 'Hashtags Copied!'}</span>
                </>
              ) : (
                <>
                  <Hash className="w-4 h-4 text-rose-400" />
                  <span>{lang === 'hi' ? 'सभी हैशटैग्स कॉपी करें' : 'Copy All #Hashtags'}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Meta indicator bar: YouTube Studio character limit guide */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-900/60 rounded-2xl p-3.5 mb-5 border border-slate-800/80 gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span className="text-slate-300">
            {lang === 'hi'
              ? 'YouTube Studio में टैग्स के लिए अधिकतम 500 वर्ण (Characters) की सीमा होती है।'
              : 'YouTube Studio allows up to 500 characters in the video tags box.'}
          </span>
        </div>

        <div className="flex items-center space-x-3 text-slate-400">
          <span>
            {lang === 'hi' ? 'कुल कीवर्ड्स:' : 'Total tags:'}{' '}
            <strong className="text-white">{keywords.length}</strong>
          </span>
          <span className="text-slate-600">|</span>
          <span>
            {lang === 'hi' ? 'कुल वर्ण:' : 'Characters:'}{' '}
            <strong className={totalCharacters > 500 ? 'text-amber-400' : 'text-emerald-400'}>
              {totalCharacters}
            </strong>{' '}
            / 500
          </span>
        </div>
      </div>

      {/* Filter search if many keywords */}
      {keywords.length > 8 && (
        <div className="mb-4">
          <div className="relative max-w-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              placeholder={lang === 'hi' ? 'टैग्स में खोजें...' : 'Filter keywords...'}
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      )}

      {/* Keywords Chips */}
      {keywords.length === 0 ? (
        <div className="text-center py-8 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800">
          <p className="text-sm text-slate-400 mb-1">
            {lang === 'hi'
              ? 'इस वीडियो में क्रिएटर ने कोई खास अलग टैग नहीं दिया था।'
              : 'No hidden tags were specified by the creator on this video.'}
          </p>
          <p className="text-xs text-slate-500">
            {lang === 'hi'
              ? 'चिंता न करें, आप नीचे दिए गए "AI SEO बूस्टर" से इस वीडियो के लिए बेस्ट वायरल टैग्स बना सकते हैं!'
              : 'Use the AI Studio Booster below to auto-generate high-ranking tags for this topic!'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {filteredKeywords.map((tag, idx) => {
              const isCopied = copiedSingleTag === tag;
              return (
                <button
                  key={idx}
                  onClick={() => handleCopySingle(tag)}
                  className={`group flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer border ${
                    isCopied
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-900/90 text-slate-200 border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800'
                  }`}
                  title={lang === 'hi' ? 'कॉपी करने के लिए क्लिक करें' : 'Click to copy tag'}
                >
                  <Tag className="w-3 h-3 text-indigo-400 group-hover:text-indigo-300" />
                  <span>{tag}</span>
                  {isCopied ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick instructions */}
          <p className="text-[11px] text-slate-500 italic">
            💡 {lang === 'hi'
              ? 'टिप: किसी भी टैग पर क्लिक करके उसे अकेले कॉपी करें, या ऊपर बटन से सभी टैग्स एक साथ कॉपी करके YouTube Studio के "Tags" बॉक्स में पेस्ट करें।'
              : 'Tip: Click any individual tag to copy it, or use the top button to copy all tags formatted for YouTube Studio.'}
          </p>
        </div>
      )}

      {/* Hashtags Section if present */}
      {hashtags.length > 0 && (
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Hash className="w-4 h-4 text-rose-400" />
              <span>{lang === 'hi' ? 'वीडियो में उपयोग किए गए हैशटैग्स (#)' : 'Hashtags Used in Video'}</span>
            </h3>
            <span className="text-xs text-slate-400">{hashtags.length} {lang === 'hi' ? 'हैशटैग्स' : 'hashtags'}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {hashtags.map((h, i) => (
              <button
                key={i}
                onClick={() => handleCopySingle(`#${h}`)}
                className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-white border border-rose-500/20 text-xs font-medium transition-colors cursor-pointer flex items-center space-x-1"
              >
                <span>#{h}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
