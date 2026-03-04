import { Pipe, PipeTransform } from '@angular/core';
import { Song } from '../models/music';

@Pipe({ name: 'filterByArtist', standalone: true, pure: true })
export class FilterByArtistPipe implements PipeTransform {
  transform(songs: Song[] | null, artist: string): Song[] {
    if (!songs || !artist) return songs ?? [];
    return songs.filter(s => s.artist.toLowerCase().includes(artist.toLowerCase()));
  }
}
