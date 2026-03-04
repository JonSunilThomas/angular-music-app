import { Directive, ElementRef, inject, input, effect } from '@angular/core';

@Directive({ selector: '[appHighlightPlaying]', standalone: true })
export class HighlightPlayingDirective {
  private el = inject(ElementRef);
  appHighlightPlaying = input<boolean>(false);

  constructor() {
    effect(() => {
      const isPlaying = this.appHighlightPlaying();
      const element = this.el.nativeElement as HTMLElement;
      if (isPlaying) {
        element.style.borderLeft = '3px solid #6A0DAD';
        element.style.backgroundColor = 'rgba(106, 13, 173, 0.15)';
        element.classList.add('now-playing');
      } else {
        element.style.borderLeft = '3px solid transparent';
        element.style.backgroundColor = '';
        element.classList.remove('now-playing');
      }
    });
  }
}
