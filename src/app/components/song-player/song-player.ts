import { Component, inject } from '@angular/core';
import { AudioPlayerService } from '../../services/audio-player';
import { AsyncPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { DurationFormatPipe } from '../../pipes/duration-format.pipe';

@Component({
  selector: 'app-song-player',
  standalone: true,
  imports: [AsyncPipe, MatIconModule, MatSliderModule, MatButtonModule, DurationFormatPipe],
  templateUrl: './song-player.html',
  styleUrls: ['./song-player.css']
})
export class SongPlayerComponent {
  playerService = inject(AudioPlayerService);

  onVolumeChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.playerService.setVolume(Number(input.value));
  }

  onSeek(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.playerService.seekToPercent(Number(input.value));
  }

  getRepeatIcon(mode: string): string {
    switch (mode) {
      case 'one': return 'repeat_one';
      case 'all': return 'repeat';
      default: return 'repeat';
    }
  }
}