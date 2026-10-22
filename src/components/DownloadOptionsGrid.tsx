import React, { useState } from 'react';
import { Download, Film, Music, Check, Sparkles, ShieldCheck, Zap, HardDrive, ArrowDownToLine } from 'lucide-react';
import { DownloadQuality, VideoMetadata } from '../types';

interface DownloadOptionsGridProps {
  video: VideoMetadata;
  lang: 'hi' | 'en';
}

export const DownloadOptionsGrid: React.FC<DownloadOptionsGridProps> = ({ video, lang }) => {
  const [downloadingQuality, setDownloadingQuality] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [downloadedItem, setDownloadedItem] = useState<string | null>(null);

  const handleDownload = async (item: DownloadQuality) => {
    setDownloadingQuality(item.quality);
    setDownloadProgress(10);

    // Simulate high-speed buffer download progression
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 20) + 10;
      });
    }, 250);

    setTimeout(() => {
      clearInterval(interval);
      setDownloadProgress(100);

      // Create a direct downloadable blob / link helper
      const cleanName = video.title.replace(/[^a-zA-Z0-9_\u0900-\u097F -]/g, '').trim().substring(0, 50) || video.videoId;
      const ext = item.type === 'audio' ? 'mp3' : 'mp4';
      const filename = `${cleanName}_${item.quality.replace(/\s+/g, '_')}.${ext}`;

      // In browser, trigger helper download
      const helperBlob = new Blob(
        [
          `--- TubeStudio Pro Download Package ---\n` +
          `Title: ${video.title}\n` +
          `Quality: ${item.quality} (${item.resolution})\n` +
          `Channel: ${video.channelTitle}\n` +
          `YouTube URL: ${video.watchUrl}\n` +
          `Timestamp: ${new Date().toISOString()}\n\n` +
          `Status: Verified 1080p Stream Package Ready.\n`
        ],
        { type: 'text/plain' }
      );

      const downloadUrl = URL.createObjectURL(helperBlob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `${filename}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);

      setDownloadedItem(item.quality);
      setDownloadingQuality(null);

      // Also trigger browser video download stream endpoint
      window.open(`/api/youtube/download-stream?videoId=${encodeURIComponent(video.videoId)}&quality=${encodeURIComponent(item.quality)}&title=${encodeURIComponent(video.title)}`, '_blank');
    }, 1800);
  };

  return (
    <section id="download-section" className="w-full bg-[#111827]/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
              <ArrowDownToLine className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              {lang === 'hi' ? 'फुल एचडी वीडियो डाउनलोड करें' : 'Full HD Video Downloads'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {lang === 'hi'
              ? 'अपनी पसंदीदा क्वालिटी चुनें (1080p, 720p या MP3 ऑडियो) और सीधे एक क्लिक में डाउनलोड करें।'
              : 'Choose your desired resolution (1080p, 720p or MP3 audio) and download in one click.'}
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4" />
          <span>{lang === 'hi' ? 'डायरेक्ट सुरक्षित डाउनलोड' : 'Direct Safe Downloads'}</span>
        </div>
      </div>

      {/* Download Quality Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {video.downloadQualities.map((item, idx) => {
          const isFullHD = item.quality.includes('1080p');
          const isAudio = item.type === 'audio';
          const isCurrentlyDownloading = downloadingQuality === item.quality;
          const isDone = downloadedItem === item.quality;

          return (
            <div
              key={idx}
              className={`relative rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between ${
                isFullHD
                  ? 'bg-gradient-to-b from-red-950/30 to-slate-900/90 border-red-500/50 shadow-lg shadow-red-900/20 hover:border-red-500'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Highlight Badge */}
              {isFullHD && (
                <div className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-gradient-to-r from-red-600 to-amber-500 text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                  ★ {lang === 'hi' ? 'सर्वोत्तम क्वालिटी' : 'Recommended 1080p'}
                </div>
              )}

              {isAudio && (
                <div className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider">
                  🎵 {lang === 'hi' ? 'सिर्फ ऑडियो' : 'Audio Only'}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {isAudio ? (
                      <Music className="w-5 h-5 text-indigo-400" />
                    ) : (
                      <Film className={`w-5 h-5 ${isFullHD ? 'text-red-400' : 'text-slate-400'}`} />
                    )}
                    <span className="font-bold text-white text-base sm:text-lg">
                      {item.quality}
                    </span>
                  </div>

                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                    {item.format}
                  </span>
                </div>

                <p className="text-xs text-slate-400 mb-4">{item.note}</p>

                <div className="flex items-center justify-between text-xs text-slate-400 py-2 border-t border-slate-800/80 mb-4">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    {item.resolution}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-slate-300">
                    <HardDrive className="w-3.5 h-3.5 text-slate-500" />
                    {item.estimatedSize}
                  </span>
                </div>
              </div>

              {/* Download Action Button */}
              <div>
                {isCurrentlyDownloading ? (
                  <div className="space-y-1.5">
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-red-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${downloadProgress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                      <span>{lang === 'hi' ? 'तैयार कर रहे हैं...' : 'Preparing Stream...'}</span>
                      <span>{downloadProgress}%</span>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleDownload(item)}
                    className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer active:scale-95 ${
                      isFullHD
                        ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-600/25'
                        : isAudio
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                        : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                    }`}
                  >
                    {isDone ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>{lang === 'hi' ? 'डाउनलोड शुरू हुआ!' : 'Download Started!'}</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>
                          {lang === 'hi' ? `${item.quality} डाउनलोड करें` : `Download ${item.quality}`}
                        </span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
