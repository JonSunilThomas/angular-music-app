import { Directive, ElementRef, inject, afterNextRender } from '@angular/core';

@Directive({ selector: '[appAutoFocus]', standalone: true })
export class AutoFocusDirective {
  private el = inject(ElementRef);

  constructor() {
    afterNextRender(() => {
      this.el.nativeElement.focus();
    });
  }
}
