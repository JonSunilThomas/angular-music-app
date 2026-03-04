import { Pipe, PipeTransform } from '@angular/core';
import { Song } from '../models/music';

@Pipe({ name: 'searchFilter', standalone: true, pure: true })
export class SearchPipe implements PipeTransform {
  transform(items: Song[] | null, term: string): Song[] {
    if (!items || !term) return items ?? [];
    const lower = term.toLowerCase();
    return items.filter(item =>
      item.title.toLowerCase().includes(lower) ||
      item.artist.toLowerCase().includes(lower) ||
      item.genre.toLowerCase().includes(lower) ||
      item.album.toLowerCase().includes(lower)
    );
  }
}
