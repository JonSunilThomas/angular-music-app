import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router'; // To read URL
import { AsyncPipe, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MusicDataService } from '../../services/music-data';
import { AudioPlayerService } from '../../services/audio-player';
import { Playlist, Song } from '../../models/music';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-playlist-detail',
  standalone: true,
  imports: [AsyncPipe, DatePipe, RouterLink, MatButtonModule, MatIconModule, MatListModule],
  templateUrl: './playlist-detail.html',
  styleUrls: ['./playlist-detail.css']
})
export class PlaylistDetailComponent {
  private route = inject(ActivatedRoute);
  private musicService = inject(MusicDataService);
  public playerService = inject(AudioPlayerService);

  // Magic code: Reacts whenever the URL ID changes
  playlist$ = this.route.paramMap.pipe(
    switchMap(params => {
      const id = Number(params.get('id'));
      return this.musicService.getPlaylistById(id);
    })
  );

  play(song: Song, playlistSongs: Song[]) {
    const index = playlistSongs.findIndex(s => s.id === song.id);
    this.playerService.playStream(playlistSongs, index);
  }
}