import React, { useState } from 'react';
import { AlignLeft, Copy, Check, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { VideoMetadata } from '../types';

interface DescriptionCardProps {
  video: VideoMetadata;
  lang: 'hi' | 'en';
}

export const DescriptionCard: React.FC<DescriptionCardProps> = ({ video, lang }) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const description = video.description || '';
  const wordCount = description.trim() ? description.trim().split(/\s+/).length : 0;
  const charCount = description.length;

  const handleCopy = () => {
    navigator.clipboard.writeText(description);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isLong = description.length > 500;
  const displayedText = isLong && !isExpanded ? description.substring(0, 500) + '...' : description;

  return (
    <section id="description-section" className="w-full bg-[#111827]/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <AlignLeft className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              {lang === 'hi' ? 'वीडियो का पूरा डिस्क्रिप्शन' : 'Full Video Description'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {lang === 'hi'
              ? 'ओरिजिनल वीडियो का संपूर्ण विवरण, लिंक्स, टाइमस्टैम्प्स और क्रेडिट्स।'
              : 'Original description including all links, chapters, timestamps, and credits.'}
          </p>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg shadow-teal-600/20 transition-all cursor-pointer active:scale-95 self-start sm:self-auto"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>{lang === 'hi' ? 'डिस्क्रिप्शन कॉपी हो गया! ✓' : 'Description Copied! ✓'}</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>{lang === 'hi' ? 'डिस्क्रिप्शन कॉपी करें' : 'Copy Description'}</span>
            </>
          )}
        </button>
      </div>

      {/* Stats bar */}
      <div className="flex items-center space-x-4 text-xs text-slate-400 mb-3 px-1">
        <span>
          {lang === 'hi' ? 'शब्द:' : 'Words:'} <strong className="text-white">{wordCount}</strong>
        </span>
        <span className="text-slate-600">•</span>
        <span>
          {lang === 'hi' ? 'वर्ण:' : 'Characters:'}{' '}
          <strong className="text-white">{charCount}</strong>
        </span>
      </div>

      {/* Description Content Box */}
      <div className="relative bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-line selection:bg-teal-500/30">
        {displayedText || (
          <span className="text-slate-500 italic">
            {lang === 'hi' ? 'कोई डिस्क्रिप्शन उपलब्ध नहीं है।' : 'No description provided for this video.'}
          </span>
        )}

        {/* Expand / Collapse Button if long */}
        {isLong && (
          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-center">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <span>
                {isExpanded
                  ? lang === 'hi'
                    ? 'कम दिखाएं'
                    : 'Show Less'
                  : lang === 'hi'
                  ? 'पूरा विवरण देखें (+)'
                  : 'Show Full Description (+)'}
              </span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
