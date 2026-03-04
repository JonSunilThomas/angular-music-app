import { Routes } from '@angular/router';

export const feedbackRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./feedback').then(m => m.FeedbackComponent)
  }
];
