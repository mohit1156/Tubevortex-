import React, { useState, useEffect } from 'react';
import {
  Youtube,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Sparkles,
  Download,
  Share2,
  Layers,
  ArrowUp,
} from 'lucide-react';
import { VideoMetadata, ChannelProfile } from './types';
import { extractVideoInfo } from './services/api';
import { Header } from './components/Header';
import { UrlInputBar } from './components/UrlInputBar';
import { VideoPlayerCard } from './components/VideoPlayerCard';
import { DownloadOptionsGrid } from './components/DownloadOptionsGrid';
import { ThumbnailGallery } from './components/ThumbnailGallery';
import { TagsAndKeywordsCard } from './components/TagsAndKeywordsCard';
import { DescriptionCard } from './components/DescriptionCard';
import { StudioConnectModal } from './components/StudioConnectModal';
import { StudioUploadModal } from './components/StudioUploadModal';
import { AIOptimizerCard } from './components/AIOptimizerCard';
import { RecentSearches } from './components/RecentSearches';

export default function App() {
  const [video, setVideo] = useState<VideoMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [lang, setLang] = useState<'hi' | 'en'>('hi');

  // Studio Channel & Auth
  const [channel, setChannel] = useState<ChannelProfile | null>(null);
  const [accessToken, setAccessToken] = useState<string>('');
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Search history
  const [history, setHistory] = useState<VideoMetadata[]>([]);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Initialize with initial video & saved channel if present
  useEffect(() => {
    try {
      const savedChannel = localStorage.getItem('tubestudio_channel');
      if (savedChannel) {
        setChannel(JSON.parse(savedChannel));
      }

      const savedHistory = localStorage.getItem('tubestudio_history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.warn('Storage read error:', e);
    }

    // Load initial sample video so the screen is lively on first view
    handleExtract('https://www.youtube.com/watch?v=dQw4w9WgXcQ');

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleExtract = async (url: string) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const data = await extractVideoInfo(url);
      setVideo(data);

      // Save to recent searches history
      setHistory((prev) => {
        const filtered = prev.filter((item) => item.videoId !== data.videoId);
        const updated = [data, ...filtered].slice(0, 8);
        try {
          localStorage.setItem('tubestudio_history', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to extract video details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectChannel = (profile: ChannelProfile, token?: string) => {
    setChannel(profile);
    if (token) setAccessToken(token);
    try {
      localStorage.setItem('tubestudio_channel', JSON.stringify(profile));
    } catch (e) {}
  };

  const handleDisconnectChannel = () => {
    setChannel(null);
    setAccessToken('');
    try {
      localStorage.removeItem('tubestudio_channel');
    } catch (e) {}
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('tubestudio_history');
    } catch (e) {}
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleApplyTitle = (newTitle: string) => {
    if (video) {
      setVideo({ ...video, title: newTitle });
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col font-sans selection:bg-red-600/30">
      {/* Top Navigation */}
      <Header
        channel={channel}
        onOpenConnectModal={() => setIsConnectModalOpen(true)}
        lang={lang}
        onToggleLang={() => setLang(lang === 'hi' ? 'en' : 'hi')}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* 1. Hero & URL Input Search Bar */}
        <UrlInputBar onExtract={handleExtract} isLoading={isLoading} lang={lang} />

        {/* Error Notification */}
        {errorMessage && (
          <div className="max-w-4xl mx-auto flex items-center space-x-3 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm animate-shake">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
            <div className="flex-1">
              <strong className="font-bold">
                {lang === 'hi' ? 'त्रुटि (Error): ' : 'Error: '}
              </strong>
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage('')}
              className="text-xs text-rose-400 hover:text-white px-2 py-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Recent Searches */}
        <RecentSearches
          history={history}
          onSelectVideo={(item) => setVideo(item)}
          onClearHistory={handleClearHistory}
          lang={lang}
        />

        {/* Video Loaded Data View */}
        {video && (
          <div className="space-y-10 animate-in fade-in duration-300">
            {/* 2. Video Player & Primary Overview */}
            <VideoPlayerCard
              video={video}
              onOpenUploadModal={() => {
                if (!channel) {
                  setIsConnectModalOpen(true);
                } else {
                  setIsUploadModalOpen(true);
                }
              }}
              onScrollToSection={scrollToSection}
              lang={lang}
            />

            {/* 3. Full HD Video Downloader Grid */}
            <DownloadOptionsGrid video={video} lang={lang} />

            {/* 4. HD Thumbnail Extractor & Downloads */}
            <ThumbnailGallery video={video} lang={lang} />

            {/* 5. Extracted Hidden Keywords & Hashtags */}
            <TagsAndKeywordsCard video={video} lang={lang} />

            {/* 6. Full Description Box */}
            <DescriptionCard video={video} lang={lang} />

            {/* 7. AI YouTube Studio Optimization Suite */}
            <AIOptimizerCard video={video} onApplyTitle={handleApplyTitle} lang={lang} />
          </div>
        )}
      </main>

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-xl shadow-red-600/40 transition-all cursor-pointer active:scale-90"
          title="Scroll to Top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* YouTube Studio Connect Modal */}
      <StudioConnectModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        channel={channel}
        onConnectChannel={handleConnectChannel}
        onDisconnectChannel={handleDisconnectChannel}
        onOpenUpload={() => setIsUploadModalOpen(true)}
        lang={lang}
      />

      {/* Direct YouTube Studio Video Uploader Modal */}
      <StudioUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        video={video}
        channel={channel}
        accessToken={accessToken}
        onOpenConnectModal={() => {
          setIsUploadModalOpen(false);
          setIsConnectModalOpen(true);
        }}
        lang={lang}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#090d15] py-10 mt-16 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white">
              <Youtube className="w-5 h-5 fill-white" />
            </div>
            <div>
              <span className="font-extrabold text-white text-sm">
                TubeStudio Pro
              </span>
              <p className="text-[11px] text-slate-500">
                {lang === 'hi'
                  ? 'यूट्यूब वीडियो, थंबनेल डाउनलोडर एवं स्टूडियो री-अपलोडर'
                  : 'YouTube HD Video, Tags & Thumbnail Downloader with Direct Studio Upload'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400">
            <span>✨ 1080p Full HD</span>
            <span>🖼️ 4K MaxRes Thumbnail</span>
            <span>🏷️ Hidden Creator Tags</span>
            <span>📝 Complete Description</span>
            <span>🚀 Direct Channel Uploader</span>
          </div>

          <p className="text-slate-500 text-[11px]">
            © {new Date().getFullYear()} TubeStudio Pro. Built for content creators.
          </p>
        </div>
      </footer>
    </div>
  );
}
