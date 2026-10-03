import React, { useState } from 'react';
import { 
  X, 
  Cpu, 
  Layers, 
  Code, 
  Workflow, 
  CheckCircle2, 
  Copy, 
  Brain, 
  Clapperboard, 
  Mic, 
  MessageSquareText, 
  Film,
  Server,
  Zap
} from 'lucide-react';
import { ProjectEditModel } from '../types/video';

interface SystemArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProject: ProjectEditModel;
}

export const SystemArchitectureModal: React.FC<SystemArchitectureModalProps> = ({
  isOpen,
  onClose,
  currentProject,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'pipeline' | 'json' | 'tech_stack'>('pipeline');

  if (!isOpen) return null;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(currentProject, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-neutral-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Workflow className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Kiến Trúc Kỹ Thuật Hệ Thống &amp; 4 AI Production Agent
              </h2>
              <span className="text-[11px] text-neutral-400">
                Mô hình xử lý video phi tuyến tính (NLE) kết hợp AI Agent &amp; Project Edit Model
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

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-neutral-800 bg-neutral-950/50">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'pipeline'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Luồng Xử Lý 7 Bước &amp; 4 Agent
          </button>

          <button
            onClick={() => setActiveTab('json')}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'json'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Project Edit Model (JSON Thời Gian Thực)</span>
          </button>

          <button
            onClick={() => setActiveTab('tech_stack')}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'tech_stack'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Công Nghệ Tích Hợp (FFmpeg + Remotion + WebCodecs)
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
          {/* TAB 1: 7-STEP PIPELINE & 4 AGENTS */}
          {activeTab === 'pipeline' && (
            <div className="space-y-6">
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
                <span className="text-xs font-semibold text-neutral-300 block mb-1">
                  Triết lý kiến trúc cốt lõi:
                </span>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  "AI không chỉ xuất ra một video mới như hộp đen, mà biến đổi một <strong>Project Edit Model</strong> có cấu trúc. Toàn bộ các lớp layer (Video, Audio stem, Phụ đề, Nhạc nền, Overlay) đều hiển thị và cho phép người dùng tự tay can thiệp như trên CapCut hoặc Premiere Pro."
                </p>
              </div>

              {/* 4 Specialized Agents Diagram */}
              <div>
                <div className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-400" />
                  <span>Đội ngũ AI Production Agent điều phối:</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-neutral-950 border border-sky-500/30">
                    <div className="flex items-center gap-2 text-sky-400 text-xs font-bold mb-1">
                      <Clapperboard className="w-4 h-4" />
                      <span>1. Visual Agent (Thị Giác)</span>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Phân tích từng khung hình, tạo chuyển động hoạt ảnh, chuyển đổi tỷ lệ dọc 9:16 / ngang 16:9, áp bộ lọc màu Cinematic LUTs và chèn B-Roll cận cảnh.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-950 border border-purple-500/30">
                    <div className="flex items-center gap-2 text-purple-400 text-xs font-bold mb-1">
                      <Mic className="w-4 h-4" />
                      <span>2. Voice Agent (Âm Thanh)</span>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Tách stem giọng nói, khử tạp âm Studio Mic, điều khiển nhạc nền tự động hạ âm lượng (Audio Ducking) và sinh giọng đọc AI theo vùng miền (Bắc/Nam).
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-950 border border-emerald-500/30">
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-1">
                      <MessageSquareText className="w-4 h-4" />
                      <span>3. Script Agent (Kịch Bản &amp; Subtitle)</span>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Trích xuất lời thoại, tạo phụ đề động Karaoke nhảy chữ theo từng miligiây, highlight từ khóa khuyến mãi và viết lời kêu gọi hành động CTA.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-950 border border-amber-500/30">
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-1">
                      <Film className="w-4 h-4" />
                      <span>4. Editor Agent (Dựng Phim)</span>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Cắt gọt những khoảng lặng thừa, ghép cảnh chuyển tiếp (Whoosh/Flash), đồng bộ nhịp điệu với tiết tấu nhạc và sắp xếp các track trên Timeline.
                    </p>
                  </div>
                </div>
              </div>

              {/* 7-Step Pipeline */}
              <div className="space-y-2.5">
                <div className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                  Quy trình xử lý 7 bước chuẩn công nghiệp:
                </div>

                {[
                  { step: 1, title: 'Upload video hoặc Ảnh tĩnh (Sản phẩm + KOL)', desc: 'Lưu trữ file an toàn, kiểm tra codec và định dạng đầu vào.' },
                  { step: 2, title: 'Bóc tách Demuxing bằng FFmpeg', desc: 'Trích xuất video không tiếng, file voice WAV riêng biệt, tạo biểu đồ sóng âm (waveform) và dải thumbnail.' },
                  { step: 3, title: 'Phân tích nội dung đa phương thức', desc: 'Nhận diện transcript, mốc thời gian lời thoại, phát hiện khoảng lặng và phân loại cảnh quay.' },
                  { step: 4, title: 'Chuyển đổi Prompt thành Project Edit Model', desc: 'Coordinator chuyển prompt ngôn ngữ tự nhiên thành JSON các thao tác cắt, gọt, đổi màu, thêm nhạc.' },
                  { step: 5, title: 'Tạo bản dựng thử (Fast Preview Canvas)', desc: 'Thực thi ngay trên trình duyệt với thời gian phản hồi tức thì để người dùng xem trước.' },
                  { step: 6, title: 'Chỉnh sửa thủ công trên Timeline', desc: 'Cho phép người dùng kéo thả clip, chỉnh thời điểm phụ đề, đổi nhạc hoặc tinh chỉnh transform.' },
                  { step: 7, title: 'Render và xuất file phân phối', desc: 'Hỗ trợ xuất video hoàn chỉnh MP4, trích xuất riêng file audio WAV hoặc phụ đề .SRT.' }
                ].map((s) => (
                  <div key={s.step} className="flex items-start gap-3 p-2.5 rounded-lg bg-neutral-950/60 border border-neutral-800">
                    <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 mt-0.5">
                      {s.step}
                    </span>
                    <div>
                      <div className="text-xs font-semibold text-neutral-200">{s.title}</div>
                      <div className="text-[11px] text-neutral-400">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: REAL-TIME PROJECT EDIT MODEL JSON */}
          {activeTab === 'json' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs text-neutral-400">
                  Dữ liệu JSON mô tả toàn bộ bản dựng hiện tại. Mọi thao tác cắt gọt hoặc lệnh prompt đều cập nhật tức thời vào cấu trúc này:
                </div>
                <button
                  onClick={handleCopyJson}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-white transition-colors cursor-pointer"
                >
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Đã sao chép!' : 'Sao chép JSON'}</span>
                </button>
              </div>

              <pre className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 font-mono text-[11px] text-emerald-400 overflow-x-auto max-h-[460px] custom-scrollbar leading-relaxed">
                {JSON.stringify(currentProject, null, 2)}
              </pre>
            </div>
          )}

          {/* TAB 3: TECH STACK DETAILS */}
          {activeTab === 'tech_stack' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                  <div className="flex items-center gap-2 text-sky-400 font-bold text-xs">
                    <Server className="w-4 h-4" />
                    <span>Lớp Xử Lý Dữ Liệu</span>
                  </div>
                  <ul className="text-xs text-neutral-400 space-y-1.5 list-disc list-inside">
                    <li>FFmpeg Demuxing &amp; Audio Isolation</li>
                    <li>Waveform Audio Peak Analysis</li>
                    <li>Spleeter / Demucs AI Voice Stemming</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                  <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
                    <Brain className="w-4 h-4" />
                    <span>Lớp Trí Tuệ Nhân Tạo</span>
                  </div>
                  <ul className="text-xs text-neutral-400 space-y-1.5 list-disc list-inside">
                    <li>Gemini 3.8 Flash (Orchestrator)</li>
                    <li>Gemini 3.8 Flash Lite TTS (Voiceover)</li>
                    <li>Voice Character Emulation (Bắc / Nam)</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                    <Zap className="w-4 h-4" />
                    <span>Lớp Render &amp; Trình Diễn</span>
                  </div>
                  <ul className="text-xs text-neutral-400 space-y-1.5 list-disc list-inside">
                    <li>Web Audio API Synthesizer</li>
                    <li>HTML5 Canvas Real-Time Compositor</li>
                    <li>Remotion Headless Worker Exporter</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-neutral-800 flex justify-end bg-neutral-950">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white transition-colors cursor-pointer"
          >
            Đóng bảng kiến trúc
          </button>
        </div>
      </div>
    </div>
  );
};
