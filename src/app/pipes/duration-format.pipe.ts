import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'durationFormat', standalone: true, pure: true })
export class DurationFormatPipe implements PipeTransform {
  transform(seconds: number | null | undefined): string {
    if (seconds == null || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}
