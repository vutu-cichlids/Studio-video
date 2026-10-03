import React, { useState } from 'react';
import { 
  Sparkles, 
  Upload, 
  Play, 
  ArrowRight, 
  Video, 
  Volume2, 
  Check, 
  Layers, 
  Film, 
  User, 
  Package, 
  Clapperboard, 
  CheckCircle2,
  Clock,
  Radio,
  Tv
} from 'lucide-react';
import { SAMPLE_PRODUCTS, SAMPLE_KOLS } from '../data/mockAssets';
import { KolPersona, ProductItem, ProjectEditModel, AspectRatio } from '../types/video';
import { audioFx } from '../utils/audioWaveform';

interface ImageToVideoStudioProps {
  onLoadGeneratedAdToTimeline: (adProject: ProjectEditModel) => void;
}

export const ImageToVideoStudio: React.FC<ImageToVideoStudioProps> = ({
  onLoadGeneratedAdToTimeline,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<ProductItem>(SAMPLE_PRODUCTS[0]);
  const [selectedKol, setSelectedKol] = useState<KolPersona>(SAMPLE_KOLS[0]);
  const [adPrompt, setAdPrompt] = useState(
    'Tạo video quảng cáo dọc 9:16 dài 20 giây. KOL đứng cạnh ghế massage trong phòng khách cao cấp, mỉm cười và giới thiệu sản phẩm bằng tiếng Việt với giọng nữ miền Bắc tự nhiên, ấm áp. Camera chuyển từ toàn cảnh sang cận cảnh sản phẩm, ánh sáng sang trọng, chuyển động mượt. Thêm lời dẫn, phụ đề đồng bộ và kết thúc bằng logo cùng CTA giảm 40%.'
  );
  const [adRatio, setAdRatio] = useState<AspectRatio>('9:16');
  const [targetDuration, setTargetDuration] = useState<number>(20);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<any | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    audioFx.playClick();
    try {
      const response = await fetch('/api/ai/image-to-video-ad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: selectedProduct.name,
          productCategory: selectedProduct.category,
          productFeatures: selectedProduct.features,
          kolName: selectedKol.name,
          kolRole: selectedKol.role,
          kolAccent: selectedKol.accent,
          userPrompt: adPrompt,
          targetDuration,
          ratio: adRatio,
        }),
      });

      const data = await response.json();
      setGeneratedResult(data);
      audioFx.playDing();
    } catch (err) {
      console.error('Error generating image to video ad:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInjectIntoTimeline = () => {
    if (!generatedResult) return;
    audioFx.playDing();

    // Construct full ProjectEditModel from AI Storyboard
    const scenes = generatedResult.storyboard || [];
    const sceneDuration = targetDuration / (scenes.length || 4);

    const newProject: ProjectEditModel = {
      projectId: `proj_ai_ad_${Date.now()}`,
      title: generatedResult.title || `Quảng cáo ${selectedProduct.name}`,
      createdAt: new Date().toISOString(),
      duration: targetDuration,
      settings: {
        width: adRatio === '9:16' ? 1080 : 1920,
        height: adRatio === '9:16' ? 1920 : 1080,
        fps: 30,
        aspectRatio: adRatio,
      },
      source: {
        originalVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-sitting-in-an-armchair-in-a-living-room-41553-large.mp4',
        originalAudioUrl: 'simulated://voice.wav',
        videoSeparatedUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-sitting-in-an-armchair-in-a-living-room-41553-large.mp4',
        audioVoiceSeparatedUrl: 'simulated://voice.wav',
        title: generatedResult.title,
        duration: targetDuration,
      },
      tracks: [
        {
          id: 'track_v2_overlay',
          name: 'V2 · Overlay & CTA Flash',
          type: 'overlay',
          isMuted: false,
          isLocked: false,
          isVisible: true,
          clips: [
            {
              id: 'clip_overlay_cta',
              type: 'overlay',
              category: 'cta',
              name: '🔥 CTA Chốt Đơn Giảm 40%',
              title: 'GIẢM NGAY 40% HÔM NAY',
              subtitle: 'Bấm vào góc giỏ hàng',
              timelineStart: targetDuration - 5,
              duration: 5,
              sourceStart: 0,
              color: '#ef4444',
              position: { x: 50, y: 80 },
              scale: 1.1,
            },
          ],
        },
        {
          id: 'track_v1_main',
          name: 'V1 · AI Motion Video (KOL + Sản Phẩm)',
          type: 'video',
          isMuted: false,
          isLocked: false,
          isVisible: true,
          clips: [
            {
              id: 'clip_v1_ad',
              type: 'video',
              name: `AI_Render_${selectedProduct.name.slice(0, 15)}.mp4`,
              sourceUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-sitting-in-an-armchair-in-a-living-room-41553-large.mp4',
              thumbnailUrl: selectedProduct.imageUrl,
              timelineStart: 0,
              duration: targetDuration,
              sourceStart: 0,
              speed: 1.0,
              color: '#3b82f6',
              transform: { scale: 1.0, positionX: 0, positionY: 0, rotation: 0, opacity: 1.0 },
              colorAdjustments: {
                brightness: 2,
                contrast: 8,
                saturation: 12,
                temperature: 0,
                vignette: 15,
                filter: 'teal_orange',
              },
            },
          ],
        },
        {
          id: 'track_t1_subtitles',
          name: 'T1 · Lời Thoại Phụ Đề AI',
          type: 'subtitle',
          isMuted: false,
          isLocked: false,
          isVisible: true,
          clips: scenes.map((sc: any, idx: number) => ({
            id: `sub_ad_${idx + 1}`,
            type: 'subtitle',
            name: `Cảnh #${idx + 1}: ${sc.onScreenText || 'Lời thoại'}`,
            text: sc.dialogue || sc.onScreenText,
            timelineStart: idx * sceneDuration,
            duration: sceneDuration,
            sourceStart: 0,
            color: '#10b981',
            style: {
              fontFamily: 'Inter, sans-serif',
              fontSize: 22,
              fontColor: '#ffffff',
              backgroundColor: 'rgba(0,0,0,0.7)',
              outlineColor: '#000000',
              hasBackground: true,
              animation: 'karaoke_bounce',
            },
          })),
        },
        {
          id: 'track_a1_voice',
          name: 'A1 · Giọng Nói KOL (AI Speech)',
          type: 'audio',
          subtype: 'voice',
          isMuted: false,
          isLocked: false,
          isVisible: true,
          clips: [
            {
              id: 'clip_a1_kol_voice',
              type: 'audio',
              category: 'voice',
              name: `KOL_${selectedKol.name}_Voice.wav`,
              sourceUrl: 'simulated://voice.wav',
              timelineStart: 0,
              duration: targetDuration,
              sourceStart: 0,
              color: '#8b5cf6',
              audioSettings: {
                volume: 130,
                fadeIn: 0.2,
                fadeOut: 0.5,
                voiceFilter: 'studio_mic',
                noiseReduction: true,
                isMuted: false,
              },
              waveformData: Array.from({ length: 60 }, () => Math.random() * 0.7 + 0.2),
            },
          ],
        },
        {
          id: 'track_a2_bgm',
          name: 'A2 · Nhạc Nền Quảng Cáo (BGM Ducking)',
          type: 'audio',
          subtype: 'music',
          isMuted: false,
          isLocked: false,
          isVisible: true,
          clips: [
            {
              id: 'clip_a2_bgm',
              type: 'audio',
              category: 'music',
              name: 'Cinematic_Luxury_Pop.mp3',
              sourceUrl: 'simulated://bgm.mp3',
              timelineStart: 0,
              duration: targetDuration,
              sourceStart: 0,
              color: '#ec4899',
              audioSettings: {
                volume: 35,
                fadeIn: 0.5,
                fadeOut: 1.5,
                voiceFilter: 'none',
                noiseReduction: false,
                isMuted: false,
              },
              waveformData: Array.from({ length: 60 }, () => Math.random() * 0.5 + 0.3),
            },
          ],
        },
      ],
    };

    onLoadGeneratedAdToTimeline(newProject);
  };

  return (
    <div className="flex flex-col h-full bg-neutral-950 text-neutral-100 p-6 overflow-y-auto custom-scrollbar">
      {/* Title Header */}
      <div className="max-w-6xl mx-auto w-full mb-6">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              AI Image-to-Video Ads Studio (Sản Phẩm + KOL)
            </h1>
            <p className="text-xs text-neutral-400">
              Biến ảnh tĩnh sản phẩm &amp; ảnh tĩnh KOL thành video quảng cáo chuyển động sống động, tự sinh lời thoại, giọng đọc AI và nạp trực tiếp vào Timeline CapCut.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs Column (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* STEP 1: Select Product Image */}
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center text-xs font-bold font-mono">
                  1
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-200">
                  Đầu Vào 1 — Ảnh Tĩnh Sản Phẩm
                </span>
              </div>
              <span className="text-[11px] text-neutral-400">Chọn mẫu hoặc tải ảnh lên</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {SAMPLE_PRODUCTS.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => setSelectedProduct(prod)}
                  className={`border rounded-xl p-2 cursor-pointer transition-all flex flex-col justify-between ${
                    selectedProduct.id === prod.id
                      ? 'border-sky-500 bg-sky-500/10 shadow-md shadow-sky-500/20 ring-1 ring-sky-500'
                      : 'border-neutral-800 bg-neutral-950/60 hover:border-neutral-700'
                  }`}
                >
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    className="w-full h-24 object-cover rounded-lg mb-2"
                  />
                  <div>
                    <div className="text-xs font-medium text-white truncate">{prod.name}</div>
                    <div className="text-[10px] text-sky-400 font-mono mt-0.5">{prod.priceTag}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* STEP 2: Select KOL Character Image */}
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold font-mono">
                  2
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-200">
                  Đầu Vào 2 — Ảnh Tĩnh Nhân Vật / KOL
                </span>
              </div>
              <span className="text-[11px] text-neutral-400">Mô phỏng chuyển động &amp; giọng nói</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {SAMPLE_KOLS.map((kol) => (
                <div
                  key={kol.id}
                  onClick={() => setSelectedKol(kol)}
                  className={`border rounded-xl p-2 cursor-pointer transition-all flex flex-col justify-between ${
                    selectedKol.id === kol.id
                      ? 'border-emerald-500 bg-emerald-500/10 shadow-md shadow-emerald-500/20 ring-1 ring-emerald-500'
                      : 'border-neutral-800 bg-neutral-950/60 hover:border-neutral-700'
                  }`}
                >
                  <img
                    src={kol.avatarUrl}
                    alt={kol.name}
                    className="w-full h-24 object-cover rounded-lg mb-2"
                  />
                  <div>
                    <div className="text-xs font-medium text-white truncate">{kol.name}</div>
                    <div className="text-[10px] text-emerald-400 truncate mt-0.5">{kol.accent}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* STEP 3: Prompt & Directives */}
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold font-mono">
                  3
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-200">
                  Chỉ Đạo Sáng Tạo &amp; Thông Số Video
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-neutral-300 block mb-1">Mô Tả Kịch Bản &amp; Chuyển Động Mong Muốn</label>
                <textarea
                  value={adPrompt}
                  onChange={(e) => setAdPrompt(e.target.value)}
                  rows={3}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-purple-500 rounded-xl p-3 text-xs text-neutral-100 placeholder-neutral-500 outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Tỷ lệ khung hình</label>
                  <select
                    value={adRatio}
                    onChange={(e) => setAdRatio(e.target.value as AspectRatio)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs text-white outline-none focus:border-purple-500"
                  >
                    <option value="9:16">9:16 · Dọc TikTok / Reels / Shorts</option>
                    <option value="16:9">16:9 · Ngang YouTube Commercial</option>
                    <option value="1:1">1:1 · Vuông Instagram Feed</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Thời lượng mục tiêu</label>
                  <select
                    value={targetDuration}
                    onChange={(e) => setTargetDuration(parseInt(e.target.value))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs text-white outline-none focus:border-purple-500"
                  >
                    <option value="15">15 Giây (Bắt Trend TikTok)</option>
                    <option value="20">20 Giây (Tiêu chuẩn Review &amp; CTA)</option>
                    <option value="30">30 Giây (Giới thiệu chuyên sâu)</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-neutral-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-neutral-950/20 border-t-neutral-950 rounded-full animate-spin" />
                    <span>AI Đang Phối Hợp 4 Agent Lên Kịch Bản...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Khởi Tạo Video Quảng Cáo Từ Ảnh &amp; Prompt</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Output Column: Storyboard & Timeline Injection (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 h-full flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-3">
                <div className="flex items-center gap-2">
                  <Clapperboard className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    Kết Quả Kịch Bản Storyboard AI
                  </span>
                </div>
                {generatedResult && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono">
                    Đã Khớp Khung
                  </span>
                )}
              </div>

              {!generatedResult ? (
                <div className="flex flex-col items-center justify-center p-8 text-center text-neutral-500 space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-center text-neutral-600">
                    <Video className="w-8 h-8" />
                  </div>
                  <div className="text-xs text-neutral-300 font-medium">Chưa có kịch bản quảng cáo</div>
                  <p className="text-[11px] text-neutral-500 max-w-xs leading-relaxed">
                    Chọn sản phẩm, KOL và nhấn "Khởi Tạo Video Quảng Cáo" để AI phân tích biểu cảm, chuyển động camera và lời thoại phù hợp.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 overflow-y-auto max-h-[460px] custom-scrollbar pr-1">
                  <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800">
                    <div className="text-xs font-bold text-white mb-1">{generatedResult.title}</div>
                    <p className="text-xs text-neutral-300 leading-relaxed mb-2">
                      {generatedResult.summary}
                    </p>

                    <div className="text-[11px] text-purple-400 bg-purple-950/20 border border-purple-800/40 p-2 rounded-lg">
                      <span className="font-semibold block mb-0.5">Giọng đọc &amp; Chỉ đạo diễn xuất:</span>
                      {generatedResult.agentCoordination?.voicePrompt}
                    </div>
                  </div>

                  {/* Storyboard scenes list */}
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-neutral-400">Phân cảnh chi tiết (Storyboard):</div>
                    {generatedResult.storyboard?.map((scene: any, sIdx: number) => (
                      <div
                        key={sIdx}
                        className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-400">
                            Cảnh {scene.sceneNumber}: {scene.timeRange}
                          </span>
                          <span className="text-[10px] text-neutral-500 font-mono">{scene.audioMood}</span>
                        </div>

                        <div className="text-neutral-200 text-xs font-medium">
                          {scene.visualDescription}
                        </div>

                        <div className="text-neutral-400 text-[11px] bg-neutral-900/60 p-2 rounded-lg border border-neutral-800/80">
                          <span className="text-yellow-400 font-semibold block mb-0.5">Lời thoại KOL:</span>
                          "{scene.dialogue}"
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-sky-400 pt-1">
                          <span>Chữ hiển thị: <strong>{scene.onScreenText}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action to inject into timeline */}
            {generatedResult && (
              <div className="pt-4 border-t border-neutral-800 mt-4">
                <button
                  onClick={handleInjectIntoTimeline}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Film className="w-4 h-4" />
                  <span>Nạp Vào Timeline CapCut Để Dựng Tiếp</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
