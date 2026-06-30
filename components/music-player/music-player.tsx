'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Music,
  ListMusic,
} from 'lucide-react';
import { useLocalStorage } from '@/hooks/index';
import type { MusicTrack } from '@/types';

export default function MusicPlayer() {
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMini, setIsMini] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [ready, setReady] = useState(false);
  const [storedVolume] = useLocalStorage('music-volume', 0.3);
  const [storedTrack] = useLocalStorage('music-track', 0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load tracks and restore state
  useEffect(() => {
    fetch('/api/music')
      .then((r) => r.json())
      .then((data: MusicTrack[]) => {
        setTracks(data);
        setCurrentIdx(storedTrack);
        setVolume(storedVolume);
        setReady(true);
      })
      .catch(console.error);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const currentTrack = tracks[currentIdx];

  // When tracks or currentIdx changes, set audio source
  useEffect(() => {
    if (!audioRef.current || !currentTrack || !ready) return;
    const audio = audioRef.current;
    if (audio.src !== currentTrack.src) {
      audio.src = currentTrack.src;
      audio.load();
    }
  }, [currentTrack, ready]);

  const playTrack = useCallback(
    (idx: number) => {
      if (!audioRef.current || !tracks[idx]) return;
      const audio = audioRef.current;
      audio.src = tracks[idx].src;
      audio.load();
      audio.play()
        .then(() => {
          setCurrentIdx(idx);
          setIsPlaying(true);
          localStorage.setItem('music-track', JSON.stringify(idx));
        })
        .catch(() => {
          // Autoplay may be blocked by browser
          setIsPlaying(false);
        });
    },
    [tracks]
  );

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !ready) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      if (!audio.src || audio.src === '' || audio.ended) {
        // First play or ended - set source
        if (currentTrack) {
          audio.src = currentTrack.src;
          audio.load();
        } else if (tracks.length > 0) {
          audio.src = tracks[0].src;
          audio.load();
          setCurrentIdx(0);
        }
      }
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const skipNext = () => {
    if (tracks.length === 0) return;
    const next = (currentIdx + 1) % tracks.length;
    playTrack(next);
  };

  const skipPrev = () => {
    if (tracks.length === 0) return;
    const prev = (currentIdx - 1 + tracks.length) % tracks.length;
    playTrack(prev);
  };

  const toggleVolume = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
    setIsMuted(val === 0);
    localStorage.setItem('music-volume', JSON.stringify(val));
  };

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    const next = (currentIdx + 1) % tracks.length;
    if (next !== currentIdx) {
      playTrack(next);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      <AnimatePresence>
        {isMini && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsMini(false)}
            className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <Music className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isMini && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="glass-strong fixed bottom-6 right-6 z-50 w-80 overflow-hidden rounded-2xl shadow-2xl"
          >
            <button
              onClick={() => setIsMini(true)}
              className="absolute top-3 right-3 z-10 text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M11 3L3 11M3 3l8 8" />
              </svg>
            </button>

            <div className="p-5 pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5">
                  <Music className="h-5 w-5 text-primary/60" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {currentTrack?.title || '暂无音乐'}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {currentTrack?.artist || '-'}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-5">
              <div className="relative h-1 overflow-hidden rounded-full bg-border/30">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-primary/60 to-primary"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                <span>{fmt(currentTime)}</span>
                <span>{fmt(duration)}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 p-4">
              <button
                onClick={skipPrev}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <SkipBack className="h-4 w-4" />
              </button>
              <button
                onClick={togglePlay}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background transition-all hover:scale-105"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4 ml-0.5" />
                )}
              </button>
              <button
                onClick={skipNext}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <SkipForward className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 border-t border-border/10 px-5 py-3">
              <button
                onClick={toggleVolume}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-3.5 w-3.5" />
                ) : (
                  <Volume2 className="h-3.5 w-3.5" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="h-1 w-full cursor-pointer appearance-none rounded-full bg-border/30 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
              />
            </div>

            {tracks.length > 1 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex w-full items-center justify-center gap-1 border-t border-border/10 py-2 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
              >
                <ListMusic className="h-3 w-3" />
                {isExpanded ? '收起列表' : `播放列表 (${tracks.length})`}
              </button>
            )}

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden border-t border-border/10"
                >
                  <div className="max-h-40 space-y-0.5 overflow-y-auto p-2">
                    {tracks.map((track, idx) => (
                      <button
                        key={track.id}
                        onClick={() => playTrack(idx)}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                          idx === currentIdx
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                        }`}
                      >
                        <span className="w-4 text-center text-[10px] text-muted-foreground/50">
                          {idx + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium">{track.title}</p>
                          <p className="truncate text-[10px] opacity-60">
                            {track.artist}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
