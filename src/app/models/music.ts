// src/app/models/music.ts

export interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: string;
  coverUrl: string;
  audioUrl: string;
  genre: string;
}

export interface Playlist {
  id: number;
  name: string;
  description?: string;
  songs: Song[];
}

export interface Artist {
  id: number;
  name: string;
  bio: string;
  photoUrl: string;
  topSongs: number[];
}

export interface Song {
  // ... existing properties
  isFavorite?: boolean; // Optional property
}