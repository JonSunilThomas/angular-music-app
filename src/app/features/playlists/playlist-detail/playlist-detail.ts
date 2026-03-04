import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MusicDataService } from '../../../services/music-data';
import { AudioPlayerService } from '../../../services/audio-player';
import { Playlist, Song } from '../../../models/music';
import { switchMap, map } from 'rxjs/operators';
import { Observable, combineLatest, of } from 'rxjs';
import { HighlightPlayingDirective } from '../../../directives/highlight-playing.directive';
import { fadeIn } from '../../../shared/animations/route-transition';

interface PlaylistView {
  playlist: Playlist;
  songs: Song[];
}

@Component({
  selector: 'app-playlist-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    HighlightPlayingDirective
  ],
  templateUrl: './playlist-detail.html',
  styleUrls: ['./playlist-detail.css'],
  animations: [fadeIn]
})
export class PlaylistDetailComponent {
  private route = inject(ActivatedRoute);
  private musicService = inject(MusicDataService);
  public playerService = inject(AudioPlayerService);

  playlistView$: Observable<PlaylistView> = this.route.paramMap.pipe(
    switchMap(params => {
      const id = Number(params.get('id'));
      return combineLatest([
        this.musicService.getPlaylistById(id),
        this.musicService.getSongs()
      ]);
    }),
    map(([playlist, allSongs]) => {
      const songIds = (playlist.songs as number[]) ?? [];
      const songs = songIds
        .map(id => allSongs.find(s => s.id === id))
        .filter((s): s is Song => !!s);
      return { playlist, songs };
    })
  );

  currentSong$ = this.playerService.currentSong$;

  play(song: Song, playlistSongs: Song[]): void {
    const index = playlistSongs.findIndex(s => s.id === song.id);
    this.playerService.playStream(playlistSongs, index);
  }

  playAll(songs: Song[]): void {
    if (songs.length > 0) {
      this.playerService.playStream(songs, 0);
    }
  }
}
