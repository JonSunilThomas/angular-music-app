import { Routes } from '@angular/router';

export const favoritesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./favorites').then(m => m.FavoritesComponent)
  }
];
