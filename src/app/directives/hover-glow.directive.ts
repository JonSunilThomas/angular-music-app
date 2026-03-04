import { Directive, ElementRef, HostListener, inject, input } from '@angular/core';

@Directive({ selector: '[appHoverGlow]', standalone: true })
export class HoverGlowDirective {
  private el = inject(ElementRef);
  appHoverGlow = input<string>('rgba(106, 13, 173, 0.4)');

  @HostListener('mouseenter')
  onMouseEnter(): void {
    const color = this.appHoverGlow();
    this.el.nativeElement.style.boxShadow = `0 0 20px ${color}, 0 0 40px ${color}`;
    this.el.nativeElement.style.transition = 'box-shadow 0.3s ease';
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.el.nativeElement.style.boxShadow = 'none';
  }
}
