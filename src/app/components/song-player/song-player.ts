import { Component, inject } from '@angular/core';
// UPDATED IMPORT: No ".service" in the file path
import { AudioPlayerService } from '../../services/audio-player'; 
import { AsyncPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'app-song-player',
  standalone: true,
  imports: [AsyncPipe, MatIconModule, MatSliderModule],
  template: `
    @if (playerService.currentSong$ | async; as song) {
      <div class="fixed-bottom-player">
        <div class="song-info">
          <span>{{ song.title }} - {{ song.artist }}</span>
        </div>
        
        <div class="controls">
          <button mat-icon-button (click)="playerService.togglePlay()">
            <mat-icon>{{ (playerService.isPlaying$ | async) ? 'pause' : 'play_arrow' }}</mat-icon>
          </button>
        </div>
      </div>
    }
  `,
  styles: [`
    .fixed-bottom-player {
      position: fixed; bottom: 0; width: 100%;
      background: #333; color: white; padding: 1rem;
      display: flex; justify-content: space-between; align-items: center;
    }
  `]
})
export class SongPlayerComponent {
  playerService = inject(AudioPlayerService);

  onVolumeChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.playerService.setVolume(Number(input.value));
  }
}