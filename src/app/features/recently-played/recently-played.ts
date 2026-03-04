import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MusicDataService } from '../../services/music-data';
import { AudioPlayerService } from '../../services/audio-player';
import { Song } from '../../models/music';
import { map } from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';
import { fadeIn } from '../../shared/animations/route-transition';

interface GenreStat {
  genre: string;
  count: number;
  percentage: number;
}

@Component({
  selector: 'app-recently-played',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './recently-played.html',
  styleUrls: ['./recently-played.css'],
  animations: [fadeIn]
})
export class RecentlyPlayedComponent {
  private musicService = inject(MusicDataService);
  private playerService = inject(AudioPlayerService);

  recentSongs$ = this.playerService.recentlyPlayed$;

  topSongs$: Observable<Song[]> = this.musicService.getSongs().pipe(
    map(songs => [...songs].sort((a, b) => (b.playCount ?? 0) - (a.playCount ?? 0)).slice(0, 5))
  );

  genreStats$: Observable<GenreStat[]> = this.musicService.getSongs().pipe(
    map(songs => {
      const genreMap = new Map<string, number>();
      songs.forEach(s => {
        genreMap.set(s.genre, (genreMap.get(s.genre) ?? 0) + (s.playCount ?? 0));
      });
      const total = Array.from(genreMap.values()).reduce((a, b) => a + b, 0) || 1;
      return Array.from(genreMap.entries())
        .map(([genre, count]) => ({ genre, count, percentage: (count / total) * 100 }))
        .sort((a, b) => b.count - a.count);
    })
  );

  play(song: Song, songs: Song[]): void {
    const index = songs.findIndex(s => s.id === song.id);
    this.playerService.playStream(songs, index >= 0 ? index : 0);
  }
}
