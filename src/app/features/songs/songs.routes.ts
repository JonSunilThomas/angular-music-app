import { Routes } from '@angular/router';

export const songsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./song-list/song-list').then(m => m.SongListComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./song-detail/song-detail').then(m => m.SongDetailComponent)
  }
];
