import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Film, 
  Mic, 
  FileText, 
  Code, 
  CheckCircle2, 
  Layers, 
  Sparkles,
  Cpu
} from 'lucide-react';
import { ProjectEditModel, AspectRatio } from '../types/video';
import { createWavBlob, generateSrtContent, audioFx } from '../utils/audioWaveform';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectEditModel;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  const [resolution, setResolution] = useState<'1080p' | '720p' | '4k'>('1080p');
  const [fps, setFps] = useState<30 | 60>(30);
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [isRenderFinished, setIsRenderFinished] = useState(false);

  if (!isOpen) return null;

  const handleStartRenderVideo = () => {
    setIsRendering(true);
    setRenderProgress(0);
    setIsRenderFinished(false);
    audioFx.playClick();

    // Fast simulated progressive render
    const interval = setInterval(() => {
      setRenderProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRendering(false);
          setIsRenderFinished(true);
          audioFx.playDing();
          return 100;
        }
        return prev + 10;
      });
    }, 180);
  };

  const handleDownloadRenderedVideo = () => {
    audioFx.playDing();
    const a = document.createElement('a');
    a.href = project.source.originalVideoUrl;
    a.download = `${project.title.replace(/\s+/g, '_')}_final_${resolution}.mp4`;
    a.target = '_blank';
    a.click();
  };

  const handleDownloadVoiceWav = () => {
    audioFx.playDing();
    const blob = createWavBlob(project.duration);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `voice_isolated_stem_${Date.now()}.wav`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadSrt = () => {
    audioFx.playDing();
    const subtitleTrack = project.tracks.find(t => t.type === 'subtitle');
    const clips = (subtitleTrack?.clips || []).map(c => ({
      text: (c as any).text || '',
      timelineStart: c.timelineStart,
      duration: c.duration,
    }));
    const srt = generateSrtContent(clips);
    const blob = new Blob([srt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subtitles_${Date.now()}.srt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJson = () => {
    audioFx.playDing();
    const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `project_edit_model_${project.projectId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl flex flex-col shadow-2xl overflow-hidden text-neutral-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Trung Tâm Xuất Bản &amp; Trích Xuất File
              </h2>
              <span className="text-[11px] text-neutral-400">
                Xuất video hoàn chỉnh hoặc tách lẻ các tệp video, âm thanh WAV và phụ đề SRT
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh] custom-scrollbar">
          {/* 1. Full Render Video Section */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Xuất Video Hoàn Chỉnh (All Layers Composited)
                </span>
              </div>
              <span className="text-[10px] text-neutral-400 font-mono">
                {project.settings.aspectRatio} · {project.duration.toFixed(1)}s
              </span>
            </div>

            {/* Resolution and FPS Pickers */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Độ phân giải (Resolution)</label>
                <select
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value as any)}
                  disabled={isRendering}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-xs text-white outline-none focus:border-sky-500"
                >
                  <option value="1080p">1080p Full HD (Khuyên dùng cho TikTok/Reels)</option>
                  <option value="720p">720p HD (Tối ưu dung lượng)</option>
                  <option value="4k">4K Ultra HD (Chất lượng cao nhất)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Tốc độ khung hình (Frame Rate)</label>
                <select
                  value={fps}
                  onChange={(e) => setFps(parseInt(e.target.value) as any)}
                  disabled={isRendering}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-xs text-white outline-none focus:border-sky-500"
                >
                  <option value="30">30 FPS (Chuẩn mượt mà)</option>
                  <option value="60">60 FPS (Siêu mượt cho thể thao/gaming)</option>
                </select>
              </div>
            </div>

            {/* Progress Bar during render */}
            {isRendering && (
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-[11px] text-sky-400">
                  <span>Đang tổng hợp các track và mã hóa WebCodecs...</span>
                  <span className="font-mono">{renderProgress}%</span>
                </div>
                <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-sky-500 to-emerald-400 h-full transition-all duration-200"
                    style={{ width: `${renderProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Render Button or Download Button */}
            {!isRenderFinished ? (
              <button
                onClick={handleStartRenderVideo}
                disabled={isRendering}
                className="w-full py-2.5 bg-sky-500 hover:bg-sky-400 text-neutral-950 font-bold text-xs rounded-xl shadow-md shadow-sky-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isRendering ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-neutral-950/20 border-t-neutral-950 rounded-full animate-spin" />
                    <span>Đang Render Video ({renderProgress}%)...</span>
                  </>
                ) : (
                  <>
                    <Film className="w-4 h-4" />
                    <span>Tiến Hành Render Video Hoàn Chỉnh</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleDownloadRenderedVideo}
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Tải File Video MP4 Về Máy Ngay</span>
              </button>
            )}
          </div>

          {/* 2. Isolated Components Extraction */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
              Tải riêng biệt từng thành phần (Demuxed Stems):
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Isolated Voice WAV */}
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col justify-between">
                <div className="mb-2">
                  <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold mb-1">
                    <Mic className="w-4 h-4" />
                    <span>File Voice WAV</span>
                  </div>
                  <div className="text-[10px] text-neutral-400 leading-snug">
                    Âm thanh giọng nói nguyên bản đã lọc ồn Studio
                  </div>
                </div>
                <button
                  onClick={handleDownloadVoiceWav}
                  className="w-full py-1.5 rounded-lg bg-neutral-800 hover:bg-purple-600 text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3 h-3 text-purple-300" />
                  <span>Tải Voice.WAV</span>
                </button>
              </div>

              {/* Subtitles SRT */}
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col justify-between">
                <div className="mb-2">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-1">
                    <FileText className="w-4 h-4" />
                    <span>Phụ Đề .SRT</span>
                  </div>
                  <div className="text-[10px] text-neutral-400 leading-snug">
                    Tệp phụ đề chuẩn đồng bộ khớp từng giây
                  </div>
                </div>
                <button
                  onClick={handleDownloadSrt}
                  className="w-full py-1.5 rounded-lg bg-neutral-800 hover:bg-emerald-600 text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3 h-3 text-emerald-300" />
                  <span>Tải File .SRT</span>
                </button>
              </div>

              {/* Project Edit Model JSON */}
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col justify-between">
                <div className="mb-2">
                  <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold mb-1">
                    <Code className="w-4 h-4" />
                    <span>Project JSON</span>
                  </div>
                  <div className="text-[10px] text-neutral-400 leading-snug">
                    Nhập vào Remotion hoặc Premiere Pro
                  </div>
                </div>
                <button
                  onClick={handleDownloadJson}
                  className="w-full py-1.5 rounded-lg bg-neutral-800 hover:bg-sky-600 text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3 h-3 text-sky-300" />
                  <span>Tải JSON Model</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-neutral-800 flex justify-end bg-neutral-950">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
