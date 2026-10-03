import React from 'react';
import { 
  Sparkles, 
  Film, 
  Layers, 
  Download, 
  Undo2, 
  Redo2, 
  Ratio, 
  Cpu, 
  Video, 
  Image as ImageIcon 
} from 'lucide-react';
import { AspectRatio } from '../types/video';

interface HeaderProps {
  projectTitle: string;
  onUpdateTitle: (title: string) => void;
  activeMode: 'remix' | 'image_to_video' | 'architecture';
  onChangeMode: (mode: 'remix' | 'image_to_video' | 'architecture') => void;
  aspectRatio: AspectRatio;
  onChangeAspectRatio: (ratio: AspectRatio) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onOpenExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  projectTitle,
  onUpdateTitle,
  activeMode,
  onChangeMode,
  aspectRatio,
  onChangeAspectRatio,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onOpenExport,
}) => {
  return (
    <header className="h-14 border-b border-neutral-800 bg-neutral-950 px-4 flex items-center justify-between text-neutral-100 select-none z-30 relative">
      {/* Brand & Project Name */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 font-bold tracking-tight text-white">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-sky-500 to-emerald-400 p-0.5 flex items-center justify-center shadow-lg shadow-sky-500/10">
            <div className="w-full h-full bg-neutral-950 rounded-[7px] flex items-center justify-center">
              <Film className="w-4 h-4 text-sky-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-wide flex items-center gap-1.5">
              PROMPTCUT <span className="text-[10px] text-sky-400 font-mono font-medium">STUDIO</span>
            </span>
          </div>
        </div>

        <div className="h-4 w-px bg-neutral-800 mx-1" />

        {/* Project Title Editor */}
        <input
          type="text"
          value={projectTitle}
          onChange={(e) => onUpdateTitle(e.target.value)}
          className="text-xs bg-transparent border-b border-transparent hover:border-neutral-700 focus:border-sky-500 px-1.5 py-0.5 text-neutral-300 hover:text-white transition-colors outline-none max-w-[220px] truncate"
          title="Nhấp để đổi tên dự án"
        />
      </div>

      {/* Main Navigation Modes */}
      <div className="flex items-center gap-1 bg-neutral-900/90 p-1 rounded-lg border border-neutral-800">
        <button
          onClick={() => onChangeMode('remix')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            activeMode === 'remix'
              ? 'bg-neutral-800 text-sky-400 shadow-sm border border-neutral-700/60'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40'
          }`}
        >
          <Video className="w-3.5 h-3.5" />
          <span>Biên Tập &amp; Xào Nấu AI</span>
        </button>

        <button
          onClick={() => onChangeMode('image_to_video')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            activeMode === 'image_to_video'
              ? 'bg-neutral-800 text-emerald-400 shadow-sm border border-neutral-700/60'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Tạo Video Từ Ảnh (KOL + Sản Phẩm)</span>
        </button>

        <button
          onClick={() => onChangeMode('architecture')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            activeMode === 'architecture'
              ? 'bg-neutral-800 text-purple-400 shadow-sm border border-neutral-700/60'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Kiến Trúc 4 Agent &amp; FFmpeg</span>
        </button>
      </div>

      {/* Actions & Aspect Ratio & Export */}
      <div className="flex items-center gap-2.5">
        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5 border border-neutral-800 rounded-md p-0.5 bg-neutral-900/50">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title="Hoàn tác (Ctrl+Z)"
            className="p-1 rounded text-neutral-400 hover:text-neutral-200 disabled:opacity-30 disabled:hover:text-neutral-400 transition-colors"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            title="Làm lại (Ctrl+Y)"
            className="p-1 rounded text-neutral-400 hover:text-neutral-200 disabled:opacity-30 disabled:hover:text-neutral-400 transition-colors"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Aspect Ratio Selector */}
        <div className="flex items-center gap-1.5 border border-neutral-800 rounded-md px-2 py-1 bg-neutral-900/80">
          <Ratio className="w-3.5 h-3.5 text-neutral-400" />
          <select
            value={aspectRatio}
            onChange={(e) => onChangeAspectRatio(e.target.value as AspectRatio)}
            className="bg-transparent text-xs text-neutral-200 outline-none font-medium cursor-pointer"
          >
            <option value="9:16" className="bg-neutral-900 text-white">9:16 (TikTok / Reels)</option>
            <option value="16:9" className="bg-neutral-900 text-white">16:9 (YouTube / Chuẩn)</option>
            <option value="1:1" className="bg-neutral-900 text-white">1:1 (Instagram Vuông)</option>
            <option value="4:5" className="bg-neutral-900 text-white">4:5 (Facebook Feed)</option>
          </select>
        </div>

        {/* Export / Separation Trigger */}
        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-semibold text-xs tracking-wide shadow-md shadow-emerald-500/20 transition-all hover:shadow-emerald-500/30 active:scale-95"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Xuất &amp; Tách File</span>
        </button>
      </div>
    </header>
  );
};
