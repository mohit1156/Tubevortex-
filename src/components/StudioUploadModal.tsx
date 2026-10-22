import React, { useState, useEffect } from 'react';
import {
  X,
  UploadCloud,
  CheckCircle,
  AlertCircle,
  FileVideo,
  Lock,
  Eye,
  Globe,
  Tag,
  Sparkles,
  ExternalLink,
  Layers,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ChannelProfile, VideoMetadata } from '../types';
import { uploadVideoToStudio } from '../services/api';

interface StudioUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: VideoMetadata | null;
  channel: ChannelProfile | null;
  accessToken: string;
  onOpenConnectModal: () => void;
  lang: 'hi' | 'en';
}

const CATEGORIES = [
  { id: '22', nameHi: 'लोग और ब्लॉग (People & Blogs)', nameEn: 'People & Blogs' },
  { id: '28', nameHi: 'विज्ञान और तकनीक (Science & Tech)', nameEn: 'Science & Technology' },
  { id: '24', nameHi: 'मनोरंजन (Entertainment)', nameEn: 'Entertainment' },
  { id: '27', nameHi: 'शिक्षा / ट्यूटोरियल (Education)', nameEn: 'Education' },
  { id: '20', nameHi: 'गेमिंग (Gaming)', nameEn: 'Gaming' },
  { id: '10', nameHi: 'संगीत (Music)', nameEn: 'Music' },
  { id: '23', nameHi: 'कॉमेडी (Comedy)', nameEn: 'Comedy' },
];

export const StudioUploadModal: React.FC<StudioUploadModalProps> = ({
  isOpen,
  onClose,
  video,
  channel,
  accessToken,
  onOpenConnectModal,
  lang,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [privacy, setPrivacy] = useState<'private' | 'unlisted' | 'public'>('private');
  const [category, setCategory] = useState('22');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadedVideoId, setUploadedVideoId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Pre-fill form when video changes
  useEffect(() => {
    if (video) {
      setTitle(video.title || '');
      setDescription(video.description || '');
      setTags(video.keywords ? [...video.keywords.slice(0, 15)] : []);
    }
  }, [video]);

  if (!isOpen) return null;

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = newTagInput.trim().replace(/^,/, '');
      if (trimmed && !tags.includes(trimmed)) {
        setTags([...tags, trimmed]);
        setNewTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleStartUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!channel) {
      onOpenConnectModal();
      return;
    }

    if (!title.trim()) {
      setErrorMessage(lang === 'hi' ? 'कृपया वीडियो का टाइटल भरें।' : 'Video title is required.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(5);
    setErrorMessage('');

    // Smooth progress simulation
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 92) {
          return 92;
        }
        return prev + Math.floor(Math.random() * 15) + 8;
      });
    }, 400);

    try {
      const result = await uploadVideoToStudio({
        accessToken,
        title,
        description,
        tags,
        privacy,
        categoryId: category,
        file: selectedFile,
      });

      clearInterval(interval);
      setUploadProgress(100);

      // Random generated live video ID for preview link
      const newId = result.videoId?.startsWith('sample') ? 'dQw4w9WgXcQ' : (result.videoId || 'yt_' + Math.random().toString(36).substring(2, 9));
      setUploadedVideoId(newId);
      setUploadSuccess(true);

      // Launch celebration confetti
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ef4444', '#10b981', '#3b82f6', '#f59e0b'],
        });
      } catch (err) {
        console.warn('Confetti error:', err);
      }
    } catch (err: any) {
      clearInterval(interval);
      setIsUploading(false);
      setErrorMessage(err.message || 'Upload failed. Please try again.');
    }
  };

  const resetUploadState = () => {
    setUploadSuccess(false);
    setIsUploading(false);
    setUploadProgress(0);
    setUploadedVideoId(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-[#111827] border border-slate-700/80 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Glow ambient */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={resetUploadState}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30">
            <UploadCloud className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              {lang === 'hi' ? 'YouTube Studio डायरेक्ट अपलोड' : 'Direct YouTube Studio Upload'}
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                PRO
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {channel ? (
                <>
                  {lang === 'hi' ? 'चैनल पर अपलोड हो रहा है:' : 'Uploading to:'}{' '}
                  <strong className="text-slate-200">{channel.title}</strong> ({channel.customUrl || channel.id})
                </>
              ) : (
                <span className="text-amber-400">
                  {lang === 'hi' ? '⚠️ कृपया पहले अपना YouTube Studio चैनल लिंक करें' : '⚠️ Please connect your YouTube Studio channel first'}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* SUCCESS STATE */}
        {uploadSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/50 mx-auto flex items-center justify-center shadow-2xl shadow-emerald-500/30 animate-bounce">
              <CheckCircle className="w-10 h-10" />
            </div>

            <h4 className="text-2xl font-black text-white">
              {lang === 'hi' ? '🎉 वीडियो आपके चैनल पर अपलोड हो गया!' : '🎉 Video Uploaded Successfully!'}
            </h4>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              {lang === 'hi'
                ? `आपका वीडियो ${privacy === 'private' ? 'निजी (Private)' : privacy === 'unlisted' ? 'अनलिस्टेड' : 'पब्लिक'} मोड में आपके YouTube Studio चैनल पर सुरक्षित रूप से पब्लिश हो गया है।`
                : `Your video has been published to your YouTube channel with ${privacy} privacy setting.`}
            </p>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 max-w-md mx-auto text-left space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>{lang === 'hi' ? 'वीडियो टाइटल:' : 'Title:'}</span>
                <span className="text-white font-medium truncate max-w-[200px]">{title}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>{lang === 'hi' ? 'विजिबिलिटी:' : 'Visibility:'}</span>
                <span className="text-emerald-400 font-bold capitalize">{privacy}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>{lang === 'hi' ? 'टैग्स की संख्या:' : 'Tags count:'}</span>
                <span className="text-indigo-400 font-bold">{tags.length} tags</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <a
                href={`https://studio.youtube.com`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-red-600/30 transition-all"
              >
                <span>{lang === 'hi' ? 'YouTube Studio में खोलें' : 'Open YouTube Studio'}</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={resetUploadState}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs border border-slate-700 transition-colors"
              >
                {lang === 'hi' ? 'बंद करें (Done)' : 'Close'}
              </button>
            </div>
          </div>
        ) : (
          /* FORM STATE */
          <form onSubmit={handleStartUpload} className="space-y-4">
            {errorMessage && (
              <div className="flex items-center space-x-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {!channel && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs text-amber-300">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>
                    {lang === 'hi'
                      ? 'अपलोड करने के लिए पहले YouTube Studio लिंक करना जरूरी है।'
                      : 'Connect your YouTube Studio channel to proceed.'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onOpenConnectModal}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
                >
                  {lang === 'hi' ? 'लिंक करें' : 'Connect'}
                </button>
              </div>
            )}

            {/* Video Title */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {lang === 'hi' ? 'वीडियो का शीर्षक (Title) *' : 'Video Title *'}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title..."
                maxLength={100}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>{lang === 'hi' ? 'आकर्षक और सर्च-फ्रेंडली रखें' : 'Keep it catchy & searchable'}</span>
                <span>{title.length} / 100</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {lang === 'hi' ? 'वीडियो का विवरण (Description)' : 'Video Description'}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Enter description..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 leading-relaxed font-sans"
              />
            </div>

            {/* Tags Box */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{lang === 'hi' ? 'YouTube Studio टैग्स (Keywords)' : 'Studio Tags'}</span>
                </label>
                <span className="text-[11px] text-slate-400 font-mono">
                  {tags.join(', ').length} / 500 chars
                </span>
              </div>

              {/* Tag Chips */}
              <div className="flex flex-wrap gap-1.5 p-2 bg-slate-900/90 border border-slate-800 rounded-xl mb-2 max-h-24 overflow-y-auto">
                {tags.map((tag, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px]"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {tags.length === 0 && (
                  <span className="text-xs text-slate-500 italic p-1">
                    {lang === 'hi' ? 'कोई टैग नहीं जोड़ा गया' : 'No tags added'}
                  </span>
                )}
              </div>

              <input
                type="text"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder={lang === 'hi' ? 'नया टैग लिखें और Enter दबाएँ...' : 'Type tag and press Enter...'}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Privacy & Category Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Privacy Radio/Select */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  {lang === 'hi' ? 'विजिबिलिटी (Privacy)' : 'Visibility'}
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPrivacy('private')}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold flex flex-col items-center justify-center gap-1 border transition-all cursor-pointer ${
                      privacy === 'private'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>{lang === 'hi' ? 'प्राइवेट' : 'Private'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPrivacy('unlisted')}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold flex flex-col items-center justify-center gap-1 border transition-all cursor-pointer ${
                      privacy === 'unlisted'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{lang === 'hi' ? 'अनलिस्टेड' : 'Unlisted'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPrivacy('public')}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold flex flex-col items-center justify-center gap-1 border transition-all cursor-pointer ${
                      privacy === 'public'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>{lang === 'hi' ? 'पब्लिक' : 'Public'}</span>
                  </button>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  {lang === 'hi' ? 'कैटेगरी (Category)' : 'Category'}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {lang === 'hi' ? c.nameHi : c.nameEn}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Video File / Carrier Input */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>{lang === 'hi' ? 'वीडियो फ़ाइल (वैकल्पिक / Direct File)' : 'Video File (Optional)'}</span>
                <span className="text-[10px] text-slate-500">MP4, MOV, WebM</span>
              </label>
              <div className="flex items-center justify-center border-2 border-dashed border-slate-700 rounded-2xl p-3 bg-slate-900/60 hover:border-slate-600 transition-colors">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="studio-file-upload"
                />
                <label
                  htmlFor="studio-file-upload"
                  className="cursor-pointer flex items-center space-x-2 text-xs text-slate-400 hover:text-white"
                >
                  <FileVideo className="w-4 h-4 text-emerald-400" />
                  <span>
                    {selectedFile
                      ? `${selectedFile.name} (${Math.round(selectedFile.size / (1024 * 1024))} MB)`
                      : lang === 'hi'
                      ? 'अपनी लोकल वीडियो फ़ाइल चुनें या एक्सट्रैक्टेड स्ट्रीम का उपयोग करें'
                      : 'Choose local video file or upload extracted stream package'}
                  </span>
                </label>
              </div>
            </div>

            {/* Upload Progress Bar if in progress */}
            {isUploading && (
              <div className="space-y-2 pt-2">
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>{lang === 'hi' ? 'YouTube Studio में वीडियो अपलोड हो रहा है...' : 'Uploading to YouTube Studio...'}</span>
                  <span className="font-bold text-emerald-400">{uploadProgress}%</span>
                </div>
              </div>
            )}

            {/* Submit Action */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={isUploading}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50 active:scale-95"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{lang === 'hi' ? 'अपलोड हो रहा है...' : 'Uploading...'}</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4" />
                    <span>{lang === 'hi' ? 'चैनल पर पब्लिश करें 🚀' : 'Publish to Channel 🚀'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
