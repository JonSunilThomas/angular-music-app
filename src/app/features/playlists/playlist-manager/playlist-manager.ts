import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatFabButton } from '@angular/material/button';
import { MusicDataService } from '../../../services/music-data';
import { Playlist } from '../../../models/music';
import { HoverGlowDirective } from '../../../directives/hover-glow.directive';
import { AutoFocusDirective } from '../../../directives/auto-focus.directive';
import { fadeIn } from '../../../shared/animations/route-transition';

@Component({
  selector: 'app-playlist-manager',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    HoverGlowDirective,
    AutoFocusDirective
  ],
  templateUrl: './playlist-manager.html',
  styleUrls: ['./playlist-manager.css'],
  animations: [fadeIn]
})
export class PlaylistManagerComponent {
  private musicService = inject(MusicDataService);
  private fb = inject(FormBuilder);

  playlists$ = this.musicService.getPlaylists();

  isCreating = false;

  playlistForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    description: ['']
  });

  createPlaylist(): void {
    if (this.playlistForm.invalid) return;
    const { name, description } = this.playlistForm.value;
    const newPlaylist: Partial<Playlist> = {
      name,
      description,
      songs: []
    };

    this.musicService.createPlaylist(newPlaylist).subscribe(() => {
      this.playlists$ = this.musicService.getPlaylists();
      this.isCreating = false;
      this.playlistForm.reset();
    });
  }

  deletePlaylist(id: number, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.musicService.deletePlaylist(id).subscribe(() => {
      this.playlists$ = this.musicService.getPlaylists();
    });
  }

  getPlaylistSongCount(playlist: Playlist): number {
    return Array.isArray(playlist.songs) ? playlist.songs.length : 0;
  }
}
