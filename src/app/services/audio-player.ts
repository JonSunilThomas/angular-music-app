import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, interval, animationFrameScheduler } from 'rxjs';
import { map, distinctUntilChanged, filter } from 'rxjs/operators';
import { Song, RepeatMode, PlaybackState } from '../models/music';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AudioPlayerService {
  private http = inject(HttpClient);
  private audio = new Audio();
  private queue: Song[] = [];
  private originalQueue: Song[] = [];
  private currentIndex = -1;

  // Core observables
  private currentSongSubject = new BehaviorSubject<Song | null>(null);
  currentSong$ = this.currentSongSubject.asObservable();

  private isPlayingSubject = new BehaviorSubject<boolean>(false);
  isPlaying$ = this.isPlayingSubject.asObservable();

  // Playback progress
  private currentTimeSubject = new BehaviorSubject<number>(0);
  currentTime$ = this.currentTimeSubject.asObservable();

  private durationSubject = new BehaviorSubject<number>(0);
  duration$ = this.durationSubject.asObservable();

  // Progress percentage (0-100)
  progress$ = this.currentTime$.pipe(
    map(time => {
      const dur = this.audio.duration;
      return dur > 0 ? (time / dur) * 100 : 0;
    }),
    distinctUntilChanged()
  );

  // Shuffle & Repeat
  private shuffleSubject = new BehaviorSubject<boolean>(false);
  shuffle$ = this.shuffleSubject.asObservable();

  private repeatSubject = new BehaviorSubject<RepeatMode>('none');
  repeat$ = this.repeatSubject.asObservable();

  // Volume
  private volumeSubject = new BehaviorSubject<number>(0.5);
  volume$ = this.volumeSubject.asObservable();

  // Recently played
  private recentlyPlayedSubject = new BehaviorSubject<Song[]>([]);
  recentlyPlayed$ = this.recentlyPlayedSubject.asObservable();

  constructor() {
    this.restoreState();

    // Update current time on animation frames
    this.audio.addEventListener('timeupdate', () => {
      this.currentTimeSubject.next(this.audio.currentTime);
    });

    this.audio.addEventListener('loadedmetadata', () => {
      this.durationSubject.next(this.audio.duration);
    });

    // Auto-play next track when one ends
    this.audio.addEventListener('ended', () => this.onTrackEnded());
  }

  private onTrackEnded(): void {
    const repeat = this.repeatSubject.value;

    if (repeat === 'one') {
      this.audio.currentTime = 0;
      this.audio.play();
      return;
    }

    if (this.currentIndex < this.queue.length - 1) {
      this.currentIndex++;
      this.playInternal(this.queue[this.currentIndex]);
    } else if (repeat === 'all') {
      this.currentIndex = 0;
      this.playInternal(this.queue[this.currentIndex]);
    } else {
      this.isPlayingSubject.next(false);
    }
  }

  playStream(songs: Song[], index: number): void {
    this.originalQueue = [...songs];
    if (this.shuffleSubject.value) {
      const picked = songs[index];
      this.queue = this.shuffleArray(songs.filter(s => s.id !== picked.id));
      this.queue.unshift(picked);
      this.currentIndex = 0;
    } else {
      this.queue = [...songs];
      this.currentIndex = index;
    }
    this.playInternal(this.queue[this.currentIndex]);
  }

  private playInternal(song: Song): void {
    this.currentSongSubject.next(song);
    this.audio.preload = 'auto';
    this.audio.src = song.audioUrl;
    this.audio.load();
    this.audio.play().catch(() => {});
    this.isPlayingSubject.next(true);
    this.addToRecentlyPlayed(song);
    this.debouncedIncrementPlayCount(song);
    this.saveState();
  }

  togglePlay(): void {
    if (this.audio.paused) {
      this.audio.play();
      this.isPlayingSubject.next(true);
    } else {
      this.audio.pause();
      this.isPlayingSubject.next(false);
    }
  }

  next(): void {
    if (this.currentIndex < this.queue.length - 1) {
      this.currentIndex++;
      this.playInternal(this.queue[this.currentIndex]);
    } else if (this.repeatSubject.value === 'all') {
      this.currentIndex = 0;
      this.playInternal(this.queue[this.currentIndex]);
    }
  }

  prev(): void {
    if (this.audio.currentTime > 5) {
      this.audio.currentTime = 0;
    } else if (this.currentIndex > 0) {
      this.currentIndex--;
      this.playInternal(this.queue[this.currentIndex]);
    }
  }

  seekTo(seconds: number): void {
    if (this.audio.duration) {
      this.audio.currentTime = Math.min(seconds, this.audio.duration);
      this.currentTimeSubject.next(this.audio.currentTime);
    }
  }

  seekToPercent(percent: number): void {
    if (this.audio.duration) {
      this.audio.currentTime = (percent / 100) * this.audio.duration;
      this.currentTimeSubject.next(this.audio.currentTime);
    }
  }

  setVolume(vol: number): void {
    this.audio.volume = vol;
    this.volumeSubject.next(vol);
    localStorage.setItem('music-app-volume', String(vol));
  }

  toggleShuffle(): void {
    const newShuffle = !this.shuffleSubject.value;
    this.shuffleSubject.next(newShuffle);
    if (newShuffle) {
      const current = this.queue[this.currentIndex];
      const rest = this.queue.filter((_, i) => i !== this.currentIndex);
      this.queue = [current, ...this.shuffleArray(rest)];
      this.currentIndex = 0;
    } else {
      const current = this.queue[this.currentIndex];
      this.queue = [...this.originalQueue];
      this.currentIndex = this.queue.findIndex(s => s.id === current.id);
    }
    this.saveState();
  }

  toggleRepeat(): void {
    const modes: RepeatMode[] = ['none', 'all', 'one'];
    const current = modes.indexOf(this.repeatSubject.value);
    this.repeatSubject.next(modes[(current + 1) % modes.length]);
    this.saveState();
  }

  private shuffleArray<T>(arr: T[]): T[] {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private addToRecentlyPlayed(song: Song): void {
    const recent = this.recentlyPlayedSubject.value.filter(s => s.id !== song.id);
    recent.unshift(song);
    this.recentlyPlayedSubject.next(recent.slice(0, 20));

    // Persist to backend
    this.http.post('http://localhost:3000/recentlyPlayed', {
      songId: song.id,
      playedAt: new Date().toISOString()
    }).subscribe({ error: () => {} });
  }

  private playCountTimer: any = null;
  private debouncedIncrementPlayCount(song: Song): void {
    // Debounce play count updates to avoid rapid-fire HTTP calls when skipping
    if (this.playCountTimer) clearTimeout(this.playCountTimer);
    this.playCountTimer = setTimeout(() => {
      const count = (song.playCount ?? 0) + 1;
      song.playCount = count;
      this.http.patch(`http://localhost:3000/songs/${song.id}`, { playCount: count })
        .subscribe({ error: () => {} });
    }, 3000); // Only persist after 3s of actual listening
  }

  private saveState(): void {
    const state: PlaybackState = {
      currentSongId: this.currentSongSubject.value?.id ?? null,
      queue: this.queue.map(s => s.id),
      currentIndex: this.currentIndex,
      volume: this.audio.volume,
      shuffle: this.shuffleSubject.value,
      repeat: this.repeatSubject.value,
      currentTime: this.audio.currentTime
    };
    localStorage.setItem('music-app-playback', JSON.stringify(state));
  }

  private restoreState(): void {
    const vol = localStorage.getItem('music-app-volume');
    if (vol) {
      this.audio.volume = Number(vol);
      this.volumeSubject.next(Number(vol));
    }

    const saved = localStorage.getItem('music-app-playback');
    if (saved) {
      try {
        const state: PlaybackState = JSON.parse(saved);
        this.shuffleSubject.next(state.shuffle);
        this.repeatSubject.next(state.repeat);
      } catch {}
    }
  }
}