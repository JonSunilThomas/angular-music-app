import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { MusicDataService } from '../../services/music-data'; 
import { AudioPlayerService } from '../../services/audio-player'; 
import { Song } from '../../models/music'; 

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [AsyncPipe, MatCardModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './favorites.html',
  styleUrls: ['./favorites.css']
})
export class FavoritesComponent implements OnInit {
  private musicService = inject(MusicDataService);
  private playerService = inject(AudioPlayerService);

  // This array will hold only the liked songs
  favoriteSongs: Song[] = [];

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    this.musicService.getSongs().subscribe(songs => {
      // Filter the full list to find only favorites
      this.favoriteSongs = songs.filter(song => song.isFavorite);
    });
  }

  play(song: Song) {
    // Play this specific list of favorites
    const index = this.favoriteSongs.findIndex(s => s.id === song.id);
    this.playerService.playStream(this.favoriteSongs, index);
  }

  removeFavorite(song: Song, event: Event) {
    event.stopPropagation();
    
    // 1. Toggle state
    song.isFavorite = false;

    // 2. Remove from UI immediately (so it vanishes from the list)
    this.favoriteSongs = this.favoriteSongs.filter(s => s.id !== song.id);

    // 3. Update Database
    this.musicService.updateSong(song).subscribe();
  }
}