import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { MusicDataService } from '../../../services/music-data';
import { AudioPlayerService } from '../../../services/audio-player';
import { Song, Artist, Album } from '../../../models/music';
import { switchMap, map } from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';
import { HoverGlowDirective } from '../../../directives/hover-glow.directive';
import { HighlightPlayingDirective } from '../../../directives/highlight-playing.directive';
import { AddToPlaylistDialogComponent } from '../../playlists/add-to-playlist-dialog/add-to-playlist.dialog';
import { fadeIn } from '../../../shared/animations/route-transition';

interface SongView {
  song: Song;
  artist: Artist | null;
  album: Album | null;
  relatedSongs: Song[];
}

@Component({
  selector: 'app-song-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    DecimalPipe,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
    HoverGlowDirective,
    HighlightPlayingDirective
  ],
  templateUrl: './song-detail.html',
  styleUrls: ['./song-detail.css'],
  animations: [fadeIn]
})
export class SongDetailComponent {
  private route = inject(ActivatedRoute);
  private musicService = inject(MusicDataService);
  public playerService = inject(AudioPlayerService);
  private dialog = inject(MatDialog);

  currentSong$ = this.playerService.currentSong$;

  songView$: Observable<SongView> = this.route.paramMap.pipe(
    switchMap(params => {
      const id = Number(params.get('id'));
      return combineLatest([
        this.musicService.getSongById(id),
        this.musicService.getArtists(),
        this.musicService.getAlbums(),
        this.musicService.getSongs()
      ]);
    }),
    map(([song, artists, albums, allSongs]) => {
      const artist = artists.find(a => a.id === song.artistId) ?? null;
      const album = albums.find(a => a.id === song.albumId) ?? null;

      // Related songs: same artist or same genre, excluding the current song
      const relatedSongs = allSongs
        .filter(s => s.id !== song.id && (s.artistId === song.artistId || s.genre === song.genre))
        .slice(0, 6);

      return { song, artist, album, relatedSongs };
    })
  );

  play(song: Song): void {
    this.playerService.playStream([song], 0);
  }

  playRelated(song: Song, relatedSongs: Song[]): void {
    const index = relatedSongs.findIndex(s => s.id === song.id);
    this.playerService.playStream(relatedSongs, index >= 0 ? index : 0);
  }

  toggleFavorite(song: Song): void {
    song.isFavorite = !song.isFavorite;
    this.musicService.updateSong(song).subscribe();
  }

  addToPlaylist(song: Song): void {
    this.dialog.open(AddToPlaylistDialogComponent, {
      data: song,
      width: '350px'
    });
  }

  get lyricsLines(): (view: SongView) => string[] {
    return (view: SongView) => {
      if (!view.song.lyrics) return [];
      return view.song.lyrics.split('\n');
    };
  }

  trackBySong(_index: number, song: Song): number {
    return song.id;
  }
}
