import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { PromptConsole } from './components/PromptConsole';
import { PreviewCanvas } from './components/PreviewCanvas';
import { Timeline } from './components/Timeline';
import { InspectorPanel } from './components/InspectorPanel';
import { MediaLibrary } from './components/MediaLibrary';
import { ImageToVideoStudio } from './components/ImageToVideoStudio';
import { SystemArchitectureModal } from './components/SystemArchitectureModal';
import { ExportModal } from './components/ExportModal';
import { createInitialProject, SAMPLE_PROJECTS, generateWaveform } from './data/mockAssets';
import { 
  ProjectEditModel, 
  TimelineClip, 
  AspectRatio, 
  AgentExecutionLog, 
  AIProductionPlan, 
  SampleProject,
  VideoClip,
  AudioClip,
  SubtitleClip,
  OverlayClip
} from './types/video';
import { audioFx } from './utils/audioWaveform';
import { Sparkles, Sliders, FolderOpen, Film, Video, Layers, Wand2 } from 'lucide-react';

export default function App() {
  // Main Project Edit Model State
  const [project, setProject] = useState<ProjectEditModel>(createInitialProject(SAMPLE_PROJECTS[0]));
  const [history, setHistory] = useState<ProjectEditModel[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Playback & Timeline Scrubber State
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);

  // Studio Mode: 'remix' | 'image_to_video' | 'architecture'
  const [activeMode, setActiveMode] = useState<'remix' | 'image_to_video' | 'architecture'>('remix');

  // Left Panel Sub-tab: 'prompt' | 'media' | 'inspector'
  const [leftTab, setLeftTab] = useState<'prompt' | 'media' | 'inspector'>('prompt');

  // Modals
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState<boolean>(false);

  // AI Prompt State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [agentLogs, setAgentLogs] = useState<AgentExecutionLog[]>([
    {
      id: 'init_log_1',
      agent: 'Coordinator',
      action: 'Khởi tạo Project Edit Model & sẵn sàng nhận prompt',
      details: 'Đã bóc tách độc lập V1 (Video stream) và A1 (Voice stem). Hệ thống sẵn sàng xào nấu theo lệnh.',
      timestamp: 'Sẵn sàng',
      status: 'completed',
      icon: 'Brain'
    }
  ]);
  const [lastPlan, setLastPlan] = useState<AIProductionPlan | null>(null);

  const playbackTimerRef = useRef<number | null>(null);

  // Push state to undo/redo history
  const updateProjectWithHistory = (newProject: ProjectEditModel) => {
    setHistory((prev) => [...prev.slice(0, historyIndex + 1), project]);
    setHistoryIndex((prev) => prev + 1);
    setProject(newProject);
  };

  const handleUndo = () => {
    if (historyIndex >= 0) {
      const prev = history[historyIndex];
      setHistoryIndex((idx) => idx - 1);
      setProject(prev);
      audioFx.playClick();
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex((idx) => idx + 1);
      setProject(next);
      audioFx.playClick();
    }
  };

  // Playback Loop
  useEffect(() => {
    if (isPlaying) {
      const fpsInterval = 1000 / 30; // 30 FPS tick
      playbackTimerRef.current = window.setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= project.duration) {
            setIsPlaying(false);
            return 0;
          }
          return parseFloat((prev + 0.033).toFixed(3));
        });
      }, fpsInterval);
    } else {
      if (playbackTimerRef.current) {
        clearInterval(playbackTimerRef.current);
      }
    }
    return () => {
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
    };
  }, [isPlaying, project.duration]);

  // Handle Play / Pause Toggle
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (time: number) => {
    setCurrentTime(Math.max(0, Math.min(project.duration, time)));
  };

  // Find currently selected clip across all tracks
  const selectedClip = React.useMemo(() => {
    if (!selectedClipId) return null;
    for (const track of project.tracks) {
      const found = track.clips.find((c) => c.id === selectedClipId);
      if (found) return found;
    }
    return null;
  }, [project.tracks, selectedClipId]);

  // When a clip is clicked, automatically switch left tab to 'inspector'
  const handleSelectClip = (clip: TimelineClip | null) => {
    if (clip) {
      setSelectedClipId(clip.id);
      setLeftTab('inspector');
    } else {
      setSelectedClipId(null);
    }
  };

  // Update specific clip
  const handleUpdateClip = (updatedClip: TimelineClip) => {
    const updatedTracks = project.tracks.map((track) => ({
      ...track,
      clips: track.clips.map((clip) => (clip.id === updatedClip.id ? updatedClip : clip)),
    }));
    updateProjectWithHistory({ ...project, tracks: updatedTracks });
  };

  // Update clip position on timeline
  const handleUpdateClipPosition = (clipId: string, newStart: number) => {
    const updatedTracks = project.tracks.map((track) => ({
      ...track,
      clips: track.clips.map((clip) =>
        clip.id === clipId ? { ...clip, timelineStart: newStart } : clip
      ),
    }));
    setProject({ ...project, tracks: updatedTracks });
  };

  // Delete clip
  const handleDeleteSelectedClip = (clipIdToDelete?: string) => {
    const targetId = clipIdToDelete || selectedClipId;
    if (!targetId) return;

    const updatedTracks = project.tracks.map((track) => ({
      ...track,
      clips: track.clips.filter((clip) => clip.id !== targetId),
    }));

    setSelectedClipId(null);
    updateProjectWithHistory({ ...project, tracks: updatedTracks });
    audioFx.playClick();
  };

  // Duplicate clip
  const handleDuplicateSelectedClip = (clipToDup?: TimelineClip) => {
    const target = clipToDup || selectedClip;
    if (!target) return;

    const newClip: TimelineClip = {
      ...target,
      id: `${target.id}_copy_${Date.now()}`,
      name: `${target.name} (Bản sao)`,
      timelineStart: Math.min(project.duration - target.duration, target.timelineStart + target.duration + 0.2),
    };

    const updatedTracks = project.tracks.map((track) => {
      if (track.clips.some((c) => c.id === target.id)) {
        return { ...track, clips: [...track.clips, newClip] };
      }
      return track;
    });

    setSelectedClipId(newClip.id);
    updateProjectWithHistory({ ...project, tracks: updatedTracks });
    audioFx.playDing();
  };

  // Razor / Split Clip at current playhead position
  const handleSplitClipAtPlayhead = () => {
    let splitted = false;
    const updatedTracks = project.tracks.map((track) => {
      const newClips: TimelineClip[] = [];
      for (const clip of track.clips) {
        const clipEnd = clip.timelineStart + clip.duration;
        if (currentTime > clip.timelineStart + 0.2 && currentTime < clipEnd - 0.2) {
          splitted = true;
          const firstPartDuration = parseFloat((currentTime - clip.timelineStart).toFixed(2));
          const secondPartDuration = parseFloat((clipEnd - currentTime).toFixed(2));

          const firstPart: TimelineClip = {
            ...clip,
            id: `${clip.id}_part1`,
            duration: firstPartDuration,
          };

          const secondPart: TimelineClip = {
            ...clip,
            id: `${clip.id}_part2`,
            timelineStart: currentTime,
            duration: secondPartDuration,
            sourceStart: clip.sourceStart + firstPartDuration,
            name: `${clip.name} (Cắt)`,
          };

          newClips.push(firstPart, secondPart);
        } else {
          newClips.push(clip);
        }
      }
      return { ...track, clips: newClips };
    });

    if (splitted) {
      updateProjectWithHistory({ ...project, tracks: updatedTracks });
      audioFx.playClick();
    }
  };

  // Trim Start to playhead
  const handleTrimClipStart = () => {
    if (!selectedClip) return;
    if (currentTime > selectedClip.timelineStart && currentTime < selectedClip.timelineStart + selectedClip.duration) {
      const delta = currentTime - selectedClip.timelineStart;
      const newDuration = selectedClip.duration - delta;
      const updated: TimelineClip = {
        ...selectedClip,
        timelineStart: currentTime,
        duration: parseFloat(newDuration.toFixed(2)),
        sourceStart: selectedClip.sourceStart + delta,
      };
      handleUpdateClip(updated);
      audioFx.playClick();
    }
  };

  // Trim End to playhead
  const handleTrimClipEnd = () => {
    if (!selectedClip) return;
    if (currentTime > selectedClip.timelineStart && currentTime < selectedClip.timelineStart + selectedClip.duration) {
      const newDuration = currentTime - selectedClip.timelineStart;
      const updated: TimelineClip = {
        ...selectedClip,
        duration: parseFloat(newDuration.toFixed(2)),
      };
      handleUpdateClip(updated);
      audioFx.playClick();
    }
  };

  // Track toggles
  const handleToggleTrackMute = (trackId: string) => {
    const updated = project.tracks.map((t) =>
      t.id === trackId ? { ...t, isMuted: !t.isMuted } : t
    );
    setProject({ ...project, tracks: updated });
  };

  const handleToggleTrackVisibility = (trackId: string) => {
    const updated = project.tracks.map((t) =>
      t.id === trackId ? { ...t, isVisible: !t.isVisible } : t
    );
    setProject({ ...project, tracks: updated });
  };

  const handleToggleTrackLock = (trackId: string) => {
    const updated = project.tracks.map((t) =>
      t.id === trackId ? { ...t, isLocked: !t.isLocked } : t
    );
    setProject({ ...project, tracks: updated });
  };

  // Execute AI Prompt Remix ("Xào nấu video")
  const handleExecutePrompt = async (promptText: string) => {
    setIsLoading(true);
    audioFx.playClick();

    try {
      const res = await fetch('/api/ai/remix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          currentTracks: project.tracks,
          projectTitle: project.title,
          currentDuration: project.duration,
          currentAspectRatio: project.settings.aspectRatio,
        }),
      });

      const data = await res.json();
      if (data.plan) {
        setLastPlan(data.plan);
      }
      if (data.agentLogs) {
        setAgentLogs(data.agentLogs);
      }

      // Apply modifications to active clips
      const newAspectRatio = data.plan?.aspectRatio || project.settings.aspectRatio;
      const newColorFilter = data.plan?.colorGrade || 'teal_orange';
      const targetDuration = data.plan?.targetDuration || project.duration;

      const updatedTracks = project.tracks.map((track) => {
        if (track.type === 'video') {
          return {
            ...track,
            clips: track.clips.map((clip) => ({
              ...clip,
              duration: Math.min(clip.duration, targetDuration),
              colorAdjustments: {
                ...(clip as VideoClip).colorAdjustments,
                filter: newColorFilter,
                contrast: (clip as VideoClip).colorAdjustments.contrast + 4,
              },
            })),
          };
        }
        if (track.type === 'audio' && track.subtype === 'music') {
          return {
            ...track,
            clips: track.clips.map((clip) => ({
              ...clip,
              duration: Math.min(clip.duration, targetDuration),
              audioSettings: {
                ...(clip as AudioClip).audioSettings,
                volume: data.updatedSettings?.duckingVolume || 30, // Ducking music
              },
            })),
          };
        }
        return track;
      });

      const updatedProject: ProjectEditModel = {
        ...project,
        duration: targetDuration,
        settings: {
          ...project.settings,
          aspectRatio: newAspectRatio,
        },
        tracks: updatedTracks,
      };

      updateProjectWithHistory(updatedProject);
      audioFx.playDing();
    } catch (err) {
      console.error('Failed to execute AI Remix prompt:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Add Audio Track from Library
  const handleAddAudioTrack = (name: string, category: 'music' | 'sfx', clipDuration: number) => {
    audioFx.playClick();
    const targetSubtype = category;
    const targetTrack = project.tracks.find((t) => t.type === 'audio' && t.subtype === targetSubtype);

    const newClip: AudioClip = {
      id: `audio_clip_${Date.now()}`,
      type: 'audio',
      category,
      name,
      sourceUrl: 'simulated://audio.mp3',
      timelineStart: currentTime,
      duration: Math.min(clipDuration, project.duration - currentTime),
      sourceStart: 0,
      color: category === 'music' ? '#ec4899' : '#f97316',
      audioSettings: {
        volume: category === 'music' ? 40 : 85,
        fadeIn: 0.2,
        fadeOut: 0.5,
        voiceFilter: 'none',
        noiseReduction: false,
        isMuted: false,
      },
      waveformData: generateWaveform(30, 42),
    };

    if (targetTrack) {
      const updatedTracks = project.tracks.map((t) =>
        t.id === targetTrack.id ? { ...t, clips: [...t.clips, newClip] } : t
      );
      updateProjectWithHistory({ ...project, tracks: updatedTracks });
    }
  };

  // Add Overlay Clip from Library
  const handleAddOverlayClip = (title: string, category: 'sticker' | 'cta' | 'b_roll') => {
    audioFx.playClick();
    const overlayTrack = project.tracks.find((t) => t.type === 'overlay');
    const newOverlay: OverlayClip = {
      id: `overlay_${Date.now()}`,
      type: 'overlay',
      category,
      name: title,
      title,
      timelineStart: currentTime,
      duration: 4.0,
      sourceStart: 0,
      color: category === 'cta' ? '#ef4444' : '#f59e0b',
      position: { x: 50, y: 75 },
      scale: 1.0,
    };

    if (overlayTrack) {
      const updatedTracks = project.tracks.map((t) =>
        t.id === overlayTrack.id ? { ...t, clips: [...t.clips, newOverlay] } : t
      );
      updateProjectWithHistory({ ...project, tracks: updatedTracks });
    }
  };

  // Load sample project
  const handleSelectSampleProject = (sample: SampleProject) => {
    audioFx.playClick();
    const newProj = createInitialProject(sample);
    updateProjectWithHistory(newProj);
    setCurrentTime(0);
    setSelectedClipId(null);
  };

  // Load generated ad from Image-to-Video mode into timeline
  const handleLoadGeneratedAdToTimeline = (adProject: ProjectEditModel) => {
    updateProjectWithHistory(adProject);
    setActiveMode('remix');
    setCurrentTime(0);
    setSelectedClipId(null);
    setLeftTab('prompt');
  };

  // Subtitles list for export
  const allSubtitles = React.useMemo(() => {
    const subTrack = project.tracks.find((t) => t.type === 'subtitle');
    return (subTrack?.clips || []).map((c) => ({
      text: (c as SubtitleClip).text,
      timelineStart: c.timelineStart,
      duration: c.duration,
    }));
  }, [project.tracks]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-neutral-950 font-sans text-neutral-100 select-none">
      {/* 1. Global Header Bar */}
      <Header
        projectTitle={project.title}
        onUpdateTitle={(title) => setProject({ ...project, title })}
        activeMode={activeMode}
        onChangeMode={(mode) => {
          if (mode === 'architecture') {
            setIsArchitectureModalOpen(true);
          } else {
            setActiveMode(mode);
          }
        }}
        aspectRatio={project.settings.aspectRatio}
        onChangeAspectRatio={(ratio) =>
          setProject({
            ...project,
            settings: { ...project.settings, aspectRatio: ratio },
          })
        }
        canUndo={historyIndex >= 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onOpenExport={() => setIsExportOpen(true)}
      />

      {/* 2. Main Content View Area */}
      {activeMode === 'image_to_video' ? (
        <div className="flex-1 overflow-hidden">
          <ImageToVideoStudio onLoadGeneratedAdToTimeline={handleLoadGeneratedAdToTimeline} />
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Half: 3-Column Studio (Left Tools, Center Monitor, Right Inspector) */}
          <div className="flex-1 flex overflow-hidden border-b border-neutral-800">
            {/* Left Column: AI Prompt Console & Media Separation Library */}
            <div className="w-[380px] flex-shrink-0 flex flex-col bg-neutral-950 border-r border-neutral-800">
              {/* Left Sub-tabs */}
              <div className="h-10 border-b border-neutral-800 bg-neutral-900/80 px-2 flex items-center gap-1">
                <button
                  onClick={() => setLeftTab('prompt')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                    leftTab === 'prompt'
                      ? 'bg-neutral-800 text-sky-400 border border-neutral-700/60 shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Xào Nấu AI</span>
                </button>

                <button
                  onClick={() => setLeftTab('media')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                    leftTab === 'media'
                      ? 'bg-neutral-800 text-sky-400 border border-neutral-700/60 shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span>Media &amp; Tách File</span>
                </button>

                <button
                  onClick={() => setLeftTab('inspector')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                    leftTab === 'inspector'
                      ? 'bg-neutral-800 text-sky-400 border border-neutral-700/60 shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Chỉnh Thủ Công</span>
                </button>
              </div>

              {/* Sub-tab view */}
              <div className="flex-1 overflow-hidden">
                {leftTab === 'prompt' && (
                  <PromptConsole
                    onExecutePrompt={handleExecutePrompt}
                    isLoading={isLoading}
                    agentLogs={agentLogs}
                    lastPlan={lastPlan}
                  />
                )}

                {leftTab === 'media' && (
                  <MediaLibrary
                    currentProjectTitle={project.title}
                    onSelectSampleProject={handleSelectSampleProject}
                    onAddAudioTrack={handleAddAudioTrack}
                    onAddOverlayClip={handleAddOverlayClip}
                    subtitles={allSubtitles}
                  />
                )}

                {leftTab === 'inspector' && (
                  <InspectorPanel
                    selectedClip={selectedClip}
                    onUpdateClip={handleUpdateClip}
                    onDeleteClip={handleDeleteSelectedClip}
                    onDuplicateClip={handleDuplicateSelectedClip}
                    aspectRatio={project.settings.aspectRatio}
                    onChangeAspectRatio={(ratio) =>
                      setProject({
                        ...project,
                        settings: { ...project.settings, aspectRatio: ratio },
                      })
                    }
                    totalDuration={project.duration}
                  />
                )}
              </div>
            </div>

            {/* Center Column: Live Preview Canvas Player */}
            <div className="flex-1 flex flex-col bg-neutral-950 overflow-hidden">
              <PreviewCanvas
                tracks={project.tracks}
                currentTime={currentTime}
                duration={project.duration}
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
                onSeek={handleSeek}
                aspectRatio={project.settings.aspectRatio}
              />
            </div>
          </div>

          {/* Bottom Half: Full-Featured Multi-Track CapCut / Premiere Timeline */}
          <div className="h-[280px] flex-shrink-0">
            <Timeline
              tracks={project.tracks}
              currentTime={currentTime}
              duration={project.duration}
              onSeek={handleSeek}
              selectedClipId={selectedClipId}
              onSelectClip={handleSelectClip}
              onSplitClipAtPlayhead={handleSplitClipAtPlayhead}
              onTrimClipStart={handleTrimClipStart}
              onTrimClipEnd={handleTrimClipEnd}
              onDeleteSelectedClip={handleDeleteSelectedClip}
              onDuplicateSelectedClip={handleDuplicateSelectedClip}
              onToggleTrackMute={handleToggleTrackMute}
              onToggleTrackVisibility={handleToggleTrackVisibility}
              onToggleTrackLock={handleToggleTrackLock}
              onUpdateClipPosition={handleUpdateClipPosition}
            />
          </div>
        </div>
      )}

      {/* 3. Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        project={project}
      />

      {/* 4. Architecture & 4-Agent Pipeline Modal */}
      <SystemArchitectureModal
        isOpen={isArchitectureModalOpen}
        onClose={() => setIsArchitectureModalOpen(false)}
        currentProject={project}
      />
    </div>
  );
}
