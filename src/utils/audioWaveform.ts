/**
 * Audio synthesis, waveform tools, and file exporter utilities
 */

// Generate a valid WAV Blob from simulated PCM data for real file downloads
export function createWavBlob(durationSeconds: number = 5, sampleRate: number = 22050): Blob {
  const numChannels = 1;
  const numSamples = Math.floor(durationSeconds * sampleRate);
  const blockAlign = numChannels * 2;
  const byteRate = sampleRate * blockAlign;
  const dataSize = numSamples * 2;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  // RIFF identifier
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, 'WAVE');

  // fmt chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true); // AudioFormat (1 for PCM)
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true); // BitsPerSample

  // data chunk
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  // Write synthetic speech/harmonic waveform
  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    // Harmonic vocal timbre simulation
    const freq = 180 + Math.sin(t * 3) * 30;
    const sample = 
      Math.sin(2 * Math.PI * freq * t) * 0.4 +
      Math.sin(2 * Math.PI * (freq * 2) * t) * 0.2 +
      Math.sin(2 * Math.PI * (freq * 3) * t) * 0.1;
    
    // Envelope (fade in/out)
    const envelope = Math.min(1, t * 4) * Math.min(1, (durationSeconds - t) * 4);
    const intSample = Math.max(-1, Math.min(1, sample * envelope)) * 32767;
    view.setInt16(offset, intSample, true);
    offset += 2;
  }

  return new Blob([buffer], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

// Convert timestamp (in seconds) to SRT timecode: 00:00:01,234
export function formatSrtTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
}

// Generate downloadable .SRT file content from SubtitleClips
export function generateSrtContent(subtitles: Array<{ text: string; timelineStart: number; duration: number }>): string {
  return subtitles
    .sort((a, b) => a.timelineStart - b.timelineStart)
    .map((sub, index) => {
      const startTime = formatSrtTime(sub.timelineStart);
      const endTime = formatSrtTime(sub.timelineStart + sub.duration);
      return `${index + 1}\n${startTime} --> ${endTime}\n${sub.text}\n`;
    })
    .join('\n');
}

// Simple Web Audio Sound Synthesizer for timeline playback feedback
class AudioManager {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  playWhoosh() {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(3200, ctx.currentTime + 0.15);
      filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.35);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.15);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.1);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.36);
    } catch {}
  }

  playDing() {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1318.51, ctx.currentTime); // E6 note
      osc.frequency.exponentialRampToValueAtTime(2637.02, ctx.currentTime + 0.05); // E7 harmonic

      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.82);
    } catch {}
  }

  playClick() {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {}
  }
}

export const audioFx = new AudioManager();
