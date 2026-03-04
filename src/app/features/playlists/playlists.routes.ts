import { Routes } from '@angular/router';

export const playlistsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./playlist-manager/playlist-manager').then(m => m.PlaylistManagerComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./playlist-detail/playlist-detail').then(m => m.PlaylistDetailComponent)
  }
];
