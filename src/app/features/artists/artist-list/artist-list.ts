import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MusicDataService } from '../../../services/music-data';
import { Artist } from '../../../models/music';
import { Observable } from 'rxjs';
import { HoverGlowDirective } from '../../../directives/hover-glow.directive';
import { fadeIn } from '../../../shared/animations/route-transition';

@Component({
  selector: 'app-artist-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    HoverGlowDirective,
    DecimalPipe
  ],
  templateUrl: './artist-list.html',
  styleUrls: ['./artist-list.css'],
  animations: [fadeIn]
})
export class ArtistListComponent {
  private musicService = inject(MusicDataService);
  artists$: Observable<Artist[]> = this.musicService.getArtists();
}
