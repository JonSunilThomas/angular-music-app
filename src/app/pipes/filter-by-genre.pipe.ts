import { Pipe, PipeTransform } from '@angular/core';
import { Song } from '../models/music';

@Pipe({ name: 'filterByGenre', standalone: true, pure: true })
export class FilterByGenrePipe implements PipeTransform {
  transform(songs: Song[] | null, genre: string): Song[] {
    if (!songs || !genre) return songs ?? [];
    return songs.filter(s => s.genre.toLowerCase() === genre.toLowerCase());
  }
}
