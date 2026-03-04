import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MusicDataService } from '../../services/music-data';
import { AudioPlayerService } from '../../services/audio-player';
import { Song } from '../../models/music';
import { HoverGlowDirective } from '../../directives/hover-glow.directive';
import { fadeIn } from '../../shared/animations/route-transition';

@Component({
  selector: 'app-favorites',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule, MatButtonModule, MatIconModule, RouterLink, HoverGlowDirective],
  templateUrl: './favorites.html',
  styleUrls: ['./favorites.css'],
  animations: [fadeIn]
})
export class FavoritesComponent implements OnInit {
  private musicService = inject(MusicDataService);
  private playerService = inject(AudioPlayerService);

  favoriteSongs: Song[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.musicService.getSongs().subscribe(songs => {
      this.favoriteSongs = songs.filter(song => song.isFavorite);
      this.isLoading = false;
    });
  }

  play(song: Song): void {
    const index = this.favoriteSongs.findIndex(s => s.id === song.id);
    this.playerService.playStream(this.favoriteSongs, index);
  }

  removeFavorite(song: Song, event: Event): void {
    event.stopPropagation();
    song.isFavorite = false;
    this.favoriteSongs = this.favoriteSongs.filter(s => s.id !== song.id);
    this.musicService.updateSong(song).subscribe();
  }

  trackBySong(index: number, song: Song): number {
    return song.id;
  }
}
