import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MusicDataService } from '../../../services/music-data';
import { AudioPlayerService } from '../../../services/audio-player';
import { Artist, Song, Album } from '../../../models/music';
import { switchMap, map } from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';
import { HighlightPlayingDirective } from '../../../directives/highlight-playing.directive';
import { fadeIn } from '../../../shared/animations/route-transition';

interface ArtistView {
  artist: Artist;
  songs: Song[];
  albums: Album[];
}

@Component({
  selector: 'app-artist-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    DecimalPipe,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    HighlightPlayingDirective
  ],
  templateUrl: './artist-detail.html',
  styleUrls: ['./artist-detail.css'],
  animations: [fadeIn]
})
export class ArtistDetailComponent {
  private route = inject(ActivatedRoute);
  private musicService = inject(MusicDataService);
  public playerService = inject(AudioPlayerService);

  artistView$: Observable<ArtistView> = this.route.paramMap.pipe(
    switchMap(params => {
      const id = Number(params.get('id'));
      return combineLatest([
        this.musicService.getArtistById(id),
        this.musicService.getArtistSongs(id),
        this.musicService.getAlbumsByArtist(id)
      ]);
    }),
    map(([artist, songs, albums]) => ({ artist, songs, albums }))
  );

  currentSong$ = this.playerService.currentSong$;

  play(song: Song, songs: Song[]): void {
    const index = songs.findIndex(s => s.id === song.id);
    this.playerService.playStream(songs, index);
  }

  playAll(songs: Song[]): void {
    if (songs.length > 0) {
      this.playerService.playStream(songs, 0);
    }
  }
}
