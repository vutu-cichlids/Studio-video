/**
 * Video Studio Types & Project Edit Model
 * Following the architecture from the user consultation:
 * - ProjectEditModel with multi-track layout
 * - Video, Audio, Subtitle, and Overlay tracks
 * - 4-Agent Production Architecture
 */

export type AspectRatio = '9:16' | '16:9' | '1:1' | '4:5';

export type VideoFilter = 
  | 'none' 
  | 'cinematic' 
  | 'teal_orange' 
  | 'cyberpunk' 
  | 'warm_film' 
  | 'noir' 
  | 'vivid_crisp';

export interface ClipTransform {
  scale: number; // 0.5 to 2.0
  positionX: number; // -100 to 100
  positionY: number; // -100 to 100
  rotation: number; // -180 to 180
  opacity: number; // 0 to 1
}

export interface ClipColorAdjustment {
  brightness: number; // -50 to 50
  contrast: number; // -50 to 50
  saturation: number; // -50 to 50
  temperature: number; // -50 to 50
  vignette: number; // 0 to 100
  filter: VideoFilter;
}

export interface ClipAudioAdjustment {
  volume: number; // 0 to 200%
  fadeIn: number; // seconds
  fadeOut: number; // seconds
  voiceFilter: 'none' | 'studio_mic' | 'deep_podcast' | 'vocal_booster' | 'chipmunk';
  noiseReduction: boolean;
  isMuted: boolean;
}

export interface SubtitleStyle {
  fontFamily: string;
  fontSize: number; // px
  fontColor: string;
  backgroundColor: string;
  outlineColor: string;
  hasBackground: boolean;
  animation: 'none' | 'pop' | 'fade' | 'karaoke_bounce';
}

export interface BaseClip {
  id: string;
  name: string;
  timelineStart: number; // in seconds
  duration: number; // in seconds
  sourceStart: number; // in seconds
  color: string;
}

export interface VideoClip extends BaseClip {
  type: 'video';
  sourceUrl: string;
  thumbnailUrl?: string;
  speed: number; // 0.5 to 2.0
  transform: ClipTransform;
  colorAdjustments: ClipColorAdjustment;
}

export interface AudioClip extends BaseClip {
  type: 'audio';
  category: 'voice' | 'music' | 'sfx';
  sourceUrl: string;
  audioSettings: ClipAudioAdjustment;
  waveformData: number[];
}

export interface SubtitleWord {
  word: string;
  start: number;
  end: number;
  highlight?: boolean;
}

export interface SubtitleClip extends BaseClip {
  type: 'subtitle';
  text: string;
  words?: SubtitleWord[];
  style: SubtitleStyle;
}

export interface OverlayClip extends BaseClip {
  type: 'overlay';
  category: 'sticker' | 'b_roll' | 'cta' | 'lower_third';
  title: string;
  subtitle?: string;
  iconName?: string;
  imageUrl?: string;
  position: { x: number; y: number };
  scale: number;
}

export type TimelineClip = VideoClip | AudioClip | SubtitleClip | OverlayClip;

export interface TimelineTrack {
  id: string;
  name: string;
  type: 'video' | 'overlay' | 'subtitle' | 'audio';
  subtype?: 'voice' | 'music' | 'sfx';
  isMuted: boolean;
  isLocked: boolean;
  isVisible: boolean;
  clips: TimelineClip[];
}

export interface ProjectEditModel {
  projectId: string;
  title: string;
  createdAt: string;
  duration: number; // total composition duration in seconds
  settings: {
    width: number;
    height: number;
    fps: number;
    aspectRatio: AspectRatio;
  };
  source: {
    originalVideoUrl: string;
    originalAudioUrl: string;
    videoSeparatedUrl: string;
    audioVoiceSeparatedUrl: string;
    title: string;
    duration: number;
  };
  tracks: TimelineTrack[];
}

export interface AgentExecutionLog {
  id: string;
  agent: 'Coordinator' | 'Visual Agent' | 'Voice Agent' | 'Script Agent' | 'Editor Agent';
  action: string;
  details: string;
  timestamp: string;
  status: 'completed' | 'in_progress' | 'waiting';
  icon: string;
}

export interface AIProductionPlan {
  summary: string;
  targetDuration: number;
  aspectRatio: AspectRatio;
  colorGrade: VideoFilter;
  audioStyle: string;
  appliedChanges: string[];
  agentLogs: AgentExecutionLog[];
}

export interface SampleProject {
  id: string;
  name: string;
  category: string;
  description: string;
  videoUrl: string;
  posterUrl: string;
  duration: number;
  transcript: Array<{ text: string; start: number; end: number }>;
}

export interface KolPersona {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  accent: string;
  sampleVoicePrompt: string;
}

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  features: string[];
  priceTag: string;
}
