import { KolPersona, ProductItem, ProjectEditModel, SampleProject } from '../types/video';

// Generate simulated smooth audio waveform peaks
export function generateWaveform(count: number, seed: number = 42): number[] {
  const result: number[] = [];
  let current = 0.5;
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * (4 + (seed % 5));
    const noise = Math.sin(angle) * 0.35 + Math.cos(angle * 2.3) * 0.2 + (Math.random() - 0.5) * 0.15;
    current = Math.max(0.12, Math.min(0.95, 0.45 + noise));
    result.push(parseFloat(current.toFixed(2)));
  }
  return result;
}

export const SAMPLE_PROJECTS: SampleProject[] = [
  {
    id: 'sample_massage_chair',
    name: 'Quảng Cáo Ghế Massage AI & KOL (Dự Án Mẫu)',
    category: 'E-commerce & KOL Ads',
    description: 'Video review và quảng cáo ghế massage thông minh, tích hợp KOL thuyết trình và cận cảnh tính năng thư giãn 4D.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-sitting-in-an-armchair-in-a-living-room-41553-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
    duration: 18,
    transcript: [
      { text: 'Chào mọi người, hôm nay mình trên tay siêu phẩm ghế massage AI.', start: 0.5, end: 4.2 },
      { text: 'Công nghệ con lăn 4D tự động quét huyệt đạo toàn thân cực đỉnh.', start: 4.8, end: 9.3 },
      { text: 'Chỉ cần ngả lưng 15 phút, mọi căng thẳng mệt mỏi đều tan biến.', start: 10.0, end: 14.5 },
      { text: 'Ưu đãi đặt sớm giảm ngay 40%, bấm link ngay bên dưới nhé!', start: 14.8, end: 17.8 }
    ]
  },
  {
    id: 'sample_tech_gadget',
    name: 'Unboxing & Review Smartphone Flagship',
    category: 'Tech Review',
    description: 'Video unboxing công nghệ cao cấp, bóc tách âm thanh review mic ngoài và nhạc nền sôi động.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-unboxing-a-new-mobile-phone-41481-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
    duration: 15,
    transcript: [
      { text: 'Mở hộp siêu phẩm công nghệ đáng mua nhất trong phân khúc năm nay!', start: 0.4, end: 4.0 },
      { text: 'Mặt lưng kính mờ cao cấp, camera 200MP zoom siêu nét 100x.', start: 4.5, end: 9.0 },
      { text: 'Hiệu năng mượt mà, màn hình 120Hz trải nghiệm đỉnh chóp.', start: 9.5, end: 14.4 }
    ]
  },
  {
    id: 'sample_skincare_cosmetics',
    name: 'Review Serum Dưỡng Da & Glow Skin',
    category: 'Beauty & Skincare',
    description: 'Quay cận cảnh chất serum thẩm thấu, KOL giới thiệu routine chăm sóc da mùa hè.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-drops-of-liquid-falling-on-a-beauty-product-42217-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    duration: 16,
    transcript: [
      { text: 'Bí quyết giúp làn da căng mọng bóng khỏe suốt cả ngày dài.', start: 0.6, end: 4.2 },
      { text: 'Serum chứa HA đa tầng và Niacinamide 5% thẩm thấu trong 3 giây.', start: 4.6, end: 10.1 },
      { text: 'Rất nhẹ thoáng, không hề bết rít kể cả da dầu nhạy cảm.', start: 10.6, end: 15.2 }
    ]
  }
];

export const SAMPLE_KOLS: KolPersona[] = [
  {
    id: 'kol_mai_anh',
    name: 'Mai Anh (Beauty & Lifestyle)',
    role: 'KOL Chuyên Review Mỹ Phẩm & Đời Sống',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    accent: 'Giọng Nữ Miền Bắc chuẩn, ấm áp, tự nhiên',
    sampleVoicePrompt: 'Giọng nữ 24 tuổi, nhẹ nhàng truyền cảm, phong cách tâm tình đáng tin cậy'
  },
  {
    id: 'kol_duy_luan',
    name: 'Tuấn Khang (Tech & Gear)',
    role: 'Chuyên gia Review Thiết Bị Công Nghệ',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    accent: 'Giọng Nam Miền Nam hào sảng, dứt khoát',
    sampleVoicePrompt: 'Giọng nam 28 tuổi, hiện đại, nhịp điệu nhanh, cuốn hút kiểu review công nghệ'
  },
  {
    id: 'kol_lan_huong',
    name: 'Lan Hương (Commercial Host)',
    role: 'MC Truyền Hình & Đại Sứ Thương Hiệu',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    accent: 'Giọng Nữ chuẩn phát thanh, sang trọng',
    sampleVoicePrompt: 'Giọng nữ đĩnh đạc, sang trọng, rất phù hợp cho dòng sản phẩm chăm sóc sức khỏe và nội thất cao cấp'
  },
  {
    id: 'kol_hoang_nam',
    name: 'Hoàng Nam (Fitness & Wellness)',
    role: 'Huấn Luyện Viên & Reviewer Sức Khỏe',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    accent: 'Giọng Nam năng động, truyền động lực',
    sampleVoicePrompt: 'Giọng nam khỏe khoắn, truyền cảm hứng thể thao và phục hồi năng lượng'
  }
];

export const SAMPLE_PRODUCTS: ProductItem[] = [
  {
    id: 'prod_massage_chair',
    name: 'Ghế Massage Thông Minh AI MaxRelax Pro 4D',
    category: 'Nội Thất Sức Khỏe Cao Cấp',
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
    features: ['Con lăn silicon 4D mô phỏng bàn tay', 'Chế độ không trọng lực Zero-Gravity', 'Nhiệt hồng ngoại sưởi ấm lưng', 'Điều khiển giọng nói tiếng Việt AI'],
    priceTag: '29.900.000đ (Giảm 40%)'
  },
  {
    id: 'prod_skincare_serum',
    name: 'Tinh Chất Phục Hồi BioGlow Multi-HA',
    category: 'Mỹ Phẩm Skincare',
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    features: ['Phức hợp 5 loại Hyaluronic Acid', 'Niacinamide 5% làm sáng da', 'Cấp ẩm sâu suốt 72 giờ', 'Không hương liệu, dịu nhẹ'],
    priceTag: '450.000đ / chai 50ml'
  },
  {
    id: 'prod_smartwatch',
    name: 'Đồng Hồ Thể Thao ChronoFit Titanium Ultra',
    category: 'Thiết Bị Đeo Thông Minh',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    features: ['Khung viền Titanium siêu bền nhẹ', 'Đo điện tâm đồ ECG & SpO2', 'Pin bền 14 ngày liên tục', 'Chống nước 5ATM chuẩn bơi lội'],
    priceTag: '5.200.000đ'
  },
  {
    id: 'prod_headphones',
    name: 'Tai Nghe Chống Ồn Chủ Động SoundPro X',
    category: 'Âm Thanh Cao Cấp',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    features: ['Chống ồn ANC thông minh -40dB', 'Âm thanh không gian Spatial Audio', 'Micro lọc ồn AI đàm thoại trong trẻo', 'Thời lượng pin 40 giờ nghe nhạc'],
    priceTag: '3.690.000đ'
  }
];

export const AUDIO_LIBRARY = [
  { id: 'bgm_1', name: 'Upbeat Summer Pop', genre: 'Pop & Trendy', duration: 30, mood: 'Vui tươi, năng lượng' },
  { id: 'bgm_2', name: 'Cinematic Luxury Strings', genre: 'Cinematic', duration: 45, mood: 'Sang trọng, kịch tính' },
  { id: 'bgm_3', name: 'Chill Coffee Lo-Fi', genre: 'Lo-Fi Beat', duration: 60, mood: 'Thư giãn, nhẹ nhàng' },
  { id: 'bgm_4', name: 'Cyberpunk Drive Synth', genre: 'Electronic', duration: 25, mood: 'Công nghệ, hiện đại' },
  { id: 'bgm_5', name: 'TikTok Phonk High Bass', genre: 'Viral Short', duration: 20, mood: 'Bắt trend, giật bass' },
];

export const SFX_LIBRARY = [
  { id: 'sfx_whoosh', name: 'Fast Whoosh Transition', category: 'Transition' },
  { id: 'sfx_ding', name: 'Cash Register Ding / Bell', category: 'Notice' },
  { id: 'sfx_camera', name: 'DSLR Shutter Click', category: 'Action' },
  { id: 'sfx_pop', name: 'Bubble Pop', category: 'UI' },
  { id: 'sfx_glitch', name: 'Digital Glitch Hit', category: 'Effect' },
  { id: 'sfx_sub', name: 'Sub-bass Impact Boom', category: 'Cinematic' },
];

export const PRESET_PROMPTS = [
  {
    label: '✂️ Cắt Im Lặng & Làm Màu Cinematic',
    prompt: 'Cắt bỏ toàn bộ những khoảng ngưng/im lặng hơn 0.5s, áp bộ lọc Cinematic Teal & Orange, tăng độ tương phản nhẹ và đồng bộ phụ đề chữ vàng viền đen kiểu CapCut.'
  },
  {
    label: '📱 Chuyển Dọc 9:16 TikTok Bắt Trend 15s',
    prompt: 'Chuyển toàn bộ khung hình sang tỷ lệ 9:16 cho TikTok/Reels, rút gọn thành video 15 giây giữ những câu nói đắt giá nhất, chèn nhạc nền sôi động và tạo hiệu ứng zoom cận cảnh sản phẩm.'
  },
  {
    label: '🎙️ Tách Giọng Nói Riêng & Khử Ồn AI',
    prompt: 'Tự động trích xuất file video và file voice riêng biệt, áp dụng lọc tạp âm phòng Studio Mic cho giọng nói, giảm âm lượng nhạc nền tự động (audio ducking) mỗi khi KOL lên tiếng.'
  },
  {
    label: '✨ Phụ Đề Karaoke & Highlight Từ Khóa',
    prompt: 'Tạo phụ đề tự động theo từng từ dạng Karaoke nảy chữ, tô màu vàng cho các từ khóa quan trọng về giá và tính năng, chèn sticker Giảm 40% ở góc phải màn hình.'
  },
  {
    label: '⚡ Video Bán Hàng Flash Sale Kịch Tính',
    prompt: 'Thêm âm thanh Whoosh chuyển cảnh nhanh, chèn hiệu ứng Flash nhẹ mỗi khi đổi cảnh, đẩy tốc độ video lên 1.1x để tạo cảm giác gấp gáp chốt đơn, gắn CTA Mua Ngay cuối video.'
  }
];

export function createInitialProject(sample: SampleProject = SAMPLE_PROJECTS[0]): ProjectEditModel {
  const duration = sample.duration;
  const waveformA1 = generateWaveform(80, 101);
  const waveformA2 = generateWaveform(80, 202);

  return {
    projectId: `proj_${Date.now()}`,
    title: sample.name,
    createdAt: new Date().toISOString(),
    duration: duration,
    settings: {
      width: 1080,
      height: 1920,
      fps: 30,
      aspectRatio: '9:16'
    },
    source: {
      originalVideoUrl: sample.videoUrl,
      originalAudioUrl: sample.videoUrl,
      videoSeparatedUrl: sample.videoUrl, // isolated video stream
      audioVoiceSeparatedUrl: 'simulated://audio/voice_stem.wav', // isolated voice stream
      title: sample.name,
      duration: duration
    },
    tracks: [
      {
        id: 'track_v2_overlay',
        name: 'V2 · Overlay & B-Roll',
        type: 'overlay',
        isMuted: false,
        isLocked: false,
        isVisible: true,
        clips: [
          {
            id: 'clip_overlay_1',
            type: 'overlay',
            category: 'sticker',
            name: '🏷️ Ưu đãi Giảm 40%',
            title: 'SIÊU SALE 40%',
            subtitle: 'Chỉ hôm nay',
            timelineStart: 1.0,
            duration: 4.5,
            sourceStart: 0,
            color: '#ef4444',
            position: { x: 70, y: 15 },
            scale: 1.0
          },
          {
            id: 'clip_overlay_2',
            type: 'overlay',
            category: 'cta',
            name: '👉 Nút Kêu Gọi CTA',
            title: 'MUA NGAY TRÊN GIỎ HÀNG',
            subtitle: 'Miễn phí vận chuyển toàn quốc',
            timelineStart: 13.5,
            duration: 4.5,
            sourceStart: 0,
            color: '#f59e0b',
            position: { x: 50, y: 82 },
            scale: 1.1
          }
        ]
      },
      {
        id: 'track_v1_main',
        name: 'V1 · Video Gốc (Hình Ảnh)',
        type: 'video',
        isMuted: false,
        isLocked: false,
        isVisible: true,
        clips: [
          {
            id: 'clip_v1_main',
            type: 'video',
            name: 'Footage_Gốc_FullHD.mp4',
            sourceUrl: sample.videoUrl,
            thumbnailUrl: sample.posterUrl,
            timelineStart: 0,
            duration: duration,
            sourceStart: 0,
            speed: 1.0,
            color: '#3b82f6',
            transform: {
              scale: 1.0,
              positionX: 0,
              positionY: 0,
              rotation: 0,
              opacity: 1.0
            },
            colorAdjustments: {
              brightness: 0,
              contrast: 5,
              saturation: 10,
              temperature: 0,
              vignette: 15,
              filter: 'teal_orange'
            }
          }
        ]
      },
      {
        id: 'track_t1_subtitles',
        name: 'T1 · Phụ Đề Tự Động (Captions)',
        type: 'subtitle',
        isMuted: false,
        isLocked: false,
        isVisible: true,
        clips: sample.transcript.map((item, idx) => ({
          id: `sub_${idx + 1}`,
          type: 'subtitle',
          name: `Subtitle #${idx + 1}`,
          text: item.text,
          timelineStart: item.start,
          duration: parseFloat((item.end - item.start).toFixed(2)),
          sourceStart: 0,
          color: '#10b981',
          style: {
            fontFamily: 'Inter, sans-serif',
            fontSize: 22,
            fontColor: '#ffffff',
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            outlineColor: '#000000',
            hasBackground: true,
            animation: 'karaoke_bounce'
          },
          words: item.text.split(' ').map((w, wIdx, arr) => ({
            word: w,
            start: item.start + (wIdx / arr.length) * (item.end - item.start),
            end: item.start + ((wIdx + 1) / arr.length) * (item.end - item.start),
            highlight: w.toLowerCase().includes('ai') || w.toLowerCase().includes('4d') || w.includes('40%') || w.includes('massage')
          }))
        }))
      },
      {
        id: 'track_a1_voice',
        name: 'A1 · Giọng Nói Đã Trích Xuất (Voice Stem)',
        type: 'audio',
        subtype: 'voice',
        isMuted: false,
        isLocked: false,
        isVisible: true,
        clips: [
          {
            id: 'clip_a1_voice',
            type: 'audio',
            category: 'voice',
            name: 'Voice_Isolated_Stem.wav',
            sourceUrl: 'simulated://voice.wav',
            timelineStart: 0,
            duration: duration,
            sourceStart: 0,
            color: '#8b5cf6',
            audioSettings: {
              volume: 120,
              fadeIn: 0.2,
              fadeOut: 0.3,
              voiceFilter: 'studio_mic',
              noiseReduction: true,
              isMuted: false
            },
            waveformData: waveformA1
          }
        ]
      },
      {
        id: 'track_a2_bgm',
        name: 'A2 · Nhạc Nền (BGM Ducking)',
        type: 'audio',
        subtype: 'music',
        isMuted: false,
        isLocked: false,
        isVisible: true,
        clips: [
          {
            id: 'clip_a2_music',
            type: 'audio',
            category: 'music',
            name: 'Upbeat_Vibe_RoyaltyFree.mp3',
            sourceUrl: 'simulated://bgm.mp3',
            timelineStart: 0,
            duration: duration,
            sourceStart: 0,
            color: '#ec4899',
            audioSettings: {
              volume: 35, // lower for auto ducking under voice
              fadeIn: 1.0,
              fadeOut: 2.0,
              voiceFilter: 'none',
              noiseReduction: false,
              isMuted: false
            },
            waveformData: waveformA2
          }
        ]
      },
      {
        id: 'track_a3_sfx',
        name: 'A3 · Hiệu Ứng Âm Thanh (SFX)',
        type: 'audio',
        subtype: 'sfx',
        isMuted: false,
        isLocked: false,
        isVisible: true,
        clips: [
          {
            id: 'clip_sfx_whoosh_1',
            type: 'audio',
            category: 'sfx',
            name: 'Whoosh_Transition.wav',
            sourceUrl: 'simulated://whoosh.wav',
            timelineStart: 0.1,
            duration: 0.8,
            sourceStart: 0,
            color: '#f97316',
            audioSettings: {
              volume: 80,
              fadeIn: 0,
              fadeOut: 0.2,
              voiceFilter: 'none',
              noiseReduction: false,
              isMuted: false
            },
            waveformData: generateWaveform(20, 99)
          },
          {
            id: 'clip_sfx_ding_2',
            type: 'audio',
            category: 'sfx',
            name: 'Success_Chime_Ding.wav',
            sourceUrl: 'simulated://ding.wav',
            timelineStart: 13.5,
            duration: 1.2,
            sourceStart: 0,
            color: '#f97316',
            audioSettings: {
              volume: 90,
              fadeIn: 0,
              fadeOut: 0.5,
              voiceFilter: 'none',
              noiseReduction: false,
              isMuted: false
            },
            waveformData: generateWaveform(25, 77)
          }
        ]
      }
    ]
  };
}
