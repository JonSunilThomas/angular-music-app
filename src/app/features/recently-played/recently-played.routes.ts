import { Routes } from '@angular/router';

export const recentlyPlayedRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./recently-played').then(m => m.RecentlyPlayedComponent)
  }
];
