import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Brain, 
  Clapperboard, 
  Mic, 
  MessageSquareText, 
  Film, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { PRESET_PROMPTS } from '../data/mockAssets';
import { AgentExecutionLog, AIProductionPlan } from '../types/video';

interface PromptConsoleProps {
  onExecutePrompt: (prompt: string) => Promise<void>;
  isLoading: boolean;
  agentLogs: AgentExecutionLog[];
  lastPlan: AIProductionPlan | null;
}

export const PromptConsole: React.FC<PromptConsoleProps> = ({
  onExecutePrompt,
  isLoading,
  agentLogs,
  lastPlan,
}) => {
  const [promptInput, setPromptInput] = useState('');
  const [showLogs, setShowLogs] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim() || isLoading) return;
    await onExecutePrompt(promptInput.trim());
    setPromptInput('');
  };

  const handleSelectPreset = (prompt: string) => {
    setPromptInput(prompt);
  };

  const getAgentIcon = (agent: string) => {
    switch (agent) {
      case 'Coordinator':
        return <Brain className="w-4 h-4 text-indigo-400" />;
      case 'Visual Agent':
        return <Clapperboard className="w-4 h-4 text-sky-400" />;
      case 'Voice Agent':
        return <Mic className="w-4 h-4 text-purple-400" />;
      case 'Script Agent':
        return <MessageSquareText className="w-4 h-4 text-emerald-400" />;
      case 'Editor Agent':
        return <Film className="w-4 h-4 text-amber-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-sky-400" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-neutral-950/80 text-neutral-200 p-3 overflow-y-auto custom-scrollbar">
      {/* Prompt Form */}
      <div className="border border-neutral-800 bg-neutral-900/90 rounded-xl p-3 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-sky-500/10 text-sky-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-200">
              Nhập Prompt Xào Nấu Video
            </span>
          </div>
          <span className="text-[11px] text-neutral-500">Gemini 3.8 Production Agent</span>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
          <textarea
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="Ví dụ: Cắt những đoạn im lặng, làm màu điện ảnh teal & orange, đồng bộ phụ đề karaoke tiếng Việt, tự động hạ nhạc nền khi có tiếng nói..."
            rows={3}
            className="w-full bg-neutral-950 border border-neutral-800 focus:border-sky-500 rounded-lg p-2.5 text-xs text-neutral-100 placeholder-neutral-500 outline-none resize-none transition-all leading-relaxed"
          />

          <div className="flex items-center justify-between">
            <span className="text-[10px] text-neutral-500 italic">
              AI sẽ tự động lập kế hoạch và áp trực tiếp lên Timeline
            </span>

            <button
              type="submit"
              disabled={!promptInput.trim() || isLoading}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-medium text-xs rounded-lg disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-sky-500/20 transition-all active:scale-95 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Xào Nấu Video</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Preset Prompt Suggestions */}
        <div className="mt-3 pt-2.5 border-t border-neutral-800/80">
          <div className="text-[11px] font-medium text-neutral-400 mb-1.5 flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3 text-neutral-500" />
            <span>Gợi ý kịch bản phổ biến:</span>
          </div>
          <div className="flex flex-col gap-1.5">
            {PRESET_PROMPTS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(item.prompt)}
                className="text-left text-xs text-neutral-300 hover:text-sky-300 bg-neutral-950/60 hover:bg-neutral-800/60 border border-neutral-800 hover:border-sky-500/40 px-2.5 py-1.5 rounded-md transition-all flex items-center justify-between group cursor-pointer"
              >
                <span className="font-medium truncate">{item.label}</span>
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-sky-400 transition-opacity flex-shrink-0 ml-1" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Applied Plan Summary */}
      {lastPlan && (
        <div className="mt-3 border border-emerald-500/30 bg-emerald-950/20 rounded-xl p-3">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Kế hoạch sản xuất đã thực thi</span>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed mb-2">
            {lastPlan.summary}
          </p>

          <div className="grid grid-cols-3 gap-2 text-[11px] mb-2 bg-neutral-900/60 p-2 rounded-lg border border-neutral-800/60">
            <div>
              <span className="text-neutral-500 block">Thời lượng:</span>
              <span className="text-white font-mono font-medium">{lastPlan.targetDuration}s</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Tỷ lệ khung:</span>
              <span className="text-white font-mono font-medium">{lastPlan.aspectRatio}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Bộ lọc màu:</span>
              <span className="text-sky-400 font-medium capitalize">{lastPlan.colorGrade.replace('_', ' ')}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-semibold text-neutral-400 block tracking-wider">
              Thay đổi đã nạp vào timeline:
            </span>
            {lastPlan.appliedChanges.map((change, cIdx) => (
              <div key={cIdx} className="text-xs text-neutral-300 flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">•</span>
                <span>{change}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4 AI Production Agents Execution Flow */}
      <div className="mt-3 border border-neutral-800 bg-neutral-900/80 rounded-xl overflow-hidden">
        <button
          onClick={() => setShowLogs(!showLogs)}
          className="w-full px-3 py-2.5 bg-neutral-900 flex items-center justify-between text-xs font-semibold text-neutral-300 hover:text-white transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-sky-400" />
            <span>Điều Phối 4 AI Production Agent</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 font-mono">
              {agentLogs.length} logs
            </span>
          </div>
          {showLogs ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showLogs && (
          <div className="p-2.5 space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
            {agentLogs.map((log) => (
              <div
                key={log.id}
                className="bg-neutral-950/70 border border-neutral-800/80 rounded-lg p-2.5 text-xs transition-all hover:border-neutral-700"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 font-medium text-neutral-200">
                    {getAgentIcon(log.agent)}
                    <span className="font-semibold text-sky-300">{log.agent}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-neutral-500 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{log.timestamp}</span>
                  </div>
                </div>

                <div className="text-neutral-200 font-medium text-[11px] mb-0.5">
                  {log.action}
                </div>
                <div className="text-neutral-400 text-[11px] leading-relaxed">
                  {log.details}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
