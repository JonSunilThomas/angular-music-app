import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { AddToPlaylistDialogComponent } from '../../playlists/add-to-playlist-dialog/add-to-playlist.dialog';
import { MusicDataService } from '../../../services/music-data';
import { AudioPlayerService } from '../../../services/audio-player';
import { Song } from '../../../models/music';
import { HoverGlowDirective } from '../../../directives/hover-glow.directive';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader.component';
import { fadeIn } from '../../../shared/animations/route-transition';

@Component({
  selector: 'app-song-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    HoverGlowDirective,
    SkeletonLoaderComponent
  ],
  templateUrl: './song-list.html',
  styleUrls: ['./song-list.css'],
  animations: [fadeIn]
})
export class SongListComponent implements OnInit {
  private musicService = inject(MusicDataService);
  private playerService = inject(AudioPlayerService);
  private dialog = inject(MatDialog);

  allSongs: Song[] = [];
  filteredSongs: Song[] = [];
  searchTerm = '';
  isLoading = true;

  ngOnInit(): void {
    this.musicService.getSongs().subscribe(songs => {
      this.allSongs = songs;
      this.filteredSongs = songs;
      this.isLoading = false;
    });
  }

  filterSongs(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredSongs = this.allSongs.filter(song =>
      song.title.toLowerCase().includes(term) ||
      song.artist.toLowerCase().includes(term) ||
      song.genre.toLowerCase().includes(term)
    );
  }

  play(song: Song): void {
    const index = this.filteredSongs.findIndex(s => s.id === song.id);
    if (index !== -1) {
      this.playerService.playStream(this.filteredSongs, index);
    }
  }

  addToPlaylist(song: Song): void {
    this.dialog.open(AddToPlaylistDialogComponent, {
      data: song,
      width: '350px'
    });
  }

  toggleFavorite(song: Song, event: Event): void {
    event.stopPropagation();
    song.isFavorite = !song.isFavorite;
    this.musicService.updateSong(song).subscribe();
  }

  trackBySong(index: number, song: Song): number {
    return song.id;
  }
}
