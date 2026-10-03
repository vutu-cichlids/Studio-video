import React, { useRef, useState, useEffect } from 'react';
import { 
  Scissors, 
  Trash2, 
  Copy, 
  Eye, 
  EyeOff, 
  Volume2, 
  VolumeX, 
  Lock, 
  Unlock, 
  Magnet, 
  ZoomIn, 
  ZoomOut, 
  Plus, 
  Music, 
  Film, 
  Type, 
  Layers, 
  Sparkles,
  ChevronRight,
  ArrowLeftToLine,
  ArrowRightToLine
} from 'lucide-react';
import { TimelineTrack, TimelineClip, AudioClip } from '../types/video';
import { audioFx } from '../utils/audioWaveform';

interface TimelineProps {
  tracks: TimelineTrack[];
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  selectedClipId: string | null;
  onSelectClip: (clip: TimelineClip | null) => void;
  onSplitClipAtPlayhead: () => void;
  onTrimClipStart: () => void;
  onTrimClipEnd: () => void;
  onDeleteSelectedClip: () => void;
  onDuplicateSelectedClip: () => void;
  onToggleTrackMute: (trackId: string) => void;
  onToggleTrackVisibility: (trackId: string) => void;
  onToggleTrackLock: (trackId: string) => void;
  onUpdateClipPosition: (clipId: string, newStart: number) => void;
}

export const Timeline: React.FC<TimelineProps> = ({
  tracks,
  currentTime,
  duration,
  onSeek,
  selectedClipId,
  onSelectClip,
  onSplitClipAtPlayhead,
  onTrimClipStart,
  onTrimClipEnd,
  onDeleteSelectedClip,
  onDuplicateSelectedClip,
  onToggleTrackMute,
  onToggleTrackVisibility,
  onToggleTrackLock,
  onUpdateClipPosition,
}) => {
  const [zoomLevel, setZoomLevel] = useState(50); // pixels per second (20 to 120)
  const [isSnapping, setIsSnapping] = useState(true);
  const [isDraggingPlayhead, setIsDraggingPlayhead] = useState(false);
  const [draggedClip, setDraggedClip] = useState<{ id: string; initialStart: number; startX: number } | null>(null);

  const rulerRef = useRef<HTMLDivElement | null>(null);
  const timelineBodyRef = useRef<HTMLDivElement | null>(null);

  // Calculate timeline width in pixels
  const timelinePixelWidth = Math.max(1200, (duration + 5) * zoomLevel);

  // Playhead scrubber drag handling
  const handleRulerMouseDown = (e: React.MouseEvent) => {
    setIsDraggingPlayhead(true);
    updatePlayheadFromMouse(e);
  };

  const updatePlayheadFromMouse = (e: MouseEvent | React.MouseEvent) => {
    if (!rulerRef.current) return;
    const rect = rulerRef.current.getBoundingClientRect();
    const scrollLeft = timelineBodyRef.current?.scrollLeft || 0;
    const clientX = e.clientX;
    const offsetX = clientX - rect.left + scrollLeft;
    const newTime = Math.max(0, Math.min(duration, offsetX / zoomLevel));
    onSeek(newTime);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingPlayhead) {
        updatePlayheadFromMouse(e);
      } else if (draggedClip) {
        const deltaPixels = e.clientX - draggedClip.startX;
        const deltaTime = deltaPixels / zoomLevel;
        let candidateStart = Math.max(0, draggedClip.initialStart + deltaTime);

        // Snapping to playhead or 0
        if (isSnapping) {
          if (Math.abs(candidateStart - currentTime) < 0.25) {
            candidateStart = currentTime;
          } else if (candidateStart < 0.2) {
            candidateStart = 0;
          }
        }

        onUpdateClipPosition(draggedClip.id, parseFloat(candidateStart.toFixed(2)));
      }
    };

    const handleMouseUp = () => {
      if (isDraggingPlayhead) setIsDraggingPlayhead(false);
      if (draggedClip) setDraggedClip(null);
    };

    if (isDraggingPlayhead || draggedClip) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDraggingPlayhead, draggedClip, zoomLevel, currentTime, isSnapping, duration, onSeek, onUpdateClipPosition]);

  // Generate ruler tick marks (every 1 second, main label every 5 seconds)
  const renderRulerTicks = () => {
    const ticks = [];
    const totalSeconds = Math.ceil(duration + 4);
    for (let sec = 0; sec <= totalSeconds; sec++) {
      const left = sec * zoomLevel;
      const isMajor = sec % 5 === 0;
      ticks.push(
        <div
          key={sec}
          className="absolute top-0 flex flex-col items-center pointer-events-none select-none"
          style={{ left: `${left}px` }}
        >
          <div
            className={`w-px ${
              isMajor ? 'h-3 bg-neutral-500' : 'h-1.5 bg-neutral-700'
            }`}
          />
          {isMajor && (
            <span className="text-[9px] font-mono text-neutral-400 mt-0.5">
              {Math.floor(sec / 60)}:{(sec % 60).toString().padStart(2, '0')}
            </span>
          )}
        </div>
      );
    }
    return ticks;
  };

  const getTrackIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Film className="w-3.5 h-3.5 text-blue-400" />;
      case 'overlay':
        return <Layers className="w-3.5 h-3.5 text-amber-400" />;
      case 'subtitle':
        return <Type className="w-3.5 h-3.5 text-emerald-400" />;
      case 'audio':
        return <Music className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <Film className="w-3.5 h-3.5 text-neutral-400" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-neutral-950 border-t border-neutral-800 select-none">
      {/* 1. Timeline Toolbar (CapCut / Premiere Pro Style) */}
      <div className="h-10 border-b border-neutral-800/80 px-3 bg-neutral-900 flex items-center justify-between text-neutral-300">
        <div className="flex items-center gap-1">
          {/* Split / Razor tool */}
          <button
            onClick={() => {
              audioFx.playClick();
              onSplitClipAtPlayhead();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-800 hover:bg-sky-600 text-neutral-200 hover:text-white text-xs font-medium transition-colors cursor-pointer"
            title="Cắt đoạn tại vị trí con trỏ (Ctrl+B / Razor Cut)"
          >
            <Scissors className="w-3.5 h-3.5 text-sky-400 hover:text-white" />
            <span>Cắt Clip (Split)</span>
          </button>

          {/* Trim Left to Playhead */}
          <button
            onClick={() => {
              audioFx.playClick();
              onTrimClipStart();
            }}
            className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title="Cắt đầu clip đến con trỏ"
          >
            <ArrowLeftToLine className="w-3.5 h-3.5" />
          </button>

          {/* Trim Right to Playhead */}
          <button
            onClick={() => {
              audioFx.playClick();
              onTrimClipEnd();
            }}
            className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title="Cắt đuôi clip từ con trỏ"
          >
            <ArrowRightToLine className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-neutral-800 mx-1" />

          {/* Duplicate Clip */}
          <button
            onClick={() => {
              audioFx.playClick();
              onDuplicateSelectedClip();
            }}
            disabled={!selectedClipId}
            className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white disabled:opacity-30 disabled:hover:text-neutral-400 transition-colors cursor-pointer"
            title="Nhân bản clip đã chọn"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          {/* Delete Clip */}
          <button
            onClick={() => {
              audioFx.playClick();
              onDeleteSelectedClip();
            }}
            disabled={!selectedClipId}
            className="p-1.5 rounded hover:bg-red-500/20 text-neutral-400 hover:text-red-400 disabled:opacity-30 disabled:hover:text-neutral-400 transition-colors cursor-pointer"
            title="Xóa clip đã chọn (Del)"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-neutral-800 mx-1" />

          {/* Snapping / Magnet toggle */}
          <button
            onClick={() => setIsSnapping(!isSnapping)}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors cursor-pointer ${
              isSnapping ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' : 'text-neutral-400 hover:text-white'
            }`}
            title="Bật/Tắt tính năng hít từ tính (Snapping)"
          >
            <Magnet className="w-3.5 h-3.5" />
            <span>Hít Từ Tính</span>
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <ZoomOut className="w-3 h-3 text-neutral-500" />
          <input
            type="range"
            min="25"
            max="110"
            value={zoomLevel}
            onChange={(e) => setZoomLevel(parseInt(e.target.value))}
            className="w-24 accent-sky-500 h-1 bg-neutral-800 rounded-lg cursor-pointer"
            title="Thu phóng Timeline"
          />
          <ZoomIn className="w-3 h-3 text-neutral-500" />
          <span className="text-[10px] font-mono text-neutral-500 w-8">{zoomLevel}px</span>
        </div>
      </div>

      {/* 2. Main Timeline Container (Track Headers on left, Scrollable Tracks on right) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Track Headers Panel (Fixed) */}
        <div className="w-52 flex-shrink-0 bg-neutral-900 border-r border-neutral-800 flex flex-col z-10">
          {/* Header spacer aligned with ruler */}
          <div className="h-6 border-b border-neutral-800 px-3 flex items-center justify-between text-[10px] font-semibold text-neutral-500 uppercase tracking-wider bg-neutral-950/70">
            <span>Layers &amp; Tracks</span>
            <span>Controls</span>
          </div>

          {/* Track Headers list */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {tracks.map((track) => (
              <div
                key={track.id}
                className="h-12 border-b border-neutral-800/80 px-2.5 flex items-center justify-between bg-neutral-900 hover:bg-neutral-850 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0 pr-1">
                  {getTrackIcon(track.type)}
                  <span className="text-xs font-medium text-neutral-200 truncate" title={track.name}>
                    {track.name}
                  </span>
                </div>

                {/* Track Controls */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => onToggleTrackVisibility(track.id)}
                    className="p-1 rounded text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    title={track.isVisible ? 'Ẩn Track này' : 'Hiện Track này'}
                  >
                    {track.isVisible ? <Eye className="w-3 h-3 text-neutral-300" /> : <EyeOff className="w-3 h-3 text-neutral-600" />}
                  </button>

                  <button
                    onClick={() => onToggleTrackMute(track.id)}
                    className="p-1 rounded text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    title={track.isMuted ? 'Bật tiếng Track' : 'Tắt tiếng Track'}
                  >
                    {track.isMuted ? <VolumeX className="w-3 h-3 text-red-400" /> : <Volume2 className="w-3 h-3 text-neutral-300" />}
                  </button>

                  <button
                    onClick={() => onToggleTrackLock(track.id)}
                    className="p-1 rounded text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    title={track.isLocked ? 'Mở khóa Track' : 'Khóa Track này'}
                  >
                    {track.isLocked ? <Lock className="w-3 h-3 text-amber-400" /> : <Unlock className="w-3 h-3 text-neutral-600" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Scrollable Timeline Body */}
        <div 
          ref={timelineBodyRef}
          className="flex-1 overflow-x-auto overflow-y-auto relative custom-scrollbar bg-neutral-950"
        >
          <div 
            style={{ width: `${timelinePixelWidth}px` }} 
            className="relative min-h-full flex flex-col"
          >
            {/* Timecode Ruler */}
            <div
              ref={rulerRef}
              onMouseDown={handleRulerMouseDown}
              className="h-6 border-b border-neutral-800 bg-neutral-900/90 relative cursor-pointer sticky top-0 z-20"
            >
              {renderRulerTicks()}
            </div>

            {/* Vertical Playhead Cursor Line running across all tracks */}
            <div
              className="absolute top-0 bottom-0 z-30 pointer-events-none"
              style={{ left: `${currentTime * zoomLevel}px` }}
            >
              {/* Playhead Handle */}
              <div className="w-3 h-3.5 bg-red-500 -ml-1.5 clip-path-playhead shadow-md flex items-center justify-center">
                <div className="w-1 h-1 bg-white rounded-full" />
              </div>
              {/* Playhead Line */}
              <div className="w-px h-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.7)]" />
            </div>

            {/* Track Lanes */}
            <div className="flex-1">
              {tracks.map((track) => (
                <div
                  key={track.id}
                  className={`h-12 border-b border-neutral-800/80 relative flex items-center transition-colors ${
                    track.isVisible ? 'bg-neutral-950/60' : 'bg-neutral-950/20 opacity-40'
                  }`}
                  onClick={(e) => {
                    // Click on empty space deselects clip
                    if (e.target === e.currentTarget) {
                      onSelectClip(null);
                    }
                  }}
                >
                  {/* Track Clips */}
                  {track.clips.map((clip) => {
                    const isSelected = selectedClipId === clip.id;
                    const leftPos = clip.timelineStart * zoomLevel;
                    const widthPx = Math.max(16, clip.duration * zoomLevel);

                    return (
                      <div
                        key={clip.id}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          onSelectClip(clip);
                          if (!track.isLocked) {
                            setDraggedClip({
                              id: clip.id,
                              initialStart: clip.timelineStart,
                              startX: e.clientX,
                            });
                          }
                        }}
                        className={`absolute h-9 rounded-md flex items-center px-2 cursor-pointer transition-shadow overflow-hidden group select-none ${
                          isSelected
                            ? 'ring-2 ring-sky-400 z-10 shadow-lg shadow-sky-500/20'
                            : 'hover:brightness-110'
                        }`}
                        style={{
                          left: `${leftPos}px`,
                          width: `${widthPx}px`,
                          backgroundColor: clip.color || '#3b82f6',
                        }}
                        title={`${clip.name} (${clip.timelineStart.toFixed(1)}s - ${(clip.timelineStart + clip.duration).toFixed(1)}s)`}
                      >
                        {/* Trim handles on clip ends */}
                        <div className="absolute left-0 inset-y-0 w-1.5 bg-black/30 group-hover:bg-white/40 cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute right-0 inset-y-0 w-1.5 bg-black/30 group-hover:bg-white/40 cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity" />

                        {/* Audio Waveform visualization */}
                        {clip.type === 'audio' && (clip as AudioClip).waveformData && (
                          <div className="absolute inset-0 flex items-center justify-between px-1 pointer-events-none opacity-40">
                            {(clip as AudioClip).waveformData.map((val, wIdx) => (
                              <div
                                key={wIdx}
                                className="w-0.5 bg-white rounded-full mx-px"
                                style={{ height: `${Math.max(15, val * 100)}%` }}
                              />
                            ))}
                          </div>
                        )}

                        {/* Clip Content Label */}
                        <div className="relative z-10 flex items-center gap-1.5 min-w-0 pr-1 text-white">
                          <span className="text-[11px] font-semibold truncate leading-none drop-shadow-sm">
                            {clip.name}
                          </span>
                          <span className="text-[9px] font-mono opacity-80 flex-shrink-0">
                            {clip.duration.toFixed(1)}s
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
