export interface DownloadQuality {
  quality: string;
  resolution: string;
  format: string;
  fps: number;
  note: string;
  estimatedSize: string;
  type: 'video' | 'audio';
}

export interface ThumbnailSet {
  maxres: string;
  sd: string;
  hq: string;
  mq: string;
  default: string;
}

export interface VideoMetadata {
  videoId: string;
  title: string;
  description: string;
  channelTitle: string;
  channelUrl: string;
  viewCount: number;
  viewCountFormatted: string;
  lengthSeconds: number;
  durationFormatted: string;
  publishDate: string;
  keywords: string[];
  hashtags: string[];
  thumbnails: ThumbnailSet;
  downloadQualities: DownloadQuality[];
  embedUrl: string;
  watchUrl: string;
}

export interface ChannelProfile {
  id: string;
  title: string;
  customUrl?: string;
  description?: string;
  avatar?: string;
  subscriberCount?: string;
  videoCount?: string;
  viewCount?: string;
}

export interface ShortsIdea {
  hook: string;
  script: string;
  duration: string;
}

export interface AIOptimizationResult {
  viralTitles: string[];
  optimizedDescription: string;
  rankingKeywords: string[];
  shortsIdeas: ShortsIdea[];
}

export interface UploadFormData {
  title: string;
  description: string;
  tags: string[];
  privacy: 'private' | 'unlisted' | 'public';
  categoryId: string;
  isMadeForKids: boolean;
  videoFile?: File | null;
}
