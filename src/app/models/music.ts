// src/app/models/music.ts

export interface Song {
  id: number;
  title: string;
  artist: string;
  artistId: number;
  album: string;
  albumId: number;
  duration: string;
  durationSeconds: number;
  coverUrl: string;
  audioUrl: string;
  genre: string;
  isFavorite?: boolean;
  playCount?: number;
  lyrics?: string | null;
}

export interface Playlist {
  id: number;
  name: string;
  description?: string;
  coverUrl?: string;
  songs: number[] | Song[];
}

export interface Artist {
  id: number;
  name: string;
  bio: string;
  photoUrl: string;
  genre: string;
  monthlyListeners: number;
  songIds: number[];
  albumIds: number[];
}

export interface Album {
  id: number;
  title: string;
  artistId: number;
  artistName: string;
  coverUrl: string;
  year: number;
  songIds: number[];
}

export interface RecentlyPlayed {
  id?: number;
  songId: number;
  playedAt: string;
}

export type RepeatMode = 'none' | 'one' | 'all';

export interface PlaybackState {
  currentSongId: number | null;
  queue: number[];
  currentIndex: number;
  volume: number;
  shuffle: boolean;
  repeat: RepeatMode;
  currentTime: number;
}