import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  TrendingUp,
  FileText,
  Film,
  Copy,
  Check,
  RefreshCw,
  Lightbulb,
} from 'lucide-react';
import { VideoMetadata, AIOptimizationResult } from '../types';
import { requestAIOptimization } from '../services/api';

interface AIOptimizerCardProps {
  video: VideoMetadata;
  onApplyTitle: (title: string) => void;
  lang: 'hi' | 'en';
}

export const AIOptimizerCard: React.FC<AIOptimizerCardProps> = ({
  video,
  onApplyTitle,
  lang,
}) => {
  const [loading, setLoading] = useState(false);
  const [aiData, setAiData] = useState<AIOptimizationResult | null>(null);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'titles' | 'description' | 'keywords' | 'shorts'>('titles');

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const data = await requestAIOptimization({
        title: video.title,
        description: video.description,
        keywords: video.keywords,
        hashtags: video.hashtags,
      });
      setAiData(data);
    } catch (err) {
      console.error('AI optimizer error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(id);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  return (
    <section className="w-full bg-gradient-to-b from-[#131b2e] to-[#0f172a] border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Decorative ambient lights */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-indigo-500/20">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              {lang === 'hi' ? 'AI YouTube Studio बूस्टर' : 'AI YouTube Studio Booster'}
              <span className="text-[10px] bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-2 py-0.5 rounded-full font-bold">
                Smart AI
              </span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            {lang === 'hi'
              ? 'इस वीडियो के आधार पर 10x ज्यादा व्यूज पाने के लिए वायरल टाइटल्स, री-राइटेड SEO डिस्क्रिप्शन और शॉर्ट्स आइडियाज पाएँ।'
              : 'Generate viral high-CTR titles, fresh SEO descriptions without duplicate penalties, and Shorts ideas.'}
          </p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer self-start sm:self-auto disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>{lang === 'hi' ? 'जेनरेट हो रहा है...' : 'Generating AI Package...'}</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 text-amber-300" />
              <span>
                {aiData
                  ? lang === 'hi'
                    ? 'पुनः नया बनाएँ (Regenerate)'
                    : 'Regenerate'
                  : lang === 'hi'
                  ? 'AI ऑप्टिमाइज़ेशन शुरू करें'
                  : 'Start AI Optimization'}
              </span>
            </>
          )}
        </button>
      </div>

      {!aiData && !loading && (
        <div className="text-center py-8 bg-slate-900/60 rounded-2xl border border-dashed border-indigo-500/20">
          <Lightbulb className="w-10 h-10 text-indigo-400 mx-auto mb-2 opacity-80" />
          <h4 className="text-sm font-bold text-white mb-1">
            {lang === 'hi' ? 'अपने वीडियो को वायरल बनाना चाहते हैं?' : 'Want to maximize views on your channel?'}
          </h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
            {lang === 'hi'
              ? 'एक क्लिक में नए वायरल टाइटल्स, डिस्क्रिप्शन और कीवर्ड्स तैयार करें ताकि री-अपलोड करने पर भी वीडियो टॉप रैंक करे।'
              : 'Click "Start AI Optimization" above to generate high-ranking titles, SEO-friendly descriptions, and Shorts scripts.'}
          </p>
          <button
            onClick={handleGenerate}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md cursor-pointer"
          >
            {lang === 'hi' ? '✨ तुरंत AI सजेशन्स देखें' : '✨ View AI Suggestions'}
          </button>
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-400 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-200">
            {lang === 'hi'
              ? 'AI वीडियो और कीवर्ड्स का विश्लेषण कर रहा है...'
              : 'AI is analyzing video metadata & search trends...'}
          </p>
        </div>
      )}

      {aiData && !loading && (
        <div className="space-y-4">
          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-800 gap-2 pb-2">
            <button
              onClick={() => setActiveTab('titles')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'titles'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white bg-slate-900/60'
              }`}
            >
              🔥 {lang === 'hi' ? 'वायरल टाइटल्स (5)' : 'Viral Titles'}
            </button>
            <button
              onClick={() => setActiveTab('description')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'description'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white bg-slate-900/60'
              }`}
            >
              📝 {lang === 'hi' ? 'SEO डिस्क्रिप्शन' : 'SEO Description'}
            </button>
            <button
              onClick={() => setActiveTab('keywords')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'keywords'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white bg-slate-900/60'
              }`}
            >
              🏷️ {lang === 'hi' ? 'टॉप रैंकिंग टैग्स' : 'Ranking Tags'}
            </button>
            <button
              onClick={() => setActiveTab('shorts')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'shorts'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white bg-slate-900/60'
              }`}
            >
              ⚡ {lang === 'hi' ? 'शॉर्ट्स आइडियाज' : 'Shorts Ideas'}
            </button>
          </div>

          {/* TAB 1: Viral Titles */}
          {activeTab === 'titles' && (
            <div className="space-y-2.5">
              {aiData.viralTitles?.map((t, idx) => {
                const isCopied = copiedItem === `title_${idx}`;
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 transition-colors gap-3"
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-slate-200">{t}</span>
                    </div>

                    <div className="flex items-center space-x-1.5 flex-shrink-0">
                      <button
                        onClick={() => onApplyTitle(t)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/60 text-indigo-300 text-xs font-medium transition-colors"
                        title="Use this title"
                      >
                        {lang === 'hi' ? 'लागू करें' : 'Apply'}
                      </button>
                      <button
                        onClick={() => handleCopyText(t, `title_${idx}`)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        title="Copy"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: SEO Description */}
          {activeTab === 'description' && (
            <div className="relative">
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => handleCopyText(aiData.optimizedDescription, 'opt_desc')}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all cursor-pointer"
                >
                  {copiedItem === 'opt_desc' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>{lang === 'hi' ? 'कॉपी हो गया! ✓' : 'Copied! ✓'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{lang === 'hi' ? 'पूरी AI डिस्क्रिप्शन कॉपी करें' : 'Copy AI Description'}</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-xs sm:text-sm text-slate-200 font-mono whitespace-pre-line max-h-72 overflow-y-auto leading-relaxed">
                {aiData.optimizedDescription}
              </div>
            </div>
          )}

          {/* TAB 3: Keywords */}
          {activeTab === 'keywords' && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-slate-400">
                  {aiData.rankingKeywords?.length || 0} {lang === 'hi' ? 'हाई-रैंकिंग टैग्स' : 'Ranking Tags'}
                </span>
                <button
                  onClick={() => handleCopyText(aiData.rankingKeywords.join(', '), 'all_ai_tags')}
                  className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer"
                >
                  {copiedItem === 'all_ai_tags'
                    ? lang === 'hi'
                      ? 'कॉपी हुआ! ✓'
                      : 'Copied! ✓'
                    : lang === 'hi'
                    ? 'सभी AI टैग्स कॉपी करें'
                    : 'Copy All Tags'}
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {aiData.rankingKeywords?.map((kw, i) => (
                  <button
                    key={i}
                    onClick={() => handleCopyText(kw, `kw_${i}`)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-slate-200 text-xs font-medium flex items-center space-x-1"
                  >
                    <span>{kw}</span>
                    {copiedItem === `kw_${i}` && <Check className="w-3 h-3 text-emerald-400" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Shorts Ideas */}
          {activeTab === 'shorts' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {aiData.shortsIdeas?.map((item, idx) => (
                <div key={idx} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md">
                      Shorts Hook #{idx + 1}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{item.duration}</span>
                  </div>
                  <h5 className="text-xs font-bold text-white">"{item.hook}"</h5>
                  <p className="text-xs text-slate-400 leading-normal">{item.script}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};
