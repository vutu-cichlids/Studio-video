import React, { useState } from 'react';
import { 
  Upload, 
  Film, 
  Mic, 
  Music, 
  Volume2, 
  FileText, 
  Download, 
  Play, 
  Pause, 
  Plus, 
  Check, 
  Scissors, 
  Sparkles,
  Layers,
  ArrowRightLeft
} from 'lucide-react';
import { SAMPLE_PROJECTS, AUDIO_LIBRARY, SFX_LIBRARY } from '../data/mockAssets';
import { SampleProject, TimelineTrack } from '../types/video';
import { audioFx, createWavBlob, generateSrtContent } from '../utils/audioWaveform';

interface MediaLibraryProps {
  currentProjectTitle: string;
  onSelectSampleProject: (sample: SampleProject) => void;
  onAddAudioTrack: (name: string, category: 'music' | 'sfx', duration: number) => void;
  onAddOverlayClip: (title: string, category: 'sticker' | 'cta' | 'b_roll') => void;
  subtitles: Array<{ text: string; timelineStart: number; duration: number }>;
  onCustomVideoUpload?: (file: File) => void;
}

export const MediaLibrary: React.FC<MediaLibraryProps> = ({
  currentProjectTitle,
  onSelectSampleProject,
  onAddAudioTrack,
  onAddOverlayClip,
  subtitles,
  onCustomVideoUpload,
}) => {
  const [activeTab, setActiveTab] = useState<'separation' | 'projects' | 'audio' | 'sfx' | 'overlays'>('separation');
  const [playingPreview, setPlayingPreview] = useState<string | null>(null);

  const handleDownloadSeparatedVoice = () => {
    audioFx.playDing();
    const blob = createWavBlob(15);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `voice_stem_${Date.now()}.wav`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadSeparatedVideo = () => {
    audioFx.playDing();
    // Simulate downloading muted video stream
    const a = document.createElement('a');
    a.href = 'https://assets.mixkit.co/videos/preview/mixkit-woman-sitting-in-an-armchair-in-a-living-room-41553-large.mp4';
    a.download = `video_stream_muted_${Date.now()}.mp4`;
    a.target = '_blank';
    a.click();
  };

  const handleDownloadSrt = () => {
    audioFx.playDing();
    const srtContent = generateSrtContent(subtitles);
    const blob = new Blob([srtContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subtitles_${Date.now()}.srt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleAudition = (id: string, type: 'whoosh' | 'ding' | 'music') => {
    if (playingPreview === id) {
      setPlayingPreview(null);
    } else {
      setPlayingPreview(id);
      if (type === 'whoosh') audioFx.playWhoosh();
      else if (type === 'ding') audioFx.playDing();
      else audioFx.playClick();

      setTimeout(() => setPlayingPreview(null), 1500);
    }
  };

  return (
    <div className="flex flex-col h-full bg-neutral-950 text-neutral-200">
      {/* Category Tabs */}
      <div className="flex items-center gap-1 border-b border-neutral-800 p-2 bg-neutral-900/60 overflow-x-auto">
        <button
          onClick={() => setActiveTab('separation')}
          className={`px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'separation'
              ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Scissors className="w-3.5 h-3.5" />
          <span>Tách Audio/Video</span>
        </button>

        <button
          onClick={() => setActiveTab('projects')}
          className={`px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'projects'
              ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Film className="w-3.5 h-3.5" />
          <span>Video Gốc</span>
        </button>

        <button
          onClick={() => setActiveTab('audio')}
          className={`px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'audio'
              ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Music className="w-3.5 h-3.5" />
          <span>Nhạc Nền</span>
        </button>

        <button
          onClick={() => setActiveTab('sfx')}
          className={`px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'sfx'
              ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>Âm Thanh SFX</span>
        </button>

        <button
          onClick={() => setActiveTab('overlays')}
          className={`px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'overlays'
              ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Sticker &amp; CTA</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 p-3 overflow-y-auto custom-scrollbar">
        {/* TAB 1: SEPARATION STATUS & DOWNLOADS */}
        {activeTab === 'separation' && (
          <div className="space-y-3">
            <div className="p-3 rounded-xl border border-sky-500/30 bg-sky-950/20">
              <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold mb-1">
                <Scissors className="w-4 h-4" />
                <span>Quy trình bóc tách tự động hoàn tất</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed mb-3">
                Hệ thống đã tách riêng biệt luồng hình ảnh (Video stream) và luồng giọng nói (Voice stream) qua bộ xử lý FFmpeg Demuxing &amp; AI Voice Isolation.
              </p>

              {/* 3 Separated Elements */}
              <div className="space-y-2">
                {/* 1. Muted Video Stream */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-900 border border-neutral-800">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded bg-blue-500/20 text-blue-400">
                      <Film className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-white">Video Gốc (Không Tiếng)</div>
                      <div className="text-[10px] text-neutral-400 font-mono">MP4 · 1080x1920 · 30fps · H.264</div>
                    </div>
                  </div>
                  <button
                    onClick={handleDownloadSeparatedVideo}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    <Download className="w-3 h-3 text-sky-400" />
                    <span>Tải Video</span>
                  </button>
                </div>

                {/* 2. Isolated Voice Stream */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-900 border border-neutral-800">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded bg-purple-500/20 text-purple-400">
                      <Mic className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-white">Giọng Nói Tách Riêng (Voice Stem)</div>
                      <div className="text-[10px] text-neutral-400 font-mono">WAV · 24kHz · Mono · 16-bit PCM</div>
                    </div>
                  </div>
                  <button
                    onClick={handleDownloadSeparatedVoice}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    <Download className="w-3 h-3 text-purple-400" />
                    <span>Tải Voice WAV</span>
                  </button>
                </div>

                {/* 3. Subtitles SRT */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-900 border border-neutral-800">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded bg-emerald-500/20 text-emerald-400">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-white">Phụ Đề Trích Xuất (Transcripts)</div>
                      <div className="text-[10px] text-neutral-400 font-mono">{subtitles.length} câu thoại · Timestamp chuẩn</div>
                    </div>
                  </div>
                  <button
                    onClick={handleDownloadSrt}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    <Download className="w-3 h-3 text-emerald-400" />
                    <span>Tải File .SRT</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Transcript Preview */}
            <div className="border border-neutral-800 rounded-xl p-3 bg-neutral-900/60">
              <span className="text-xs font-semibold text-neutral-300 block mb-2">
                Lời thoại phát hiện từ video:
              </span>
              <div className="space-y-1.5 max-h-[220px] overflow-y-auto custom-scrollbar">
                {subtitles.map((sub, idx) => (
                  <div key={idx} className="p-2 rounded bg-neutral-950/70 border border-neutral-800/80 text-xs">
                    <div className="text-[10px] font-mono text-sky-400 mb-0.5">
                      {sub.timelineStart.toFixed(1)}s ➔ {(sub.timelineStart + sub.duration).toFixed(1)}s
                    </div>
                    <div className="text-neutral-200 leading-snug">{sub.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROJECTS & SAMPLE FOOTAGE */}
        {activeTab === 'projects' && (
          <div className="space-y-3">
            <div className="text-xs text-neutral-400 mb-2">
              Chọn video mẫu hoặc tải video của bạn lên để hệ thống tự động bóc tách và nạp vào Timeline:
            </div>

            {/* Upload Button */}
            <label className="border-2 border-dashed border-neutral-700 hover:border-sky-500 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer bg-neutral-900/40 hover:bg-neutral-900/80 transition-all text-center">
              <Upload className="w-6 h-6 text-sky-400" />
              <div className="text-xs font-medium text-white">Tải Video Mới Lên</div>
              <div className="text-[10px] text-neutral-400">Hỗ trợ MP4, MOV, WebM (Tự trích xuất video + audio)</div>
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0] && onCustomVideoUpload) {
                    onCustomVideoUpload(e.target.files[0]);
                  }
                }}
              />
            </label>

            {/* Sample Footage Cards */}
            <div className="space-y-2 mt-3">
              <div className="text-xs font-semibold text-neutral-300">Dự án mẫu có sẵn:</div>
              {SAMPLE_PROJECTS.map((sample) => (
                <div
                  key={sample.id}
                  onClick={() => onSelectSampleProject(sample)}
                  className="flex gap-3 p-2.5 rounded-xl border border-neutral-800 hover:border-sky-500/60 bg-neutral-900/60 hover:bg-neutral-800/50 cursor-pointer transition-all group"
                >
                  <img
                    src={sample.posterUrl}
                    alt={sample.name}
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0 border border-neutral-800"
                  />
                  <div className="flex flex-col justify-between flex-1 min-w-0">
                    <div>
                      <div className="text-xs font-medium text-white group-hover:text-sky-300 transition-colors truncate">
                        {sample.name}
                      </div>
                      <div className="text-[10px] text-sky-400 font-mono mt-0.5">{sample.category} · {sample.duration}s</div>
                      <p className="text-[11px] text-neutral-400 line-clamp-2 mt-1 leading-snug">
                        {sample.description}
                      </p>
                    </div>
                    <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium mt-1">
                      <Check className="w-3 h-3" /> Sẵn sàng tách stem &amp; dựng
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ROYALTY FREE MUSIC */}
        {activeTab === 'audio' && (
          <div className="space-y-2">
            <div className="text-xs text-neutral-400 mb-2">
              Kho nhạc nền không bản quyền phù hợp video ngắn TikTok, Reels &amp; Quảng Cáo:
            </div>
            {AUDIO_LIBRARY.map((audio) => (
              <div
                key={audio.id}
                className="flex items-center justify-between p-2.5 rounded-lg border border-neutral-800 bg-neutral-900/70 hover:border-neutral-700 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => toggleAudition(audio.id, 'music')}
                    className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-sky-400 transition-colors cursor-pointer"
                  >
                    {playingPreview === audio.id ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                  </button>
                  <div>
                    <div className="text-xs font-medium text-white">{audio.name}</div>
                    <div className="text-[10px] text-neutral-400">{audio.genre} · {audio.mood}</div>
                  </div>
                </div>

                <button
                  onClick={() => onAddAudioTrack(audio.name, 'music', audio.duration)}
                  className="p-1.5 rounded-md bg-neutral-800 hover:bg-sky-600 text-neutral-300 hover:text-white transition-all cursor-pointer"
                  title="Thêm vào Timeline"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: SFX LIBRARY */}
        {activeTab === 'sfx' && (
          <div className="space-y-2">
            <div className="text-xs text-neutral-400 mb-2">
              Hiệu ứng âm thanh nhấn nhá chuyển cảnh và kích thích sự chú ý:
            </div>
            {SFX_LIBRARY.map((sfx) => (
              <div
                key={sfx.id}
                className="flex items-center justify-between p-2.5 rounded-lg border border-neutral-800 bg-neutral-900/70 hover:border-neutral-700 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => toggleAudition(sfx.id, sfx.id.includes('whoosh') ? 'whoosh' : 'ding')}
                    className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-amber-400 transition-colors cursor-pointer"
                  >
                    {playingPreview === sfx.id ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                  </button>
                  <div>
                    <div className="text-xs font-medium text-white">{sfx.name}</div>
                    <div className="text-[10px] text-neutral-400 font-mono">{sfx.category}</div>
                  </div>
                </div>

                <button
                  onClick={() => onAddAudioTrack(sfx.name, 'sfx', 1.2)}
                  className="p-1.5 rounded-md bg-neutral-800 hover:bg-amber-600 text-neutral-300 hover:text-white transition-all cursor-pointer"
                  title="Thêm vào Timeline SFX"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* TAB 5: STICKERS & OVERLAYS */}
        {activeTab === 'overlays' && (
          <div className="space-y-2">
            <div className="text-xs text-neutral-400 mb-2">
              Lớp phủ đồ họa kích thích chốt đơn và tỷ lệ giữ chân khán giả:
            </div>
            {[
              { id: 'stk_sale40', title: '🔥 SIÊU SALE GIẢM 40%', category: 'sticker' as const, color: 'bg-red-500/20 text-red-400' },
              { id: 'stk_cta', title: '👉 BẤM VÀO GIỎ HÀNG NGAY', category: 'cta' as const, color: 'bg-amber-500/20 text-amber-400' },
              { id: 'stk_broll', title: '🔍 CẬN CẢNH CON LĂN 4D (B-Roll)', category: 'b_roll' as const, color: 'bg-sky-500/20 text-sky-400' },
              { id: 'stk_freeship', title: '🚚 FREESHIP TOÀN QUỐC HÔM NAY', category: 'sticker' as const, color: 'bg-emerald-500/20 text-emerald-400' },
            ].map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2.5 rounded-lg border border-neutral-800 bg-neutral-900/70 hover:border-neutral-700 transition-all"
              >
                <div className="flex items-center gap-2">
                  <div className={`px-2 py-1 rounded text-xs font-semibold ${item.color}`}>
                    {item.title}
                  </div>
                </div>

                <button
                  onClick={() => onAddOverlayClip(item.title, item.category)}
                  className="p-1.5 rounded-md bg-neutral-800 hover:bg-sky-600 text-neutral-300 hover:text-white transition-all cursor-pointer"
                  title="Thêm vào Track V2 Overlay"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
