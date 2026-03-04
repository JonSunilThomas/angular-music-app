import { trigger, transition, style, animate, query, group } from '@angular/animations';

export const routeTransition = trigger('routeTransition', [
  transition('* <=> *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(12px)' })
    ], { optional: true }),
    query(':leave', [
      animate('150ms ease-out', style({ opacity: 0, transform: 'translateY(-12px)' }))
    ], { optional: true }),
    query(':enter', [
      animate('250ms 100ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
    ], { optional: true }),
  ])
]);

export const fadeIn = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(10px)' }),
    animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
  ])
]);

export const staggerFadeIn = trigger('staggerFadeIn', [
  transition('* => *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(15px)' }),
      animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
    ], { optional: true }),
  ])
]);
