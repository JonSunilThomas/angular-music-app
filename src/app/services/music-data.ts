import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Song, Playlist } from '../models/music';

@Injectable({ providedIn: 'root' })
export class MusicDataService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000';

  getSongs(): Observable<Song[]> {
    return this.http.get<Song[]>(`${this.apiUrl}/songs`);
  }

  // --- ADD THESE METHODS ---
  getPlaylists(): Observable<Playlist[]> {
    return this.http.get<Playlist[]>(`${this.apiUrl}/playlists`);
  }

  createPlaylist(playlist: Playlist): Observable<Playlist> {
    return this.http.post<Playlist>(`${this.apiUrl}/playlists`, playlist);
  }

  // Add this inside the MusicDataService class
  updatePlaylist(playlist: Playlist): Observable<Playlist> {
    return this.http.put<Playlist>(`${this.apiUrl}/playlists/${playlist.id}`, playlist);
  }

  getPlaylistById(id: number): Observable<Playlist> {
  return this.http.get<Playlist>(`${this.apiUrl}/playlists/${id}`);
  }

  // Add this method inside MusicDataService
  updateSong(song: Song): Observable<Song> {
    return this.http.put<Song>(`${this.apiUrl}/songs/${song.id}`, song);
  }
}