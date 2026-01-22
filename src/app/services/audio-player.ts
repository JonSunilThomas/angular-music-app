import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Song } from '../models/music';

@Injectable({ providedIn: 'root' })
export class AudioPlayerService {
  private audio = new Audio();
  private queue: Song[] = []; // The list of songs to play
  private currentIndex = -1;

  private currentSongSubject = new BehaviorSubject<Song | null>(null);
  currentSong$ = this.currentSongSubject.asObservable();

  private isPlayingSubject = new BehaviorSubject<boolean>(false);
  isPlaying$ = this.isPlayingSubject.asObservable();

  constructor() {
    // Auto-play next song when one finishes
    this.audio.addEventListener('ended', () => this.next());
  }

  // 1. Set the playlist context (called when you click a song in a list)
  playStream(songs: Song[], index: number) {
    this.queue = songs;
    this.currentIndex = index;
    this.playInternal(this.queue[this.currentIndex]);
  }

  // 2. Internal play logic
  private playInternal(song: Song) {
    this.currentSongSubject.next(song);
    this.audio.src = song.audioUrl;
    this.audio.load();
    this.audio.play();
    this.isPlayingSubject.next(true);
  }

  togglePlay() {
    if (this.audio.paused) {
      this.audio.play();
      this.isPlayingSubject.next(true);
    } else {
      this.audio.pause();
      this.isPlayingSubject.next(false);
    }
  }

  // 3. Next / Previous Logic
  next() {
    if (this.currentIndex < this.queue.length - 1) {
      this.currentIndex++;
      this.playInternal(this.queue[this.currentIndex]);
    }
  }

  prev() {
    if (this.audio.currentTime > 5) {
      this.audio.currentTime = 0; // Restart song if played > 5s
    } else if (this.currentIndex > 0) {
      this.currentIndex--;
      this.playInternal(this.queue[this.currentIndex]);
    }
  }
  
  // 4. Volume Logic (For Feature 3)
  setVolume(vol: number) {
    this.audio.volume = vol;
  }
}