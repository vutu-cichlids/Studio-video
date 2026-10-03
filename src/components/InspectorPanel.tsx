import React from 'react';
import { 
  Sliders, 
  Palette, 
  Volume2, 
  Type as TypeIcon, 
  Maximize2, 
  Eye, 
  RotateCw, 
  Sparkles,
  Zap,
  CheckCircle2,
  Trash2,
  Copy
} from 'lucide-react';
import { 
  TimelineClip, 
  VideoClip, 
  AudioClip, 
  SubtitleClip, 
  OverlayClip, 
  VideoFilter,
  AspectRatio
} from '../types/video';

interface InspectorPanelProps {
  selectedClip: TimelineClip | null;
  onUpdateClip: (clip: TimelineClip) => void;
  onDeleteClip: (clipId: string) => void;
  onDuplicateClip: (clip: TimelineClip) => void;
  aspectRatio: AspectRatio;
  onChangeAspectRatio: (ratio: AspectRatio) => void;
  totalDuration: number;
}

export const InspectorPanel: React.FC<InspectorPanelProps> = ({
  selectedClip,
  onUpdateClip,
  onDeleteClip,
  onDuplicateClip,
  aspectRatio,
  onChangeAspectRatio,
  totalDuration,
}) => {
  if (!selectedClip) {
    return (
      <div className="flex flex-col h-full bg-neutral-950 p-4 text-neutral-300 overflow-y-auto custom-scrollbar">
        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-200 mb-3 uppercase tracking-wider">
          <Sliders className="w-4 h-4 text-sky-400" />
          <span>Cấu Hình Dự Án Chung</span>
        </div>

        <div className="space-y-4">
          <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-3 space-y-3">
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Tỷ Lệ Khung Hình Canvas</label>
              <select
                value={aspectRatio}
                onChange={(e) => onChangeAspectRatio(e.target.value as AspectRatio)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs text-white outline-none focus:border-sky-500"
              >
                <option value="9:16">9:16 · Dọc TikTok / Shorts / Reels (1080x1920)</option>
                <option value="16:9">16:9 · Ngang YouTube / Màn hình rộng (1920x1080)</option>
                <option value="1:1">1:1 · Vuông Instagram / Facebook Feed (1080x1080)</option>
                <option value="4:5">4:5 · Chân dung Facebook / Instagram (1080x1350)</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-neutral-400 block mb-1">Tổng Thời Lượng</label>
              <div className="text-xs font-mono bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-emerald-400 font-semibold">
                {totalDuration.toFixed(2)}s ({Math.floor(totalDuration / 60)}m {Math.floor(totalDuration % 60)}s)
              </div>
            </div>

            <div>
              <label className="text-xs text-neutral-400 block mb-1">Chuẩn Frame Rate (FPS)</label>
              <div className="text-xs font-mono bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-neutral-300">
                30.00 FPS (Progressive)
              </div>
            </div>
          </div>

          <div className="p-3 bg-neutral-900/40 border border-neutral-800/80 rounded-xl text-xs text-neutral-400 leading-relaxed">
            <span className="font-semibold text-neutral-300 block mb-1">Mẹo chỉnh sửa:</span>
            Nhấp chuột vào bất kỳ đoạn clip nào trên timeline (Video, Giọng nói, Phụ đề, hoặc Sticker) để mở bảng điều khiển chi tiết CapCut/Premiere tương ứng.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-neutral-950 p-3 text-neutral-200 overflow-y-auto custom-scrollbar">
      {/* Header with Title and Actions */}
      <div className="flex items-center justify-between pb-2 border-b border-neutral-800 mb-3">
        <div className="min-w-0 pr-2">
          <span className="text-[10px] text-sky-400 uppercase font-mono font-medium block">
            {selectedClip.type.toUpperCase()} INSPECTOR
          </span>
          <div className="text-xs font-semibold text-white truncate max-w-[170px]">
            {selectedClip.name}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onDuplicateClip(selectedClip)}
            className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title="Nhân bản clip (Duplicate)"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDeleteClip(selectedClip.id)}
            className="p-1.5 rounded hover:bg-red-500/20 text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
            title="Xóa clip này"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 1. VIDEO CLIP CONTROLS */}
      {selectedClip.type === 'video' && (() => {
        const clip = selectedClip as VideoClip;
        return (
          <div className="space-y-4">
            {/* Color LUT / Preset */}
            <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-3 space-y-2">
              <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-sky-400" />
                <span>Bộ Lọc Màu (Color LUT)</span>
              </label>
              <select
                value={clip.colorAdjustments.filter}
                onChange={(e) => onUpdateClip({
                  ...clip,
                  colorAdjustments: { ...clip.colorAdjustments, filter: e.target.value as VideoFilter }
                })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs text-white outline-none focus:border-sky-500"
              >
                <option value="none">Nguyên bản (Không lọc)</option>
                <option value="teal_orange">🎬 Cinematic Teal &amp; Orange (Điện ảnh)</option>
                <option value="vivid_crisp">✨ Vivid Crisp (Tươi sáng, rõ nét TikTok)</option>
                <option value="warm_film">🎞️ Vintage Film Warm (Cổ điển ấm áp)</option>
                <option value="cyberpunk">🌆 Cyberpunk Neon (Hiện đại, tương phản cao)</option>
                <option value="noir">🖤 Film Noir (Đen trắng kịch tính)</option>
              </select>
            </div>

            {/* Transform Controls */}
            <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-3 space-y-2.5">
              <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Biến Đổi Khung Hình (Transform)</span>
              </label>

              {/* Scale / Zoom */}
              <div>
                <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                  <span>Thu phóng (Zoom/Scale)</span>
                  <span className="font-mono text-white">{(clip.transform.scale * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.05"
                  value={clip.transform.scale}
                  onChange={(e) => onUpdateClip({
                    ...clip,
                    transform: { ...clip.transform, scale: parseFloat(e.target.value) }
                  })}
                  className="w-full accent-sky-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Speed */}
              <div>
                <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                  <span>Tốc độ phát (Speed)</span>
                  <span className="font-mono text-white">{clip.speed}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={clip.speed}
                  onChange={(e) => onUpdateClip({
                    ...clip,
                    speed: parseFloat(e.target.value)
                  })}
                  className="w-full accent-indigo-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Opacity */}
              <div>
                <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                  <span>Độ trong suốt (Opacity)</span>
                  <span className="font-mono text-white">{(clip.transform.opacity * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={clip.transform.opacity}
                  onChange={(e) => onUpdateClip({
                    ...clip,
                    transform: { ...clip.transform, opacity: parseFloat(e.target.value) }
                  })}
                  className="w-full accent-emerald-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Color Adjustment Sliders */}
            <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-3 space-y-2.5">
              <label className="text-xs font-semibold text-neutral-300">
                Chỉnh Màu Chi Tiết (Color Correction)
              </label>

              <div>
                <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                  <span>Độ tương phản (Contrast)</span>
                  <span className="font-mono text-white">{clip.colorAdjustments.contrast}</span>
                </div>
                <input
                  type="range"
                  min="-30"
                  max="30"
                  value={clip.colorAdjustments.contrast}
                  onChange={(e) => onUpdateClip({
                    ...clip,
                    colorAdjustments: { ...clip.colorAdjustments, contrast: parseInt(e.target.value) }
                  })}
                  className="w-full accent-sky-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                  <span>Độ bão hòa màu (Saturation)</span>
                  <span className="font-mono text-white">{clip.colorAdjustments.saturation}</span>
                </div>
                <input
                  type="range"
                  min="-30"
                  max="30"
                  value={clip.colorAdjustments.saturation}
                  onChange={(e) => onUpdateClip({
                    ...clip,
                    colorAdjustments: { ...clip.colorAdjustments, saturation: parseInt(e.target.value) }
                  })}
                  className="w-full accent-sky-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                  <span>Hiệu ứng tối viền (Vignette)</span>
                  <span className="font-mono text-white">{clip.colorAdjustments.vignette}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={clip.colorAdjustments.vignette}
                  onChange={(e) => onUpdateClip({
                    ...clip,
                    colorAdjustments: { ...clip.colorAdjustments, vignette: parseInt(e.target.value) }
                  })}
                  className="w-full accent-purple-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>
        );
      })()}

      {/* 2. AUDIO CLIP CONTROLS */}
      {selectedClip.type === 'audio' && (() => {
        const clip = selectedClip as AudioClip;
        return (
          <div className="space-y-4">
            <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-3 space-y-3">
              <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Âm Lượng &amp; Độ Lớn</span>
              </label>

              <div>
                <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                  <span>Volume Level</span>
                  <span className="font-mono text-white">{clip.audioSettings.volume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  step="5"
                  value={clip.audioSettings.volume}
                  onChange={(e) => onUpdateClip({
                    ...clip,
                    audioSettings: { ...clip.audioSettings, volume: parseInt(e.target.value) }
                  })}
                  className="w-full accent-purple-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-neutral-300">Tắt tiếng đoạn này (Mute)</span>
                <input
                  type="checkbox"
                  checked={clip.audioSettings.isMuted}
                  onChange={(e) => onUpdateClip({
                    ...clip,
                    audioSettings: { ...clip.audioSettings, isMuted: e.target.checked }
                  })}
                  className="w-4 h-4 accent-purple-500 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Vocal Enhancements & Filters */}
            <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-3 space-y-3">
              <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span>Xử Lý Giọng Nói AI (Voice Isolation)</span>
              </label>

              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Hiệu Ứng Tone Giọng (Voice Filter)</label>
                <select
                  value={clip.audioSettings.voiceFilter}
                  onChange={(e) => onUpdateClip({
                    ...clip,
                    audioSettings: { ...clip.audioSettings, voiceFilter: e.target.value as any }
                  })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs text-white outline-none focus:border-purple-500"
                >
                  <option value="none">Tự nhiên (Natural Stem)</option>
                  <option value="studio_mic">🎙️ Studio Mic (Ấm, lọc gió, tiêu âm)</option>
                  <option value="deep_podcast">📻 Deep Podcast Radio (Trầm, đanh thép)</option>
                  <option value="vocal_booster">⚡ Vocal Booster (Tăng độ sáng lời thoại)</option>
                  <option value="chipmunk">🐿️ Chipmunk Vui Nhộn</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="text-xs text-neutral-200 block">Khử ồn tạp âm thông minh</span>
                  <span className="text-[10px] text-neutral-500">Loại bỏ tiếng quạt gió &amp; tiếng vang</span>
                </div>
                <input
                  type="checkbox"
                  checked={clip.audioSettings.noiseReduction}
                  onChange={(e) => onUpdateClip({
                    ...clip,
                    audioSettings: { ...clip.audioSettings, noiseReduction: e.target.checked }
                  })}
                  className="w-4 h-4 accent-purple-500 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        );
      })()}

      {/* 3. SUBTITLE CLIP CONTROLS */}
      {selectedClip.type === 'subtitle' && (() => {
        const clip = selectedClip as SubtitleClip;
        return (
          <div className="space-y-4">
            <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-3 space-y-2">
              <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                <TypeIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span>Nội Dung Phụ Đề (Subtitle Text)</span>
              </label>
              <textarea
                value={clip.text}
                onChange={(e) => onUpdateClip({
                  ...clip,
                  text: e.target.value
                })}
                rows={3}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs text-white outline-none focus:border-emerald-500 resize-none leading-relaxed"
              />
            </div>

            <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-3 space-y-3">
              <label className="text-xs font-semibold text-neutral-300">
                Kiểu Chữ &amp; Hiệu Ứng Bắt Trend
              </label>

              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Hiệu Ứng Hoạt Họa (Animation)</label>
                <select
                  value={clip.style.animation}
                  onChange={(e) => onUpdateClip({
                    ...clip,
                    style: { ...clip.style, animation: e.target.value as any }
                  })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs text-white outline-none focus:border-emerald-500"
                >
                  <option value="karaoke_bounce">🎤 Karaoke Bouncing (Nhảy chữ vàng CapCut)</option>
                  <option value="pop">💥 Pop In (Phóng to đập mắt)</option>
                  <option value="fade">✨ Fade Mượt mà</option>
                  <option value="none">Cố định (Static)</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                  <span>Kích thước chữ (Font Size)</span>
                  <span className="font-mono text-white">{clip.style.fontSize}px</span>
                </div>
                <input
                  type="range"
                  min="16"
                  max="36"
                  value={clip.style.fontSize}
                  onChange={(e) => onUpdateClip({
                    ...clip,
                    style: { ...clip.style, fontSize: parseInt(e.target.value) }
                  })}
                  className="w-full accent-emerald-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-neutral-300">Nền hộp mờ đen (Background Box)</span>
                <input
                  type="checkbox"
                  checked={clip.style.hasBackground}
                  onChange={(e) => onUpdateClip({
                    ...clip,
                    style: { ...clip.style, hasBackground: e.target.checked }
                  })}
                  className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        );
      })()}

      {/* 4. OVERLAY / STICKER CLIP CONTROLS */}
      {selectedClip.type === 'overlay' && (() => {
        const clip = selectedClip as OverlayClip;
        return (
          <div className="space-y-4">
            <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-3 space-y-2">
              <label className="text-xs font-semibold text-neutral-300">Tiêu Đề Lớp Phủ</label>
              <input
                type="text"
                value={clip.title}
                onChange={(e) => onUpdateClip({
                  ...clip,
                  title: e.target.value
                })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs text-white outline-none focus:border-amber-500"
              />
            </div>

            <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-3 space-y-2">
              <label className="text-xs font-semibold text-neutral-300">Dòng Phụ / Chi Tiết</label>
              <input
                type="text"
                value={clip.subtitle || ''}
                onChange={(e) => onUpdateClip({
                  ...clip,
                  subtitle: e.target.value
                })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs text-white outline-none focus:border-amber-500"
              />
            </div>

            <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-3 space-y-3">
              <label className="text-xs font-semibold text-neutral-300">Vị Trí &amp; Kích Thước</label>
              <div>
                <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                  <span>Tọa độ Dọc (Y Position)</span>
                  <span className="font-mono text-white">{clip.position.y}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="90"
                  value={clip.position.y}
                  onChange={(e) => onUpdateClip({
                    ...clip,
                    position: { ...clip.position, y: parseInt(e.target.value) }
                  })}
                  className="w-full accent-amber-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                  <span>Tỷ lệ phóng to (Scale)</span>
                  <span className="font-mono text-white">{clip.scale.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={clip.scale}
                  onChange={(e) => onUpdateClip({
                    ...clip,
                    scale: parseFloat(e.target.value)
                  })}
                  className="w-full accent-amber-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
