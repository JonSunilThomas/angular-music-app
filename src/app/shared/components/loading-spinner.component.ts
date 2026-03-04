import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [AsyncPipe],
  template: `
    @if (loadingService.loading$ | async) {
      <div class="progress-bar">
        <div class="progress-bar-fill"></div>
      </div>
    }
  `,
  styles: [`
    .progress-bar {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 3px;
      z-index: 9999;
      overflow: hidden;
      background: rgba(106, 13, 173, 0.15);
    }

    .progress-bar-fill {
      height: 100%;
      width: 40%;
      background: linear-gradient(90deg, #6A0DAD, #B57EDC);
      border-radius: 0 2px 2px 0;
      animation: loading 1s ease-in-out infinite;
    }

    @keyframes loading {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(350%); }
    }
  `]
})
export class LoadingSpinnerComponent {
  loadingService = inject(LoadingService);
}
