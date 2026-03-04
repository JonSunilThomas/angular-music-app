import { Routes } from '@angular/router';

export const artistsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./artist-list/artist-list').then(m => m.ArtistListComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./artist-detail/artist-detail').then(m => m.ArtistDetailComponent)
  }
];
