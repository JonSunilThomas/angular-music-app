import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { tap, shareReplay, catchError, map, switchMap } from 'rxjs/operators';
import { Song, Playlist, Artist, Album, RecentlyPlayed } from '../models/music';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MusicDataService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // Cache subjects
  private songsCache$: Observable<Song[]> | null = null;
  private artistsCache$: Observable<Artist[]> | null = null;
  private albumsCache$: Observable<Album[]> | null = null;
  private playlistsCache$: Observable<Playlist[]> | null = null;

  // Loading & Error streams
  private loadingSubject = new BehaviorSubject<boolean>(false);
  readonly loading$ = this.loadingSubject.asObservable();

  private errorSubject = new BehaviorSubject<string | null>(null);
  readonly error$ = this.errorSubject.asObservable();

  // ─── Songs ───
  getSongs(): Observable<Song[]> {
    if (!this.songsCache$) {
      this.loadingSubject.next(true);
      this.songsCache$ = this.http.get<Song[]>(`${this.apiUrl}/songs`).pipe(
        tap(() => this.loadingSubject.next(false)),
        catchError(err => this.handleError<Song[]>('Failed to load songs', err, [])),
        shareReplay(1)
      );
    }
    return this.songsCache$;
  }

  getSongById(id: number): Observable<Song> {
    // Use cached songs list instead of individual HTTP call
    return this.getSongs().pipe(
      map(songs => songs.find(s => s.id === id)!),
      catchError(err => this.handleError<Song>('Failed to load song', err))
    );
  }

  updateSong(song: Song): Observable<Song> {
    this.songsCache$ = null; // Invalidate cache
    return this.http.put<Song>(`${this.apiUrl}/songs/${song.id}`, song).pipe(
      catchError(err => this.handleError<Song>('Failed to update song', err))
    );
  }

  // ─── Playlists ───
  getPlaylists(): Observable<Playlist[]> {
    if (!this.playlistsCache$) {
      this.playlistsCache$ = this.http.get<Playlist[]>(`${this.apiUrl}/playlists`).pipe(
        catchError(err => this.handleError<Playlist[]>('Failed to load playlists', err, [])),
        shareReplay(1)
      );
    }
    return this.playlistsCache$;
  }

  getPlaylistById(id: number): Observable<Playlist> {
    return this.getPlaylists().pipe(
      map(playlists => playlists.find(p => p.id === id)!),
      catchError(err => this.handleError<Playlist>('Failed to load playlist', err))
    );
  }

  createPlaylist(playlist: Partial<Playlist>): Observable<Playlist> {
    this.playlistsCache$ = null;
    return this.http.post<Playlist>(`${this.apiUrl}/playlists`, playlist).pipe(
      catchError(err => this.handleError<Playlist>('Failed to create playlist', err))
    );
  }

  updatePlaylist(playlist: Playlist): Observable<Playlist> {
    this.playlistsCache$ = null;
    return this.http.put<Playlist>(`${this.apiUrl}/playlists/${playlist.id}`, playlist).pipe(
      catchError(err => this.handleError<Playlist>('Failed to update playlist', err))
    );
  }

  deletePlaylist(id: number): Observable<void> {
    this.playlistsCache$ = null;
    return this.http.delete<void>(`${this.apiUrl}/playlists/${id}`).pipe(
      catchError(err => this.handleError<void>('Failed to delete playlist', err))
    );
  }

  // ─── Artists ───
  getArtists(): Observable<Artist[]> {
    if (!this.artistsCache$) {
      this.artistsCache$ = this.http.get<Artist[]>(`${this.apiUrl}/artists`).pipe(
        catchError(err => this.handleError<Artist[]>('Failed to load artists', err, [])),
        shareReplay(1)
      );
    }
    return this.artistsCache$;
  }

  getArtistById(id: number): Observable<Artist> {
    return this.getArtists().pipe(
      map(artists => artists.find(a => a.id === id)!),
      catchError(err => this.handleError<Artist>('Failed to load artist', err))
    );
  }

  // ─── Albums ───
  getAlbums(): Observable<Album[]> {
    if (!this.albumsCache$) {
      this.albumsCache$ = this.http.get<Album[]>(`${this.apiUrl}/albums`).pipe(
        catchError(err => this.handleError<Album[]>('Failed to load albums', err, [])),
        shareReplay(1)
      );
    }
    return this.albumsCache$;
  }

  getAlbumsByArtist(artistId: number): Observable<Album[]> {
    return this.getAlbums().pipe(
      map(albums => albums.filter(a => a.artistId === artistId)),
      catchError(err => this.handleError<Album[]>('Failed to load albums', err, []))
    );
  }

  // ─── Recently Played ───
  getRecentlyPlayed(): Observable<RecentlyPlayed[]> {
    return this.http.get<RecentlyPlayed[]>(
      `${this.apiUrl}/recentlyPlayed?_sort=playedAt&_order=desc&_limit=20`
    ).pipe(
      catchError(err => this.handleError<RecentlyPlayed[]>('Failed to load recently played', err, []))
    );
  }

  // ─── Helpers ───
  getSongsByIds(ids: number[]): Observable<Song[]> {
    return this.getSongs().pipe(
      map(songs => songs.filter(s => ids.includes(s.id)))
    );
  }

  getArtistSongs(artistId: number): Observable<Song[]> {
    return this.getSongs().pipe(
      map(songs => songs.filter(s => s.artistId === artistId))
    );
  }

  invalidateSongsCache(): void {
    this.songsCache$ = null;
  }

  invalidateArtistsCache(): void {
    this.artistsCache$ = null;
  }

  private handleError<T>(message: string, error: unknown, fallback?: T): Observable<T> {
    this.errorSubject.next(message);
    this.loadingSubject.next(false);
    if (fallback !== undefined) {
      return of(fallback);
    }
    return throwError(() => new Error(message));
  }
}