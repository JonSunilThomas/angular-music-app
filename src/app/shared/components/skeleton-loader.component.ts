import { Component } from '@angular/core';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  template: `
    <div class="skeleton-grid">
      @for (item of items; track item) {
        <div class="skeleton-card">
          <div class="skeleton-image skeleton-pulse"></div>
          <div class="skeleton-text skeleton-pulse" style="width: 80%"></div>
          <div class="skeleton-text skeleton-pulse" style="width: 50%"></div>
        </div>
      }
    </div>
  `,
  styles: [`
    .skeleton-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 24px;
      padding: 30px;
    }

    .skeleton-card {
      background: var(--card-bg, #1a1a2e);
      border-radius: 8px;
      padding: 16px;
    }

    .skeleton-image {
      width: 100%;
      aspect-ratio: 1;
      border-radius: 4px;
      margin-bottom: 16px;
    }

    .skeleton-text {
      height: 14px;
      border-radius: 4px;
      margin-bottom: 8px;
    }

    .skeleton-pulse {
      background: linear-gradient(90deg, #222244 25%, #2a2a4e 50%, #222244 75%);
      background-size: 200% 100%;
      animation: pulse 1.5s ease-in-out infinite;
    }

    @keyframes pulse {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `]
})
export class SkeletonLoaderComponent {
  items = Array.from({ length: 8 });
}
