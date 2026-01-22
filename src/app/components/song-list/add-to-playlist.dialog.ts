import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';
import { MusicDataService } from '../../services/music-data'; // Adjust path
import { Playlist, Song } from '../../models/music'; // Adjust path

@Component({
  selector: 'app-add-to-playlist-dialog',
  standalone: true,
  imports: [MatDialogModule, MatListModule, MatButtonModule, AsyncPipe],
  template: `
    <h2 mat-dialog-title>Add to Playlist</h2>
    <mat-dialog-content>
      <mat-list>
        @for (playlist of playlists$ | async; track playlist.id) {
          <button mat-button class="playlist-btn" (click)="selectPlaylist(playlist)">
            {{ playlist.name }} ({{ playlist.songs.length }} songs)
          </button>
        } @empty {
          <p>No playlists found. Create one first!</p>
        }
      </mat-list>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .playlist-btn { width: 100%; text-align: left; margin-bottom: 5px; }
  `]
})
export class AddToPlaylistDialogComponent {
  private musicService = inject(MusicDataService);
  private dialogRef = inject(MatDialogRef<AddToPlaylistDialogComponent>);
  
  // The song that was clicked is passed in here
  public song: Song = inject(MAT_DIALOG_DATA);

  playlists$ = this.musicService.getPlaylists();

  selectPlaylist(playlist: Playlist) {
    // Add the song to the playlist array
    playlist.songs.push(this.song);

    // Save it to the database
    this.musicService.updatePlaylist(playlist).subscribe(() => {
      this.dialogRef.close(true); // Close and signal success
    });
  }
}