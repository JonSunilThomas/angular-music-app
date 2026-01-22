import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router'; // Important for [routerLink]
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MusicDataService } from '../../services/music-data';
import { Playlist } from '../../models/music';

@Component({
  selector: 'app-playlist-manager',
  standalone: true,
  imports: [
    AsyncPipe, 
    FormsModule,
    RouterLink,
    MatCardModule, 
    MatButtonModule, 
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './playlist-manager.html',
  styleUrls: ['./playlist-manager.css']
})
export class PlaylistManagerComponent {
  private musicService = inject(MusicDataService);
  
  playlists$ = this.musicService.getPlaylists();

  // State for the "Create New" form
  isCreating = false;
  newPlaylistName = '';

  // --- THIS WAS MISSING ---
  createPlaylist() {
    if (!this.newPlaylistName.trim()) return;

    const newPlaylist: Playlist = {
      id: Date.now(), // Generate a simple unique ID
      name: this.newPlaylistName,
      songs: [] // Start with an empty song list
    };

    this.musicService.createPlaylist(newPlaylist).subscribe(() => {
      // 1. Refresh the list to show the new item
      this.playlists$ = this.musicService.getPlaylists();
      // 2. Hide the form and clear the input
      this.isCreating = false;
      this.newPlaylistName = '';
    });
  }
}