import React, { useRef, useEffect, useState } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2,
  Grid,
  Sparkles,
  Flame
} from 'lucide-react';
import { 
  AspectRatio, 
  TimelineTrack, 
  VideoClip, 
  SubtitleClip, 
  OverlayClip,
  AudioClip
} from '../types/video';

interface PreviewCanvasProps {
  tracks: TimelineTrack[];
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  aspectRatio: AspectRatio;
}

export const PreviewCanvas: React.FC<PreviewCanvasProps> = ({
  tracks,
  currentTime,
  duration,
  isPlaying,
  onPlayPause,
  onSeek,
  aspectRatio,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [showSafeGuides, setShowSafeGuides] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [masterVolume, setMasterVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // Find active video clip
  const videoTrack = tracks.find(t => t.type === 'video' && t.isVisible);
  const activeVideoClip = videoTrack?.clips.find(
    c => currentTime >= c.timelineStart && currentTime <= c.timelineStart + c.duration
  ) as VideoClip | undefined;

  // Find active subtitles
  const subtitleTrack = tracks.find(t => t.type === 'subtitle' && t.isVisible);
  const activeSubtitle = subtitleTrack?.clips.find(
    c => currentTime >= c.timelineStart && currentTime <= c.timelineStart + c.duration
  ) as SubtitleClip | undefined;

  // Find active overlays
  const overlayTrack = tracks.find(t => t.type === 'overlay' && t.isVisible);
  const activeOverlays = (overlayTrack?.clips.filter(
    c => currentTime >= c.timelineStart && currentTime <= c.timelineStart + c.duration
  ) || []) as OverlayClip[];

  // Sync HTML5 video element time with current timeline scrubber
  useEffect(() => {
    if (videoRef.current) {
      if (Math.abs(videoRef.current.currentTime - currentTime) > 0.3) {
        videoRef.current.currentTime = currentTime;
      }
      if (isPlaying && videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
      } else if (!isPlaying && !videoRef.current.paused) {
        videoRef.current.pause();
      }
    }
  }, [currentTime, isPlaying]);

  // Master Volume sync
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? 0 : masterVolume;
    }
  }, [masterVolume, isMuted]);

  // Spacebar toggle shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        onPlayPause();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onPlayPause]);

  // CSS Filter string based on active video clip settings
  const getFilterStyle = () => {
    if (!activeVideoClip) return {};

    const { filter, brightness, contrast, saturation } = activeVideoClip.colorAdjustments;
    let filterString = `brightness(${100 + brightness}%) contrast(${100 + contrast}%) saturate(${100 + saturation}%)`;

    switch (filter) {
      case 'teal_orange':
        // Cinematic warm shadows + cool highlights simulation
        filterString += ' sepia(25%) hue-rotate(185deg) contrast(110%)';
        break;
      case 'cyberpunk':
        filterString += ' contrast(135%) saturate(150%) hue-rotate(280deg)';
        break;
      case 'warm_film':
        filterString += ' sepia(35%) contrast(105%) brightness(102%)';
        break;
      case 'noir':
        filterString += ' grayscale(100%) contrast(140%) brightness(95%)';
        break;
      case 'vivid_crisp':
        filterString += ' saturate(130%) contrast(115%) brightness(105%)';
        break;
      default:
        break;
    }

    return {
      filter: filterString,
      transform: `scale(${activeVideoClip.transform.scale}) translate(${activeVideoClip.transform.positionX}px, ${activeVideoClip.transform.positionY}px) rotate(${activeVideoClip.transform.rotation}deg)`,
      opacity: activeVideoClip.transform.opacity,
    };
  };

  // Aspect ratio dimension calculation
  const getAspectRatioClasses = () => {
    switch (aspectRatio) {
      case '9:16':
        return 'aspect-[9/16] max-h-[82%]';
      case '16:9':
        return 'aspect-[16/9] max-w-[92%]';
      case '1:1':
        return 'aspect-square max-h-[82%]';
      case '4:5':
        return 'aspect-[4/5] max-h-[82%]';
      default:
        return 'aspect-[9/16] max-h-[82%]';
    }
  };

  const formatTimecode = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const ms = Math.floor((secs % 1) * 100);
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="flex flex-col h-full bg-neutral-950 relative select-none"
    >
      {/* Top Monitor Bar */}
      <div className="h-8 border-b border-neutral-800/80 px-3 flex items-center justify-between text-[11px] text-neutral-400 bg-neutral-900/50">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-neutral-300">PREVIEW MONITOR</span>
          <span>·</span>
          <span className="font-mono text-sky-400">{aspectRatio}</span>
          {activeVideoClip?.colorAdjustments.filter !== 'none' && (
            <span className="px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 text-[10px] font-mono">
              LUT: {activeVideoClip?.colorAdjustments.filter}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Safe Area Guides Toggle */}
          <button
            onClick={() => setShowSafeGuides(!showSafeGuides)}
            className={`p-1 rounded transition-colors flex items-center gap-1 text-[10px] ${
              showSafeGuides ? 'bg-sky-500/20 text-sky-400' : 'hover:text-white'
            }`}
            title="Bật/Tắt đường chỉ dẫn vùng an toàn TikTok"
          >
            <Grid className="w-3 h-3" />
            <span>Safe Zones</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-1 rounded hover:text-white transition-colors"
            title="Toàn màn hình"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Canvas Viewport Area */}
      <div className="flex-1 flex items-center justify-center p-3 overflow-hidden bg-neutral-950 relative">
        <div 
          className={`relative bg-black rounded-lg overflow-hidden shadow-2xl border border-neutral-800 flex items-center justify-center transition-all ${getAspectRatioClasses()}`}
        >
          {/* Main Video Stream */}
          {activeVideoClip ? (
            <video
              ref={videoRef}
              src={activeVideoClip.sourceUrl}
              className="w-full h-full object-cover transition-transform duration-75"
              style={getFilterStyle()}
              playsInline
              muted={isMuted}
              loop
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-neutral-600 gap-2 p-6 text-center">
              <div className="w-12 h-12 rounded-full border border-neutral-800 flex items-center justify-center">
                <Play className="w-5 h-5 text-neutral-600 ml-0.5" />
              </div>
              <span className="text-xs">Không có video tại điểm phát này</span>
            </div>
          )}

          {/* Vignette Overlay if enabled */}
          {activeVideoClip && activeVideoClip.colorAdjustments.vignette > 0 && (
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                boxShadow: `inset 0 0 ${activeVideoClip.colorAdjustments.vignette * 1.5}px rgba(0,0,0,0.85)`
              }}
            />
          )}

          {/* Safe Area Guidelines for TikTok/Reels */}
          {showSafeGuides && (
            <div className="absolute inset-0 border border-dashed border-red-500/40 pointer-events-none p-4 flex flex-col justify-between">
              <div className="text-[10px] text-red-400 bg-black/60 px-1 py-0.5 rounded self-start">
                Vùng an toàn TikTok
              </div>
              <div className="space-y-1 text-right self-end">
                <div className="text-[9px] text-neutral-400 bg-black/60 px-1 rounded">Nút Like/Share</div>
                <div className="text-[9px] text-neutral-400 bg-black/60 px-1 rounded">Nút Comment</div>
              </div>
              <div className="text-[9px] text-yellow-400 bg-black/60 px-1 rounded self-center">
                Khu vực Caption &amp; Âm thanh gốc
              </div>
            </div>
          )}

          {/* Active Overlays & Stickers (V2 Track) */}
          {activeOverlays.map((overlay) => (
            <div
              key={overlay.id}
              className="absolute pointer-events-none select-none transition-all duration-150 animate-in fade-in zoom-in-95"
              style={{
                top: `${overlay.position.y}%`,
                left: `${overlay.position.x}%`,
                transform: `translate(-50%, -50%) scale(${overlay.scale})`,
              }}
            >
              <div className="bg-gradient-to-r from-red-600 to-amber-500 text-white font-extrabold px-3 py-1.5 rounded-lg shadow-xl shadow-red-900/40 border border-white/20 text-center flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
                <div>
                  <div className="text-xs uppercase tracking-wider">{overlay.title}</div>
                  {overlay.subtitle && (
                    <div className="text-[9px] font-normal opacity-90">{overlay.subtitle}</div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Active Subtitle (T1 Track) with Karaoke Animation */}
          {activeSubtitle && (
            <div className="absolute bottom-8 inset-x-4 pointer-events-none flex justify-center text-center">
              <div
                className={`max-w-[88%] px-3 py-1.5 rounded-lg transition-all duration-100 ${
                  activeSubtitle.style.hasBackground ? 'bg-black/75 backdrop-blur-sm' : ''
                } ${activeSubtitle.style.animation === 'pop' ? 'scale-105 transition-transform' : ''}`}
                style={{
                  color: activeSubtitle.style.fontColor,
                  fontSize: `${activeSubtitle.style.fontSize}px`,
                  fontFamily: activeSubtitle.style.fontFamily,
                  textShadow: '0 2px 8px rgba(0,0,0,0.9), 0 0 2px #000',
                }}
              >
                {/* Karaoke Word Rendering if available */}
                {activeSubtitle.words && activeSubtitle.words.length > 0 ? (
                  <div className="flex flex-wrap justify-center gap-1 font-bold">
                    {activeSubtitle.words.map((w, wIdx) => {
                      const isWordActive = currentTime >= w.start && currentTime <= w.end;
                      return (
                        <span
                          key={wIdx}
                          className={`transition-all ${
                            isWordActive
                              ? 'text-yellow-400 scale-110 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]'
                              : w.highlight
                              ? 'text-sky-300'
                              : 'text-white'
                          }`}
                        >
                          {w.word}
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <span className="font-bold tracking-wide">{activeSubtitle.text}</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Transport Controls Bar */}
      <div className="h-12 border-t border-neutral-800 bg-neutral-900/90 px-4 flex items-center justify-between text-neutral-300">
        {/* Timecode display */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-sky-400 font-semibold">{formatTimecode(currentTime)}</span>
          <span className="text-neutral-600">/</span>
          <span className="text-neutral-400">{formatTimecode(duration)}</span>
        </div>

        {/* Playback Transport Buttons */}
        <div className="flex items-center gap-2">
          {/* Step -1 Frame */}
          <button
            onClick={() => onSeek(Math.max(0, currentTime - 0.033))}
            className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title="Lùi 1 Frame (-0.033s)"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* Play / Pause */}
          <button
            onClick={onPlayPause}
            className="w-8 h-8 rounded-full bg-sky-500 hover:bg-sky-400 text-neutral-950 flex items-center justify-center shadow-md shadow-sky-500/20 transition-all active:scale-95 cursor-pointer font-bold"
            title="Phát / Tạm dừng (Phím Space)"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4 ml-0.5 fill-neutral-950" />
            )}
          </button>

          {/* Step +1 Frame */}
          <button
            onClick={() => onSeek(Math.min(duration, currentTime + 0.033))}
            className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title="Tiến 1 Frame (+0.033s)"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          {/* Reset to Start */}
          <button
            onClick={() => onSeek(0)}
            className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title="Về đầu video"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Volume & Audio Settings */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title={isMuted ? 'Bật âm lượng' : 'Tắt tiếng'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : masterVolume}
            onChange={(e) => {
              setMasterVolume(parseFloat(e.target.value));
              if (isMuted) setIsMuted(false);
            }}
            className="w-20 accent-sky-500 h-1 bg-neutral-800 rounded-lg cursor-pointer"
            title="Âm lượng phát"
          />
        </div>
      </div>
    </div>
  );
};
