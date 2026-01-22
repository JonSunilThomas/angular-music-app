import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { AddToPlaylistDialogComponent } from './add-to-playlist.dialog';
import { MusicDataService } from '../../services/music-data'; 
import { AudioPlayerService } from '../../services/audio-player'; 
import { Song } from '../../models/music'; 

@Component({
  selector: 'app-song-list',
  standalone: true,
  imports: [
    AsyncPipe, 
    FormsModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './song-list.html',
  styleUrls: ['./song-list.css']
})
export class SongListComponent implements OnInit {
  private musicService = inject(MusicDataService);
  private playerService = inject(AudioPlayerService);
  private dialog = inject(MatDialog);

  allSongs: Song[] = [];
  filteredSongs: Song[] = [];
  searchTerm: string = '';

  ngOnInit() {
    this.musicService.getSongs().subscribe(songs => {
      this.allSongs = songs;
      this.filteredSongs = songs;
    });
  }

  filterSongs() {
    const term = this.searchTerm.toLowerCase();
    this.filteredSongs = this.allSongs.filter(song => 
      song.title.toLowerCase().includes(term) || 
      song.artist.toLowerCase().includes(term) ||
      song.genre.toLowerCase().includes(term)
    );
  }

  // FIXED PLAY METHOD
  play(song: Song) {
    const index = this.filteredSongs.findIndex(s => s.id === song.id);
    if (index !== -1) {
      this.playerService.playStream(this.filteredSongs, index);
    }
  }

  addToPlaylist(song: Song) {
    this.dialog.open(AddToPlaylistDialogComponent, {
      data: song,
      width: '300px'
    });
  }

  toggleFavorite(song: Song, event: Event) {
    event.stopPropagation();
    song.isFavorite = !song.isFavorite;
    this.musicService.updateSong(song).subscribe();
  }
} 
// ^ Ensure the file ends with this single closing brace