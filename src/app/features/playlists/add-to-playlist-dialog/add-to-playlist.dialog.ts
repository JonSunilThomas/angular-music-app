import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';
import { MusicDataService } from '../../../services/music-data';
import { Playlist, Song } from '../../../models/music';

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
            {{ playlist.name }} ({{ getPlaylistSongCount(playlist) }} songs)
          </button>
        } @empty {
          <p style="color: #cfcfe6; text-align: center;">No playlists found. Create one first!</p>
        }
      </mat-list>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .playlist-btn { width: 100%; text-align: left; margin-bottom: 5px; color: white; }
    .playlist-btn:hover { background: rgba(106, 13, 173, 0.2); }
  `]
})
export class AddToPlaylistDialogComponent {
  private musicService = inject(MusicDataService);
  private dialogRef = inject(MatDialogRef<AddToPlaylistDialogComponent>);
  public song: Song = inject(MAT_DIALOG_DATA);

  playlists$ = this.musicService.getPlaylists();

  getPlaylistSongCount(playlist: Playlist): number {
    return Array.isArray(playlist.songs) ? playlist.songs.length : 0;
  }

  selectPlaylist(playlist: Playlist): void {
    const songs = Array.isArray(playlist.songs) ? playlist.songs : [];
    if (!songs.includes(this.song.id as never)) {
      (songs as number[]).push(this.song.id);
    }
    playlist.songs = songs;
    this.musicService.updatePlaylist(playlist).subscribe(() => {
      this.dialogRef.close(true);
    });
  }
}
